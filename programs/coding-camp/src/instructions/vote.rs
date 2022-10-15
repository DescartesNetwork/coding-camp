use crate::schema::ballot::*;
use anchor_lang::prelude::*;

#[event]
pub struct VoteEvent {
  pub authority: Pubkey,
  pub campaign: [u8; 32],
  pub project: [u8; 32],
}

#[derive(Accounts)]
#[instruction(campaign: [u8; 32], project: [u8; 32])]
pub struct Vote<'info> {
  #[account(mut)]
  pub authority: Signer<'info>,
  #[account(
    init,
    payer = authority,
    space = Ballot::LEN,
    seeds = [
      b"ballot".as_ref(),
      &authority.key().to_bytes(),
      &campaign,
      &project
    ],
    bump,
  )]
  pub ballot: Account<'info, Ballot>,
  pub system_program: Program<'info, System>,
  pub rent: Sysvar<'info, Rent>,
}

pub fn exec(ctx: Context<Vote>, campaign: [u8; 32], project: [u8; 32]) -> Result<()> {
  let ballot = &mut ctx.accounts.ballot;
  let authority = &ctx.accounts.authority;

  ballot.authority = authority.key();
  ballot.campaign = campaign;
  ballot.project = project;

  emit!(VoteEvent {
    authority: authority.key(),
    campaign,
    project
  });

  Ok(())
}
