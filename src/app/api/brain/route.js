import { connect } from "@/dbConnection/dbConfig";
import Brain from "@/models/brain.model";
import { v4 as uuidv4 } from "uuid";

export async function GET(req) {
  await connect();
  const doc = await Brain.findOne();
  if (!doc) {
    return new Response(JSON.stringify({ bestBrain: null }), { status: 200 });
  }
  return new Response(JSON.stringify({ bestBrain: doc.bestBrain }), {
    status: 200,
  });
}

export async function POST(req) {
  try {
    await connect();
    const { bestBrain } = await req.json();
    let doc = await Brain.findOne();
    if (!doc) {
      // Create new with uuid
      await Brain.create({ uuid: uuidv4(), bestBrain });
    } else {
      // Update existing, keep uuid
      await Brain.findOneAndUpdate({ uuid: doc.uuid }, { bestBrain });
    }
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("POST /api/brain error:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    await connect();
    await Brain.deleteMany({});
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("DELETE /api/brain error:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500 }
    );
  }
}
