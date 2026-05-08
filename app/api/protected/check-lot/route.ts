import { NextResponse } from "next/server";
import { checkLotByTime } from "@/actions/parkingLots.action";

export async function POST(req: Request) {
  try {
    const { lotId, startTime, endTime } = await req.json()

    const result = await checkLotByTime(
      lotId,
      new Date(startTime),
      new Date(endTime)
    )

    return NextResponse.json({ data: result })
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "Failed to check availability" },
      { status: 500 }
    )
  }
}