import { ethers } from "ethers";
import { ERC20_ABI } from "./utils";

export async function arbitrumSupply(arbRPCURL: string) {
  
  const ARBITRUM_PROVIDER = new ethers.providers.JsonRpcProvider(arbRPCURL);
  const ARB_DAI_L2 = new ethers.Contract("0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1", ERC20_ABI, ARBITRUM_PROVIDER);
  let ts = await ARB_DAI_L2.totalSupply();
  return ts;
}

export async function optimismSupply(optRPCURL: string) {
  
  const OPTIMISM_PROVIDER = new ethers.providers.JsonRpcProvider(optRPCURL);
  const OPT_DAI_L2 = new ethers.Contract("0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1", ERC20_ABI, OPTIMISM_PROVIDER);
  let ts = await OPT_DAI_L2.totalSupply();
  return ts;
}
