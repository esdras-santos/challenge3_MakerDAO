import { ethers } from "ethers";

const OPTIMISM_RPC_URL = "https://mainnet.optimism.io";
export const OPTIMISM_PROVIDER = new ethers.providers.JsonRpcProvider(OPTIMISM_RPC_URL);

const ARBITRUM_RPC_URL = "https://arb1.arbitrum.io/rpc";
export const ARBITRUM_PROVIDER = new ethers.providers.JsonRpcProvider(ARBITRUM_RPC_URL);

export const TRANSFER_EVENT: string = "event Transfer(address indexed _from, address indexed _to, uint256 _value)";

export const DAI_ADDR = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

export const ARBITRUM_L1_ESCROW: string = "0xA10c7CE4b876998858b1a9E12b10092229539400";

export const OPTIMISM_L1_ESCROW = "0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65";

export const ERC20_ABI = [
  "function totalSupply() external view returns (uint256)",
  "function balanceOf(address _owner) external view returns (uint256 balance)",
];
