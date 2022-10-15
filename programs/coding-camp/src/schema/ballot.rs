use crate::constants::*;
use anchor_lang::prelude::*;

#[account]
pub struct Ballot {
  pub authority: Pubkey,
  pub campaign: [u8; 32],
  pub project: [u8; 32],
}

impl Ballot {
  pub const LEN: usize = DISCRIMINATOR_SIZE + PUBKEY_SIZE + U8_SIZE * 32 + U8_SIZE * 32;
}
