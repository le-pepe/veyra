// types/script.ts
export type { Script } from '@/lib/db/schema';

export interface ChangelogEntry {
    version: string;
    changes: string[];
}

export type Category =
    | 'Utilities'
    | 'Farm Stamina'
    | 'Farm Wave'
    | 'Loot'
    | 'Extra'
    | 'Others';