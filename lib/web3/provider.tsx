'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create Query Client
const queryClient = new QueryClient();

interface Web3ContextType {
  address?: `0x${string}`;
  isConnected: boolean;
  isConnecting: boolean;
  chainId?: number;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  balance?: bigint;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Web3InternalProvider>{children}</Web3InternalProvider>
    </QueryClientProvider>
  );
}

function Web3InternalProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<`0x${string}` | undefined>();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [chainId, setChainId] = useState<number | undefined>();
  const [balance, setBalance] = useState<bigint | undefined>();

  useEffect(() => {
    checkConnection();
  }, []);

  async function checkConnection() {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts && accounts.length > 0) {
          setAddress(accounts[0] as `0x${string}`);
          setIsConnected(true);
          const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
          setChainId(parseInt(chainIdHex, 16));
          await fetchBalance(accounts[0]);
        }
      }
    } catch (error) {
      console.error('Error checking connection:', error);
    }
  }

  async function fetchBalance(addr: string) {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const balanceHex = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [addr, 'latest'],
        });
        setBalance(BigInt(balanceHex));
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  }

  async function connect() {
    try {
      setIsConnecting(true);

      if (typeof window !== 'undefined' && window.ethereum) {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });

        if (accounts && accounts.length > 0) {
          setAddress(accounts[0] as `0x${string}`);
          setIsConnected(true);
          const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
          setChainId(parseInt(chainIdHex, 16));
          await fetchBalance(accounts[0]);
        }
      } else {
        throw new Error('No crypto wallet found. Please install MetaMask or another wallet.');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  }

  async function disconnect() {
    try {
      setAddress(undefined);
      setIsConnected(false);
      setChainId(undefined);
      setBalance(undefined);
    } catch (error) {
      console.error('Error disconnecting:', error);
    }
  }

  return (
    <Web3Context.Provider
      value={{
        address,
        isConnected,
        isConnecting,
        chainId,
        connect,
        disconnect,
        balance,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}

// Extend Window interface for MetaMask
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ethereum?: any;
  }
}
