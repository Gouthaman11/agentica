import dotenv from "dotenv";
import fs from "fs";
import { HeadBucketCommand, S3Client } from "@aws-sdk/client-s3";
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

const region = (process.env.AWS_REGION || "ap-south-1").trim();
const textractRegion = (process.env.AWS_TEXTRACT_REGION || region).trim();
const accessKeyId = process.env.AWS_ACCESS_KEY_ID?.trim();
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY?.trim();
const bucketName = (process.env.AWS_BUCKET_NAME || "bank-statement-agentica").trim();

if (!accessKeyId || !secretAccessKey) {
  console.warn("AWS S3 credentials are not set in environment variables!");
}

export const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId: accessKeyId!,
    secretAccessKey: secretAccessKey!,
  },
});

let validationPromise: Promise<void> | null = null;

export async function validateS3Configuration() {
  if (!validationPromise) {
    validationPromise = (async () => {
      console.log(`[aws] Loaded S3 bucket config: bucket=${bucketName}, region=${region}, textractRegion=${textractRegion}`);

      if (!bucketName) {
        console.error("[aws] AWS_BUCKET_NAME is empty.");
        return;
      }

      try {
        await s3Client.send(
          new HeadBucketCommand({
            Bucket: bucketName,
          }),
        );
        console.log(`[aws] HeadBucket succeeded for '${bucketName}'.`);
      } catch (error) {
        const awsError = error as {
          name?: string;
          message?: string;
          Code?: string;
          code?: string;
          $metadata?: { httpStatusCode?: number };
        };

        console.error(
          `[aws] HeadBucket failed for '${bucketName}' in region '${region}'. ` +
            `code=${awsError.name || awsError.Code || awsError.code || "unknown"}, ` +
            `status=${awsError.$metadata?.httpStatusCode || "unknown"}, ` +
            `message=${awsError.message || "No message returned."}`,
        );
      }
    })();
  }

  await validationPromise;
}

export { bucketName, region, textractRegion };
