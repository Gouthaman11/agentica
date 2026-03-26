import { Router } from "express";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ResultSetHeader } from "mysql2";

import { s3Client, bucketName, region } from "../s3";
import { db } from "../db";

export const usersRouter = Router();

// 1. Generate an S3 Pre-signed URL for client-side direct upload
usersRouter.post("/upload-url", async (req, res) => {
  const { fileName, fileType, userId } = req.body;
  if (!fileName || !userId) {
    return res.status(400).json({ message: "File name and userId are required." });
  }

  // Generate a unique object key within the S3 bucket structured around the user
  const key = `users/${userId}/avatar_${Date.now()}_${fileName}`;

  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: fileType || "application/octet-stream",
    });

    // Generate a pre-signed URL valid for 60 minutes
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    
    // Construct the final public URL assuming the bucket objects can be read publicly. 
    // In strict enterprise setups, you'd generate GET signed URLs instead.
    const publicUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;

    return res.status(200).json({ uploadUrl, key, publicUrl });
  } catch (error) {
    console.error("Presigned URL Error:", error);
    return res.status(500).json({ message: "Failed to generate S3 upload URL.", error });
  }
});

// 2. Update the SQL DB with the newly uploaded S3 File URL
usersRouter.put("/:userId/profile-picture", async (req, res) => {
  const { userId } = req.params;
  const { profilePictureUrl } = req.body;

  if (!profilePictureUrl) {
    return res.status(400).json({ message: "Profile picture URL is required." });
  }

  try {
    // Update the SQL table with the confirmed S3 upload link
    const [result] = await db.query<ResultSetHeader>(
      "UPDATE users SET profile_picture_url = ? WHERE id = ?",
      [profilePictureUrl, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found within the database." });
    }

    return res.status(200).json({ 
      message: "Profile picture securely attached to user.", 
      profilePictureUrl 
    });
  } catch (error) {
    console.error("DB Update Error:", error);
    return res.status(500).json({ message: "Failed to attach file to user record.", error });
  }
});
