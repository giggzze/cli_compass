import { NextResponse, Request } from 'next/server';
import { db } from '@/db';
import { commands } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';

export async function GET() {
  try {
    // Fetch all commands with their categories
    const allCommands = await db.select().from(commands).orderBy(desc(commands.created_at));

    return NextResponse.json({ 
      success: true, 
      data: allCommands 
    });
  } catch (error) {
    console.error('Error fetching commands:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch commands' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, category } = body;

    // Insert the command
    const [newCommand] = await db.insert(commands).values({
      name,
      description,
      usage: name, // Using name as usage for now
      category_id: 1, // Using default category_id for now
    }).returning();

    return NextResponse.json({ 
      success: true, 
      data: newCommand 
    });
  } catch (error) {
    console.error('Error creating command:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create command' },
      { status: 500 }
    );
  }
}
