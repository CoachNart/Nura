# Nura AI

Nura is a patient-first health intelligence application with a production-oriented AI Doctor conversation engine, user-controlled health context, care planning, medication tracking, privacy controls and Lithosphere wallet connectivity.

## Lithosphere

Nura is now aligned with the current Lithosphere EVM network.

- Production network: Lithosphere Mainnet
- EVM chain ID: 9005 (0x2325)
- Native token: LITHO
- Mainnet RPC: https://rpc-mainnet.litho.ai
- Mainnet explorer: https://lithoscan.ai
- Test network: Lithosphere Makalu
- Makalu EVM chain ID: 700777 (0xab169)
- Makalu RPC: https://rpc.litho.ai
- Makalu explorer: https://makalu.litho.ai

Set VITE_LITHO_NETWORK=mainnet for production or VITE_LITHO_NETWORK=makalu when explicitly testing against Makalu.

Nura deliberately keeps personal health information off-chain. The wallet/network layer is for user identity and future permissioned, verifiable application actions; medical records and conversations are not written to the blockchain.

## AI Doctor

The AI Doctor endpoint at /api/ai/health currently runs without an external model API or OpenAI dependency.

The health engine includes:
- deterministic emergency-symptom triage before ordinary conversation handling
- bounded conversation input and message history
- topic detection across symptoms, medication, vitals, test results, sleep, wellbeing, pregnancy/menstrual questions, care preparation and general questions
- targeted follow-up questions rather than generic one-line replies
- medication safety boundaries that avoid inventing prescription changes or doses
- test-result interpretation boundaries that require the reported reference range and clinical context
- explicit escalation for potentially life-threatening symptoms
- conversation-aware topic detection using recent user messages
- a safe fallback if the server handler encounters an unexpected error

The engine is an information and triage assistant, not a diagnostic or emergency-care service. Production clinical deployment should still undergo clinical review, safety validation, privacy/security assessment and jurisdiction-specific regulatory review.

## Privacy

Health information is user-controlled. The application supports health-data export and deletion. Sensitive health information is intentionally not placed on Lithosphere.

For a clinical-grade deployment, the next infrastructure layer should be an encrypted, authenticated health-data service with durable consent/audit controls rather than browser-only persistence.

## Wallet

Wallet connection uses EIP-1193 injected providers and WalletConnect/Reown-compatible flows. Nura never requests seed phrases or private keys.

## Development

1. Set VITE_WALLETCONNECT_PROJECT_ID.
2. Set VITE_LITHO_NETWORK=mainnet for production.
3. Run npm install.
4. Run npm run dev.
5. Run npm run build.

No OpenAI API key is required by the current AI Doctor engine.