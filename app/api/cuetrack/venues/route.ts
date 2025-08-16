import { NextResponse } from "next/server";
import dbConnect from '@/lib/cuetrack/mongodb';
import Venue from '@/lib/cuetrack/models/venue';

// ✅ GET all venues
export async function GET() {
  try {
    await dbConnect();

    const venues = await Venue.find({});
    return NextResponse.json(venues, { status: 200 });
  } catch (error: any) {
    console.error("GET /venues error:", error);
    return NextResponse.json(
      { error: "Failed to fetch venues" },
      { status: 500 }
    );
  }
}

// ✅ POST new venue
export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();

    // 🔍 Validate required fields
    const { name, rating, lat, lon } = body;
    if (
      !name ||
      typeof rating !== "number" ||
      typeof lat !== "number" ||
      typeof lon !== "number"
    ) {
      return NextResponse.json(
        { error: "Missing or invalid required fields" },
        { status: 400 }
      );
    }

    const newVenue = await Venue.create({ name, rating, lat, lon });

    return NextResponse.json(newVenue, { status: 201 });
  } catch (error: any) {
    console.error("POST /venues error:", error);

    // Handle duplicate keys or Mongoose validation errors
    if (error.name === "ValidationError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create venue" },
      { status: 500 }
    );
  }
}
