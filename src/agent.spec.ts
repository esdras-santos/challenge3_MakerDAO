import { FindingType, FindingSeverity, Finding, HandleTransaction } from "forta-agent";
import { Interface } from "ethers/lib/utils";
import { provideHandleTransaction } from "./agent";
import { DAI_ADDR, TRANSFER_EVENT } from "./utils";
import { TestTransactionEvent } from "forta-agent-tools/lib/test";
import { createAddress } from "forta-agent-tools";

describe("Invariant violation monitor", () => {
  let handleTransaction: HandleTransaction;
  let events: Interface
  let mockPool: string = createAddress("0x034")
  
  // do mock event

  beforeAll(() => {
    events = new Interface([TRANSFER_EVENT])
    handleTransaction = provideHandleTransaction(TRANSFER_EVENT);
  });

  it("should return 0 findings if transfer event is not emitted", async ()=> {
    let findings: Finding[];
    let txEvent: TestTransactionEvent;

    txEvent = new TestTransactionEvent();
    findings = await handleTransaction(txEvent);

    expect(findings).toStrictEqual([]);
  })

  it("should return 0 findings when trensfer event is not emitted for none of the escrows", async ()=> {
    let findings: Finding[];
    let txEvent: TestTransactionEvent;

    txEvent = new TestTransactionEvent().addEventLog(events.getEvent("Transfer"), DAI_ADDR, [
      createAddress("0x10"),
      10,
      createAddress("0x11"),
    ]);
    findings = await handleTransaction(txEvent);

    expect(findings).toStrictEqual([]);
  })

  it("should return 0 findings when transfer event is not emitted by the DAI contract", async ()=> {
    let findings: Finding[];
    let txEvent: TestTransactionEvent;

    txEvent = new TestTransactionEvent().addEventLog(events.getEvent("Transfer"), mockPool, [
      createAddress("0x10"),
      10,
      createAddress("0x11"),
    ]);
    findings = await handleTransaction(txEvent);

    expect(findings).toStrictEqual([]);
  })

  it("should return 1 finding when event is emitted by DAI and is for one of the escrows", async ()=> {

  })

  it("should return 2 findings when event is emitted by DAI and is for both escrows", async ()=> {
    
  })

});
