const CHAIN_ID=4663;
const CHAIN_HEX="0x1237";
const CHAIN={
 id:CHAIN_HEX,
 chainId:CHAIN_HEX,
 chainName:"Robinhood Chain",
 nativeCurrency:{name:"Ether",symbol:"ETH",decimals:18},
 rpcUrls:["https://rpc.mainnet.chain.robinhood.com"],
 blockExplorerUrls:["https://robinhoodchain.blockscout.com"]
};

const STORAGE_KEY="nura.wallet.v1";
let activeProvider=null;
let activeConnector="";

function providers(){
 if(typeof window==="undefined") return [];
 const list=[];
 const seen=new Set();
 const push=(p,name)=>{
   if(!p||seen.has(p)) return;
   seen.add(p); list.push({provider:p,name});
 };
 if(window.ethereum){
   if(Array.isArray(window.ethereum.providers)){
     window.ethereum.providers.forEach((p,i)=>push(p,p.isMetaMask?"MetaMask":p.isCoinbaseWallet?"Coinbase Wallet":p.isRabby?"Rabby":`Browser Wallet ${i+1}`));
   }else push(window.ethereum,window.ethereum.isMetaMask?"MetaMask":window.ethereum.isCoinbaseWallet?"Coinbase Wallet":"Browser Wallet");
 }
 return list;
}

function save(data){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(data));}catch{}}
export function getSavedWallet(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||"null")}catch{return null}}
export function shortenAddress(address){return address?address.slice(0,6)+"…"+address.slice(-4):""}

async function ensureChain(provider){
 const current=await provider.request({method:"eth_chainId"});
 if(current?.toLowerCase()===CHAIN_HEX.toLowerCase()) return;
 try{
   await provider.request({method:"wallet_switchEthereumChain",params:[{chainId:CHAIN_HEX}]});
 }catch(error){
   if(error?.code!==4902) throw new Error("Please switch your wallet to Robinhood Chain.");
   await provider.request({method:"wallet_addEthereumChain",params:[CHAIN]});
 }
}

async function connectInjected(){
 const available=providers();
 if(!available.length) return null;
 const picked=available[0];
 await picked.provider.request({method:"eth_requestAccounts"});
 await ensureChain(picked.provider);
 const accounts=await picked.provider.request({method:"eth_accounts"});
 if(!accounts?.[0]) throw new Error("No wallet account was returned.");
 activeProvider=picked.provider;
 activeConnector=picked.name;
 const data={address:accounts[0],connector:picked.name,chainId:CHAIN_ID};
 save(data);
 return data;
}

async function connectWalletConnect(){
 const projectId=import.meta.env.VITE_WALLETCONNECT_PROJECT_ID||"2c1790608fb8a31c207703e33ab0f572";
 if(!projectId) throw new Error("WalletConnect is not configured yet. Add VITE_WALLETCONNECT_PROJECT_ID in Vercel.");
 const mod=await import("@walletconnect/ethereum-provider");
 const EthereumProvider=mod.default||mod.EthereumProvider;
 const provider=await EthereumProvider.init({
   projectId,
   optionalChains:[CHAIN_ID],
   rpcMap:{[CHAIN_ID]:"https://rpc.mainnet.chain.robinhood.com"},
   showQrModal:true,
   metadata:{
     name:"Nura AI",
     description:"AI health companion for onchain users",
     url:window.location.origin,
     icons:[window.location.origin+"/favicon.svg"]
   }
 });
 await provider.enable();
 await ensureChain(provider);
 const accounts=await provider.request({method:"eth_accounts"});
 if(!accounts?.[0]) throw new Error("WalletConnect did not return an account.");
 activeProvider=provider;
 activeConnector="WalletConnect";
 provider.on?.("accountsChanged",(accounts)=>{if(accounts?.[0]) save({address:accounts[0],connector:"WalletConnect",chainId:CHAIN_ID});else localStorage.removeItem(STORAGE_KEY)});
 provider.on?.("chainChanged",async(chainId)=>{if(chainId!==CHAIN_HEX){try{await ensureChain(provider)}catch{}}});
 const data={address:accounts[0],connector:"WalletConnect",chainId:CHAIN_ID};
 save(data);
 return data;
}

async function restoreInjected(saved){
 const available=providers();
 for(const item of available){
  try{
   const accounts=await item.provider.request({method:"eth_accounts"});
   const chain=await item.provider.request({method:"eth_chainId"});
   if(accounts?.[0]&&chain?.toLowerCase()===CHAIN_HEX.toLowerCase()){
    activeProvider=item.provider;activeConnector=item.name;
    const data={address:accounts[0],connector:item.name,chainId:CHAIN_ID};save(data);return data;
   }
  }catch{}
 }
 return null;
}
async function restoreWalletConnect(saved){
 if(!saved||saved.connector!=="WalletConnect") return null;
 const projectId=import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;
 if(!projectId) return null;
 try{
  const mod=await import("@walletconnect/ethereum-provider");
  const EthereumProvider=mod.default||mod.EthereumProvider;
  const provider=await EthereumProvider.init({projectId,optionalChains:[CHAIN_ID],rpcMap:{[CHAIN_ID]:"https://rpc.mainnet.chain.robinhood.com"},showQrModal:false,metadata:{name:"Nura AI",description:"AI health companion for onchain users",url:window.location.origin,icons:[window.location.origin+"/favicon.svg"]}});
  if(!provider.session) return null;
  await provider.enable();
  const accounts=await provider.request({method:"eth_accounts"});
  if(!accounts?.[0]) return null;
  activeProvider=provider;activeConnector="WalletConnect";
  const data={address:accounts[0],connector:"WalletConnect",chainId:CHAIN_ID};save(data);return data;
 }catch{return null}
}
export async function restoreWallet(){
 if(typeof window==="undefined") return null;
 const saved=getSavedWallet();
 const injected=await restoreInjected(saved);
 if(injected) return injected;
 const wc=await restoreWalletConnect(saved);
 if(wc) return wc;
 try{localStorage.removeItem(STORAGE_KEY)}catch{}
 return null;
}

export async function connectWallet(){
 try{
   const injected=await connectInjected();
   if(injected) return injected;
 }catch(error){
   if(error?.code===4001) throw new Error("Wallet connection was cancelled.");
   throw error;
 }
 return connectWalletConnect();
}

export async function disconnectWallet(){
 try{await activeProvider?.disconnect?.()}catch{}
 activeProvider=null;
 activeConnector="";
 try{localStorage.removeItem(STORAGE_KEY)}catch{}
}

export function getActiveConnector(){return activeConnector}
