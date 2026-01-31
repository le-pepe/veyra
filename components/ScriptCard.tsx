import {useState} from 'react';
import {Download, Eye} from 'lucide-react';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import ScriptDetailModal from './ScriptDetailModal';
import {Script} from "@/lib/db/schema";

;

interface ScriptCardProps {
    script: Script;
}

export default function ScriptCard({ script }: ScriptCardProps) {
    const [showModal, setShowModal] = useState(false);


    return (
        <>
            <Card className="flex flex-col transition-all hover:shadow-lg">
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-4xl">{script.icon}</span>
                            <div>
                                <CardTitle className="text-xl">{script.name}</CardTitle>
                                <CardDescription className="mt-1">
                                    v{script.version} • {script.category}
                                </CardDescription>
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="flex-1">
                    <p className="text-sm text-muted-foreground line-clamp-3">{script.description}</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {script.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                                #{tag}
                            </Badge>
                        ))}
                        {script.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                                +{script.tags.length - 3}
                            </Badge>
                        )}
                    </div>

                </CardContent>

                <CardFooter className="flex flex-col gap-2">
                    <div className="flex w-full gap-2">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setShowModal(true)}
                        >
                            <Eye className="mr-2 h-4 w-4" />
                            Details
                        </Button>
                        <Button asChild className="flex-1">
                            <a href={`/api/scripts/${script.id}/script.user.js`} target="_blank" className={`flex items-center gap-2`} >
                                <Download className="mr-2 h-4 w-4" />
                                Install
                            </a>
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">by {script.author}</p>
                </CardFooter>
            </Card>

            <ScriptDetailModal
                script={script}
                open={showModal}
                onClose={() => setShowModal(false)}
            />
        </>
    );
}