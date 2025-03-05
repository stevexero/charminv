import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { items } from '@/lib/schema';
// import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const { name, subcategory_id } = await req.json();

    if (!name || !subcategory_id) {
      return NextResponse.json(
        { error: 'Item name and subcategory_id are required' },
        { status: 400 }
      );
    }

    await db.insert(items).values({
      name,
      subcategory_id,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return NextResponse.json(
      { message: 'Item added successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding item:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const subcategory_id = searchParams.get('subcategory_id');

//     if (!subcategory_id) {
//       return NextResponse.json(
//         { error: 'subcategory_id is required' },
//         { status: 400 }
//       );
//     }

//     const itemList = await db
//       .select()
//       .from(items)
//       .where(eq(items.subcategory_id, subcategory_id))
//       .execute();

//     return NextResponse.json({ items: itemList }, { status: 200 });
//   } catch (error) {
//     console.error('Error fetching items:', error);
//     return NextResponse.json(
//       { error: 'Internal Server Error' },
//       { status: 500 }
//     );
//   }
// }
