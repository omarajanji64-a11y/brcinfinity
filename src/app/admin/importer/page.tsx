"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Progress } from "@/components/ui/progress";

export default function ImageImporterPage() {
    const [googleDriveLink, setGoogleDriveLink] = useState('');
    const [isImporting, setIsImporting] = useState(false);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const { toast } = useToast();
    const [progress, setProgress] = useState(0);

    const handleImport = async () => {
        if (!googleDriveLink) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Please paste a Google Drive link.',
            });
            return;
        }

        setIsImporting(true);
        setProgress(0);
        setImageUrls([]);

        try {
            toast({ title: 'Importing...', description: 'Connecting to the server.' });
            setProgress(25);

            const response = await fetch('/api/import', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ googleDriveLink }),
            });

            setProgress(75);

            if (!response.ok) {
                throw new Error('Failed to import images.');
            }

            const data = await response.json();
            setImageUrls(data.imageUrls);
            setProgress(100);

            toast({
                title: 'Import Successful',
                description: 'Images have been imported and are ready.',
            });

        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: (error as Error).message || 'An unexpected error occurred.',
            });
            setProgress(0);
        } finally {
            setIsImporting(false);
        }
    };

    const handleExportCsv = () => {
        if (imageUrls.length === 0) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'No image URLs to export.',
            });
            return;
        }

        const csvContent = "data:text/csv;charset=utf-8,"
            + "image_url\n"
            + imageUrls.join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "product_images.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Google Drive to Cloudinary Image Importer</CardTitle>
                    <CardDescription>
                        Paste a Google Drive link to upload images to Cloudinary and generate a CSV of the image URLs.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex space-x-2">
                        <Input
                            placeholder="Paste Google Drive link here..."
                            value={googleDriveLink}
                            onChange={(e) => setGoogleDriveLink(e.target.value)}
                            disabled={isImporting}
                        />
                        <Button onClick={handleImport} disabled={isImporting}>
                            {isImporting ? 'Importing...' : 'Import'}
                        </Button>
                    </div>
                    {isImporting && <Progress value={progress} />}
                </CardContent>
            </Card>

            {imageUrls.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Cloudinary Image URLs</CardTitle>
                        <CardDescription>
                            Here are the Cloudinary URLs for the imported images. You can edit them here or export them as a CSV.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <textarea
                            className="w-full h-40 p-2 border rounded"
                            value={imageUrls.join('\n')}
                            onChange={(e) => setImageUrls(e.target.value.split('\n'))}
                        />
                        <Button onClick={handleExportCsv}>Export as CSV</Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
