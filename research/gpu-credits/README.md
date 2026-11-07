# Free compute for a personal, agentic small language model

Research opened and official pages checked: **7 November 2026**. This is a research shortlist, not an account-tested guarantee. No accounts were created, purchases made, or personal data uploaded. The conversation/work corpus has not been located or inspected. The user requires deployment on laptops, phones and small GPUs with **less than 8 GB RAM**. Treat this as total device RAM, pending device-specific details. Corpus size and exact hardware remain unknown. This means data is uninspected, not that it does not exist.

## Recommendation

For signup links, required accounts, local authentication, data access and a handoff checklist, see [Accounts and access for the first experiment](ACCOUNTS.md).

Start with **Modal for programmable training compute**, **Lightning for an introductory GPU experiment**, and **Groq/OpenRouter for small inference evaluations**. Investigate Fireworks' temporary managed SFT offer before its advertised November 30 deadline, but confirm checkpoint export and model terms before committing data. Keep an independently runnable model below the user’s 8 GB total-device-memory ceiling as the goal.

Fine-tune an existing checkpoint rather than pretraining an MoE from scratch. Build a retrieval baseline, a small dense adapter baseline, and a genuinely small MoE experiment. Choose using held-out agent tasks and serving cost. Personal conversation volume and quality have not yet been measured; there is no evidence yet that they justify an architecture or training budget.

## Training from 250k-context conversations

The source conversations are described as approximately **250k tokens of context**; their actual exported lengths remain unmeasured. Start with **Qwen3-0.6B + LoRA + local retrieval**, extracting short, verified episodes with only the history available before each target action. Preserve distant dependencies through source-backed memory and retrieval rather than feeding a full conversation into each training sequence. Keep Granite’s small MoE as a measured alternative.

Read the [training method and long-conversation data pipeline](TRAINING.md) for causal summaries, duplicate snapshot handling, a proposed pilot recipe and held-out evaluation. The initial training/deployment sequence budget remains 2,048 tokens; source length does not imply that the deployed model must attend to 250k tokens.

## Three different resources

| Resource | What it buys | Relevant use |
| --- | --- | --- |
| Inference API credit/free tier | Calls to hosted models | Evaluate agents, classify redacted examples, compare teachers |
| GPU/CPU compute credit | Your training/inference code on provider hardware | Train adapters and export artifacts |
| Managed fine-tuning promotion | Supported training jobs/models | Quick SFT experiment, subject to model and export constraints |

These balances cannot be pooled across providers. Inference access does not imply permission to train a competing model on its outputs; check the particular service and model terms before synthetic-data generation or distillation. Use legitimate individual offers, within their eligibility and usage limits.

## Offers worth investigating

“Confirmed” below means the public official page states the offer. Account eligibility, available GPUs and redemption have not been tested. Unknown terms are unresolved, not assumed favorable.

| Provider / official evidence | Advertised benefit | Training relevance | Conditions and unresolved terms |
| --- | --- | --- | --- |
| [Modal pricing](https://modal.com/pricing) | Starter: $30 compute/month | Custom GPU training in Functions; programmable platform, not an SSH VM | Covers GPU/CPU/memory. Shared Endpoints excluded and billed from first token. [Payment method required](https://modal.com/docs/guide/billing); excess usage is automatically billed. Country eligibility and rollover unverified. CPU/RAM consume the same allowance. |
| [Lightning pricing FAQ](https://lightning.ai/pricing) | 5 Lightning credits on registration; 25 more for adding a card | GPU Studios/custom training; download artifacts | Credits expire in 12 months; phone verification. Credits also cover storage/tokens. Advertised ~50 interruptible GPU hours is configuration dependent, not a guaranteed allocation. Country eligibility unverified. Free-plan A100/H100/H200 sessions list a four-hour limit; checkpoint and verify resume before longer runs. |
| [Fireworks pricing](https://fireworks.ai/pricing) | Muse Glimmer 30B SFT free through November 30; no card required | Managed SFT via UI or Serverless Training API | [Cookbook](https://docs.fireworks.ai/fine-tuning/training-api/cookbook/muse-glimmer) limits the offer to LoRA SFT started before 2026-12-01T00:00:00-08:00. Excludes RL, DPO, full training, deployment and outside inference. Treat evaluation sampling as paid. Export/license, caps and account eligibility unverified; generic no-card quotas conflict with the promotion. Muse adapters need paid dedicated serving; not a fit established for sub-8-GB devices. |
| [Groq Free Plan FAQ](https://community.groq.com/t/do-i-get-charged-for-anything-on-the-groq-free-plan/832), [limits](https://console.groq.com/docs/rate-limits) | Free inference within account/model limits; exceeding Free Plan limits returns 429 | Evaluation and prototype agent loop | No custom GPU training established. Consult the account limits rather than assuming one universal token allowance. Data handling and synthetic-training permission need separate review. |
| [OpenRouter free-model collection](https://openrouter.ai/collections/free-models) | Free variants: 20 requests/minute, 50/day; larger allowance after a qualifying purchase | Low-volume hosted evaluation | Model availability/upstream limits vary. Pin a model and record its identity for comparisons. Router default can change models. No GPU-training credit. Provider privacy and output-use terms vary. |
| [Cerebras pricing](https://www.cerebras.ai/pricing) | One-time $5 after adding a valid payment method | Inference evaluation | Expires 30 days after activation. No automatic paid enrollment; pauses at expiry/exhaustion unless PayGo purchased separately. Not a recurring free tier or GPU-training grant. |
| [Runpod referral terms](https://docs.runpod.io/accounts-billing/referrals) | After $10 load: $5 European bonus; weighted $5–$500 outside Europe | Pods can support custom training | Referral signup and Google SSO requirements apply. Not zero-spend. Country classification, expiry and payment-method requirements need confirmation. Do not budget for the maximum random reward. |
| [Google Cloud trial docs](https://docs.cloud.google.com/free/docs/free-cloud-features) | Eligible new users: $300 / 90 days | Conditional candidate after paid-account upgrade | Free-trial accounts cannot attach GPUs or request quota increases. Remaining eligible credit survives upgrade within original deadline; GPU quota/capacity/SKU coverage still need confirmation. Upgrade enables charges. Payment method required. |

### Offers with conflicting or incomplete evidence

- **Together:** [billing docs](https://docs.together.ai/docs/billing-credits) require a $15 initial purchase and say free credit does not waive it; a [support page](https://support.together.ai/articles/1862638756-changes-to-free-tier-and-billing-july-2025) instead states $5. Budget $15 pending account confirmation. Its [credit campaign](https://www.together.ai/get-credits) advertises a $150 claim form, with acceptance, expiry and access exceptions unverified. Excluded from the zero-spend shortlist.
- **Fireworks starter credit:** the [billing FAQ](https://docs.fireworks.ai/faq-new/billing-pricing/what-happens-when-i-finish-my-1-dollar-credit) still references $1 starter credit in its introduction, while the body explains prepaid billing. Current issuance and expiry remain unverified; do not count $1 in the budget. Keep this separate from the free SFT campaign. Auto Reload can make purchases when enabled.
- [Hugging Face Inference Providers](https://huggingface.co/docs/inference-providers/pricing) currently lists no monthly credit for free accounts; old free-account credit lists are stale. [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/platform/pricing/) advertises 10,000 Neurons/day, a separate inference candidate, not training GPUs.
- Startup grants and negotiated offers require separate qualification. Referral posts and lookalike domains are not evidence of a general offer. This shortlist is not an exhaustive market census.

## What $30 of training compute could mean

Calculated upper bounds using [Modal's published per-second GPU rates](https://modal.com/pricing), **GPU charges only**. They exclude CPU, RAM, storage, preparation, evaluation and failed runs; actual training hours will be lower. These are budget illustrations, not model throughput benchmarks.

| GPU | Published GPU rate, converted to $/hour | $30 / GPU rate |
| --- | ---: | ---: |
| T4 | 0.5904 | 50.8 hours |
| L4 | 0.7992 | 37.5 hours |
| L40S | 1.9512 | 15.4 hours |
| A100 80 GB | 2.4984 | 12.0 hours |
| H100 | 3.9492 | 7.6 hours |

Formula: dollars/hour = dollars/second × 3,600. Reserve part of the allowance for a short synthetic-data smoke run, validation and checkpoint reload. Benchmark tokens/second with the actual model, sequence length and adapter setup before estimating a full run. Training time ≈ processed training tokens / measured training tokens per second; processed tokens depend on epochs, packing, padding and masking.

## A small MoE that is actually small

| Candidate | Published parameters | Calculated weight-only storage | Proposed role |
| --- | --- | --- | --- |
| [IBM Granite 3.1 1B-A400M Instruct](https://huggingface.co/ibm-granite/granite-3.1-1b-a400m-instruct) | 1.3B total / 400M active | ~2.6 GB BF16 | Small MoE architecture experiment; task quality unknown |
| [Qwen3-30B-A3B](https://huggingface.co/Qwen/Qwen3-30B-A3B) | 30.5B total / 3.3B active | ~61 GB BF16; ideal 4-bit packing ~15.25 GB | Excluded from on-device target; possible remote teacher only |

Storage estimates use decimal GB and total parameter count, excluding metadata and runtime/training state. Active parameters mainly describe computation per token; they do not remove inactive expert weights from storage. Quantization, offloading and sharding change runtime placement and speed. A 24 GB Qwen QLoRA run is an unverified experiment; 48–80 GB is a planning preference for headroom, not a measured requirement or guarantee.

Select a 0.5–1.5B dense instruction checkpoint with a suitable license and tool format as a control. Do not assume the tiny MoE will outperform it. Keep prompts, retrieval, data budget, sequence lengths and evaluation tasks comparable; report latency, peak VRAM and training cost alongside accuracy. Check current training-library support before selecting final model revisions.

Granite’s official [configuration](https://huggingface.co/ibm-granite/granite-3.1-1b-a400m-instruct/raw/main/config.json) resolves its architecture explicitly: `GraniteMoeForCausalLM`, `model_type: granitemoe`, 32 local experts and 8 experts per token. This confirms MoE architecture, not runtime portability.

With MoE, verify which expert/router tensors actually train. Some expert layers need PEFT's [`target_parameters`](https://huggingface.co/docs/peft/package_reference/lora) rather than only module-name targeting. Measure adapter serving speed and validate the exported checkpoint in the intended runtime. Downloaded adapters still depend on the compatible base model, tokenizer and configuration; they are not standalone weights.

## Deployment constraint: laptops and phones below 8 GB RAM

This ceiling concerns **inference**, not the cloud GPU used for fine-tuning. The OS, application, retrieval index, tokenizer, runtime buffers and KV cache all need memory in addition to the weights. Device RAM is not the application's usable memory allowance; mobile OS limits and GPU backend limits need measurement.

Start with **0.5–1.5B total parameters**, approximately four-bit weights, one active request and a **2,048-token initial context**. These are proposed engineering starting points, not measured compatibility guarantees. Ideal packed weights are 0.25–0.75 GB for this parameter range; quantization metadata and runtime memory increase that. Aim initially for **at most 2 GB measured process memory** on a representative 4 GB device, then revise from measurements. No universal fit across all devices below 8 GB is promised.

Use [Qwen3-0.6B with official GGUF artifacts](https://huggingface.co/Qwen/Qwen3-0.6B-GGUF) as one dense control, and Granite 1.3B-total MoE as the architecture experiment. The linked official Qwen repository currently supplies Q8_0 (about 639 MB), an eight-bit baseline; a four-bit deployment artifact would be produced separately and re-evaluated. Qwen3-30B-A3B is excluded from the local deployment shortlist: even ideal four-bit weights exceed the entire device budget. Its memory estimates above explain the active-parameter trap, not a recommendation to deploy it here.

[llama.cpp documents Android builds](https://github.com/ggml-org/llama.cpp/blob/master/docs/android.md); [MLC LLM documents Android and iOS deployment](https://github.com/mlc-ai/mlc-llm/blob/main/docs/get_started/quick_start.rst). Neither source guarantees that a chosen model, quantization and phone backend will work. Confirm Granite conversion, expert operations and quantization support in the selected runtime **before** fine-tuning. If MoE support fails, retain it as research and use the dense deployable model.

Fine-tune on cloud compute, export the adapter, merge where supported, quantize the resulting model, then evaluate the actual exported artifact again. Quantization can change task quality. Measure peak resident/allocated memory, prefill and decode speed, cold load time, battery/thermal behavior, tool accuracy and sustained task success on a CPU laptop, Android phone, iPhone if relevant, and a small GPU. CPU operation should be the portability baseline; acceleration is device dependent.

A remote teacher is optional and outside the default private-data pipeline. Evaluate it on synthetic/public tasks first; send personal material only after rights, retention and output-training terms are resolved and sensitive content is removed. Its outputs still need independent validation.

Keep the retrieval index small and queried in bounded chunks. Use a compact agent loop with a few explicit tools and bounded call/output budgets. Complex autonomous work may exceed a tiny model's capabilities; quality gates decide which tasks stay local and whether an optional remote fallback is needed.

## Turn collected work into useful training data

This is a proposed local pipeline, not an audit of the user's files.

1. **Inventory without uploading.** Record export format, source application, conversation/project ID, timestamp, ownership, language, approximate tokens and presence of tool events. Keep raw files outside this public site's published directories and version control. Do not put personal exports in this folder.
2. **Separate memory from behavior.** Put changing facts, documents and project history in a local retrieval index. Use training examples for stable preferences and demonstrated skills: choosing tools, producing valid arguments, checking results, recovering from failures and completing tasks.
3. **Curate.** Remove credentials, third-party private information, repeated branches and near duplicates. Mark failed/abandoned outputs; don't imitate every assistant response. Preserve user corrections and verified final outcomes. Check rights to work material before any external processing. Tokenization is not anonymization: training tokens retain recoverable content. Inference zero-retention policies do not establish deletion rules for uploaded training datasets or checkpoints; verify training-specific retention and deletion separately. Use synthetic/public tasks for initial provider evaluations.
4. **Split before augmentation.** Hold out whole conversations and projects, with a later-time test set. Keep related branches/duplicates together. Avoid putting test solutions into training data, synthetic generation prompts or the retrieval index used for evaluation. If a task intentionally tests retrieval, document exactly which non-solution evidence is available.
5. **Represent agent trajectories.** Preserve tool schemas, calls, results and verified outcomes in the selected model's chat template. Mask user/tool tokens as appropriate for the training objective. Logs with only prose answers do not prove tool-use ability; collect missing trajectories through sandboxed tasks and verify successes.
6. **Build baselines.** Measure the unchanged model, then retrieval, then dense LoRA, then MoE LoRA. Use the same held-out tasks. Keep final test data untouched during tuning; use a separate development split for decisions.

Proposed evaluation: tool selection, schema-valid arguments, end-to-end task success, factual accuracy with source evidence, recovery from injected tool failures, unnecessary actions, memorization of withheld private strings, latency and peak memory. Use task validators and human spot checks; model-judge scores alone are insufficient. Test tools in a sandbox with explicit permission boundaries.

## First experiment and decision gates

- **Inventory gate:** locate exports and establish token counts, quality, rights and target hardware. Until then, no credible full-training budget or model choice.
- **Compute gate:** confirm offer in account, payment/expiry terms and a spend cap. Run synthetic data, save checkpoint, download it, and reload locally. For managed SFT, verify export and downstream inference costs first.
- **Pilot gate:** start with a curated subset (e.g. 500–2,000 verified trajectories if available; a proposed pilot range, not a measured requirement). Record dataset hashes, revisions, seed, trainable parameter count, sequence length, GPU, runtime and total bill.
- **MoE gate:** advance only for measurable held-out improvement within the target deployment budget. Otherwise keep the better dense model and retrieval system. Pretraining from scratch and expensive RL are outside this first credit-funded experiment.

The next inputs are **export locations/formats**, **usable token/trajectory counts**, **local GPU and VRAM**, **desired runtime**, and **acceptable ongoing budget**. The research can proceed without them; substantive training cannot be responsibly sized yet.

## Method and limits

Primary provider documentation and official model cards underpin the numerical claims. Dates are retrieval dates, not guarantees that an offer will persist. No current corpus, training run, eligibility test or benchmark has been performed. Terms not expressly established remain unknown. Public research contains no conversation excerpts or account identifiers. Council findings are tracked in the conversation; this document is the consolidated research artifact.
