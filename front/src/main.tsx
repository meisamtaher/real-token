import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import theme from "./theme.ts"
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, sepolia, WagmiConfig } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  zora,
  goerli,
  scrollSepolia,
  arbitrumGoerli,
  polygonZkEvmTestnet,
  mantleTestnet,
  lineaTestnet,
  baseGoerli,
} from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
const { chains, publicClient } = configureChains(
  [goerli, sepolia, scrollSepolia, arbitrumGoerli, polygonZkEvmTestnet, mantleTestnet, lineaTestnet, baseGoerli],
  [
    publicProvider()
  ]
);
console.log(" Project ID:" ,import.meta.env.REACT_APP_PROJECT_ID)
const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  projectId: import.meta.env.VITE_REACT_APP_PROJECT_ID as string,
  chains
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
})


ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <App />
      </RainbowKitProvider>
    </WagmiConfig>
  </ThemeProvider>
)
