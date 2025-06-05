"use client";

import { useState, ChangeEvent, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { UploadCloud, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface OutfitUploaderProps {
  onImageUpload: (imageDataUrl: string) => void;
  isLoading: boolean;
}

const OutfitUploader = ({ onImageUpload, isLoading }: OutfitUploaderProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError("File size exceeds 5MB limit.");
        setSelectedFile(null);
        setPreviewUrl(null);
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setError("Invalid file type. Please upload JPG, PNG, or WEBP.");
        setSelectedFile(null);
        setPreviewUrl(null);
        return;
      }
      
      setSelectedFile(file);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (previewUrl) {
      onImageUpload(previewUrl);
    } else {
      setError("Please select an image first.");
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto shadow-xl">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-2xl font-headline text-primary">AI Style Matcher</CardTitle>
          <CardDescription>Upload a photo of your outfit, and we'll recommend shoes that match your style!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="outfit-image" className="sr-only">Upload Outfit Image</Label>
            <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${error ? 'border-destructive' : 'border-border'} border-dashed rounded-md`}>
              <div className="space-y-1 text-center">
                {previewUrl ? (
                  <div className="relative w-full h-64">
                    <Image src={previewUrl} alt="Outfit preview" fill className="object-contain rounded-md" />
                  </div>
                ) : (
                  <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                )}
                <div className="flex text-sm text-muted-foreground justify-center">
                  <label
                    htmlFor="outfit-image-input"
                    className="relative cursor-pointer rounded-md font-medium text-accent hover:text-accent/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-accent"
                  >
                    <span>{previewUrl ? 'Change image' : 'Upload a file'}</span>
                    <Input id="outfit-image-input" name="outfit-image" type="file" className="sr-only" onChange={handleFileChange} accept="image/jpeg,image/png,image/webp" />
                  </label>
                  {!previewUrl && <p className="pl-1">or drag and drop</p>}
                </div>
                {!previewUrl && <p className="text-xs text-muted-foreground">PNG, JPG, WEBP up to 5MB</p>}
              </div>
            </div>
            {error && <p className="text-sm text-destructive mt-2">{error}</p>}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={!selectedFile || isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Find Matching Shoes'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default OutfitUploader;
