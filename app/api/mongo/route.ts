import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import mongoose from "mongoose";

/**
 * 🧠 Dynamic model loader
 * Tries to get or create a model dynamically based on the given name and schema definition.
 */
function getDynamicModel(modelName: string, schemaDefinition: any) {
  if (!mongoose.models[modelName]) {
    const schema = new mongoose.Schema(schemaDefinition, { timestamps: true });
    mongoose.model(modelName, schema);
  }
  return mongoose.models[modelName];
}

/**
 * ✅ GET — Fetch a document by ID (with modelName + schema)
 * Example: /api/mongo?id=123&model=MarketplaceProduct
 */
export async function GET(req: Request) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const modelName = searchParams.get("model");
    const schemaString = searchParams.get("schema"); // optional JSON stringified schema

    if (!id || !modelName) {
      return NextResponse.json(
        { success: false, error: "Missing 'id' or 'model' in query params" },
        { status: 400 }
      );
    }

    const schemaDefinition = schemaString ? JSON.parse(schemaString) : {};
    const Model = getDynamicModel(modelName, schemaDefinition);

    const doc = await Model.findById(id);
    if (!doc) {
      return NextResponse.json(
        { success: false, error: "Document not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: doc }, { status: 200 });
  } catch (err) {
    console.error("❌ Error in GET /api/mongo:", err);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * ✅ PATCH — Update a document by ID using model name + schema + update data
 * Example body:
 * {
 *   "model": "MarketplaceProduct",
 *   "schema": { "title": "String", "description": "String" },
 *   "id": "674d...",
 *   "data": { "title": "New Title" }
 * }
 */
export async function PATCH(req: Request) {
  try {
    await connectToDB();
    const body = await req.json();

    const { model, schema, id, data } = body;

    if (!model || !id || !data) {
      return NextResponse.json(
        { success: false, error: "Missing 'model', 'id' or 'data' in request body" },
        { status: 400 }
      );
    }

    const Model = getDynamicModel(model, schema || {});
    const updatedDoc = await Model.findByIdAndUpdate(id, { $set: data }, { new: true });

    if (!updatedDoc) {
      return NextResponse.json(
        { success: false, error: "Document not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedDoc }, { status: 200 });
  } catch (err) {
    console.error("❌ Error in PATCH /api/mongo:", err);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
