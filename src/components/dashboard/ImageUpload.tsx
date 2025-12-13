import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Image as ImageIcon, FileImage, AlertCircle, TestTube2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import sampleXray from '@/assets/sample-xray.jpg';

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  onSampleLoad: (imageUrl: string) => void;
  uploadedImage: string | null;
  onClear: () => void;
}

export function ImageUpload({ onImageUpload, onSampleLoad, uploadedImage, onClear }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/png', 'image/dicom', 'application/dicom'];
    const maxSize = 50 * 1024 * 1024; // 50MB

    if (!validTypes.includes(file.type) && !file.name.endsWith('.dcm')) {
      setError('Please upload a valid medical image (JPEG, PNG, or DICOM)');
      return false;
    }

    if (file.size > maxSize) {
      setError('File size must be less than 50MB');
      return false;
    }

    setError(null);
    return true;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) {
      onImageUpload(file);
    }
  }, [onImageUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      onImageUpload(file);
    }
  }, [onImageUpload]);

  const handleLoadSample = useCallback(() => {
    onSampleLoad(sampleXray);
  }, [onSampleLoad]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Upload X-Ray Image</h2>
          <p className="text-sm text-muted-foreground">Supported formats: JPEG, PNG, DICOM</p>
        </div>
        <div className="flex items-center gap-2">
          {!uploadedImage && (
            <Button variant="outline" size="sm" onClick={handleLoadSample} className="text-muted-foreground">
              <TestTube2 className="h-4 w-4 mr-1" />
              Load Sample
            </Button>
          )}
          {uploadedImage && (
            <Button variant="ghost" size="sm" onClick={onClear} className="text-muted-foreground">
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!uploadedImage ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <label
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200",
                isDragging
                  ? "border-primary bg-medical-blue-light scale-[1.01]"
                  : "border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50",
                error && "border-destructive bg-destructive/5"
              )}
            >
              <input
                type="file"
                className="hidden"
                accept="image/jpeg,image/png,.dcm,application/dicom"
                onChange={handleFileSelect}
              />
              
              <motion.div
                animate={isDragging ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
                className="flex flex-col items-center gap-3"
              >
                <div className={cn(
                  "p-4 rounded-full transition-colors duration-200",
                  isDragging ? "bg-primary/10" : "bg-secondary"
                )}>
                  <Upload className={cn(
                    "h-8 w-8 transition-colors duration-200",
                    isDragging ? "text-primary" : "text-muted-foreground"
                  )} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">
                    {isDragging ? 'Drop your image here' : 'Drag & drop your X-ray image'}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    or click to browse files
                  </p>
                </div>
              </motion.div>

              <div className="absolute bottom-4 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <FileImage className="h-3 w-3" /> Max 50MB
                </span>
                <span>•</span>
                <span>DICOM, JPEG, PNG</span>
              </div>
            </label>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 mt-3 p-3 bg-destructive/10 text-destructive rounded-lg text-sm"
              >
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="relative rounded-xl overflow-hidden bg-muted/50 border border-border"
          >
            <div className="aspect-square max-h-80 w-full flex items-center justify-center p-4">
              <img
                src={uploadedImage}
                alt="Uploaded X-ray"
                className="max-w-full max-h-full object-contain rounded-lg shadow-md"
              />
            </div>
            <div className="absolute top-3 right-3">
              <Button
                variant="secondary"
                size="icon"
                onClick={onClear}
                className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm shadow-md hover:bg-background"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-background/80 to-transparent">
              <div className="flex items-center gap-2 text-sm text-foreground">
                <ImageIcon className="h-4 w-4" />
                <span className="font-medium">Image uploaded successfully</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
