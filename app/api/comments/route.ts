import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import MarketplaceProduct from "@/twinx/models/MarketplaceProduct";

// POST - Add a new comment to a product
export async function POST(req: Request) {
  try {
    await connectToDB();
    const body = await req.json();

    const { productId, comment } = body;

    console.log(productId);
    

    // ✅ Validate request body
    if (!productId || !comment || !comment.content || !comment.owner) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ Prepare comment object
    const newComment = {
      content: comment.content,
      owner: comment.owner,
      date: comment.date || new Date(),
      likes: comment.likes || 0,
    };

    // ✅ Push new comment without removing existing ones
    const updatedProduct = await MarketplaceProduct.findByIdAndUpdate(
      productId,
      { $push: { comments: newComment } },
      { new: true } // return the updated document
    );

    if (!updatedProduct) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: updatedProduct.comments },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Failed to add comment:", err);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
