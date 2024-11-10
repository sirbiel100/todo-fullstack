import { NextResponse } from "next/server";
import { db } from "@/config/db";

export async function GET() {

  try {

    const [results] = await (await db).query("SELECT * FROM list ORDER BY position ASC");
    console.log(results);
    return NextResponse.json(results);

  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }

}




export async function POST(request: Request) {


  try {
    const { id, value, checked, position }  = await request.json();
     (await db).execute(`INSERT INTO list (id, value, checked, position) VALUES (?, ?, ?, ?)`, [id, value, checked, position]);
    
    return NextResponse.json({ message: "Item added successfully" }, { status: 200 });
    
  } catch (err) {

    if (err instanceof Error){
      return NextResponse.json({ message: err.message }, { status: 500 });
    }
    
    return NextResponse.json({ message: "An error occurred" },{ status: 500 });

  }


}

export async function DELETE(request: Request) {
  try {
    let { id } = await request.json();

    // Ensure `id` is always an array
    if (!Array.isArray(id)) {
        id = [id];
    }

    if (id.length === 0) {
        return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    const placeholders = id.map(() => '?').join(', '); // Creates ?, ?, ? for each ID

    // Execute delete with the correct number of placeholders
    await (await db).execute(`DELETE FROM list WHERE id IN (${placeholders})`, id);

    return NextResponse.json({ message: "Item(s) deleted successfully" }, { status: 200 })
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message }, { status: 500 });
    }
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}

export async function PUT(request : Request){
  try {
    const { id, checked } = await request.json();

    await (await db).execute("UPDATE list SET checked = ? WHERE id = ?", [checked, id]);
    console.log(id, checked);

    return NextResponse.json({ message: "Item deleted successfully" }, { status: 200 });
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message }, { status: 500 });
    }
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { positions } = await request.json();

    // Start a transaction to safely update multiple items
    const dbConn = await db;
    await dbConn.beginTransaction();

    for (const { id, position } of positions) {
      await dbConn.execute("UPDATE list SET position = ? WHERE id = ?", [position, id]);
    }

    await dbConn.commit();

    return NextResponse.json({ message: "Positions updated successfully" }, { status: 200 });
  } catch (err) {
    if (err instanceof Error) {
      console.error("Update Error:", err.message);
    }
    await (await db).rollback();
    return NextResponse.json({ message: "Failed to update positions" }, { status: 500 });
  }
}
