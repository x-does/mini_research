# A small personal model trained from 250k-context conversations

Research patch: **7 November 2026**. The user describes conversations based on approximately **250,000 tokens of context**. This is user-provided context, not a measured dataset statistic. Actual lengths, tokenizer, number of conversations, compaction and export format remain uninspected. The deployment requirement remains **less than 8 GB total device RAM**, including laptops and phones.

## Recommended first experiment

Use **Qwen3-0.6B with a LoRA adapter**, train on short, verified task episodes extracted from the long conversations, and keep the full approved archive in a separate local retrieval store. Compare it against the unchanged checkpoint with identical retrieval. Test **Granite 3.1 1B-A400M Instruct** as the small MoE candidate after confirming conversion and runtime support.

This is a proposed pilot, not a completed training pipeline. It adapts an existing instruction model to demonstrated behavior; it does not guarantee that adding conversations makes it a capable autonomous agent or a reliable database of personal facts. Keep facts and source evidence retrievable, and teach the model to use that evidence and tools.

[Qwen's model card](https://huggingface.co/Qwen/Qwen3-0.6B) identifies a 0.6B checkpoint and advertises 32,768-token context. That does not establish support for a 250k-token input. [Granite's configuration](https://huggingface.co/ibm-granite/granite-3.1-1b-a400m-instruct/raw/main/config.json) identifies the small MoE with 32 experts, eight selected per token. Neither model's advertised context establishes practical phone memory or speed.

## Source length is different from model context

A 250k-token conversation is a **source document**. It need not be one training example or one on-device prompt. The proposed model learns many bounded decisions from it, while retrieval supplies evidence from distant parts when needed.

Long inference contexts also consume memory beyond model weights. For a conventional full-attention KV cache:

```text
cache bytes = 2 × layers × KV heads × head dimension
              × cached tokens × bytes per cache element × batch size
```

Using Qwen3-0.6B's [published configuration](https://huggingface.co/Qwen/Qwen3-0.6B/raw/main/config.json), 28 layers, eight KV heads, head dimension 128, batch one and a two-byte cache, **a hypothetical 250,000-token cache alone is about 28.7 GB decimal**. This is a storage calculation outside the model card's advertised context, not a supported run or a measured benchmark. It excludes weights and other runtime memory; four-bit weight quantization does not automatically quantize the KV cache. Runtime cache quantization, offloading or different attention implementations require separate validation.

Start with **2,048 tokens for each complete training sequence and initial deployed context**, counting chat template, tools, memory, recent messages and target/output allowance. Extend only after measuring quality and memory. Cloud training can use more memory than deployment, but long-context training is outside this first credit-funded pilot.

## Preserve the archive, extract the decisions

1. **Inventory locally.** Determine whether the exports contain unique messages, repeated full-context snapshots, tool events, attachments, summaries or compaction records. Retokenize with the chosen model's tokenizer; a source application's reported 250k context is not a portable token count. Record actual length distributions and missing history. Don't infer unavailable tool results or pre-compaction messages.
2. **Reconstruct and deduplicate.** Keep message IDs, branch IDs, timestamps and tool call/result associations. Repeated 250k snapshots may share nearly all their content; reconstruct unique events before sampling. Group near duplicates and related projects/branches for splitting. Cap each source conversation's contribution so one huge session does not dominate the pilot.
3. **Split whole groups first.** Reserve conversation/project groups for development and test, with a later-time test slice. Only then create chunks, memories, summaries or synthetic examples within each split. If there are too few independent conversations, disclose the weak evaluation rather than claiming generalization from random message splits.
4. **Segment by task and state changes.** Find user requests, corrections, tool interactions and verified completions. Keep a complete tool-call/result pair together. Use bounded overlapping source chunks for indexing when needed, but construct training episodes around semantic boundaries rather than cutting every N tokens blindly.
5. **Recover prior dependencies.** For each candidate target action at time T, collect the relevant earlier instructions, decisions, file state and tool evidence. Build a compact state summary with source spans, plus query-relevant retrieved evidence. Everything supplied as input must have been available **before T**. Source-backed summaries may omit details; keep links to originals and reject contradictions.
6. **Select verified targets.** A target can be the next valid tool call, a correction-aware response, a result check, a memory update or a final answer. Later outcomes may establish whether a target was successful, but must never be copied into its earlier prompt. Exclude unsupported success claims, obsolete answers superseded by a correction, and unverified tool traces.
7. **Reject oversize or under-specified examples.** Count tokens after the exact chat template is applied. Preserve indispensable instructions and tool schemas; reduce irrelevant evidence first. If the target still depends on more context than fits, exclude it from the short-context pilot or mark it for a later long-context study. Do not silently truncate and leave an impossible target.

Do not replace an entire 250k conversation with one global summary and call it training data. Global summaries can erase exceptions, merge changing requirements and reveal answers to earlier steps. A long-context teacher is optional: only send approved data under verified privacy/output-use terms, validate its extractions against source spans, and do not make it a requirement for the first local pipeline.

## What an example should contain

Keep provenance metadata in the **private dataset manifest**, separate from the rendered model input:

```text
conversation_group, project_group, branch, target_event_id, cutoff_time
source_spans, available_tool_schema_version, verified_outcome
train/dev/test split, deduplication_group, tokenizer/model revision
```

For the model input, use the selected checkpoint's supported chat/tool format:

```text
System: stable instructions and permitted tool schemas
Prior state: short source-backed memory available before the target
Retrieved evidence: relevant earlier excerpts, bounded to the token budget
Recent turns: the immediate request and complete recent tool interactions
Assistant target: the verified next action or answer
```

This is a conceptual layout, not a new chat serialization standard. Preserve tool IDs and schemas in the actual model-specific template. If a training example uses retrieval, construct it with the same kind of retriever and context budget used during deployment. Teach "insufficient evidence" behavior rather than rewarding invented memories.

At runtime, maintain a local archive/index, a compact versioned state and a bounded recent-turn buffer. Retrieve a small set of relevant excerpts, act, verify the result, and update memory with provenance. Earlier decisions remain accessible without reloading the full 250k session into the model. Start with lexical retrieval if that avoids an extra embedding model on memory-constrained devices; benchmark retrieval quality before adding complexity.

## Pilot training recipe

The following are **starting hypotheses**, not tuned settings or a GPU-memory guarantee. Pin the base model, tokenizer, chat template, dataset manifest and dependency versions before the run.

- **Base:** `Qwen/Qwen3-0.6B`; keep its instruction format and use the intended short-answer/tool behavior consistently at training and inference. Do not use the GGUF inference file as the adapter-training checkpoint.
- **Method:** supervised fine-tuning with LoRA. Start with BF16 base weights on a supported cloud GPU if the measured budget permits; use QLoRA only if needed to reduce training memory. Four-bit training quantization and final GGUF deployment quantization are separate operations. [PEFT quantized-adapter guide](https://huggingface.co/docs/peft/developer_guides/quantization).
- **Initial adapter:** rank 8, alpha 16, dropout 0.05, targeting supported attention projection layers such as `q_proj` and `v_proj`. Inspect actual matched layers and trainable counts; expand targets/rank only if development results justify it. Granite needs its own verified targeting, including expert tensors if trained.
- **Initial schedule:** learning rate 1e-4, one epoch, sequence length 2,048, microbatch one and gradient accumulation 16. Effective batch and optimizer steps depend on available data and hardware. Check loss, gradient health, overfitting and development task success; these values are not a claim of optimality.
- **Loss:** train on verified assistant targets, with user/system/tool observations masked. If preceding assistant turns should be context only, mask those too; an assistant-only switch can otherwise train on all assistant turns. Inspect actual label masks and ensure every example has target tokens. [TRL SFT documentation](https://huggingface.co/docs/trl/sft_trainer) describes conversational/assistant-only and completion-only loss, including template requirements.
- **Packing:** disable for the first correctness run. Later enable only after confirming episode boundaries, attention isolation and label masks in the pinned trainer. Packing short episodes does not teach dependencies across an original 250k conversation.
- **Pilot scale:** reuse the proposed 500–2,000 verified-episode range only if available. Select for source diversity and demonstrable outcomes, not raw conversation length. Measure processed tokens, throughput and the actual bill before expanding.

Keep some explicitly licensed general instruction/tool examples as a candidate replay set if personal-only tuning regresses basic skills. Choose the mix on development data; no fixed replay proportion is established here. Continued pretraining on all raw logs and expensive RL are deferred until SFT/retrieval results demonstrate a specific need.

## Evaluation that tests long-conversation usefulness

Compare **unchanged base + retrieval** with **LoRA model + the same retrieval**, then the MoE alternative if portable. Keep a base without retrieval as a diagnostic. Measure the exported quantized artifact too. Fix tool definitions, prompts, context budget, decoding and task validators across comparisons.

Include held-out tasks whose essential evidence is far earlier in a long session: resume a project, obey a corrected preference, reconcile a later change, identify an outdated decision, and execute a tool action using the latest valid state. For a target at time T, only history available before T enters the evaluation retrieval store. Exclude target answers, future tool results and derived summaries containing them. This historical evidence is permitted retrieval context, not a training split escape hatch.

Measure retrieval evidence recall separately from answer/tool success, plus schema-valid calls, completion rate, unsupported claims and correct abstention. Also measure device peak memory, cold start, sustained speed and regressions on ordinary instructions. Failures caused by missing retrieval evidence need a retrieval fix; failures with evidence present may need better examples or a stronger model.

Select the dense model if it wins the task/deployment comparison. Keep the small MoE as the requested research branch, not a mandatory architectural change. A tiny model with reliable memory/tools is the first deliverable; a tiny model that directly attends to 250k tokens is not established by this plan.

## Inputs needed before execution

Provide private export paths/formats, whether 250k refers to actual history or a configured context limit, conversation/project counts, missing/compacted history, target devices, and the authorized compute/spend limit using the [account handoff checklist](ACCOUNTS.md). The first action remains a local inventory; this patch adds no account, corpus upload or training run.
