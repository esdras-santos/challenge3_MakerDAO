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
      if(log.address.toLowerCase() === DAI_ADDR){
        if(_to.toLowerCase() == ARBITRUM_L1_ESCROW.toLowerCase() || _to.toLowerCase() == OPTIMISM_L1_ESCROW.toLowerCase()){
          let {optBalance, arbBalance} = await escrowsBalance()
          let arbSupply = await arbitrumSupply()
          let optSupply = await optimismSupply()
  
          if(optBalance >= optSupply || arbBalance >= arbSupply) {
            findings.push(
              Finding.fromObject({
                name: "Invariant monitor",
                description: "Emits an alert when the invariant is violated",
                alertId: "INVARIANT-MONITOR",
                severity: FindingSeverity.Info,
                type: FindingType.Info,
                protocol: "MakerDAO",
                metadata: {
                  escrowAddress: _to.toLowerCase() === ARBITRUM_L1_ESCROW.toLowerCase() ? ARBITRUM_L1_ESCROW.toLowerCase() : OPTIMISM_L1_ESCROW.toLowerCase(),
                  L2Network: _to.toLowerCase() === ARBITRUM_L1_ESCROW.toLowerCase() ? "ARBITRUM" : "OPTIMISM",
                  exceededBy: _to.toLowerCase() === ARBITRUM_L1_ESCROW.toLowerCase() ? (arbBalance - arbSupply).toString() : (optBalance - optSupply).toString()
                },
              })
            );
          }
        }
      }      
    }

    return findings;
  };
}

export default {
  handleTransaction: provideHandleTransaction(TRANSFER_EVENT),
};