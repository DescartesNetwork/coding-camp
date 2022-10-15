use crate::schema::ballot::*;
use anchor_lang::prelude::*;

#[event]
pub struct VoidEvent {
  pub authority: Pubkey,
  pub campaign: [u8; 32],
  pub project: [u8; 32],
}

#[derive(Accounts)]
#[instruction(campaign: [u8; 32], project: [u8; 32])]
pub struct Void<'info> {
  #[account(mut)]
  pub authority: Signer<'info>,
  #[account(
    mut,
    close = authority,
    has_one = authority,
    seeds = [
      b"ballot".as_ref(),
      &authority.key().to_bytes(),
      &campaign,
      &project
    ],
    bump,
  )]
  pub ballot: Account<'info, Ballot>,
}

pub fn exec(ctx: Context<Void>, campaign: [u8; 32], project: [u8; 32]) -> Result<()> {
  let authority = &ctx.accounts.authority;

  emit!(VoidEvent {
    authority: authority.key(),
    campaign,
    project
  });

  Ok(())
}
