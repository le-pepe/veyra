'use server';

import { db } from '@/lib/db';
import { scripts, NewScript } from '@/lib/db/schema';
import { eq, like, or } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getScripts(search?: string, category?: string) {
    try {
        let query = db.select().from(scripts);

        if (category && category !== 'All') {
            query = query.where(eq(scripts.category, category)) as any;
        }

        if (search) {
            query = query.where(
                or(
                    like(scripts.name, `%${search}%`),
                    like(scripts.description, `%${search}%`)
                )
            ) as any;
        }

        return await query;
    } catch (error) {
        console.error('Error fetching scripts:', error);
        return [];
    }
}

export async function getScriptById(id: string) {
    try {
        const [script] = await db
            .select()
            .from(scripts)
            .where(eq(scripts.id, id))
            .limit(1);
        return script || null;
    } catch (error) {
        console.error('Error fetching script:', error);
        return null;
    }
}

export async function createScript(data: NewScript) {
    try {
        await db.insert(scripts).values(data);
        revalidatePath('/');
        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        console.error('Error creating script:', error);
        return { success: false, error: 'Failed to create script' };
    }
}

export async function updateScript(id: string, data: Partial<NewScript>) {
    try {
        await db.update(scripts).set(data).where(eq(scripts.id, id));
        revalidatePath('/');
        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        console.error('Error updating script:', error);
        return { success: false, error: 'Failed to update script' };
    }
}

export async function deleteScript(id: string) {
    try {
        await db.delete(scripts).where(eq(scripts.id, id));
        revalidatePath('/');
        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        console.error('Error deleting script:', error);
        return { success: false, error: 'Failed to delete script' };
    }
}
