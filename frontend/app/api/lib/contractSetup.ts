import { Abi } from "viem";
import { getReadContract, getWriteContract } from "./contractUtils";
import bgbContractAbi from "./abi/bgbContractAbi.json";

// Get the contract address from environment variables and ensure it's in the correct hex format
const contractAddress = process.env.CONTRACT_ADDRESS as `0x${string}`;

/**
 * BGBContract class handles interactions with the BGB smart contract
 * This class provides an abstraction layer for reading from and writing to the contract
 */
export class BGBContract {
  // Contract address in hexadecimal format
  contractAddress: `0x${string}`;
  // Client instance for reading contract state
  readClient: ReturnType<typeof getReadContract>;
  // Client instance for writing transactions to the contract

  writeClient: ReturnType<typeof getWriteContract>;

  /**
   * Initialize the contract with read and write capabilities
   * Sets up contract instances using the provided ABI and address
   */
  constructor() {
    this.contractAddress = contractAddress;
    // Initialize read client for view functions
    this.readClient = getReadContract(
      this.contractAddress,
      bgbContractAbi.abi as Abi
    );
    // Initialize write client for state-modifying transactions
    this.writeClient = getWriteContract(
      this.contractAddress,
      bgbContractAbi.abi as Abi
    );
  }

  /**
   * Executes the claim function on the smart contract
   * @param address - The account identifier of the claimer
   * @param packageId - The identifier of the package to be claimed
   * @returns A promise that resolves with the transaction response
   */
  claim(address: string, packageId: string) {
    // Prepare arguments for the contract function
    const args: string[] = [address, packageId];
    // Execute the claim transaction
    return this.writeClient.write.claim(args);
  }
}
