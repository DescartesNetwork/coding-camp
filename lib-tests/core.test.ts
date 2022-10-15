import {
  AnchorProvider,
  BN,
  Program,
  SplToken,
  utils,
  Wallet,
  web3,
} from '@project-serum/anchor'
import { expect } from 'chai'
import CodingCamp, { uid } from '../app'

const PRIV_KEY_FOR_TEST_ONLY = Buffer.from([
  2, 178, 226, 192, 204, 173, 232, 36, 247, 215, 203, 12, 177, 251, 254, 243,
  92, 38, 237, 60, 38, 248, 213, 19, 73, 180, 31, 164, 63, 210, 172, 90, 85,
  215, 166, 105, 84, 194, 133, 92, 34, 27, 39, 2, 158, 57, 64, 226, 198, 222,
  25, 127, 150, 87, 141, 234, 34, 239, 139, 107, 155, 32, 47, 199,
])

describe('@sentre/codingcamp', function () {
  const wallet = new Wallet(web3.Keypair.fromSecretKey(PRIV_KEY_FOR_TEST_ONLY))
  const campaignName = `Vietnam Solana Coding Camp - Season ${Math.floor(
    Math.random() * 10 ** 9,
  ).toString()}`
  const campaignId = Array.from(uid(campaignName))
  const projectName = 'Sentre'
  const projectId = Array.from(uid(projectName))
  const coddingCamp = new CodingCamp(wallet)

  it('vote', async () => {
    const { ballotAddress } = await coddingCamp.vote(campaignName, projectName)
    const voters = await coddingCamp.getTotalVoters(campaignName)
    expect(voters).equal(1)
    const { campaign, project } = await coddingCamp.getBallotData(ballotAddress)
    expect(campaign).to.deep.equal(campaignId)
    expect(project).to.deep.equal(projectId)
  })

  it('void', async () => {
    const { txId, ballotAddress } = await coddingCamp.void(
      campaignName,
      projectName,
    )
  })
})
