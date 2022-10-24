import {
  Finding,
  HandleTransaction,
  TransactionEvent,
  FindingSeverity,
  FindingType,
  LogDescription,
} from "forta-agent";
import { escrowsBalance } from "./L1DAI";
import { arbitrumSupply, optimismSupply } from "./L2DAI";

import { ARBITRUM_L1_ESCROW, DAI_ADDR, OPTIMISM_L1_ESCROW, TRANSFER_EVENT } from "./utils";

export function provideHandleTransaction(transferEvent: string): HandleTransaction {
  return async (txEvent: TransactionEvent): Promise<Finding[]> => {
    const findings: Finding[] = [];

    const transferLogs: LogDescription[] = txEvent.filterLog(transferEvent);

    for (const log of transferLogs) {
      const { _from, _to, _value } = log.args
      if(log.address.toLowerCase() === DAI_ADDR.toLowerCase()){
        if(_to.toLowerCase() === ARBITRUM_L1_ESCROW.toLowerCase() || _to.toLowerCase() === OPTIMISM_L1_ESCROW.toLowerCase()){
          let {optBalance, arbBalance} = await escrowsBalance()
          let arbSupply = await arbitrumSupply()
          let optSupply = await optimismSupply()
          let escrowAddr: string = ""
          let l2Network: string = ""
          let exceededAmount: string = ""
          let violated: string = ""
          if(_to.toLowerCase() === ARBITRUM_L1_ESCROW.toLowerCase()){
            escrowAddr = ARBITRUM_L1_ESCROW.toLowerCase()
            l2Network = "ARBITRUM"
            exceededAmount = (arbBalance - arbSupply).toString()
            violated = arbBalance >= arbSupply ? "true" : "false"
          } else if(_to.toLowerCase() === OPTIMISM_L1_ESCROW.toLowerCase()){
            escrowAddr = OPTIMISM_L1_ESCROW.toLowerCase()
            l2Network = "OPTIMISM"
            exceededAmount = (optBalance - optSupply).toString()
            violated = optBalance >= optSupply ? "true" : "false"
          }

          findings.push(
            Finding.fromObject({
              name: "Invariant monitor",
              description: "Emits an alert when a transfer event is emited and check if the invariante was violated",
              alertId: "INVARIANT-MONITOR",
              severity: FindingSeverity.Info,
              type: FindingType.Info,
              protocol: "MakerDAO",
              metadata: {
                violated: violated,
                escrowAddress: escrowAddr,
                L2Network: l2Network,
                difference: exceededAmount
              },
            })
          );
        }
      }      
    }

    return findings;
  };
}

export default {
  handleTransaction: provideHandleTransaction(TRANSFER_EVENT),
};