import { AnchorProvider, Program, web3 } from '@project-serum/anchor'
import { CodingCamp as CodingCampIdl } from '../target/types/coding_camp'
import { AnchorWallet, BallotData, IdlEvents } from './types'
import {
  DEFAULT_RPC_ENDPOINT,
  DEFAULT_CODINGCAMP_PROGRAM_ID,
  DEFAULT_CODINGCAMP_IDL,
} from './constant'
import { deriveBallot, isAddress, uid } from './utils'

class CodingCamp {
  private _connection: web3.Connection
  private _provider: AnchorProvider
  readonly program: Program<CodingCampIdl>
  constructor(
    wallet: AnchorWallet,
    rpcEndpoint: string = DEFAULT_RPC_ENDPOINT,
    programId: string = DEFAULT_CODINGCAMP_PROGRAM_ID,
  ) {
    if (!isAddress(programId)) throw new Error('Invalid program id')
    // Private
    this._connection = new web3.Connection(rpcEndpoint, 'confirmed')
    this._provider = new AnchorProvider(this._connection, wallet, {
      skipPreflight: true,
      commitment: 'confirmed',
    })
    // Public
    this.program = new Program<CodingCampIdl>(
      DEFAULT_CODINGCAMP_IDL,
      programId,
      this._provider,
    )
  }

  /**
   * Get list of event names
   */
  get events() {
    return this.program.idl.events.map(({ name }) => name)
  }

  /**
   * Listen changes on an event
   * @param eventName Event name
   * @param callback Event handler
   * @returns Listener id
   */
  addListener = async <T extends keyof IdlEvents<CodingCampIdl>>(
    eventName: T,
    callback: (data: IdlEvents<CodingCampIdl>[T]) => void,
  ) => {
    return await this.program.addEventListener(
      eventName as string,
      (data: IdlEvents<CodingCampIdl>[T]) => callback(data),
    )
  }

  /**
   * Remove listener by its id
   * @param listenerId Listener id
   * @returns
   */
  removeListener = async (listenerId: number) => {
    try {
      await this.program.removeEventListener(listenerId)
    } catch (er: any) {
      console.warn(er)
    }
  }

  /**
   * Parse ballot buffer data.
   * @param data Dao buffer data.
   * @returns Dao readable data.
   */
  parseBallotData = (data: Buffer): BallotData => {
    return this.program.coder.accounts.decode('ballot', data)
  }

  /**
   * Get ballot data.
   * @param ballotAddress Ballot address.
   * @returns Ballot readable data.
   */
  getBallotData = async (ballotAddress: string): Promise<BallotData> => {
    return this.program.account.ballot.fetch(ballotAddress)
  }

  /**
   * Derive a ballot address by campaign name and project name.
   * @param campaignName Campaign name.
   * @param projectName Project name.
   * @returns Ballot address.
   */
  deriveBallotAddress = async (campaignName: string, projectName: string) => {
    const proposalPublicKey = await deriveBallot(
      this._provider.wallet.publicKey,
      campaignName,
      projectName,
      this.program.programId,
    )
    return proposalPublicKey.toBase58()
  }

  /**
   * Vote
   * @param campaignName Campaign name
   * @param projectName Project name
   * @returns {txId, ballotAddress}
   */
  vote = async (campaignName: string, projectName: string) => {
    const ballotAddress = await this.deriveBallotAddress(
      campaignName,
      projectName,
    )
    const txId = await this.program.methods
      .vote(Array.from(uid(campaignName)), Array.from(uid(projectName)))
      .accounts({
        authority: this._provider.wallet.publicKey,
        ballot: new web3.PublicKey(ballotAddress),
        systemProgram: web3.SystemProgram.programId,
        rent: web3.SYSVAR_RENT_PUBKEY,
      })
      .rpc()
    return { txId, ballotAddress }
  }

  /**
   * Void
   * @param campaignName Campaign name
   * @param projectName Project name
   * @returns {txId, ballotAddress}
   */
  void = async (campaignName: string, projectName: string) => {
    const ballotAddress = await this.deriveBallotAddress(
      campaignName,
      projectName,
    )
    const txId = await this.program.methods
      .void(Array.from(uid(campaignName)), Array.from(uid(projectName)))
      .accounts({
        authority: this._provider.wallet.publicKey,
        ballot: new web3.PublicKey(ballotAddress),
      })
      .rpc()
    return { txId, ballotAddress }
  }
}

export default CodingCamp
