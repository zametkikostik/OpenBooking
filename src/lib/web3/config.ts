// OpenBooking Web3 Configuration
import { Address } from 'viem'

export const WEB3_CONFIG = {
  // Chain Configuration
  chains: {
    1: {
      name: 'Ethereum Mainnet',
      rpcUrl: process.env.ETH_RPC_URL || '',
      explorer: 'https://etherscan.io',
      currency: 'ETH',
    },
    137: {
      name: 'Polygon',
      rpcUrl: 'https://polygon-rpc.com',
      explorer: 'https://polygonscan.com',
      currency: 'MATIC',
    },
  },

  // Token Addresses (Example - Ethereum Mainnet)
  tokens: {
    USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    ETH: '0x0000000000000000000000000000000000000000', // Native
    OPENBOOKING: process.env.NEXT_PUBLIC_OPENBOOKING_TOKEN_ADDRESS as Address || '0x6fA0BE17e4beA2fCfA22ef89BF8ac9aab0AB0fc9',
    A7A5: process.env.NEXT_PUBLIC_A7A5_STABLECOIN_ADDRESS as Address || '0x0000000000000000000000000000000000000000',
  },

  // Contract Addresses
  contracts: {
    escrow: '0x0000000000000000000000000000000000000001', // Placeholder
    aavePool: process.env.AAVE_LENDING_POOL_ADDRESS as Address || '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9',
  },
} as const

export type ChainId = keyof typeof WEB3_CONFIG.chains
export type TokenSymbol = keyof typeof WEB3_CONFIG.tokens

// Token Decimals
export const TOKEN_DECIMALS: Record<TokenSymbol, number> = {
  USDT: 6,
  USDC: 6,
  ETH: 18,
  OPENBOOKING: 18,
  A7A5: 18,
}

// Escrow Smart Contract ABI (Simplified)
export const ESCROW_ABI = [
  {
    inputs: [
      { name: 'bookingId', type: 'bytes32' },
      { name: 'amount', type: 'uint256' },
      { name: 'token', type: 'address' },
      { name: 'guest', type: 'address' },
      { name: 'host', type: 'address' },
    ],
    name: 'createEscrow',
    outputs: [{ name: 'escrowId', type: 'bytes32' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'escrowId', type: 'bytes32' }],
    name: 'releaseFunds',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'escrowId', type: 'bytes32' }],
    name: 'refund',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'escrowId', type: 'bytes32' }],
    name: 'getEscrowStatus',
    outputs: [
      { name: 'status', type: 'uint8' },
      { name: 'amount', type: 'uint256' },
      { name: 'guest', type: 'address' },
      { name: 'host', type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'escrowId', type: 'bytes32' }],
    name: 'EscrowReleased',
    outputs: [],
    type: 'event',
  },
] as const

// ERC20 Token ABI
export const ERC20_ABI = [
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

// Aave Pool ABI (Simplified)
export const AAVE_POOL_ABI = [
  {
    inputs: [
      { name: 'asset', type: 'address' },
      { name: 'amount', type: 'uint256' },
      { name: 'onBehalfOf', type: 'address' },
      { name: 'referralCode', type: 'uint16' },
    ],
    name: 'deposit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'asset', type: 'address' },
      { name: 'amount', type: 'uint256' },
      { name: 'to', type: 'address' },
    ],
    name: 'withdraw',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'asset', type: 'address' }],
    name: 'getUserAccountData',
    outputs: [
      { name: 'totalCollateralETH', type: 'uint256' },
      { name: 'totalDebtETH', type: 'uint256' },
      { name: 'availableBorrowsETH', type: 'uint256' },
      { name: 'currentLiquidationThreshold', type: 'uint256' },
      { name: 'ltv', type: 'uint256' },
      { name: 'healthFactor', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const

// Web3 Utility Functions
export function formatUnits(amount: bigint, decimals: number): string {
  const divisor = 10n ** BigInt(decimals)
  const integerPart = amount / divisor
  const fractionalPart = amount % divisor
  
  const fractionalStr = fractionalPart.toString().padStart(decimals, '0').slice(0, decimals)
  
  return `${integerPart.toString()}.${fractionalStr}`
}

export function parseUnits(amount: string, decimals: number): bigint {
  const [integerPart, fractionalPart = ''] = amount.split('.')
  const paddedFractional = fractionalPart.padEnd(decimals, '0').slice(0, decimals)
  
  const integer = BigInt(integerPart || '0')
  const fractional = BigInt(paddedFractional)
  
  return integer * (10n ** BigInt(decimals)) + fractional
}

export function getExplorerUrl(chainId: number, txHash: string): string {
  const chain = WEB3_CONFIG.chains[chainId as keyof typeof WEB3_CONFIG.chains]
  return `${chain.explorer}/tx/${txHash}`
}

export function getTokenAddress(symbol: TokenSymbol, chainId?: number): Address {
  // In production, you'd have different addresses per chain
  return WEB3_CONFIG.tokens[symbol] as Address
}
