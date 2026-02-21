'use client'

import { useState, useEffect, useCallback } from 'react'
import { createPublicClient, createWalletClient, custom, http, Address } from 'viem'
import { mainnet, polygon, type Chain } from 'viem/chains'
import { WEB3_CONFIG, ChainId, TokenSymbol, ERC20_ABI, formatUnits, parseUnits } from '@/lib/web3/config'

export function useWeb3() {
  const [account, setAccount] = useState<Address | null>(null)
  const [chainId, setChainId] = useState<number>(0)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [balances, setBalances] = useState<Record<TokenSymbol, string>>({} as any)

  const getChain = (id: number): Chain => {
    switch (id) {
      case 137:
        return polygon
      default:
        return mainnet
    }
  }

  const connect = useCallback(async () => {
    setIsConnecting(true)
    setError(null)

    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask or another Web3 wallet')
      }

      const walletClient = createWalletClient({
        transport: custom(window.ethereum),
      })

      const [address] = await walletClient.requestAddresses()
      const chainId = await walletClient.getChainId()

      setAccount(address)
      setChainId(chainId)

      // Load balances
      await loadBalances(address, chainId)

      // Listen for account changes
      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', handleChainChanged)
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet')
    } finally {
      setIsConnecting(false)
    }
  }, [])

  const disconnect = useCallback(() => {
    setAccount(null)
    setChainId(0)
    setBalances({} as any)
    setError(null)

    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
      window.ethereum.removeListener('chainChanged', handleChainChanged)
    }
  }, [])

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnect()
    } else {
      setAccount(accounts[0] as Address)
      loadBalances(accounts[0] as Address, chainId)
    }
  }

  const handleChainChanged = (newChainId: number) => {
    setChainId(newChainId)
    if (account) {
      loadBalances(account, newChainId)
    }
    // Reload page on chain change (recommended by MetaMask)
    window.location.reload()
  }

  const loadBalances = async (address: Address, chain: number) => {
    try {
      const chainConfig = getChain(chain)
      const publicClient = createPublicClient({
        chain: chainConfig,
        transport: http(),
      })

      // Load ETH balance
      const ethBalance = await publicClient.getBalance({ address })
      const balances: any = {
        ETH: formatUnits(ethBalance, 18),
      }

      // Load token balances
      for (const [symbol, tokenAddress] of Object.entries(WEB3_CONFIG.tokens)) {
        if (symbol === 'ETH' || tokenAddress === '0x0000000000000000000000000000000000000000') {
          continue
        }

        try {
          const balance = await publicClient.readContract({
            address: tokenAddress as Address,
            abi: ERC20_ABI,
            functionName: 'balanceOf',
            args: [address],
          })

          const decimals = WEB3_CONFIG.tokens[symbol as TokenSymbol] === '0x0000000000000000000000000000000000000000' ? 18 : 6
          balances[symbol] = formatUnits(balance as bigint, decimals)
        } catch (err) {
          console.warn(`Failed to load ${symbol} balance:`, err)
        }
      }

      setBalances(balances)
    } catch (err) {
      console.error('Failed to load balances:', err)
    }
  }

  const switchChain = async (targetChainId: number) => {
    if (!window.ethereum) return

    try {
      const walletClient = createWalletClient({
        transport: custom(window.ethereum),
      })

      await walletClient.switchChain({ id: targetChainId as ChainId })
      setChainId(targetChainId)
    } catch (err: unknown) {
      const error = err as { code?: number }
      if (error.code === 4902) {
        // Chain not added, try to add it
        try {
          const walletClient = createWalletClient({
            transport: custom(window.ethereum),
          })
          await walletClient.addChain({
            chain: getChain(targetChainId),
          })
          setChainId(targetChainId)
        } catch {
          setError('Failed to add network')
        }
      } else {
        setError('Failed to switch network')
      }
    }
  }

  const getPublicClient = () => {
    const chainConfig = getChain(chainId)
    return createPublicClient({
      chain: chainConfig,
      transport: http(),
    })
  }

  const getWalletClient = () => {
    if (!window.ethereum) return null
    
    return createWalletClient({
      transport: custom(window.ethereum),
    })
  }

  return {
    account,
    chainId,
    isConnected: !!account,
    isConnecting,
    error,
    balances,
    connect,
    disconnect,
    switchChain,
    getPublicClient,
    getWalletClient,
  }
}

// Declare ethereum type
declare global {
  interface Window {
    ethereum?: any
  }
}
