# Accounts and access for the first experiment

Setup guide checked **7 November 2026**. Companion to the [research and deployment plan](README.md). Target: an independently runnable personal agent on devices with **less than 8 GB total RAM**. Account creation and credential provisioning have not been performed.

## What to create first

Choose **one compute provider** initially. Modal is the preferred programmable training route if adding a payment method is acceptable. Lightning is the alternative, with a smaller no-card introductory allowance. No inference account is required to train open weights or evaluate locally.

| Account | Needed now? | Create / sign in | What to enable |
| --- | --- | --- | --- |
| Modal | Preferred compute route; choose this or Lightning | [Modal](https://modal.com/) → Get started | Starter workspace, required payment method, verify monthly allowance, configure spend budget, authorize local CLI |
| Lightning AI | Alternative compute route | [Lightning](https://lightning.ai/) → Open app / sign up | Free account, phone verification, confirm 5 registration credits; card adds 25 credits if desired; create a private Studio |
| Hugging Face | Optional for the proposed public, ungated model downloads | [Hugging Face signup](https://huggingface.co/join) | Required only if the chosen repository is gated/private or private Hub storage is desired. Accept any gated model terms yourself. Paid PRO is unnecessary for public model downloads |
| Groq | Optional hosted evaluation only | [Groq Console](https://console.groq.com/) | Stay on Free Plan; create a dedicated API key and check account limits. Start with synthetic/public tasks |
| Fireworks | Optional promotion experiment, outside the default tiny-model path | [Fireworks signup](https://app.fireworks.ai/signup) | Verify Muse promotion eligibility, export and license before dataset upload. Sampling/serving can cost money; its 30B model is not the on-device target |

OpenRouter is an optional alternative to Groq, not another required account. Cerebras, Runpod, Google Cloud and Together are **not necessary for the first experiment**; their card, deposit, quota or access conditions add complexity. Do not activate time-limited trials until the dataset and smoke test are ready.

## Modal: give the local training environment access

1. Create your account using your own email/SSO and complete provider verification. Enter billing details directly on Modal's site; do not share passwords, card details or recovery codes with the coding agent.
2. In Usage & Billing, confirm the Starter allowance and payment method. Configure both the workspace usage budget (before credits) and a custom spend limit (net charges after credits) before launching workloads. Set the net spend limit to zero for a credit-only experiment if the account permits it, and verify the saved setting. Modal documents that the spend limit stops workloads that would incur extra out-of-pocket charges; its default can permit charges beyond the included credits. Include CPU/RAM costs in the estimate. [Billing](https://modal.com/docs/guide/billing), [budgets](https://modal.com/docs/guide/budgets).
3. On the **machine that will launch training**, use an environment outside this public repository:

   ```bash
   python3 -m venv "$HOME/.venvs/personal-llm"
   source "$HOME/.venvs/personal-llm/bin/activate"
   python -m pip install modal
   modal token new --expires-in 7d
   ```

4. Complete the browser authorization opened by the CLI. Select the intended workspace. This gives that local environment permission to act as your Modal identity; it is not permission for unrelated workloads. Keep credentials in the CLI's user configuration, outside the repository. The token command supports expiry and verifies credentials by default. [Official token commands](https://modal.com/docs/cli/latest/token).
5. Tell the coding agent **which workspace/environment is authorized**, that local CLI authentication is complete, and the maximum total spend for the experiment. The agent should verify identity without displaying credentials. Never paste the contents of a token/config file into chat.
6. Start with synthetic data and a short GPU job. Verify checkpoint download, local reload and actual billed cost before the private corpus is involved. Export artifacts through a [Modal Volume](https://modal.com/docs/guide/volumes) or another explicit download path.

If the CLI runs on another machine, a browser login on your laptop does not authenticate that machine automatically. Run authorization for the intended execution environment. If a token must be provisioned remotely, use the coding application's secure secret-entry facility, one value per secret, rather than a normal message or a committed `.env` file. Do not grant billing administration or unrelated account access just to launch a training run. Revoke temporary credentials after the experiment.

## Lightning alternative: give a private Studio access

1. Register and complete phone verification. Confirm the credited balance and expiry in the account. Adding a card for extra credits is optional; confirm billing settings before doing so. [Pricing and registration-credit FAQ](https://lightning.ai/pricing).
2. Create a **private** Studio and verify its visibility before adding files. Select an affordable GPU using the live credit estimate. Confirm session limits; the free plan lists four-hour sessions for some larger GPUs.
3. For an interactive first experiment, run reviewed training code inside the authenticated Studio terminal. An external API credential is not required merely to run code manually in that terminal. Never make the Studio public to give the agent access.
4. For unattended execution by this coding environment, first identify the supported Lightning authentication/integration and its access scope. This research has not verified a particular external API-token flow; do not supply a broad token on the assumption that it is required. Use secure secret entry if an integration needs credentials. Alternatively, keep execution manual in the Studio and bring back redacted metrics and the exported adapter.
5. Copy only the approved, curated dataset into private storage. Checkpoint frequently, verify resume and download the result before credits/session time run out. Confirm deletion/retention behavior for training datasets and checkpoints.

## Optional evaluation/model-download access

**Groq:** create a separate key in [API Keys](https://console.groq.com/keys). The SDK reads `GROQ_API_KEY`; provision it through secure secret entry or an execution-environment secret store. Use Free Plan account limits and a pinned model, with synthetic/public evaluation prompts initially. This grants inference access, not training compute. [Official quickstart](https://console.groq.com/docs/quickstart).

**Hugging Face:** first attempt the public, ungated checkpoint download without login. If authentication is necessary, create a token limited to the required repositories with read access. A write token is needed only if uploading artifacts to a private Hub repository is an explicit part of the workflow. Keep personal training data off public Hub datasets and model cards. [Token documentation](https://huggingface.co/docs/hub/security-tokens).

**Fireworks:** create an API key only if pursuing the optional managed experiment. Before granting dataset access, verify promotion activation, separately billed evaluation, exact downloadable artifacts, compatible base weights/license and independent serving feasibility. Its free SFT promotion does not establish a deployable sub-8-GB checkpoint. [Promotion cookbook](https://docs.fireworks.ai/fine-tuning/training-api/cookbook/muse-glimmer).

## Give the agent the data it actually needs

Keep exports and credentials **outside this repository**: `research/` is copied into the public GitHub Pages artifact. Raw data is not needed to read or publish this research.

Provide paths and limits, not conversation contents or secrets, using this handoff template:

```text
Compute route: Modal / Lightning
Authorized workspace or private Studio: <name>
Execution environment: <this machine or named remote environment>
Authentication: completed locally / needs secure secret entry / manual Studio only
Maximum additional spend: <amount and currency; 0 is valid>
Raw export directory: <absolute path outside the public repository>
Formats: <JSON / JSONL / HTML / Markdown / other>
Conversation lengths: <actual token counts or configured 250k context limit>
History completeness: <unique messages / rolling snapshots / compacted or missing turns>
Allowed data sources: <specific exports/projects>
Excluded sources: <private work, third-party messages, credentials, etc.>
Cloud upload scope: synthetic only / specified curated and redacted subset
Artifact output directory: <private absolute path outside the public repository>
Target device: <model, OS, RAM; GPU/VRAM if present>
Offline requirement: <fully offline / optional remote fallback>
```

The first data action is a local metadata inventory: file counts, formats, token estimates and trajectory availability. Then curate, group duplicates, split by conversation/project/time, and build held-out tasks. Do not upload the entire archive simply because an account has credits.

For the proposed LoRA recipe and handling of 250k-context source conversations, read the [training method](TRAINING.md).

## Execution sequence after access is ready

1. Verify account/workspace and allowance without printing secrets.
2. Run a synthetic GPU smoke test and verify export/reload with measured cost.
3. Inventory the approved local exports; prepare a curated pilot and isolated evaluation set.
4. Evaluate retrieval and the unchanged small dense model; train a dense adapter control and a Granite small-MoE experiment if runtime conversion works.
5. Export and quantize, then measure the actual model on the target device: memory, sustained speed, tool-task success and quantization quality loss.
6. Retain the better deployable result; remove temporary cloud resources and revoke temporary access.

No model quality, successful training run or phone compatibility is implied by finishing account setup.
