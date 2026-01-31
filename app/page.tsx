'use client';

import {useEffect, useMemo, useState} from 'react';
import {getScripts} from '@/lib/actions/scripts';
import {Script} from '@/lib/db/schema';
import ScriptCard from "@/components/ScriptCard";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import {Heart} from "lucide-react";

const categories = [
    'All',
    'Utilities',
    'Farm Stamina',
    'Farm Wave',
    'Loot',
    'Extra',
    'Others'
] as const;

export default function Home() {
    const [scripts, setScripts] = useState<Script[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchScripts = async () => {
            setIsLoading(true);
            const data = await getScripts();
            setScripts(data);
            setIsLoading(false);
        };
        fetchScripts();
    }, []);

    const filteredScripts = useMemo(() => {
        return scripts.filter((script) => {
            const matchesSearch =
                script.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                script.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                script.tags.some((tag) =>
                    tag.toLowerCase().includes(searchQuery.toLowerCase())
                );

            const matchesCategory =
                selectedCategory === 'All' || script.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [scripts, searchQuery, selectedCategory]);

    return (
        <div className="flex min-h-dvh flex-col bg-linear-to-b from-background to-secondary/20">
            <div className="container mx-auto flex-1 px-4 py-8">
                {/* Header */}
                <header className="mb-12 text-center">
                    <h1 className="mb-3 text-5xl font-bold tracking-tight">
                        🔧 Veyra Game Script Gallery
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Collection of useful scripts to enhance your Veyra Game experience
                    </p>
                </header>

                {/* Filters */}
                <div className="mb-8 space-y-4">
                    <SearchBar value={searchQuery} onChange={setSearchQuery}/>
                    <CategoryFilter
                        categories={categories}
                        selected={selectedCategory}
                        onChange={setSelectedCategory}
                    />
                </div>

                {/* Results info */}
                {!isLoading && (
                    <div className="mb-6 text-sm text-muted-foreground">
                        Showing {filteredScripts.length} of {scripts.length} scripts
                    </div>
                )}

                {/* Scripts grid */}
                {isLoading ? (
                    <div className="py-12 text-center">
                        <p className="text-lg text-muted-foreground">
                            Loading scripts...
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredScripts.map((script) => (
                            <ScriptCard key={script.id} script={script}/>
                        ))}
                    </div>
                )}

                {!isLoading && filteredScripts.length === 0 && (
                    <div className="py-12 text-center">
                        <p className="text-lg text-muted-foreground">
                            No scripts found. Try a different search.
                        </p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="border-t border-border/40 bg-background/50 py-6 backdrop-blur-sm">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col items-center justify-center gap-2 text-center">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Made with</span>
                            <Heart className="h-4 w-4 fill-red-500 text-red-500 animate-pulse"/>
                            <span>by</span>
                            <a
                                href="https://c.com/LePepeDev"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-primary transition-colors hover:text-primary/80 hover:underline"
                            >
                                @LePepeDev
                            </a>
                        </div>
                        <p className="text-xs text-muted-foreground/60">
                            © {new Date().getFullYear()} All rights reserved
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}