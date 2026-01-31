'use client';

import { useState, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

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
    const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

    const handleImport = async () => {
        if (!googleDriveLink) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please paste a Google Drive link.' });
            return;
        }

        setIsImporting(true);
        setProgress(0);
        setProducts([]);
        setSelectedIndices([]);

        try {
            toast({ title: 'Importing...', description: 'Connecting to the server.' });
            setProgress(25);

            const response = await fetch('/api/import', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ googleDriveLink }),
            });

            setProgress(75);

            const data = await response.json();

            if (!response.ok) {
                // Use the detailed error message from the backend
                throw new Error(data.error || 'Failed to import images.');
            }
            
            const initialProducts: Product[] = data.imageUrls.map((url: string) => ({
              name: "BRC INFINITY",
              price: 0,
              quantity: 1,
              collection: "modern",
              image_urls: [url], // Each product starts with one image
            }));
            setProducts(initialProducts);

            setProgress(100);
            toast({ 
                title: 'Import Successful', 
                description: data.message || 'Images have been imported and are ready for editing.' 
            });

        } catch (error) {
            console.error(error);
            toast({ 
                variant: 'destructive', 
                title: 'Import Error', 
                description: (error as Error).message || 'An unexpected error occurred.',
                duration: 9000, // Show the toast for longer
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

    const handleSelectionChange = (index: number, checked: boolean) => {
      if (checked) {
        setSelectedIndices(prev => [...prev, index]);
      } else {
        setSelectedIndices(prev => prev.filter(i => i !== index));
      }
    };

    const handleGroupProducts = () => {
      if (selectedIndices.length < 2) return;

      const groupedImageUrls = selectedIndices.flatMap(index => products[index].image_urls);
      const firstSelectedProduct = products[selectedIndices[0]];

      const newProduct: Product = {
        ...firstSelectedProduct,
        image_urls: groupedImageUrls,
      };

      const remainingProducts = products.filter((_, index) => !selectedIndices.includes(index));
      
      setProducts([newProduct, ...remainingProducts]);
      setSelectedIndices([]);
    };

    const handleAddProducts = async () => {
        try {
            const response = await fetch('/api/products/bulk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ products }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response from server.' }));
                let descriptionNode: ReactNode = null;

                if (errorData.invalidProduct) {
                    const formattedJson = JSON.stringify(errorData.invalidProduct, null, 2);
                    descriptionNode = (
                        <>
                            <p>The following product data is invalid:</p>
                            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                                <code className="text-white">{formattedJson}</code>
                            </pre>
                        </>
                    );
                } else if (errorData.error) {
                    descriptionNode = `Server error details: ${errorData.error}`;
                }

                toast({
                    variant: 'destructive',
                    title: errorData.message || 'Failed to add products.',
                    description: descriptionNode,
                });
                return;
            }

            toast({ title: 'Success', description: 'All products have been added successfully.' });
            setProducts([]);
            setSelectedIndices([]);
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: 'An unexpected error occurred',
                description: (error as Error).message || 'Please check the console for more details.',
            });
        }
    };

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Google Drive to Cloudinary Image Importer</CardTitle>
                    <CardDescription>
                        Paste a Google Drive link to upload images to Cloudinary, edit, and add them as products.
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
                            Select products to group them, or edit individually and click "Add All Products".
                        </CardDescription>
                         {selectedIndices.length > 1 && (
                            <Button onClick={handleGroupProducts} className="mt-2">Group Selected</Button>
                        )}
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4">
                            {products.map((product, index) => (
                                <Card key={index} className={selectedIndices.includes(index) ? 'border-2 border-primary' : ''}>
                                    <div className="flex items-start p-4 space-x-4">
                                        <Checkbox
                                            id={`select-${index}`}
                                            onCheckedChange={(checked) => handleSelectionChange(index, !!checked)}
                                            checked={selectedIndices.includes(index)}
                                            className="mt-1"
                                        />
                                        <div className="flex-shrink-0 w-48">
                                            {product.image_urls.length > 1 ? (
                                                <Carousel className="w-full">
                                                    <CarouselContent>
                                                        {product.image_urls.map((url, imgIndex) => (
                                                            <CarouselItem key={imgIndex}>
                                                                <img src={url} alt={`Product ${index + 1} Image ${imgIndex + 1}`} className="w-full h-32 object-cover rounded-md" />
                                                            </CarouselItem>
                                                        ))}
                                                    </CarouselContent>
                                                    <CarouselPrevious />
                                                    <CarouselNext />
                                                </Carousel>
                                            ) : (
                                                <img src={product.image_urls[0]} alt={`Product ${index + 1} Image 1`} className="w-full h-32 object-cover rounded-md" />
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-2">
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
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                        <Button onClick={handleAddProducts} className="mt-4 w-full">Add All Products</Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
