'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Script, NewScript } from '@/lib/db/schema';
import { getScripts, deleteScript, createScript, updateScript } from '@/lib/actions/scripts';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {loginAction} from "@/lib/actions/login";

export default function AdminPage() {
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [scripts, setScripts] = useState<Script[]>([]);
    const [selectedScript, setSelectedScript] = useState<Script | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [formData, setFormData] = useState<Partial<NewScript>>({
        id: '',
        name: '',
        description: '',
        author: '',
        version: '',
        category: 'Utilities',
        icon: '📜',
        match: '*://*/*',
        code: '',
        tags: [],
        features: [],
        screenshots: []
    });

    const fetchScripts = async () => {
        if (!isAuthenticated) return;
        setIsLoading(true);
        const data = await getScripts();
        setScripts(data);
        setIsLoading(false);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const login = await loginAction(password)
        setIsAuthenticated(login);
        fetchScripts();
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this script?')) {
            await deleteScript(id);
            fetchScripts();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        const result = isEditing && selectedScript
            ? await updateScript(selectedScript.id, formData)
            : await createScript(formData as NewScript);
            
        if (result.success) {
            setIsDialogOpen(false);
            fetchScripts();
        } else {
            alert(result.error);
        }
        setIsLoading(false);
    };

    const openCreateDialog = () => {
        setIsEditing(false);
        setSelectedScript(null);
        setFormData({
            id: '',
            name: '',
            description: '',
            author: '',
            version: '1.0.0',
            category: 'Utilities',
            icon: '📜',
            match: '*://*/*',
            code: '',
            tags: [],
            features: [],
            screenshots: []
        });
        setIsDialogOpen(true);
    };

    const openEditDialog = (script: Script) => {
        setIsEditing(true);
        setSelectedScript(script);
        setFormData(script);
        setIsDialogOpen(true);
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchScripts();
        }
    }, [isAuthenticated]);

    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-screen p-24">
                <Card className="w-[400px]">
                    <CardHeader>
                        <CardTitle>Admin Access</CardTitle>
                        <CardDescription>Enter password to manage scripts.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <Input 
                                type="password" 
                                placeholder="Password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Button type="submit" className="w-full">Enter</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Script Manager</h1>
                
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={openCreateDialog}>Add New Script</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl! max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{isEditing ? 'Edit Script' : 'Add New Script'}</DialogTitle>
                            <DialogDescription>
                                Fill in the details for the Tampermonkey script.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-6 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="id">ID (slug)</Label>
                                    <Input 
                                        id="id" 
                                        disabled={isEditing}
                                        value={formData.id} 
                                        onChange={e => setFormData({...formData, id: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input 
                                        id="name" 
                                        value={formData.name} 
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="author">Author</Label>
                                    <Input 
                                        id="author" 
                                        value={formData.author} 
                                        onChange={e => setFormData({...formData, author: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="version">Version</Label>
                                    <Input 
                                        id="version" 
                                        value={formData.version} 
                                        onChange={e => setFormData({...formData, version: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Input 
                                        id="category" 
                                        value={formData.category} 
                                        onChange={e => setFormData({...formData, category: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="icon">Icon (Emoji)</Label>
                                    <Input 
                                        id="icon" 
                                        value={formData.icon} 
                                        onChange={e => setFormData({...formData, icon: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea 
                                    id="description" 
                                    value={formData.description || ''} 
                                    onChange={e => setFormData({...formData, description: e.target.value})}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="match">Match URL (Tampermonkey)</Label>
                                <Input 
                                    id="match" 
                                    value={formData.match} 
                                    onChange={e => setFormData({...formData, match: e.target.value})}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="code">Script Code</Label>
                                <Textarea 
                                    id="code" 
                                    className="font-mono text-xs h-64"
                                    value={formData.code} 
                                    onChange={e => setFormData({...formData, code: e.target.value})}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Screenshots (URLs, one per line)</Label>
                                <Textarea 
                                    className="text-xs"
                                    value={formData.screenshots?.join('\n') || ''} 
                                    onChange={e => setFormData({...formData, screenshots: e.target.value.split('\n').filter(Boolean)})}
                                    placeholder="https://example.com/image.png"
                                />
                            </div>

                            <div className="flex justify-end gap-3">
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? 'Saving...' : (isEditing ? 'Update Script' : 'Create Script')}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {scripts.map((script) => (
                    <Card key={script.id} className="flex flex-col">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div className="text-4xl mb-2">{script.icon}</div>
                                <Badge>{script.category}</Badge>
                            </div>
                            <CardTitle>{script.name}</CardTitle>
                            <CardDescription className="line-clamp-2">{script.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <div className="text-sm text-muted-foreground mb-4">
                                <p><strong>Version:</strong> {script.version}</p>
                                <p><strong>Author:</strong> {script.author}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" className="flex-1" onClick={() => openEditDialog(script)}>
                                    Edit
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(script.id)}>
                                    Delete
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
