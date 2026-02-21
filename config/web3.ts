import { createConfig, http } from '@wagmi/core';
import { mainnet, polygon, arbitrum, optimism, base } from 'viem/chains';
import { metaMask, walletConnect, coinbaseWallet } from '@wagmi/connectors';

// Token Addresses
export const TOKENS = {
  ETH: {
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    address: '0x0000000000000000000000000000000000000000', // Native
  },
  DAI: {
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    decimals: 18,
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', // Mainnet
  },
  A7A5: {
    symbol: 'A7A5',
    name: 'A7A5 Token',
    decimals: 18,
    address: '0x6fA0BE17e4beA2fCfA22ef89BF8ac9aab0AB0fc9',
  },
} as const;

// Aave Contract Addresses (Mainnet)
export const AAVE_ADDRESSES = {
  POOL_PROVIDER: '0x5E52dEc931FFb32f609681B8438A51c675cc232d',
  POOL: '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9',
  A_TOKEN_PREFIX: '0x030bA81f1c18d280636F32af80b9AAd02Cf0854e', // aDAI example
} as const;

// Supported Chains
export const CHAINS = {
  mainnet: {
    ...mainnet,
    rpcUrl: process.env.ETH_RPC_URL || 'https://eth.llamarpc.com',
  },
  polygon,
  arbitrum,
  optimism,
  base,
} as const;

// Wagmi Config
export const config = createConfig({
  chains: [CHAINS.mainnet, CHAINS.polygon, CHAINS.arbitrum, CHAINS.optimism, CHAINS.base],
  connectors: [
    metaMask(),
    walletConnect({ projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'default' }),
    coinbaseWallet({ appName: 'OpenBooking' }),
  ],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
    [base.id]: http(),
  },
});

// Payment Methods Configuration
export const PAYMENT_METHODS = {
  crypto: [
    {
      id: 'eth',
      name: 'Ethereum',
      symbol: 'ETH',
      network: 'mainnet',
      icon: '⟠',
      confirmations: 12,
      enabled: true,
    },
    {
      id: 'dai',
      name: 'DAI Stablecoin',
      symbol: 'DAI',
      network: 'mainnet',
      icon: '🪙',
      confirmations: 12,
      enabled: true,
    },
    {
      id: 'a7a5',
      name: 'A7A5 Token',
      symbol: 'A7A5',
      network: 'mainnet',
      icon: '🔷',
      confirmations: 12,
      enabled: true,
    },
  ],
  fiat: [
    {
      id: 'sbp',
      name: 'СБП',
      region: 'RU',
      icon: '🇷🇺',
      enabled: true,
    },
    {
      id: 'mir',
      name: 'Mir Card',
      region: 'RU',
      icon: '🇷🇺',
      enabled: true,
    },
    {
      id: 'yookassa',
      name: 'YooKassa',
      region: 'RU',
      icon: '🇷🇺',
      enabled: true,
    },
    {
      id: 'sepa',
      name: 'SEPA',
      region: 'EU',
      icon: '🇪🇺',
      enabled: true,
    },
    {
      id: 'adyen',
      name: 'Adyen',
      region: 'EU',
      icon: '🇪🇺',
      enabled: true,
    },
    {
      id: 'klarna',
      name: 'Klarna',
      region: 'EU',
      icon: '🇪🇺',
      enabled: true,
    },
    {
      id: 'borica',
      name: 'Borica',
      region: 'BG',
      icon: '🇧🇬',
      enabled: true,
    },
    {
      id: 'epay',
      name: 'ePay.bg',
      region: 'BG',
      icon: '🇧🇬',
      enabled: true,
    },
  ],
} as const;

// Escrow Configuration
export const ESCROW_CONFIG = {
  // State machine transitions
  states: {
    PENDING: {
      label: 'Ожидает оплаты',
      color: 'yellow',
      nextStates: ['PAYMENT_LOCKED', 'CANCELLED'],
    },
    PAYMENT_LOCKED: {
      label: 'Оплачено (Escrow)',
      color: 'blue',
      nextStates: ['CHECKED_IN', 'CANCELLED'],
    },
    CHECKED_IN: {
      label: 'Заселение',
      color: 'purple',
      nextStates: ['COMPLETED'],
    },
    COMPLETED: {
      label: 'Завершено',
      color: 'green',
      nextStates: ['SETTLED'],
    },
    SETTLED: {
      label: 'Расчёт выполнен',
      color: 'gray',
      nextStates: [],
    },
    CANCELLED: {
      label: 'Отменено',
      color: 'red',
      nextStates: [],
    },
  },
  // Cancellation rules
  cancellationRules: {
    // Host cannot cancel after CHECKED_IN
    hostCanCancel: ['PENDING', 'PAYMENT_LOCKED'],
    // Admin cannot withdraw after CHECKED_IN
    adminCanWithdraw: ['COMPLETED', 'SETTLED'],
    // Auto-release after checkout
    autoReleaseAfterCheckout: 24, // hours
  },
} as const;

// RPC Methods for transaction verification
export const RPC_METHODS = {
  GET_TRANSACTION_RECEIPT: 'eth_getTransactionReceipt',
  GET_TRANSACTION_BY_HASH: 'eth_getTransactionByHash',
  GET_BLOCK_NUMBER: 'eth_blockNumber',
  GET_BALANCE: 'eth_getBalance',
  CALL: 'eth_call',
  ESTIMATE_GAS: 'eth_estimateGas',
  SEND_RAW_TRANSACTION: 'eth_sendRawTransaction',
} as const;

// Helper functions
export function getTokenAddress(symbol: string, chainId: number): string {
  const token = TOKENS[symbol as keyof typeof TOKENS];
  if (!token) throw new Error(`Unknown token: ${symbol}`);
  
  // For now, return mainnet addresses
  // In production, you'd have addresses per chain
  return token.address;
}

export function getConfirmationsRequired(symbol: string): number {
  const method = PAYMENT_METHODS.crypto.find(m => m.symbol.toLowerCase() === symbol.toLowerCase());
  return method?.confirmations || 12;
}

export function isPaymentMethodEnabled(type: 'crypto' | 'fiat', id: string): boolean {
  const methods = type === 'crypto' ? PAYMENT_METHODS.crypto : PAYMENT_METHODS.fiat;
  return methods.some(m => m.id === id && m.enabled);
}
