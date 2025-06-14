import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Box, Smartphone, Eye } from 'lucide-react';
import { ARViewer } from './ar-viewer';

interface ARPreviewButtonProps {
  auctionItem: {
    id: number;
    titleAr: string;
    titleEn?: string;
    model3dUrl?: string;
    images: string[];
    categoryId?: number;
  };
  variant?: 'default' | 'secondary' | 'outline';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export function ARPreviewButton({ 
  auctionItem, 
  variant = 'outline', 
  size = 'default',
  className = '' 
}: ARPreviewButtonProps) {
  const [isARViewerOpen, setIsARViewerOpen] = useState(false);

  const handleOpenARViewer = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsARViewerOpen(true);
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleOpenARViewer}
        className={`relative group ${className}`}
      >
        <div className="flex items-center gap-2">
          <Box className="h-4 w-4 group-hover:rotate-12 transition-transform duration-200" />
          <span className="hidden sm:inline">عرض 3D</span>
          <span className="sm:hidden">3D</span>
        </div>
        
        {/* AR Badge for supported devices */}
        <Badge 
          variant="secondary" 
          className="absolute -top-1 -right-1 text-xs px-1 py-0 h-4 bg-blue-100 text-blue-700 border-blue-200"
        >
          AR
        </Badge>
      </Button>

      <ARViewer
        isOpen={isARViewerOpen}
        onClose={() => setIsARViewerOpen(false)}
        auctionItem={auctionItem}
      />
    </>
  );
}

// Compact version for card layouts
export function ARPreviewIconButton({ 
  auctionItem, 
  className = '' 
}: Pick<ARPreviewButtonProps, 'auctionItem' | 'className'>) {
  const [isARViewerOpen, setIsARViewerOpen] = useState(false);

  const handleOpenARViewer = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsARViewerOpen(true);
  };

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        onClick={handleOpenARViewer}
        className={`relative bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 ${className}`}
        title="عرض ثلاثي الأبعاد"
      >
        <Box className="h-4 w-4" />
        <Badge 
          variant="secondary" 
          className="absolute -top-1 -right-1 text-xs px-1 py-0 h-3 bg-blue-100 text-blue-700 border-blue-200 text-[10px]"
        >
          AR
        </Badge>
      </Button>

      <ARViewer
        isOpen={isARViewerOpen}
        onClose={() => setIsARViewerOpen(false)}
        auctionItem={auctionItem}
      />
    </>
  );
}