import { ethers } from "ethers";
import { getEthersProvider } from "forta-agent";
import { ARBITRUM_L1_ESCROW, DAI_ADDR, ERC20_ABI, OPTIMISM_L1_ESCROW } from "./utils";

const DAI_L1 = new ethers.Contract(DAI_ADDR, ERC20_ABI, getEthersProvider());

export async function escrowsBalance() {
    let optBalance = await DAI_L1.balanceOf(OPTIMISM_L1_ESCROW)
    let arbBalance = await DAI_L1.balanceOf(ARBITRUM_L1_ESCROW)

    return {
        optBalance,
        arbBalance
    }
}