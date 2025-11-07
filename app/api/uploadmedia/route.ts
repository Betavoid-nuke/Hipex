// app/api/generate-uploadmedia-sas/route.ts

import { NextResponse } from "next/server";
import { BlobServiceClient, generateBlobSASQueryParameters, BlobSASPermissions, SASProtocol, StorageSharedKeyCredential } from "@azure/storage-blob";

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME!;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY!;
const credential = new StorageSharedKeyCredential(accountName, accountKey);

// You can configure these as separate containers
const containers = {
  image: "user-images",
  video: "user-videos",
};

export async function POST(req: Request) {
  try {
    const { filename, filetype } = await req.json();

    if (!filename || !filetype || !["image", "video"].includes(filetype)) {
      return NextResponse.json(
        { success: false, message: "Invalid request parameters." },
        { status: 400 }
      );
    }

    const containerName = containers[filetype as "image" | "video"];
    const blobService = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net`,
      credential
    );

    const containerClient = blobService.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(filename);

    // Generate SAS token for PUT upload
    const expiresOn = new Date(new Date().valueOf() + 60 * 60 * 1000); // 1 hour expiry

    const sasToken = generateBlobSASQueryParameters(
      {
        containerName,
        blobName: filename,
        permissions: BlobSASPermissions.parse("cw"), // create + write
        expiresOn,
        protocol: SASProtocol.Https,
      },
      credential
    ).toString();

    const uploadUrl = `${blobClient.url}?${sasToken}`;
    const blobUrl = blobClient.url;

    return NextResponse.json({
      success: true,
      uploadUrl,
      blobUrl,
    });
  } catch (err: any) {
    console.error("Azure SAS generation error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to generate upload SAS." },
      { status: 500 }
    );
  }
}
