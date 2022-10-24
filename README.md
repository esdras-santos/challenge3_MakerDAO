# MakerDao Invariant monitor

## Description

Every time the event `Tranfer` is emitted the bot will verify if the MakerDAO invariant wad violated

## Supported Chains

- Ethereum

## Alerts

- INVARIANT-MONITOR
  - Emits an alert when a transfer event is emited and check if the invariante was violated
  - Severity is always set to "info"
  - Type is always set to "info"
  - Metadata fields
    - `violated`: boolean to inform if the invariant was violated
    - `escrowAddress`: address of the escrow,
    - `L2Network`: name of the L2 network,
    - `difference`: difference between L1 balance and L2 supply


## Test Data

The bot behaviour can be verified with the following transaction:

DAI `Transfer` event emission to Aribitrum and Optimism Escrows

- [0x6bcdc9544260429d7834e1e4e47badcad9dd0d361734b8441df01c6fd9ce8f2f](https://etherscan.io/tx/0x6bcdc9544260429d7834e1e4e47badcad9dd0d361734b8441df01c6fd9ce8f2f)
