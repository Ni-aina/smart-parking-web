import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { NodeHttpHandler } from "@smithy/node-http-handler";
import https from "https";

const client = new S3Client({
    endpoint: process.env.B2_ENDPOINT,
    region: process.env.B2_REGION,
    credentials: {
        accessKeyId: process.env.B2_KEY_ID as string,
        secretAccessKey: process.env.B2_APPLICATION_KEY as string
    },
    requestHandler: new NodeHttpHandler({
        httpsAgent: new https.Agent({ family: 4 }),
        connectionTimeout: 5000,
        socketTimeout: 30000
    })
})

export const GET = async () => {
    try {
        const command = new GetObjectCommand({
            Bucket: process.env.B2_BUCKET_NAME,
            Key: "smart-parking.apk"
        })

        const response = await client.send(command)

        if (!response.Body) {
            throw new Error("File not found")
        }

        const stream = response.Body.transformToWebStream()

        return new NextResponse(stream, {
            headers: {
                "Content-Type": "application/vnd.android.package-archive",
                "Content-Disposition": "attachment; filename=\"smart-parking.apk\"",
                "Content-Length": String(response.ContentLength)
            }
        })
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unexpected error occurred"

        return NextResponse.json({ error: message }, { status: 500 })
    }
}