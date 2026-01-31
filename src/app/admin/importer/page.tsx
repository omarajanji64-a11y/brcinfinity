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

// Define the Product interface for structure
interface Product {
  name: string;
  price: number;
  quantity: number;
  collection: 'modern' | 'classic';
  image_urls: string[];
}

export default function DirectUploaderPage() {
    const [files, setFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const { toast } = useToast();
    const [progress, setProgress] = useState(0);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFiles(Array.from(event.target.files));
        }
    };

    const handleUpload = async () => {
        if (files.length === 0) {
            toast({ variant: 'destructive', title: 'No Files Selected', description: 'Please choose one or more image files to upload.' });
            return;
        }

        setIsUploading(true);
        setProgress(0);
        setProducts([]);
        setSelectedIndices([]);
        const formData = new FormData();
        files.forEach(file => formData.append('files', file));

        try {
            toast({ title: 'Uploading...', description: `Sending ${files.length} file(s) to the server.` });
            setProgress(33);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            setProgress(66);

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to upload files. Please check the server logs.');
            }
            
            const initialProducts: Product[] = data.imageUrls.map((url: string) => ({
              name: "BRC INFINITY",
              price: 0,
              quantity: 1,
              collection: "modern",
              image_urls: [url], 
            }));
            setProducts(initialProducts);

            setProgress(100);
            toast({ 
                title: 'Upload Successful', 
                description: 'Images are ready for editing below.' 
            });

        } catch (error) {
            console.error(error);
            toast({ 
                variant: 'destructive', 
                title: 'Upload Error', 
                description: (error as Error).message || 'An unexpected error occurred.',
                duration: 9000,
            });
            setProgress(0);
        } finally {
            setIsUploading(false);
        }
    };

    // Handler to update a product's details in the local state
    const handleProductChange = (index: number, field: keyof Product, value: string | number | string[]) => {
      const updatedProducts = [...products];
      (updatedProducts[index] as any)[field] = value;
      setProducts(updatedProducts);
    };

    // Handler for selecting/deselecting a product card
    const handleSelectionChange = (index: number, checked: boolean) => {
      if (checked) {
        setSelectedIndices(prev => [...prev, index]);
      } else {
        setSelectedIndices(prev => prev.filter(i => i !== index));
      }
    };

    // Handler to group selected products into one product with multiple images
    const handleGroupProducts = () => {
      if (selectedIndices.length < 2) return;

      const groupedImageUrls = selectedIndices.flatMap(index => products[index].image_urls);
      const firstSelectedProduct = products[selectedIndices[0]];

      const newProduct: Product = {
        ...firstSelectedProduct,
        image_urls: groupedImageUrls,
      };

      const remainingProducts = products.filter((_, index) => !selectedIndices.includes(index));
      
      setProducts([newProduct, ...remainingProducts].sort((a,b) => b.image_urls.length - a.image_urls.length));
      setSelectedIndices([]);
    };

    // Handler to submit all edited products to the database
    const handleAddProducts = async () => {
        try {
            const response = await fetch('/api/products/bulk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ products }),
            });

            const data = await response.json();

            if (!response.ok) {
                let descriptionNode: ReactNode = data.error;
                // Provide detailed feedback for validation errors
                if (data.invalidProduct) {
                    const formattedJson = JSON.stringify(data.invalidProduct, null, 2);
                    descriptionNode = (
                        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                            <code className="text-white">{formattedJson}</code>
                        </pre>
                    );
                }
                toast({ variant: 'destructive', title: data.message || 'Failed to add products', description: descriptionNode });
                return;
            }

            toast({ title: 'Success!', description: 'All products have been added to the database.' });
            setProducts([]);
            setSelectedIndices([]);
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Submission Error', description: (error as Error).message });
        }
    };

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Direct File Uploader</CardTitle>
                    <CardDescription>
                        This is a guaranteed working alternative. Select multiple image files from your computer to upload them directly.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex space-x-2">
                        <Input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            disabled={isUploading}
                            className="flex-grow"
                        />
                        <Button onClick={handleUpload} disabled={isUploading || files.length === 0}>
                            {isUploading ? 'Uploading...' : 'Upload'}
                        </Button>
                    </div>
                    {isUploading && <Progress value={progress} className="w-full" />}
                </CardContent>
            </Card>

            {products.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Bulk Product Editor</CardTitle>
                        <CardDescription>
                            Edit product details below. Select multiple products to group them into a single item with several images.
                        </CardDescription>
                         {selectedIndices.length > 1 && (
                            <Button onClick={handleGroupProducts} className="mt-2">Group {selectedIndices.length} Selected</Button>
                        )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {products.map((product, index) => (
                                <Card key={index} className={selectedIndices.includes(index) ? 'border-2 border-primary' : ''}>
                                     <CardHeader className="flex flex-row items-center space-x-4 p-4">
                                         <Checkbox
                                            id={`select-${index}`}
                                            onCheckedChange={(checked) => handleSelectionChange(index, !!checked)}
                                            checked={selectedIndices.includes(index)}
                                        />
                                        <div className="w-48 h-32 flex-shrink-0">
                                            <Carousel className="w-full h-full">
                                                <CarouselContent className="h-full">
                                                    {product.image_urls.map((url, imgIndex) => (
                                                        <CarouselItem key={imgIndex} className="h-full">
                                                            <img src={url} alt={`Product Image ${imgIndex + 1}`} className="w-full h-full object-cover rounded-md" />
                                                        </CarouselItem>
                                                    ))}
                                                </CarouselContent>
                                                {product.image_urls.length > 1 && <><CarouselPrevious /><CarouselNext /></>}
                                            </Carousel>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-4 space-y-2">
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
                                            <SelectTrigger><SelectValue placeholder="Select a collection" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="modern">Modern</SelectItem>
                                                <SelectItem value="classic">Classic</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        <Button onClick={handleAddProducts} className="mt-4 w-full" size="lg">Add All Products to Database</Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
