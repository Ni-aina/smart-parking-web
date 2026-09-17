import { S3Client } from "@aws-sdk/client-s3";
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

export default client;