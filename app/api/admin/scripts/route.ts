// app/api/admin/scripts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { scripts } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

function checkAuth(request: NextRequest) {
    const password = request.headers.get('x-admin-password');
    return password === process.env.ADMIN_PASSWORD;
}

export async function POST(request: NextRequest) {
    if (!checkAuth(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const newScript = await db.insert(scripts).values(body).returning();
        return NextResponse.json(newScript[0]);
    } catch (error) {
        console.error('Error creating script:', error);
        return NextResponse.json({ error: 'Failed to create script' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    if (!checkAuth(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { id, ...data } = body;
        
        if (!id) {
            return NextResponse.json({ error: 'Missing script ID' }, { status: 400 });
        }

        const updatedScript = await db.update(scripts)
            .set(data)
            .where(eq(scripts.id, id))
            .returning();
        if (updatedScript.length === 0) {
            return NextResponse.json({ error: 'Script not found' }, { status: 404 });
        }

        return NextResponse.json(updatedScript[0]);
    } catch (error) {
        console.error('Error updating script:', error);
        return NextResponse.json({ error: 'Failed to update script' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    if (!checkAuth(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Missing script ID' }, { status: 400 });
        }

        await db.delete(scripts).where(eq(scripts.id, id));
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting script:', error);
        return NextResponse.json({ error: 'Failed to delete script' }, { status: 500 });
    }
}
