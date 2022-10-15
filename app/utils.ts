import { web3 } from '@project-serum/anchor'
import { hash } from 'tweetnacl'

/**
 * Validate an address
 * @param address Base58 string
 * @returns true/false
 */
export const isAddress = (address: string | undefined): address is string => {
  if (!address) return false
  try {
    const publicKey = new web3.PublicKey(address)
    if (!publicKey) throw new Error('Invalid public key')
    return true
  } catch (er) {
    return false
  }
}

/**
 * Get unique id by seed
 * @param seed String seed
 * @returns
 */
export const uid = (seed: string) => {
  return hash(new TextEncoder().encode(seed)).subarray(0, 32)
}

/**
 * Derive the ballot public key
 * @param authorityPublicKey Voter public key
 * @param campaignName Campaign name
 * @param projectName Project name
 * @param programId Coding Camp program public key
 * @returns Ballot public key
 */
export const deriveBallot = async (
  authorityPublicKey: web3.PublicKey,
  campaignName: string,
  projectName: string,
  programId: web3.PublicKey,
) => {
  const campaignId = uid(campaignName)
  const projectId = uid(projectName)
  const [proposalPublicKey] = await web3.PublicKey.findProgramAddress(
    [
      Buffer.from('ballot'),
      authorityPublicKey.toBuffer(),
      campaignId,
      projectId,
    ],
    programId,
  )
  return proposalPublicKey
}
