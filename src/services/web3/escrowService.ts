import { createPublicClient, createWalletClient, custom, http, Address, Hash, parseUnits } from 'viem'
import { mainnet } from 'viem/chains'
import { WEB3_CONFIG, ESCROW_ABI, ERC20_ABI, TOKEN_DECIMALS, TokenSymbol } from '@/lib/web3/config'

// Escrow Service for Web3 payments
export class EscrowService {
  private publicClient: any
  private walletClient: any
  private escrowContractAddress: Address

  constructor() {
    this.publicClient = createPublicClient({
      chain: mainnet,
      transport: http(WEB3_CONFIG.chains[1].rpcUrl),
    })
    
    this.escrowContractAddress = WEB3_CONFIG.contracts.escrow as Address
  }

  // Connect wallet
  async connectWallet() {
    if (!window.ethereum) {
      throw new Error('No Web3 wallet found')
    }

    this.walletClient = createWalletClient({
      transport: custom(window.ethereum),
    })

    const [address] = await this.walletClient.getAddresses()
    return address
  }

  // Create escrow for booking
  async createEscrow(params: {
    bookingId: string
    amount: string
    token: TokenSymbol
    guestAddress: Address
    hostAddress: Address
  }): Promise<{ escrowId: string; txHash: Hash }> {
    if (!this.walletClient) {
      await this.connectWallet()
    }

    const [address] = await this.walletClient.getAddresses()
    const amountWei = parseUnits(params.amount, TOKEN_DECIMALS[params.token])
    const tokenAddress = WEB3_CONFIG.tokens[params.token] as Address

    // First, approve token spending
    const approveHash = await this.approveTokenSpending({
      token: params.token,
      spender: this.escrowContractAddress,
      amount: params.amount,
    })

    // Wait for approval
    await this.waitForTransaction(approveHash)

    // Create escrow
    const escrowId = await this.publicClient.simulateContract({
      address: this.escrowContractAddress,
      abi: ESCROW_ABI,
      functionName: 'createEscrow',
      args: [
        params.bookingId as any, // bytes32
        amountWei,
        tokenAddress,
        params.guestAddress,
        params.hostAddress,
      ],
      account: address,
    })

    const txHash = await this.walletClient.writeContract(escrowId.request)

    return {
      escrowId: params.bookingId,
      txHash,
    }
  }

  // Release funds to host
  async releaseFunds(escrowId: string): Promise<Hash> {
    if (!this.walletClient) {
      await this.connectWallet()
    }

    const [address] = await this.walletClient.getAddresses()

    const releaseRequest = await this.publicClient.simulateContract({
      address: this.escrowContractAddress,
      abi: ESCROW_ABI,
      functionName: 'releaseFunds',
      args: [escrowId as any],
      account: address,
    })

    return this.walletClient.writeContract(releaseRequest.request)
  }

  // Refund to guest
  async refund(escrowId: string): Promise<Hash> {
    if (!this.walletClient) {
      await this.connectWallet()
    }

    const [address] = await this.walletClient.getAddresses()

    const refundRequest = await this.publicClient.simulateContract({
      address: this.escrowContractAddress,
      abi: ESCROW_ABI,
      functionName: 'refund',
      args: [escrowId as any],
      account: address,
    })

    return this.walletClient.writeContract(refundRequest.request)
  }

  // Get escrow status
  async getEscrowStatus(escrowId: string): Promise<{
    status: number
    amount: string
    guest: Address
    host: Address
  }> {
    const result = await this.publicClient.readContract({
      address: this.escrowContractAddress,
      abi: ESCROW_ABI,
      functionName: 'getEscrowStatus',
      args: [escrowId as any],
    })

    return {
      status: result[0],
      amount: result[1].toString(),
      guest: result[2],
      host: result[3],
    }
  }

  // Approve token spending
  private async approveTokenSpending(params: {
    token: TokenSymbol
    spender: Address
    amount: string
  }): Promise<Hash> {
    const tokenAddress = WEB3_CONFIG.tokens[params.token] as Address
    const amountWei = parseUnits(params.amount, TOKEN_DECIMALS[params.token])

    const [address] = await this.walletClient.getAddresses()

    const approveRequest = await this.publicClient.simulateContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [params.spender, amountWei],
      account: address,
    })

    return this.walletClient.writeContract(approveRequest.request)
  }

  // Wait for transaction confirmation
  private async waitForTransaction(hash: Hash, confirmations = 1): Promise<void> {
    await this.publicClient.waitForTransactionReceipt({
      hash,
      confirmations,
    })
  }

  // Listen to escrow events
  async listenToEscrowEvents(escrowId: string, callback: (event: any) => void): Promise<() => void> {
    const unwatch = await this.publicClient.watchContractEvent({
      address: this.escrowContractAddress,
      abi: ESCROW_ABI,
      eventName: 'EscrowReleased',
      args: { escrowId: escrowId as any },
      onLogs: (logs: any[]) => {
        logs.forEach((log) => callback(log))
      },
    })

    return unwatch
  }
}

// NFT Proof of Stay Service
export class NFTProofService {
  private contractAddress: Address = '0x0000000000000000000000000000000000000000' // Placeholder

  async mintProofOfStay(params: {
    bookingId: string
    guestAddress: Address
    metadata: {
      propertyId: string
      checkIn: string
      checkOut: string
      rating?: number
    }
  }): Promise<Hash> {
    // Implementation for minting NFT proof of stay
    // This would integrate with an NFT contract
    throw new Error('Not implemented - requires NFT contract deployment')
  }

  async getProofOfStay(guestAddress: Address, bookingId: string): Promise<any> {
    // Query NFT ownership for proof
    throw new Error('Not implemented')
  }
}

// Smart Contract Event Logger
export class BlockchainEventLogger {
  async logEvent(params: {
    eventType: string
    bookingId: string
    userId: string
    amount?: string
    metadata?: Record<string, any>
  }): Promise<void> {
    // Log events to blockchain for immutable audit trail
    console.log('Blockchain Event:', params)
    
    // In production, this would emit events to a smart contract
    // or store on IPFS/Arweave for permanent storage
  }

  async getEventHistory(bookingId: string): Promise<any[]> {
    // Retrieve event history from blockchain
    return []
  }
}
