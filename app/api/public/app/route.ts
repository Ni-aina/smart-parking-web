import client from "@/utils/downloads/awsClient";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
    try {
        const range = request.headers.get("range") ?? undefined

        const command = new GetObjectCommand({
            Bucket: process.env.B2_BUCKET_NAME,
            Key: "smart-parking.zip",
            Range: range
        })

        const response = await client.send(command)

        if (!response.Body) {
            throw new Error("File not found")
        }

        const stream = response.Body.transformToWebStream()

        const headers: Record<string, string> = {
            "Content-Type": "application/zip",
            "Content-Disposition": "attachment; filename=\"smart-parking.zip\"",
            "Content-Length": String(response.ContentLength),
            "Accept-Ranges": "bytes"
        }

        if (response.ContentRange) {
            headers["Content-Range"] = response.ContentRange
        }

        return new NextResponse(stream, {
            status: response.ContentRange ? 206 : 200,
            headers
        })
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unexpected error occurred"

        return NextResponse.json({ error: message }, { status: 500 })
    }
}