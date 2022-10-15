use anchor_lang::prelude::*;

pub mod constants;
pub mod instructions;
pub mod schema;

pub use instructions::*;
pub use schema::*;

declare_id!("BraFayMWsP553wS4CoAzT24zZNP9rhd4oEEBdzQM8PGe");

#[program]
pub mod coding_camp {
  use super::*;

  pub fn vote(ctx: Context<Vote>, campaign: [u8; 32], project: [u8; 32]) -> Result<()> {
    vote::exec(ctx, campaign, project)
  }

  pub fn void(ctx: Context<Void>, campaign: [u8; 32], project: [u8; 32]) -> Result<()> {
    void::exec(ctx, campaign, project)
  }
}
