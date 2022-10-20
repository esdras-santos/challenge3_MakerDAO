import {
  FindingType,
  FindingSeverity,
  Finding,
  HandleTransaction,
  createTransactionEvent,
  ethers,
} from "forta-agent";
import agent, {
} from "./agent";

describe("Invariant violation monitor", () => {
  let handleTransaction: HandleTransaction;
  const mockTxEvent = createTransactionEvent({} as any);

  beforeAll(() => {
    handleTransaction = agent.handleTransaction;
  });

  it("should return 0 findings if transfer event is not emitted", async ()=> {
    
  })

  it("should return 0 findings when trenfer event is not emitted for none of the escrows", async ()=> {
    
  })

  it("", async ()=> {
    
  })

  it("", async ()=> {
    
  })

  it("", async ()=> {
    
  })
});
