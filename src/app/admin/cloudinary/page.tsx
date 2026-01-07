'use client';

import { useState } from 'react';
import { doc, setDoc, arrayUnion } from 'firebase/firestore';
import { Loader2, Trash2, PlusCircle } from 'lucide-react';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase/client-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CarouselDoc {
  carouselImages: string[];
}

export default function CloudinaryAdminPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const carouselRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'carousel', 'main');
  }, [firestore]);

  const { data, isLoading } = useDoc<CarouselDoc>(carouselRef);

  const handleAddUrl = async () => {
    if (!newImageUrl || !newImageUrl.startsWith('https://')) {
        toast({
            variant: 'destructive',
            title: 'Invalid URL',
            description: 'Please enter a valid HTTPS image URL to add.',
        });
        return;
    }
    if (!carouselRef) return;

    setIsAdding(true);
    try {
        await setDoc(carouselRef, {
            carouselImages: arrayUnion(newImageUrl)
        }, { merge: true });

        toast({
            title: 'Image Added',
            description: 'The new image has been added to the carousel.',
        });
        setNewImageUrl('');
    } catch (error) {
        console.error('Error adding image URL:', error);
        toast({
            variant: 'destructive',
            title: 'Failed to Add Image',
            description: (error as Error).message || 'Could not save the new image URL to Firestore.',
        });
    } finally {
        setIsAdding(false);
    }
  };


  const handleDelete = async (imageUrlToRemove: string) => {
    if (!data || !carouselRef) return;

    const updatedImages = data.carouselImages.filter(url => url !== imageUrlToRemove);
    
    try {
      await setDoc(carouselRef, {
        carouselImages: updatedImages,
      }, { merge: true });
      toast({
        title: 'Image Removed',
        description: 'The image has been removed from the carousel.',
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        variant: 'destructive',
        title: 'Deletion Failed',
        description: (error as Error).message || 'Could not remove the image from Firestore.',
      });
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-bold">Carousel Management</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Add Image by URL</CardTitle>
          <CardDescription>
            Paste an image URL below to add it to your homepage carousel.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex w-full items-end gap-2">
              <div className="flex-grow grid gap-2">
                <Label htmlFor="image-url">New Image URL</Label>
                <Input 
                    id="image-url" 
                    type="url" 
                    placeholder="https://example.com/image.jpg"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    disabled={isAdding}
                />
              </div>
              <Button onClick={handleAddUrl} disabled={isAdding || !newImageUrl}>
                {isAdding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                Add Image
              </Button>
            </div>
             <p className="text-xs text-muted-foreground mt-2">The image will be added to the end of the carousel.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Carousel Images</CardTitle>
          <CardDescription>
            These are the images currently displayed in your homepage carousel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="aspect-video w-full" />)}
            </div>
          )}

          {!isLoading && (!data || data.carouselImages.length === 0) && (
            <p className="text-center text-muted-foreground py-8">No images have been added yet.</p>
          )}

          {data && data.carouselImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {data.carouselImages.map((url) => (
                <div key={url} className="relative group">
                  <img
                    src={url}
                    alt="Carousel image"
                    className="aspect-video w-full rounded-lg object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(url)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete Image</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
