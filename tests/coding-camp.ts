import {
  setProvider,
  AnchorProvider,
  workspace,
  web3,
  Program,
} from '@project-serum/anchor'
import { expect } from 'chai'
import { DEFAULT_CODINGCAMP_PROGRAM_ID, deriveBallot, uid } from '../app'
import { CodingCamp } from '../target/types/coding_camp'

describe('coding-camp', () => {
  // Configure the client to use the local cluster.
  const provider = AnchorProvider.env()
  setProvider(provider)

  const program = workspace.CodingCamp as Program<CodingCamp>
  const authority = provider.wallet.publicKey
  const campaign = `Vietnam Solana Coding Camp - Season ${Math.floor(
    Math.random() * 10 ** 9,
  ).toString()}`
  const campaignId = Array.from(uid(campaign))
  const project = 'Sentre'
  const projectId = Array.from(uid(project))
  const programId = new web3.PublicKey(DEFAULT_CODINGCAMP_PROGRAM_ID)

  it('vote', async () => {
    const ballotPublicKey = await deriveBallot(
      authority,
      campaign,
      project,
      programId,
    )
    await program.methods
      .vote(campaignId, projectId)
      .accounts({
        authority,
        ballot: ballotPublicKey,
        systemProgram: web3.SystemProgram.programId,
        rent: web3.SYSVAR_RENT_PUBKEY,
      })
      .rpc()
    const { campaign: expectedCampaignId } = await program.account.ballot.fetch(
      ballotPublicKey.toBase58(),
    )
    expect(campaignId).to.deep.equal(expectedCampaignId)
  })

  it('void', async () => {
    const ballotPublicKey = await deriveBallot(
      authority,
      campaign,
      project,
      programId,
    )
    await program.methods
      .void(campaignId, projectId)
      .accounts({
        authority,
        ballot: ballotPublicKey,
      })
      .rpc()
  })
})
