use anchor_lang::prelude::*;

pub mod constants;
pub mod instructions;
pub mod schema;

pub use instructions::*;
pub use schema::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod coding_camp {
  use super::*;

  pub fn vote(
    ctx: Context<Vote>,
    authority: Pubkey,
    campaign: [u8; 32],
    project: [u8; 32],
  ) -> Result<()> {
    vote::exec(ctx, authority, campaign, project)
  }

  pub fn void(
    ctx: Context<Vote>,
    authority: Pubkey,
    campaign: [u8; 32],
    project: [u8; 32],
  ) -> Result<()> {
    vote::exec(ctx, authority, campaign, project)
  }
}
