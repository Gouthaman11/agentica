import dotenv from "dotenv";
import fs from "fs";
import { S3Client } from "@aws-sdk/client-s3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envCandidates = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "../.env"),
  path.resolve(__dirname, "../../.env"),
  path.resolve(__dirname, "../.env"),
];

for (const candidate of envCandidates) {
  if (fs.existsSync(candidate)) {
    dotenv.config({ path: candidate });
    break;
  }
}

// Ensure required environment variables are present (in a real app, you might use zod for env validation)
const region = process.env.AWS_REGION || "eu-north-1";
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const bucketName = process.env.AWS_BUCKET_NAME || "bank-statement-data-extracter";

if (!accessKeyId || !secretAccessKey) {
  console.warn("AWS S3 credentials are not set in environment variables!");
}

export const s3Client = new S3Client({
  region,
  credentials: {
    // using ! to assert non-null since we fallback or warn above
    accessKeyId: accessKeyId!,
    secretAccessKey: secretAccessKey!,
  },
});

export { bucketName, region };
