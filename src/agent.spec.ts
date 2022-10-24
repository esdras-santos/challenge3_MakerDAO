import { FindingType, FindingSeverity, Finding, HandleTransaction } from "forta-agent";
import { Interface } from "ethers/lib/utils";
import { provideHandleTransaction } from "./agent";
import { ARBITRUM_L1_ESCROW, DAI_ADDR, OPTIMISM_L1_ESCROW, TRANSFER_EVENT } from "./utils";
import { TestTransactionEvent } from "forta-agent-tools/lib/test";
import { createAddress } from "forta-agent-tools";
import { escrowsBalance } from "./L1DAI";
import { arbitrumSupply, optimismSupply } from "./L2DAI";

describe("Invariant violation monitor", () => {
  let handleTransaction: HandleTransaction;
  let events: Interface;
  let mockDAI: string = createAddress("0x034");

  type mockMetadata = {
    violated: string;
    escrowAddress: string;
    L2Network: string;
    difference: string;
  };

  let mockFinding = (metadata: mockMetadata): Finding => {
    return Finding.fromObject({
      name: "Invariant monitor",
      description: "Emits an alert when a transfer event is emited and check if the invariante was violated",
      alertId: "INVARIANT-MONITOR",
      severity: FindingSeverity.Info,
      type: FindingType.Info,
      protocol: "MakerDAO",
      metadata: {
        violated: metadata.violated,
        escrowAddress: metadata.escrowAddress,
        L2Network: metadata.L2Network,
        difference: metadata.difference,
      },
    });
  };

  beforeAll(() => {
    events = new Interface([TRANSFER_EVENT]);
    handleTransaction = provideHandleTransaction(TRANSFER_EVENT);
  });

  it("should return 0 findings if transfer event is not emitted", async () => {
    let findings: Finding[];
    let txEvent: TestTransactionEvent;

    txEvent = new TestTransactionEvent();
    findings = await handleTransaction(txEvent);

    expect(findings).toStrictEqual([]);
  });

  it("should return 0 findings when trensfer event is not emitted for none of the escrows", async () => {
    let findings: Finding[];
    let txEvent: TestTransactionEvent;

    txEvent = new TestTransactionEvent().addEventLog(events.getEvent("Transfer"), DAI_ADDR, [
      createAddress("0x10"),
      createAddress("0x11"),
      10,
    ]);
    findings = await handleTransaction(txEvent);

    expect(findings).toStrictEqual([]);
  });

  it("should return 0 findings when transfer event is not emitted by the DAI contract", async () => {
    let findings: Finding[];
    let txEvent: TestTransactionEvent;

    txEvent = new TestTransactionEvent().addEventLog(events.getEvent("Transfer"), mockDAI, [
      createAddress("0x10"),
      createAddress("0x11"),
      10,
    ]);
    findings = await handleTransaction(txEvent);

    expect(findings).toStrictEqual([]);
  });

  it("should return 1 finding when event is emitted by DAI and is for one of the escrows", async () => {
    let { optBalance, arbBalance } = await escrowsBalance();
    let arbSupply = await arbitrumSupply();
    let findings: Finding[];
    let txEvent: TestTransactionEvent;

    txEvent = new TestTransactionEvent().addEventLog(events.getEvent("Transfer"), DAI_ADDR, [
      createAddress("0x10"),
      ARBITRUM_L1_ESCROW.toLowerCase(),
      10,
    ]);
    findings = await handleTransaction(txEvent);

    let metadata: mockMetadata = {
      violated: arbBalance >= arbSupply ? "true" : "false",
      escrowAddress: ARBITRUM_L1_ESCROW.toLocaleLowerCase(),
      L2Network: "ARBITRUM",
      difference: (arbBalance - arbSupply).toString(),
    };

    expect(findings).toStrictEqual([mockFinding(metadata)]);
  });

  it("should return 2 findings when event is emitted by DAI and is for both escrows", async () => {
    let { optBalance, arbBalance } = await escrowsBalance();
    let arbSupply = await arbitrumSupply();
    let optSupply = await optimismSupply();

    let findings: Finding[];
    let txEvent: TestTransactionEvent;

    txEvent = new TestTransactionEvent()
      .addEventLog(events.getEvent("Transfer"), DAI_ADDR.toLowerCase(), [
        createAddress("0x10"),
        ARBITRUM_L1_ESCROW.toLowerCase(),
        10,
      ])
      .addEventLog(events.getEvent("Transfer"), DAI_ADDR.toLowerCase(), [
        createAddress("0x10"),
        OPTIMISM_L1_ESCROW.toLowerCase(),
        10,
      ]);
    findings = await handleTransaction(txEvent);

    let metadata1: mockMetadata = {
      violated: arbBalance >= arbSupply ? "true" : "false",
      escrowAddress: ARBITRUM_L1_ESCROW.toLowerCase(),
      L2Network: "ARBITRUM",
      difference: (arbBalance - arbSupply).toString(),
    };

    let metadata2: mockMetadata = {
      violated: optBalance >= optSupply ? "true" : "false",
      escrowAddress: OPTIMISM_L1_ESCROW.toLowerCase(),
      L2Network: "OPTIMISM",
      difference: (optBalance - optSupply).toString(),
    };

    expect(findings).toStrictEqual([mockFinding(metadata1), mockFinding(metadata2)]);
  });
});
