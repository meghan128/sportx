import React, { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
  accept?: string;
  maxSizeMB?: number;
  className?: string;
  placeholder?: string;
}

export function FileUpload({ 
  onFileChange, 
  accept = ".pdf,.jpg,.jpeg,.png,.webp",
  maxSizeMB = 5,
  className,
  placeholder = "Click to upload or drag and drop"
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    setError("");
    
    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    // Check file type
    const allowedTypes = accept.split(',').map(type => type.trim());
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    const mimeType = file.type;
    
    const isValidType = allowedTypes.some(type => 
      type === fileExtension || 
      type === mimeType ||
      (type.startsWith('.') && fileExtension === type)
    );

    if (!isValidType) {
      setError(`File type not allowed. Accepted types: ${accept}`);
      return;
    }

    setSelectedFile(file);
    onFileChange(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    onFileChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
          isDragging ? "border-primary bg-primary/10" : "border-muted-foreground/25 hover:border-muted-foreground/50",
          selectedFile && "border-green-500 bg-green-50"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleFileInputChange}
        />
        
        {selectedFile ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="text-green-600">
              <Upload className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm font-medium">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeFile();
              }}
              className="p-1 hover:bg-red-100 rounded-full"
            >
              <X className="w-4 h-4 text-red-500" />
            </button>
          </div>
        ) : (
          <div className="text-muted-foreground">
            <Upload className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm font-medium">{placeholder}</p>
            <p className="text-xs">
              Maximum file size: {maxSizeMB}MB. Accepted formats: {accept}
            </p>
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}