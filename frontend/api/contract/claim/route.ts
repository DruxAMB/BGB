// app/api/claim/route.ts
import { BGBContract } from "@/api/lib/contractSetup";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = await req.json();
    const { accountId } = body;

    if (!accountId) {
      return NextResponse.json(
        { error: "accountId is required" },
        { status: 400 }
      );
    }

    // Initialize contract
    const bgbContract = new BGBContract();

    // Call claim function
    const transaction = await bgbContract.claim(accountId);

    return NextResponse.json(
      {
        success: true,
        message: "Claim initiated successfully",
        transactionHash: transaction.hash,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in claim endpoint:", error);
    return NextResponse.json(
      {
        error: "Failed to process claim",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
