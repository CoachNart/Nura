Nura AI

A wallet-native health companion concept for onchain users, built from the provided visual references.

UI routes
- / — premium AI-health landing page inspired by the supplied first reference.
- /app — responsive health dashboard inspired by the supplied second reference.
- AI Doctor, Health, Appointments and Profile are included in the first UI pass.

Robinhood Chain
- Mainnet chain ID: 4663
- Native gas: ETH
- Wallet interaction in this pass is UI-only; production RPC and wallet wiring should be added behind environment variables.

Safety
Nura is presented as educational health support, not a diagnosis or replacement for professional care. Production health features should add authenticated data storage, consent controls, audit logging, clinical safety review and a server-side AI layer.

Local development
1. Create a Reown/WalletConnect project and copy its project ID.
2. Set `VITE_WALLETCONNECT_PROJECT_ID` in Vercel (and locally in `.env`).
3. `npm install`
4. `npm run dev`
5. `npm run build`

Wallet support
- Desktop browser wallets use injected EIP-1193 providers (including EIP-6963-style provider lists where exposed).
- Mobile browsers without an injected wallet open the WalletConnect modal, allowing supported mobile wallets to deep-link back into Nura.
- Nura requests/switches to Robinhood Chain (chain ID 4663) and adds the network when the wallet does not have it.
- Robinhood Chain's public RPC is used only as the chain endpoint; production app infrastructure can move to a dedicated provider such as Alchemy.

The WalletConnect Project ID is public application configuration, not a wallet secret. Never place private keys or seed phrases in the repository.
