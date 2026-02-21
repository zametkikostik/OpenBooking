import { createClient } from '@/lib/supabase'
import { SafeVault, VaultTransaction, Currency } from '@/types/database'
import { WEB3_CONFIG, AAVE_POOL_ABI, TOKEN_DECIMALS, formatUnits, parseUnits } from '@/lib/web3/config'
import { Address } from 'viem'

// DeFi Protocol Configuration
export interface ProtocolConfig {
  name: string
  contractAddress: Address
  supportedAssets: Currency[]
  baseAPY: number
  riskScore: 'low' | 'medium' | 'high'
  lockPeriodDays: number
  tvl: number
}

export const DEFI_PROTOCOLS: Record<string, ProtocolConfig> = {
  aave: {
    name: 'Aave V3',
    contractAddress: WEB3_CONFIG.contracts.aavePool as Address,
    supportedAssets: ['USDT', 'USDC', 'ETH'],
    baseAPY: 4.5,
    riskScore: 'low',
    lockPeriodDays: 0, // Flexible
    tvl: 5000000000, // $5B
  },
  compound: {
    name: 'Compound V3',
    contractAddress: '0xc3d688B66703497DAA19211EEdff47f25384cdc3',
    supportedAssets: ['USDC', 'ETH'],
    baseAPY: 3.8,
    riskScore: 'low',
    lockPeriodDays: 0,
    tvl: 2000000000,
  },
}

// Safe Vault Service
export class SafeVaultService {
  private supabase: any

  constructor() {
    this.supabase = createClient()
  }

  // Create a new vault for user
  async createVault(params: {
    userId: string
    vaultName: string
    protocol: string
    currency: Currency
    lockPeriodDays?: number
  }): Promise<{ vault: SafeVault; error?: any }> {
    const protocol = DEFI_PROTOCOLS[params.protocol]
    
    if (!protocol) {
      return { vault: {} as SafeVault, error: 'Protocol not found' }
    }

    if (!protocol.supportedAssets.includes(params.currency)) {
      return { vault: {} as SafeVault, error: 'Asset not supported by protocol' }
    }

    const vaultData = {
      user_id: params.userId,
      vault_name: params.vaultName,
      protocol: params.protocol,
      deposited_currency: params.currency,
      deposited_amount: 0,
      current_value_usd: 0,
      apy: protocol.baseAPY,
      yield_earned: 0,
      risk_score: protocol.riskScore,
      lock_period_days: params.lockPeriodDays || protocol.lockPeriodDays,
      status: 'active',
      contract_address: protocol.contractAddress,
      metadata: {
        protocol_name: protocol.name,
        protocol_tvl: protocol.tvl,
      },
    }

    const { data, error } = await this.supabase
      .from('safe_vaults')
      .insert(vaultData)
      .select()
      .single()

    if (error) {
      return { vault: {} as SafeVault, error }
    }

    return { vault: data }
  }

  // Deposit to vault
  async deposit(params: {
    vaultId: string
    amount: number
    currency: Currency
    txHash: string
  }): Promise<{ success: boolean; vault?: SafeVault; error?: any }> {
    const { data: vault, error: fetchError } = await this.supabase
      .from('safe_vaults')
      .select('*')
      .eq('id', params.vaultId)
      .single()

    if (fetchError || !vault) {
      return { success: false, error: fetchError }
    }

    // Update vault balance
    const newDepositedAmount = (vault.deposited_amount || 0) + params.amount
    const currentValueUsd = newDepositedAmount // Simplified: 1:1 for stablecoins

    const { error: updateError } = await this.supabase
      .from('safe_vaults')
      .update({
        deposited_amount: newDepositedAmount,
        current_value_usd: currentValueUsd,
      })
      .eq('id', params.vaultId)

    if (updateError) {
      return { success: false, error: updateError }
    }

    // Record transaction
    await this.recordTransaction({
      vault_id: params.vaultId,
      type: 'deposit',
      amount: params.amount,
      currency: params.currency,
      tx_hash: params.txHash,
    })

    return { success: true, vault }
  }

  // Withdraw from vault
  async withdraw(params: {
    vaultId: string
    amount: number
    txHash: string
  }): Promise<{ success: boolean; vault?: SafeVault; error?: any }> {
    const { data: vault, error: fetchError } = await this.supabase
      .from('safe_vaults')
      .select('*')
      .eq('id', params.vaultId)
      .single()

    if (fetchError || !vault) {
      return { success: false, error: fetchError }
    }

    // Check if enough balance
    if (vault.deposited_amount < params.amount) {
      return { success: false, error: 'Insufficient balance' }
    }

    // Check lock period
    if (vault.status === 'locked') {
      const unlockDate = vault.unlocked_at ? new Date(vault.unlocked_at) : null
      if (unlockDate && unlockDate > new Date()) {
        return { success: false, error: 'Vault is still locked' }
      }
    }

    const newDepositedAmount = vault.deposited_amount - params.amount
    const currentValueUsd = newDepositedAmount

    const { error: updateError } = await this.supabase
      .from('safe_vaults')
      .update({
        deposited_amount: newDepositedAmount,
        current_value_usd: currentValueUsd,
      })
      .eq('id', params.vaultId)

    if (updateError) {
      return { success: false, error: updateError }
    }

    // Record transaction
    await this.recordTransaction({
      vault_id: params.vaultId,
      type: 'withdraw',
      amount: params.amount,
      currency: vault.deposited_currency,
      tx_hash: params.txHash,
    })

    return { success: true, vault }
  }

  // Record yield earned
  async recordYield(params: {
    vaultId: string
    yieldAmount: number
  }): Promise<{ success: boolean; error?: any }> {
    const { data: vault } = await this.supabase
      .from('safe_vaults')
      .select('*')
      .eq('id', params.vaultId)
      .single()

    if (!vault) {
      return { success: false, error: 'Vault not found' }
    }

    const newYieldEarned = (vault.yield_earned || 0) + params.yieldAmount
    const newValueUsd = (vault.current_value_usd || 0) + params.yieldAmount

    const { error } = await this.supabase
      .from('safe_vaults')
      .update({
        yield_earned: newYieldEarned,
        current_value_usd: newValueUsd,
      })
      .eq('id', params.vaultId)

    if (error) {
      return { success: false, error }
    }

    // Record transaction
    await this.recordTransaction({
      vault_id: params.vaultId,
      type: 'yield',
      amount: params.yieldAmount,
      currency: vault.deposited_currency,
    })

    return { success: true }
  }

  // Get user vaults
  async getUserVaults(userId: string): Promise<{ vaults: SafeVault[]; error?: any }> {
    const { data, error } = await this.supabase
      .from('safe_vaults')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (error) {
      return { vaults: [], error }
    }

    return { vaults: data || [] }
  }

  // Get vault by ID
  async getVault(vaultId: string): Promise<{ vault: SafeVault | null; error?: any }> {
    const { data, error } = await this.supabase
      .from('safe_vaults')
      .select('*')
      .eq('id', vaultId)
      .single()

    if (error) {
      return { vault: null, error }
    }

    return { vault: data }
  }

  // Get total value locked across all vaults
  async getTotalValueLocked(): Promise<{ tvl: number; error?: any }> {
    const { data, error } = await this.supabase
      .from('platform_metrics')
      .select('tvl_usd')
      .eq('id', 1)
      .single()

    if (error) {
      return { tvl: 0, error }
    }

    return { tvl: data?.tvl_usd || 0 }
  }

  // Calculate estimated APY for vault
  async calculateEstimatedAPY(vaultId: string): Promise<{ apy: number; error?: any }> {
    const { vault, error } = await this.getVault(vaultId)

    if (error || !vault) {
      return { apy: 0, error }
    }

    const protocol = DEFI_PROTOCOLS[vault.protocol]
    if (!protocol) {
      return { apy: vault.apy || 0 }
    }

    // In production, fetch real-time APY from protocol
    return { apy: protocol.baseAPY }
  }

  // Private: Record vault transaction
  private async recordTransaction(params: {
    vault_id: string
    type: string
    amount: number
    currency: Currency
    tx_hash?: string
  }): Promise<void> {
    await this.supabase
      .from('vault_transactions')
      .insert({
        vault_id: params.vault_id,
        type: params.type,
        amount: params.amount,
        currency: params.currency,
        tx_hash: params.tx_hash,
      })
  }

  // Get vault transaction history
  async getVaultTransactions(vaultId: string): Promise<{ transactions: VaultTransaction[]; error?: any }> {
    const { data, error } = await this.supabase
      .from('vault_transactions')
      .select('*')
      .eq('vault_id', vaultId)
      .order('created_at', { ascending: false })

    if (error) {
      return { transactions: [], error }
    }

    return { transactions: data || [] }
  }

  // Lock vault for specified period
  async lockVault(params: {
    vaultId: string
    days: number
  }): Promise<{ success: boolean; error?: any }> {
    const unlockDate = new Date()
    unlockDate.setDate(unlockDate.getDate() + params.days)

    const { error } = await this.supabase
      .from('safe_vaults')
      .update({
        status: 'locked',
        unlocked_at: unlockDate.toISOString(),
        lock_period_days: params.days,
      })
      .eq('id', params.vaultId)

    if (error) {
      return { success: false, error }
    }

    return { success: true }
  }

  // Get recommended protocol based on risk preference
  getRecommendedProtocol(params: {
    riskPreference: 'low' | 'medium' | 'high'
    asset: Currency
    lockPeriodPreference?: number
  }): ProtocolConfig | null {
    const protocols = Object.values(DEFI_PROTOCOLS)
    
    const matching = protocols.filter(
      (p) =>
        p.supportedAssets.includes(params.asset) &&
        p.riskScore === params.riskPreference
    )

    if (matching.length === 0) {
      return null
    }

    // Return highest APY matching protocol
    return matching.reduce((best, current) =>
      current.baseAPY > best.baseAPY ? current : best
    )
  }
}

// Yield Optimizer Service
export class YieldOptimizerService {
  private vaultService: SafeVaultService

  constructor() {
    this.vaultService = new SafeVaultService()
  }

  // Auto-compound yield
  async autoCompound(vaultId: string): Promise<{ success: boolean; error?: any }> {
    const { vault, error } = await this.vaultService.getVault(vaultId)

    if (error || !vault) {
      return { success: false, error }
    }

    if (vault.yield_earned <= 0) {
      return { success: false, error: 'No yield to compound' }
    }

    // Re-invest yield
    return this.vaultService.recordYield({
      vaultId,
      yieldAmount: vault.yield_earned,
    })
  }

  // Rebalance vaults across protocols
  async rebalance(params: {
    userId: string
    targetRisk: 'low' | 'medium' | 'high'
  }): Promise<{ success: boolean; actions: string[]; error?: any }> {
    const { vaults, error } = await this.vaultService.getUserVaults(params.userId)

    if (error || vaults.length === 0) {
      return { success: false, actions: [], error }
    }

    const actions: string[] = []

    for (const vault of vaults) {
      const protocol = DEFI_PROTOCOLS[vault.protocol]
      
      if (protocol?.riskScore !== params.targetRisk) {
        // Suggest rebalancing
        actions.push(`Consider moving ${vault.vault_name} to ${params.targetRisk} risk protocol`)
      }
    }

    return { success: true, actions }
  }

  // Get optimal yield strategy
  getOptimalStrategy(params: {
    amount: number
    currency: Currency
    riskPreference: 'low' | 'medium' | 'high'
    lockPeriodMonths?: number
  }): { protocol: string; estimatedAPY: number; estimatedYearlyYield: number } | null {
    const protocol = this.vaultService.getRecommendedProtocol({
      riskPreference: params.riskPreference,
      asset: params.currency,
      lockPeriodPreference: params.lockPeriodMonths ? params.lockPeriodMonths * 30 : undefined,
    })

    if (!protocol) {
      return null
    }

    return {
      protocol: protocol.name,
      estimatedAPY: protocol.baseAPY,
      estimatedYearlyYield: params.amount * (protocol.baseAPY / 100),
    }
  }
}
