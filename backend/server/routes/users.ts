import { Router } from "express";
import { ListObjectsV2Command, PutObjectCommand } from "@aws-sdk/client-s3";

import { s3Client, bucketName, region } from "../s3";

export const usersRouter = Router();

function buildObjectKey(fileName: string, userId?: string) {
  const safeUserId = String(userId || "guest").replace(/[^a-zA-Z0-9_-]/g, "");
  const safeFileName = String(fileName).replace(/[^a-zA-Z0-9._-]/g, "_");
  return `users/${safeUserId}/documents/${Date.now()}_${safeFileName}`;
}

function buildDocumentsPrefix(userId?: string) {
  const safeUserId = String(userId || "guest").replace(/[^a-zA-Z0-9_-]/g, "");
  return `users/${safeUserId}/documents/`;
}

usersRouter.get("/documents", async (req, res) => {
  const userId = String(req.query.userId || "guest");
  const prefix = buildDocumentsPrefix(userId);

  try {
    const result = await s3Client.send(
      new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: prefix,
      }),
    );

    const documents = (result.Contents || [])
      .filter((item) => item.Key)
      .sort((a, b) => {
        const aTime = a.LastModified ? new Date(a.LastModified).getTime() : 0;
        const bTime = b.LastModified ? new Date(b.LastModified).getTime() : 0;
        return bTime - aTime;
      })
      .map((item) => {
        const key = String(item.Key);
        const encodedKey = key
          .split("/")
          .map((part) => encodeURIComponent(part))
          .join("/");

        return {
          key,
          name: key.split("/").pop(),
          size: item.Size ?? 0,
          lastModified: item.LastModified ?? null,
          publicUrl: `https://${bucketName}.s3.${region}.amazonaws.com/${encodedKey}`,
        };
      });

    return res.status(200).json({ documents });
  } catch (error) {
    console.error("S3 List Error:", error);
    const awsError = error as { message?: string; name?: string };
    return res.status(500).json({
      message: awsError.message || "Failed to list documents from S3.",
      code: awsError.name || "S3ListError",
    });
  }
});

usersRouter.post("/upload", async (req, res) => {
  const { fileName, fileType, userId, fileContentBase64 } = req.body;
  if (!fileName) {
    return res.status(400).json({ message: "File name is required." });
  }
  if (!fileContentBase64) {
    return res.status(400).json({ message: "File content is required." });
  }

  const key = buildObjectKey(String(fileName), userId);

  try {
    const fileBuffer = Buffer.from(String(fileContentBase64), "base64");
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: fileType || "application/octet-stream",
      Body: fileBuffer,
    });

    await s3Client.send(command);

    const publicUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;

    return res.status(200).json({ key, publicUrl });
  } catch (error) {
    console.error("S3 Upload Error:", error);
    const awsError = error as {
      name?: string;
      message?: string;
      Code?: string;
      code?: string;
      $metadata?: { httpStatusCode?: number };
    };
    const detail =
      awsError.message ||
      awsError.Code ||
      awsError.code ||
      "Failed to upload file to S3.";

    return res.status(500).json({
      message: detail,
      code: awsError.name || awsError.Code || awsError.code || "S3UploadError",
      statusCode: awsError.$metadata?.httpStatusCode ?? 500,
    });
  }
});
