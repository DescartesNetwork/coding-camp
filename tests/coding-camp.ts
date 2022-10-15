import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { CodingCamp } from "../target/types/coding_camp";

describe("coding-camp", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.CodingCamp as Program<CodingCamp>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
