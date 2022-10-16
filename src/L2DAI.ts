import { ethers } from "ethers";
import { ARBITRUM_PROVIDER, ERC20_ABI, OPTIMISM_PROVIDER } from "./utils";

const OPT_DAI_L2 = new ethers.Contract("0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1", ERC20_ABI, OPTIMISM_PROVIDER);

const ARB_DAI_L2 = new ethers.Contract("0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1", ERC20_ABI, ARBITRUM_PROVIDER);

export async function arbitrumSupply() {
    let ts = await ARB_DAI_L2.totalSupply() 
    return ts
}

export async function optimismSupply() {
    let ts = await OPT_DAI_L2.totalSupply() 
    return ts
}