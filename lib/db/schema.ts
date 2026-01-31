// lib/db/schema.ts
import { pgTable, text, jsonb } from 'drizzle-orm/pg-core';

export const scripts = pgTable('scripts', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    author: text('author').notNull(),
    version: text('version').notNull(),
    category: text('category').notNull(),
    tags: text('tags').array().notNull().default([]),
    icon: text('icon').notNull(),
    match: text('match').notNull(),
    grant: text('grant').array(),
    code: text('code').notNull(),
    screenshots: text('screenshots').array(),
    features: text('features').array(),
    changelog: jsonb('changelog').$type<{
        version: string;
        changes: string[];
    }[]>(),
});

export type Script = typeof scripts.$inferSelect;
export type NewScript = typeof scripts.$inferInsert;