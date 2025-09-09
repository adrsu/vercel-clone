
import { S3Client, HeadBucketCommand } from "@aws-sdk/client-s3";
import dotenv from 'dotenv';
dotenv.config();
const BUCKET_NAME = "vercel-clone-s3bucket";
const region = "us-east-1"

const cred =  {
    "accessKeyId": process.env.AWS_ACCESS_KEY || '',
    "secretAccessKey": process.env.AWS_SECRET_ACCESS_KEY || ''
}

async function testAwsConnection() {
    const s3Client = new S3Client({ region: region, credentials: cred });

    try {
    const command = new HeadBucketCommand({ Bucket: BUCKET_NAME });
    await s3Client.send(command);
    console.log(`Successfully connected to AWS and accessed S3 bucket: ${BUCKET_NAME}`);
    } catch (error) {
    console.error("Failed to connect to AWS or access S3 bucket:", error);
    if (error instanceof Error) {
        if (error.name === "NotFound") {
            console.error(`Bucket '${BUCKET_NAME}' does not exist or you lack permissions.`);
        } else if (error.name === "AccessDenied") {
            console.error("Access Denied: Check your IAM permissions for S3.");
        }
    }
    }
}

testAwsConnection();

