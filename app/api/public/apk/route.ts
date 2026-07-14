import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

const client = new S3Client({
    endpoint: process.env.B2_ENDPOINT,
    region: process.env.B2_REGION,
    credentials: {
        accessKeyId: process.env.B2_KEY_ID as string,
        secretAccessKey: process.env.B2_APPLICATION_KEY as string
    }
})

export const GET = async () => {
    try {
        const command = new GetObjectCommand({
            Bucket: process.env.B2_BUCKET_NAME,
            Key: "smart-parking.apk"
        })

        const response = await client.send(command)
        const bytes = await response.Body?.transformToByteArray()

        if (!bytes) {
            throw new Error("File not found")
        }

        const buffer = Buffer.from(bytes)

        return new NextResponse(buffer, {
            headers: {
                "Content-Type": "application/vnd.android.package-archive",
                "Content-Disposition": "attachment; filename=\"smart-parking.apk\""
            }
        })
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unexpected error occurred"

        return NextResponse.json({ error: message }, { status: 500 })
    }
}