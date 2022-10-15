import { BN, BorshAccountsCoder, web3 } from '@project-serum/anchor'
import { encode } from 'bs58'

import { IDL } from '../target/types/coding_camp'

export const DEFAULT_RPC_ENDPOINT = 'https://api.devnet.solana.com'
export const DEFAULT_CODINGCAMP_PROGRAM_ID =
  'BraFayMWsP553wS4CoAzT24zZNP9rhd4oEEBdzQM8PGe'
export const DEFAULT_CODINGCAMP_IDL = IDL

export const BALLOT_DISCRIMINATOR = encode(
  BorshAccountsCoder.accountDiscriminator('ballot'),
)
