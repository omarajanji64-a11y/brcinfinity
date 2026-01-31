'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Define the Product interface
interface Product {
  name: string;
  price: number;
  quantity: number;
  collection: 'modern' | 'classic';
  image_urls: string[];
}

export default function ImageImporterPage() {
    const [googleDriveLink, setGoogleDriveLink] = useState('');
    const [isImporting, setIsImporting] = useState(false);
    const { toast } = useToast();
    const [progress, setProgress] = useState(0);
    const [products, setProducts] = useState<Product[]>([]);

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
        setProducts([]);

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
            
            // Initialize one product with all image URLs
            const initialProduct: Product = {
              name: "BRC INFINITY",
              price: 0,
              quantity: 1,
              collection: "modern",
              image_urls: data.imageUrls,
            };
            setProducts([initialProduct]);

            setProgress(100);

            toast({
                title: 'Import Successful',
                description: 'Images have been imported and are ready for editing.',
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

    const handleProductChange = (index: number, field: keyof Product, value: string | number | string[]) => {
      const updatedProducts = [...products];
      (updatedProducts[index] as any)[field] = value;
      setProducts(updatedProducts);
    };

    const handleAddProducts = async () => {
        try {
            const response = await fetch('/api/products/bulk', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ products }),
            });

            if (!response.ok) {
                throw new Error('Failed to add products.');
            }

            toast({
                title: 'Success',
                description: 'All products have been added successfully.',
            });
            setProducts([]); // Clear products after adding
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: (error as Error).message || 'An unexpected error occurred.',
            });
        }
    };

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Google Drive to Cloudinary Image Importer</CardTitle>
                    <CardDescription>
                        Paste a Google Drive link to upload images to Cloudinary and create a new product.
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

            {products.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Bulk Product Editor</CardTitle>
                        <CardDescription>
                            Edit the product below and click "Add Product" to save it.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {products.map((product, index) => (
                                <Card key={index}>
                                    <CardHeader>
                                        <div className="grid grid-cols-3 gap-2">
                                            {product.image_urls.map((url, imgIndex) => (
                                                <img key={imgIndex} src={url} alt={`Product ${index + 1} Image ${imgIndex + 1}`} className="w-full h-32 object-cover" />
                                            ))}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <Input
                                            value={product.name}
                                            onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                                            placeholder="Product Name"
                                        />
                                        <Input
                                            type="number"
                                            value={product.price}
                                            onChange={(e) => handleProductChange(index, 'price', Number(e.target.value))}
                                            placeholder="Price"
                                        />
                                        <Input
                                            type="number"
                                            value={product.quantity}
                                            onChange={(e) => handleProductChange(index, 'quantity', Number(e.target.value))}
                                            placeholder="Quantity"
                                        />
                                        <Select onValueChange={(value) => handleProductChange(index, 'collection', value)} defaultValue={product.collection}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a collection" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="modern">Modern</SelectItem>
                                                <SelectItem value="classic">Classic</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        <Button onClick={handleAddProducts} className="mt-4">Add Product</Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
