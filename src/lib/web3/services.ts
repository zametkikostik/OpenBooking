// ============================================
// OPENBOOKING WEB3 INTEGRATION
// Blockchain, Smart Contracts, DeFi
// ============================================

import { ethers } from 'ethers'
import type { payment_method } from '@/types/database'

// ============================================
// CONFIGURATION
// ============================================

export const WEB3_CONFIG = {
  // OpenBooking Token
  OBT_TOKEN_ADDRESS: process.env.OPENBOOKING_TOKEN_ADDRESS || '0x6fA0BE17e4beA2fCfA22ef89BF8ac9aab0AB0fc9',
  
  // A7A5 Stablecoin
  A7A5_STABLECOIN_ADDRESS: process.env.A7A5_STABLECOIN_ADDRESS || '0x0000000000000000000000000000000000000000',
  
  // Aave Lending Pool (Mainnet)
  AAVE_LENDING_POOL: process.env.AAVE_LENDING_POOL || '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9',
  
  // Networks
  NETWORKS: {
    ethereum: {
      chainId: 1,
      name: 'Ethereum Mainnet',
      rpcUrl: process.env.RPC_URL || 'https://mainnet.infura.io/v3/',
      explorer: 'https://etherscan.io'
    },
    polygon: {
      chainId: 137,
      name: 'Polygon',
      rpcUrl: 'https://polygon-rpc.com',
      explorer: 'https://polygonscan.com'
    },
    bsc: {
      chainId: 56,
      name: 'BNB Smart Chain',
      rpcUrl: 'https://bsc-dataseed.binance.org',
      explorer: 'https://bscscan.com'
    }
  }
}

// ============================================
// TOKEN CONFIGURATIONS
// ============================================

export const TOKENS: Record<string, { address: string; decimals: number; symbol: string }> = {
  USDT: {
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    decimals: 6,
    symbol: 'USDT'
  },
  USDC: {
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    decimals: 6,
    symbol: 'USDC'
  },
  ETH: {
    address: '0x0000000000000000000000000000000000000000',
    decimals: 18,
    symbol: 'ETH'
  },
  OBT: {
    address: WEB3_CONFIG.OBT_TOKEN_ADDRESS,
    decimals: 18,
    symbol: 'OBT'
  }
}

// ============================================
// SMART CONTRACT ABIs
// ============================================

const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'event Transfer(address indexed from, address indexed to, uint256 value)'
]

const ESCROW_ABI = [
  'function createEscrow(address token, address buyer, address seller, uint256 amount) returns (uint256)',
  'function release(uint256 escrowId)',
  'function dispute(uint256 escrowId)',
  'function resolveDispute(uint256 escrowId, bool favorBuyer)',
  'function getEscrow(uint256 escrowId) view returns (tuple(address token, address buyer, address seller, uint256 amount, uint8 status))',
  'event EscrowCreated(uint256 indexed escrowId, address indexed token, address indexed buyer, address seller, uint256 amount)',
  'event EscrowReleased(uint256 indexed escrowId, address indexed token, address buyer, address seller, uint256 amount)',
  'event EscrowDisputed(uint256 indexed escrowId)',
  'event DisputeResolved(uint256 indexed escrowId, bool favorBuyer)'
]

const AAVE_POOL_ABI = [
  'function deposit(address asset, uint256 amount, address onBehalfOf, uint16 referralCode)',
  'function withdraw(address asset, uint256 amount, address to) returns (uint256)',
  'function borrow(address asset, uint256 amount, uint256 interestRateMode, uint16 referralCode, address onBehalfOf)',
  'function repay(address asset, uint256 amount, uint256 interestRateMode, address onBehalfOf) returns (uint256)',
  'function getUserAccountData(address user) view returns (uint256 totalCollateralETH, uint256 totalDebtETH, uint256 availableBorrowsETH, uint256 currentLiquidationThreshold, uint256 ltv, uint256 healthFactor)',
  'event Deposit(address indexed reserve, address user, address indexed onBehalfOf, uint256 amount, uint16 indexed referralCode)',
  'event Withdrawal(address indexed reserve, address indexed user, address indexed to, uint256 amount)'
]

// ============================================
// WEB3 PROVIDER
// ============================================

export class Web3Provider {
  private provider: ethers.Provider
  private network: string
  
  constructor(network: string = 'ethereum') {
    const networkConfig = WEB3_CONFIG.NETWORKS[network as keyof typeof WEB3_CONFIG.NETWORKS]
    this.network = network
    
    if (!networkConfig) {
      throw new Error(`Unknown network: ${network}`)
    }
    
    // Use Infura or public RPC
    const rpcUrl = networkConfig.rpcUrl || WEB3_CONFIG.NETWORKS.ethereum.rpcUrl
    this.provider = new ethers.JsonRpcProvider(rpcUrl)
  }
  
  getProvider(): ethers.Provider {
    return this.provider
  }
  
  async getBlockNumber(): Promise<number> {
    return this.provider.getBlockNumber()
  }
  
  async getGasPrice(): Promise<bigint> {
    return this.provider.getFeeData().then(fees => fees.gasPrice || 0n)
  }
}

// ============================================
// TOKEN SERVICE
// ============================================

export class TokenService {
  private provider: Web3Provider
  
  constructor(provider: Web3Provider) {
    this.provider = provider
  }
  
  async getBalance(tokenSymbol: string, address: string): Promise<string> {
    const token = TOKENS[tokenSymbol]
    
    if (!token) {
      throw new Error(`Unknown token: ${tokenSymbol}`)
    }
    
    if (tokenSymbol === 'ETH') {
      const balance = await this.provider.getProvider().getBalance(address)
      return ethers.formatEther(balance)
    }
    
    const contract = new ethers.Contract(token.address, ERC20_ABI, this.provider.getProvider())
    const balance = await contract.balanceOf(address)
    return ethers.formatUnits(balance, token.decimals)
  }
  
  async getDecimals(tokenSymbol: string): Promise<number> {
    return TOKENS[tokenSymbol]?.decimals || 18
  }
  
  async getSymbol(tokenSymbol: string): Promise<string> {
    return TOKENS[tokenSymbol]?.symbol || tokenSymbol
  }
}

// ============================================
// ESCROW SERVICE
// ============================================

export class EscrowService {
  private provider: Web3Provider
  private contractAddress: string
  
  constructor(provider: Web3Provider, contractAddress: string) {
    this.provider = provider
    this.contractAddress = contractAddress
  }
  
  async createEscrow(
    tokenAddress: string,
    buyer: string,
    seller: string,
    amount: string,
    signer: ethers.Signer
  ): Promise<{ escrowId: string; txHash: string }> {
    const contract = new ethers.Contract(this.contractAddress, ESCROW_ABI, signer)
    
    const token = TOKENS[tokenAddress] || { decimals: 18 }
    const amountWei = ethers.parseUnits(amount, token.decimals)
    
    const tx = await contract.createEscrow(tokenAddress, buyer, seller, amountWei)
    const receipt = await tx.wait()
    
    // Parse event
    const event = receipt?.logs.find(log => {
      try {
        const parsed = contract.interface.parseLog(log)
        return parsed?.name === 'EscrowCreated'
      } catch {
        return false
      }
    })
    
    if (!event) {
      throw new Error('EscrowCreated event not found')
    }
    
    const parsed = contract.interface.parseLog(event)
    const escrowId = parsed?.args[0]
    
    return {
      escrowId: escrowId.toString(),
      txHash: receipt!.hash
    }
  }
  
  async releaseEscrow(escrowId: string, signer: ethers.Signer): Promise<string> {
    const contract = new ethers.Contract(this.contractAddress, ESCROW_ABI, signer)
    const tx = await contract.release(escrowId)
    await tx.wait()
    return tx.hash
  }
  
  async disputeEscrow(escrowId: string, signer: ethers.Signer): Promise<string> {
    const contract = new ethers.Contract(this.contractAddress, ESCROW_ABI, signer)
    const tx = await contract.dispute(escrowId)
    await tx.wait()
    return tx.hash
  }
  
  async getEscrowDetails(escrowId: string): Promise<{
    token: string
    buyer: string
    seller: string
    amount: string
    status: number
  }> {
    const contract = new ethers.Contract(this.contractAddress, ESCROW_ABI, this.provider.getProvider())
    const details = await contract.getEscrow(escrowId)
    
    return {
      token: details.token,
      buyer: details.buyer,
      seller: details.seller,
      amount: details.amount.toString(),
      status: details.status
    }
  }
}

// ============================================
// DEFI SERVICE (AAVE)
// ============================================

export class DefiService {
  private provider: Web3Provider
  private poolAddress: string
  
  constructor(provider: Web3Provider) {
    this.provider = provider
    this.poolAddress = WEB3_CONFIG.AAVE_LENDING_POOL
  }
  
  async deposit(
    asset: string,
    amount: string,
    onBehalfOf: string,
    signer: ethers.Signer
  ): Promise<string> {
    const contract = new ethers.Contract(this.poolAddress, AAVE_POOL_ABI, signer)
    
    const token = TOKENS[asset] || { decimals: 18 }
    const amountWei = ethers.parseUnits(amount, token.decimals)
    
    // First approve
    const tokenContract = new ethers.Contract(
      token.address === '0x0000000000000000000000000000000000000000' 
        ? asset 
        : token.address,
      ERC20_ABI,
      signer
    )
    
    const approveTx = await tokenContract.approve(this.poolAddress, amountWei)
    await approveTx.wait()
    
    // Then deposit
    const tx = await contract.deposit(asset, amountWei, onBehalfOf, 0)
    await tx.wait()
    
    return tx.hash
  }
  
  async withdraw(
    asset: string,
    amount: string,
    to: string,
    signer: ethers.Signer
  ): Promise<string> {
    const contract = new ethers.Contract(this.poolAddress, AAVE_POOL_ABI, signer)
    
    const token = TOKENS[asset] || { decimals: 18 }
    const amountWei = ethers.parseUnits(amount, token.decimals)
    
    const tx = await contract.withdraw(asset, amountWei, to)
    await tx.wait()
    
    return tx.hash
  }
  
  async getUserAccountData(user: string): Promise<{
    totalCollateralETH: string
    totalDebtETH: string
    availableBorrowsETH: string
    healthFactor: string
  }> {
    const contract = new ethers.Contract(this.poolAddress, AAVE_POOL_ABI, this.provider.getProvider())
    const data = await contract.getUserAccountData(user)
    
    return {
      totalCollateralETH: ethers.formatEther(data.totalCollateralETH),
      totalDebtETH: ethers.formatEther(data.totalDebtETH),
      availableBorrowsETH: ethers.formatEther(data.availableBorrowsETH),
      healthFactor: ethers.formatEther(data.healthFactor)
    }
  }
  
  async calculateAPY(asset: string): Promise<number> {
    // In production, fetch from Aave API or contract
    // Mock APY based on asset
    const apyRates: Record<string, number> = {
      USDT: 3.5,
      USDC: 3.2,
      ETH: 2.1,
      DAI: 3.8
    }
    
    return apyRates[asset] || 2.0
  }
}

// ============================================
// PAYMENT TO WEB3 BRIDGE
// ============================================

export class PaymentBridge {
  private provider: Web3Provider
  private tokenService: TokenService
  private escrowService: EscrowService
  
  constructor(provider: Web3Provider, escrowContractAddress: string) {
    this.provider = provider
    this.tokenService = new TokenService(provider)
    this.escrowService = new EscrowService(provider, escrowContractAddress)
  }
  
  paymentMethodToToken(method: payment_method): string {
    const mapping: Record<payment_method, string> = {
      usdt: 'USDT',
      usdc: 'USDC',
      eth: 'ETH',
      obt_token: 'OBT',
      a7a5_stable: 'USDT', // Fallback
      sbp: 'USDT',
      mir: 'USDT',
      yookassa: 'USDT',
      sepa: 'USDC',
      adyen: 'USDC',
      klarna: 'USDC',
      borica: 'USDC',
      epay_bg: 'USDC',
      visa: 'USDC',
      mastercard: 'USDC'
    }
    
    return mapping[method] || 'USDT'
  }
  
  async processCryptoPayment(
    method: payment_method,
    amount: number,
    fromAddress: string,
    toAddress: string,
    signer: ethers.Signer
  ): Promise<{ txHash: string; amount: string; token: string }> {
    const tokenSymbol = this.paymentMethodToToken(method)
    const token = TOKENS[tokenSymbol]
    
    if (!token) {
      throw new Error(`Unsupported token for payment method: ${method}`)
    }
    
    const tokenService = new TokenService(this.provider)
    const contract = new ethers.Contract(
      token.address,
      ERC20_ABI,
      signer
    )
    
    const amountWei = ethers.parseUnits(amount.toString(), token.decimals)
    
    const tx = await contract.transfer(toAddress, amountWei)
    await tx.wait()
    
    return {
      txHash: tx.hash,
      amount: amount.toString(),
      token: tokenSymbol
    }
  }
}

// ============================================
// WALLET CONNECTOR
// ============================================

export class WalletConnector {
  private provider: Web3Provider
  
  constructor() {
    this.provider = new Web3Provider()
  }
  
  async connectWallet(): Promise<{
    address: string
    chainId: number
    provider: any
  }> {
    // Browser wallet connection (MetaMask, etc.)
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({ 
          method: 'eth_requestAccounts' 
        })
        
        const chainId = await (window as any).ethereum.request({ 
          method: 'eth_chainId' 
        })
        
        return {
          address: accounts[0],
          chainId: parseInt(chainId, 16),
          provider: (window as any).ethereum
        }
      } catch (error) {
        throw new Error('Failed to connect wallet')
      }
    }
    
    throw new Error('No wallet found')
  }
  
  async switchNetwork(chainId: number): Promise<void> {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        await (window as any).ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${chainId.toString(16)}` }],
        })
      } catch (error: any) {
        if (error.code === 4902) {
          throw new Error('Network not added to wallet')
        }
        throw error
      }
    }
  }
  
  async signMessage(message: string, address: string): Promise<string> {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      return (window as any).ethereum.request({
        method: 'personal_sign',
        params: [message, address],
      })
    }
    
    throw new Error('No wallet found')
  }
}

// ============================================
// BLOCKCHAIN EVENT LISTENER
// ============================================

export class BlockchainEventListener {
  private provider: Web3Provider
  private listeners: Map<string, Set<(event: any) => void>> = new Map()
  
  constructor(provider: Web3Provider) {
    this.provider = provider
  }
  
  async listenToEscrowEvents(
    contractAddress: string,
    callback: (event: { type: string; data: any }) => void
  ): Promise<() => void> {
    const contract = new ethers.Contract(contractAddress, ESCROW_ABI, this.provider.getProvider())
    
    const handleEvent = (event: any) => {
      const parsed = contract.interface.parseLog(event)
      if (parsed) {
        callback({
          type: parsed.name,
          data: parsed.args
        })
      }
    }
    
    // Listen to all escrow events
    contract.on('*', handleEvent)
    
    // Return unsubscribe function
    return () => {
      contract.removeAllListeners()
    }
  }
  
  async listenToTokenTransfers(
    tokenAddress: string,
    callback: (transfer: { from: string; to: string; amount: string }) => void
  ): Promise<() => void> {
    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, this.provider.getProvider())
    
    contract.on('Transfer', (from: string, to: string, value: bigint) => {
      callback({
        from,
        to,
        amount: ethers.formatEther(value)
      })
    })
    
    return () => {
      contract.removeAllListeners()
    }
  }
}

// ============================================
// WEB3 FACADE
// ============================================

export class Web3Facade {
  provider: Web3Provider
  tokenService: TokenService
  escrowService: EscrowService
  defiService: DefiService
  paymentBridge: PaymentBridge
  walletConnector: WalletConnector
  eventListener: BlockchainEventListener
  
  constructor(escrowContractAddress: string) {
    this.provider = new Web3Provider()
    this.tokenService = new TokenService(this.provider)
    this.escrowService = new EscrowService(this.provider, escrowContractAddress)
    this.defiService = new DefiService(this.provider)
    this.paymentBridge = new PaymentBridge(this.provider, escrowContractAddress)
    this.walletConnector = new WalletConnector()
    this.eventListener = new BlockchainEventListener(this.provider)
  }
  
  async getTVL(): Promise<{ total: number; byToken: Record<string, number> }> {
    // Calculate Total Value Locked across all protocols
    const byToken: Record<string, number> = {}
    
    // In production, query actual contract balances
    // Mock data for now
    byToken['USDT'] = 1000000
    byToken['USDC'] = 500000
    byToken['ETH'] = 100
    
    const total = Object.entries(byToken).reduce((sum, [token, amount]) => {
      // Convert to USD equivalent (simplified)
      const rates: Record<string, number> = { USDT: 1, USDC: 1, ETH: 2000 }
      return sum + (amount * (rates[token] || 1))
    }, 0)
    
    return { total, byToken }
  }
}
