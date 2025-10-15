# Community Emergency Fund DAO on Polkadot

## Overview

This project implements a decentralized **Community Emergency Fund** on the Polkadot blockchain.  
It enables transparent fundraising, community governance, and automated fund allocation for disaster relief, emergency medical treatment, and other unbudgeted community needs.

## Key Features

- **Decentralized Fundraising**: Blockchain-based crowdfunding with transparency and accountability.
- **Community Governance (DAO)**: Voting mechanisms allow stakeholders (donors, responders, community members) to participate in decision-making.
- **Resource Allocation**: Smart contracts automate distribution of funds to approved beneficiaries.
- **Transparency and Auditability**: On-chain records ensure accountability and minimize corruption.

## Workflow

1. **Campaign Creation** – A member submits a proposal for funding (emergency or project).
2. **Community Voting** – Members vote, weighted by stake/deposit.
3. **Execution** – If quorum & majority are met, smart contract releases funds to the beneficiary.
4. **Reporting** – On-chain receipts & reports ensure auditability.

## Tech Stack

- **Blockchain**: Polkadot (parachain with contracts pallet)
- **Smart Contracts**: ink! (Rust-based)
- **Frontend**: React + Polkadot.js + @polkadot/api-contract
- **Storage**: IPFS for proposal metadata & evidence
- **Dev Tools**: cargo-contract, ink! playground, local Substrate node

## How it Works with Polkadot

- Smart contracts are deployed on a **contracts-enabled parachain**.
- Frontend dApp interacts via **Polkadot.js** using `@polkadot/api-contract`.
- Users connect through **Polkadot.js wallet extension** to sign transactions.
- Oracles & off-chain services can submit verified reports to trigger emergency payouts.

## Smart Contract Module (Fund Pool)

The `fund_pool` contract allows:

- Deposits into a shared pool.
- Proposal creation with beneficiary, requested amount, metadata.
- Stake-weighted voting.
- Automated execution & payout when conditions are met.

## Getting Started

### Requirements

- Rust & Cargo installed
- ink! toolchain: `cargo install cargo-contract --force --locked`
- Local contracts-enabled chain: `substrate-contracts-node` or use.ink testnet

### Build & Deploy

```bash
cd contracts/fund_pool
cargo +nightly contract build
cargo +nightly contract deploy --constructor new
```

### Interact

Use Polkadot.js dApp or frontend React app to connect wallet and interact with the contract.

## Roadmap

- [ ] Add event emission for deposits, votes, and payouts
- [ ] Snapshot-based voting
- [ ] Governance upgrades for thresholds & parameters
- [ ] Multisig payout option for large disbursements
- [ ] Integration with oracle feeds


---
