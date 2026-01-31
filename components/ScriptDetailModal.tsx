// src/components/ScriptDetailModal.tsx
import { useState } from 'react';
import { X, Download, Star, ExternalLink, ChevronLeft, ChevronRight, Calendar, Code } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type {Script} from '@/types/script';

interface ScriptDetailModalProps {
    script: Script;
    open: boolean;
    onClose: () => void;
}

export default function ScriptDetailModal({ script, open, onClose }: ScriptDetailModalProps) {
    const [currentScreenshot, setCurrentScreenshot] = useState(0);

    const handleInstall = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const link = document.createElement('a');
        link.href = script.fileUrl;
        link.download = `${script.id}.user.js`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const nextScreenshot = () => {
        if (script.screenshots) {
            setCurrentScreenshot((prev) => (prev + 1) % script.screenshots!.length);
        }
    };

    const prevScreenshot = () => {
        if (script.screenshots) {
            setCurrentScreenshot((prev) =>
                prev === 0 ? script.screenshots!.length - 1 : prev - 1
            );
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl! max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 z-10 border-b p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                            <div className="shrink-0 w-16 h-16 flex items-center justify-center text-4xl bg-secondary rounded-lg">
                                {script.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h2 className="text-2xl font-bold tracking-tight">{script.name}</h2>
                                <p className="text-sm text-muted-foreground mt-1">
                                    v{script.version} by {script.author}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="overflow-y-auto px-6 pb-6" style={{ maxHeight: 'calc(85vh - 200px)' }}>
                    <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="grid w-full grid-cols-4 mb-6">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="screenshots">Screenshots</TabsTrigger>
                            <TabsTrigger value="features">Features</TabsTrigger>
                            <TabsTrigger value="changelog">Changelog</TabsTrigger>
                        </TabsList>

                        {/* Overview Tab */}
                        <TabsContent value="overview" className="space-y-6 mt-0">
                            <div>
                                <h3 className="text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wide">
                                    Description
                                </h3>
                                <p className="text-foreground leading-relaxed">{script.description}</p>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
                                    Tags
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {script.tags.map((tag) => (
                                        <Badge key={tag} variant="secondary" className="px-3 py-1">
                                            #{tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-sm text-muted-foreground">Category</span>
                                        <p className="font-medium">{script.category}</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-sm text-muted-foreground">Match Pattern</span>
                                        <code className="block text-xs bg-secondary px-2 py-1 rounded mt-1 break-all">
                                            {script.match}
                                        </code>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Screenshots Tab */}
                        <TabsContent value="screenshots" className="space-y-4 mt-0">
                            {script.screenshots && script.screenshots.length > 0 ? (
                                <>
                                    <div className="relative aspect-video bg-secondary/50 rounded-lg overflow-hidden border">
                                        <img
                                            src={script.screenshots[currentScreenshot]}
                                            alt={`Screenshot ${currentScreenshot + 1}`}
                                            className="w-full h-full object-contain"
                                        />

                                        {script.screenshots.length > 1 && (
                                            <>
                                                <Button
                                                    variant="secondary"
                                                    size="icon"
                                                    className="absolute left-4 top-1/2 -translate-y-1/2 shadow-lg"
                                                    onClick={prevScreenshot}
                                                >
                                                    <ChevronLeft className="h-5 w-5" />
                                                </Button>
                                                <Button
                                                    variant="secondary"
                                                    size="icon"
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 shadow-lg"
                                                    onClick={nextScreenshot}
                                                >
                                                    <ChevronRight className="h-5 w-5" />
                                                </Button>
                                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-white">
                                                    {currentScreenshot + 1} / {script.screenshots.length}
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {script.screenshots.length > 1 && (
                                        <div className="flex gap-2 overflow-x-auto pb-2">
                                            {script.screenshots.map((screenshot, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setCurrentScreenshot(index)}
                                                    className={`shrink-0 w-28 h-20 rounded-lg border-2 overflow-hidden transition-all ${
                                                        currentScreenshot === index
                                                            ? 'border-primary ring-2 ring-primary/20'
                                                            : 'border-border opacity-50 hover:opacity-100 hover:border-primary/50'
                                                    }`}
                                                >
                                                    <img
                                                        src={screenshot}
                                                        alt={`Thumbnail ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="py-16 text-center">
                                    <p className="text-muted-foreground">No screenshots available</p>
                                </div>
                            )}
                        </TabsContent>

                        {/* Features Tab */}
                        <TabsContent value="features" className="mt-0">
                            {script.features && script.features.length > 0 ? (
                                <ul className="space-y-3">
                                    {script.features.map((feature, index) => (
                                        <li key={index} className="flex items-start gap-3 group">
                                            <span className="shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold mt-0.5">
                                                ✓
                                            </span>
                                            <span className="flex-1 leading-relaxed group-hover:text-foreground transition-colors">
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="py-16 text-center">
                                    <p className="text-muted-foreground">No features list available</p>
                                </div>
                            )}
                        </TabsContent>

                        {/* Changelog Tab */}
                        <TabsContent value="changelog" className="mt-0">
                            {script.changelog && script.changelog.length > 0 ? (
                                <div className="space-y-6">
                                    {script.changelog.map((entry, index) => (
                                        <div key={index} className="relative pl-6 border-l-2 border-primary/30">
                                            <div className="absolute -left-2.25 top-0 w-4 h-4 rounded-full bg-primary border-4 border-background" />
                                            <div className="flex items-center gap-3 mb-3">
                                                <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                                                    v{entry.version}
                                                </Badge>
                                                <span className="text-sm text-muted-foreground">{entry.date}</span>
                                            </div>
                                            <ul className="space-y-2">
                                                {entry.changes.map((change, changeIndex) => (
                                                    <li key={changeIndex} className="text-sm text-muted-foreground flex gap-2">
                                                        <span className="text-primary">•</span>
                                                        <span className="flex-1">{change}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-16 text-center">
                                    <p className="text-muted-foreground">No changelog available</p>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </DialogContent>
        </Dialog>
    );
}