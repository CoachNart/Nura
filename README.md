# Nura AI

Nura is a wallet-native health companion for onchain users. The product now includes a responsive health dashboard, Robinhood Chain wallet connection, a server-side AI Doctor boundary, local health memory, care-plan management, medication tracking, privacy controls and an installable PWA shell.

## Product routes
- `/` and `/app` — responsive health dashboard.
- **AI Doctor** — real server-backed AI conversation when `OPENAI_API_KEY` is configured.
- **Health** — user-entered health signals and daily check-ins.
- **Appointments** — appointment records stored on the device.
- **Profile** — wallet identity, consent controls, export and local data deletion.

## Robinhood Chain
- Mainnet chain ID: **4663** (`0x1237`).
- Native gas: **ETH**.
- RPC: `https://rpc.mainnet.chain.robinhood.com`.
- Explorer: `https://robinhoodchain.blockscout.com`.
- Wallets use EIP-1193 injection when available and WalletConnect for supported mobile flows.

## AI Doctor
The browser sends the current conversation plus user-controlled health context to `/api/ai/health`. The server keeps the OpenAI API key private and calls the Responses API. The endpoint has a health-safety system prompt, urgent-symptom escalation and input redaction for obvious wallet-secret phrases.

Set:
- `OPENAI_API_KEY` — **server-side only** in Vercel.
- `NURA_AI_MODEL` — optional; defaults to `gpt-5.6-luna`.

Never expose `OPENAI_API_KEY` through a `VITE_` variable.

## Health data and privacy
The current browser app stores the health profile locally in `localStorage` so the UI can work without a database. Users can export or clear that local data.

Sensitive health information is intentionally **not put on Robinhood Chain**. The wallet is an identity/permission layer; health records should remain offchain. For a production clinical deployment, replace the browser-only store with an encrypted, authenticated health-data service, add durable consent/audit storage and complete a clinical/privacy review before launch.

## PWA
Nura includes a web manifest and service worker. On supported mobile browsers it can be installed as an app. The service worker caches the shell only; it does not cache AI responses.

## Development
1. Create a Reown/WalletConnect project and set `VITE_WALLETCONNECT_PROJECT_ID`.
2. Set `OPENAI_API_KEY` in the Vercel/server environment.
3. Optionally set `NURA_AI_MODEL`.
4. Run `npm install`.
5. Run `npm run dev`.
6. Run `npm run build`.

## Safety
Nura provides educational health information, not diagnosis or emergency care. The UI explicitly directs users with severe or rapidly worsening symptoms to urgent professional care. AI output should be treated as informational and reviewed by an appropriate clinician when needed.

Never place private keys, seed phrases or passwords in the repository or in Nura's health records.
