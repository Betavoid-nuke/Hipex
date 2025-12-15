import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import MarketplaceProduct from "@/twinx/models/MarketplaceProduct";

// GET - fetch all marketplace products
export async function GET() {
  try {
    await connectToDB();
    const products = await MarketplaceProduct.find().sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, data: products },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Failed to fetch products:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST - create a new marketplace product
export async function POST(req: Request) {
  try {
    await connectToDB();
    const body = await req.json();

    // ✅ Optional runtime validation
    if (!body.title || !body.description || !body.imageUrl || !body.category || !body.creator) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ Ensure downloadUrls is valid
    const downloadUrls = Array.isArray(body.downloadUrls)
      ? body.downloadUrls.map((d:any) => ({
          format: d.format,
          url: d.url,
        }))
      : [];

    const newProduct = await MarketplaceProduct.create({
      title: body.title,
      description: body.description,
      imageUrl: body.imageUrl,
      category: body.category,
      creator: body.creator,
      creatorid: body.creatorid,
      downloadUrls,
    });

    return NextResponse.json(
      { success: true, id: newProduct._id },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("❌ Product creation failed:", err);

    // ✅ Handle duplicate key / index error more clearly
    if (err.code === 11000) {
      return NextResponse.json(
        { success: false, error: "Duplicate entry — check unique fields" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
