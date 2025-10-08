// app/api/generate-upload-sas/route.ts
import { NextResponse } from "next/server";
import {
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
} from "@azure/storage-blob";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { filename } = body;
    if (!filename) {
      return NextResponse.json({ success: false, message: "filename required" }, { status: 400 });
    }

    const account = process.env.AZURE_STORAGE_ACCOUNT_NAME!;
    const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY!;
    const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || "twinxprod";
    const expiryMinutes = Number(process.env.SAS_EXPIRY_MINUTES || 15);

    if (!account || !accountKey) {
      return NextResponse.json({ success: false, message: "Azure storage not configured" }, { status: 500 });
    }

    // sanitize filename
    const safeFilename = `${Date.now()}-${filename.replace(/\s+/g, "_")}`;

    const startsOn = new Date();
    const expiresOn = new Date(Date.now() + expiryMinutes * 60 * 1000);

    const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);

    // permissions: create + write (allow uploading)
    const permissions = BlobSASPermissions.parse("cw"); // c = create, w = write

    const sasToken = generateBlobSASQueryParameters(
      {
        containerName,
        blobName: safeFilename,
        permissions,
        startsOn,
        expiresOn,
      },
      sharedKeyCredential
    ).toString();

    const uploadUrl = `https://${account}.blob.core.windows.net/${containerName}/${safeFilename}?${sasToken}`;
    const blobUrl = `https://${account}.blob.core.windows.net/${containerName}/${safeFilename}`;

    return NextResponse.json({
      success: true,
      uploadUrl,
      blobUrl,
      expiresOn: expiresOn.toISOString(),
      blobName: safeFilename,
    });
  } catch (err: any) {
    console.error("generate-sas error:", err);
    return NextResponse.json({ success: false, message: err.message || "Server error" }, { status: 500 });
  }
}
