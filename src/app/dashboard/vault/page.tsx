'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { SafeVault, Currency } from '@/types/database'
import { SafeVaultService, DEFI_PROTOCOLS } from '@/services/defi/safeVault'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { TrendingUp, Lock, Shield, Percent } from 'lucide-react'

export default function VaultPage() {
  const { profile } = useAuth()
  const [vaults, setVaults] = useState<SafeVault[]>([])
  const [loading, setLoading] = useState(true)
  const [depositAmount, setDepositAmount] = useState('')
  const [selectedVault, setSelectedVault] = useState<string | null>(null)

  const loadVaults = useCallback(async () => {
    if (!profile) return
    
    const service = new SafeVaultService()
    const { vaults, error } = await service.getUserVaults(profile.id)
    
    if (!error) {
      setVaults(vaults)
    }
    setLoading(false)
  }, [profile])

  useEffect(() => {
    if (profile) {
      loadVaults()
    }
  }, [profile, loadVaults])

  const handleCreateVault = async (protocol: string, currency: Currency) => {
    if (!profile) return

    const service = new SafeVaultService()
    const { vault, error } = await service.createVault({
      userId: profile.id,
      vaultName: `${protocol} ${currency} Vault`,
      protocol,
      currency,
    })

    if (!error && vault) {
      setVaults([...vaults, vault])
    }
  }

  const handleDeposit = async () => {
    if (!selectedVault || !depositAmount) return

    const service = new SafeVaultService()
    const { success } = await service.deposit({
      vaultId: selectedVault,
      amount: parseFloat(depositAmount),
      currency: 'USD',
      txHash: '0x_placeholder',
    })

    if (success) {
      setDepositAmount('')
      loadVaults()
    }
  }

  const totalValueLocked = vaults.reduce((sum, v) => sum + (v.current_value_usd || 0), 0)
  const totalYield = vaults.reduce((sum, v) => sum + (v.yield_earned || 0), 0)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading vaults...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Safe Vault Economy</h1>
        <p className="text-muted-foreground">
          Earn yield on your funds with DeFi protocols like Aave
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<TrendingUp className="h-5 w-5" />}
          label="Total Value Locked"
          value={formatCurrency(totalValueLocked, 'USD')}
        />
        <StatCard
          icon={<Percent className="h-5 w-5" />}
          label="Total Yield Earned"
          value={formatCurrency(totalYield, 'USD')}
        />
        <StatCard
          icon={<Shield className="h-5 w-5" />}
          label="Active Vaults"
          value={vaults.length}
        />
        <StatCard
          icon={<Lock className="h-5 w-5" />}
          label="Average APY"
          value={`${vaults.length ? (vaults.reduce((s, v) => s + (v.apy || 0), 0) / vaults.length).toFixed(2) : 0}%`}
        />
      </div>

      {/* Create New Vault */}
      <div className="bg-card border rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Create New Vault</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {Object.entries(DEFI_PROTOCOLS).map(([key, protocol]) => (
            <div
              key={key}
              className="border rounded-lg p-4 hover:border-primary cursor-pointer transition-colors"
              onClick={() => handleCreateVault(key, 'USDC')}
            >
              <div className="font-semibold mb-2">{protocol.name}</div>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>APY: {protocol.baseAPY}%</div>
                <div>Risk: <span className="capitalize">{protocol.riskScore}</span></div>
                <div>TVL: {formatCurrency(protocol.tvl, 'USD', 'en-US')}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* My Vaults */}
      <div className="bg-card border rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">My Vaults</h2>
        
        {vaults.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Lock className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No vaults yet. Create one to start earning yield!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {vaults.map((vault) => (
              <VaultCard
                key={vault.id}
                vault={vault}
                onSelect={() => setSelectedVault(vault.id)}
                isSelected={selectedVault === vault.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Deposit Modal (simplified) */}
      {selectedVault && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Deposit to Vault</h3>
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="Amount (USD)"
              className="w-full px-4 py-3 rounded-lg border bg-background mb-4"
            />
            <div className="flex gap-2">
              <Button onClick={handleDeposit} className="flex-1">
                Deposit
              </Button>
              <Button variant="outline" onClick={() => setSelectedVault(null)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ icon, label, value }: {
  icon: React.ReactNode
  label: string
  value: string | number
}) {
  return (
    <div className="bg-card border rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2 text-primary">
        {icon}
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  )
}

function VaultCard({ vault, onSelect, isSelected }: {
  vault: SafeVault
  onSelect: () => void
  isSelected: boolean
}) {
  const protocol = DEFI_PROTOCOLS[vault.protocol]

  return (
    <div
      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
        isSelected ? 'border-primary bg-primary/5' : 'hover:border-primary'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold mb-1">{vault.vault_name}</div>
          <div className="text-sm text-muted-foreground">
            {protocol?.name || vault.protocol}
          </div>
        </div>
        <div className="text-right">
          <div className="font-bold text-lg">
            {formatCurrency(vault.current_value_usd || 0, 'USD')}
          </div>
          <div className="text-sm text-green-600">
            +{formatCurrency(vault.yield_earned || 0, 'USD')} ({vault.apy}%)
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <Lock className="h-3 w-3" />
          {vault.status === 'locked' ? 'Locked' : 'Flexible'}
        </span>
        <span className="flex items-center gap-1">
          <Shield className="h-3 w-3" />
          {vault.risk_score} risk
        </span>
        <span className="flex items-center gap-1">
          <Percent className="h-3 w-3" />
          {vault.apy}% APY
        </span>
      </div>
    </div>
  )
}
