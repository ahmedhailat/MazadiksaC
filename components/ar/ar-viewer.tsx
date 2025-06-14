import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Camera, Smartphone, Eye, X, RotateCcw, ZoomIn, ZoomOut, Box } from 'lucide-react';

interface ARViewerProps {
  isOpen: boolean;
  onClose: () => void;
  auctionItem: {
    id: number;
    titleAr: string;
    titleEn?: string;
    model3dUrl?: string;
    images: string[];
    categoryId?: number;
  };
}

export function ARViewer({ isOpen, onClose, auctionItem }: ARViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isARSupported, setIsARSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });

  const title = auctionItem.titleAr || auctionItem.titleEn || 'منتج';

  useEffect(() => {
    // Check WebXR support for AR
    if (typeof navigator !== 'undefined' && 'xr' in navigator) {
      (navigator as any).xr?.isSessionSupported?.('immersive-ar').then((supported: boolean) => {
        setIsARSupported(supported);
      }).catch(() => {
        setIsARSupported(false);
      });
    }
    
    // Initialize 3D viewer
    if (canvasRef.current) {
      initializeViewer();
    }
  }, [isOpen]);

  const initializeViewer = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Draw initial 3D representation
    drawProduct(ctx, canvas.width, canvas.height);
    setIsLoading(false);
  };

  const drawProduct = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);

    // Create gradient background
    const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width/2);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.1)');
    gradient.addColorStop(1, 'rgba(147, 197, 253, 0.05)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Calculate center and size based on zoom
    const centerX = width / 2;
    const centerY = height / 2;
    const size = Math.min(width, height) * 0.3 * zoom;

    // Apply rotation
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation.y * 0.01);
    ctx.scale(1, Math.cos(rotation.x * 0.01));

    // Draw 3D-like product representation based on category
    drawProductByCategory(ctx, size, auctionItem.categoryId);

    ctx.restore();

    // Draw rotation indicators
    drawControls(ctx, width, height);
  };

  const drawProductByCategory = (ctx: CanvasRenderingContext2D, size: number, categoryId?: number) => {
    ctx.strokeStyle = '#3b82f6';
    ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
    ctx.lineWidth = 3;

    switch (categoryId) {
      case 1: // Electronics
        drawElectronics(ctx, size);
        break;
      case 2: // Jewelry
        drawJewelry(ctx, size);
        break;
      case 3: // Vehicles
        drawVehicle(ctx, size);
        break;
      default:
        drawGeneric(ctx, size);
    }
  };

  const drawElectronics = (ctx: CanvasRenderingContext2D, size: number) => {
    // Draw smartphone/tablet
    const width = size * 0.6;
    const height = size;
    
    ctx.fillRect(-width/2, -height/2, width, height);
    ctx.strokeRect(-width/2, -height/2, width, height);
    
    // Screen
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(-width/2 + 10, -height/2 + 20, width - 20, height - 60);
    
    // Home button
    ctx.fillStyle = '#6b7280';
    ctx.beginPath();
    ctx.arc(0, height/2 - 20, 8, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawJewelry = (ctx: CanvasRenderingContext2D, size: number) => {
    // Draw ring
    ctx.strokeStyle = '#fbbf24';
    ctx.fillStyle = 'rgba(251, 191, 36, 0.3)';
    ctx.lineWidth = 8;
    
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.4, 0, Math.PI * 2);
    ctx.stroke();
    
    // Diamond
    ctx.fillStyle = '#e5e7eb';
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.3);
    ctx.lineTo(-10, -size * 0.2);
    ctx.lineTo(0, -size * 0.1);
    ctx.lineTo(10, -size * 0.2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  };

  const drawVehicle = (ctx: CanvasRenderingContext2D, size: number) => {
    // Draw car silhouette
    const width = size * 1.2;
    const height = size * 0.6;
    
    // Car body
    ctx.fillRect(-width/2, -height/4, width, height/2);
    ctx.strokeRect(-width/2, -height/4, width, height/2);
    
    // Windows
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(-width/3, -height/3, width * 0.6, height/4);
    
    // Wheels
    ctx.fillStyle = '#374151';
    ctx.beginPath();
    ctx.arc(-width/3, height/4, 15, 0, Math.PI * 2);
    ctx.arc(width/3, height/4, 15, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawGeneric = (ctx: CanvasRenderingContext2D, size: number) => {
    // Draw cube
    const s = size * 0.5;
    
    // Front face
    ctx.fillRect(-s/2, -s/2, s, s);
    ctx.strokeRect(-s/2, -s/2, s, s);
    
    // Top face
    ctx.fillStyle = 'rgba(59, 130, 246, 0.5)';
    ctx.beginPath();
    ctx.moveTo(-s/2, -s/2);
    ctx.lineTo(-s/4, -s * 0.75);
    ctx.lineTo(s * 0.75, -s * 0.75);
    ctx.lineTo(s/2, -s/2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Right face
    ctx.fillStyle = 'rgba(59, 130, 246, 0.4)';
    ctx.beginPath();
    ctx.moveTo(s/2, -s/2);
    ctx.lineTo(s * 0.75, -s * 0.75);
    ctx.lineTo(s * 0.75, s * 0.25);
    ctx.lineTo(s/2, s/2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  };

  const drawControls = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Draw rotation guide
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    
    // Horizontal guide
    ctx.beginPath();
    ctx.moveTo(50, height/2);
    ctx.lineTo(width - 50, height/2);
    ctx.stroke();
    
    // Vertical guide
    ctx.beginPath();
    ctx.moveTo(width/2, 50);
    ctx.lineTo(width/2, height - 50);
    ctx.stroke();
    
    ctx.setLineDash([]);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - lastMouse.x;
    const deltaY = e.clientY - lastMouse.y;
    
    setRotation(prev => ({
      x: prev.x + deltaY,
      y: prev.y + deltaX
    }));
    
    setLastMouse({ x: e.clientX, y: e.clientY });
    
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        drawProduct(ctx, canvasRef.current.width, canvasRef.current.height);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setRotation({ x: 0, y: 0 });
    setZoom(1);
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        drawProduct(ctx, canvasRef.current.width, canvasRef.current.height);
      }
    }
  };

  const handleZoom = (delta: number) => {
    setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        drawProduct(ctx, canvasRef.current.width, canvasRef.current.height);
      }
    }
  };

  const startARSession = async () => {
    if (!isARSupported) return;
    
    try {
      const session = await (navigator as any).xr.requestSession('immersive-ar', {
        requiredFeatures: ['local', 'hit-test']
      });
      
      // Handle AR session
      console.log('AR session started:', session);
    } catch (error) {
      console.error('AR session failed:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3">
              <Box className="h-6 w-6 text-blue-600" />
              <div>
                <span className="text-xl font-bold">{title}</span>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    عرض ثلاثي الأبعاد
                  </Badge>
                  {isARSupported && (
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      <Smartphone className="h-3 w-3 mr-1" />
                      AR متاح
                    </Badge>
                  )}
                </div>
              </div>
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 p-6 pt-4">
          <div className="relative h-full bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg overflow-hidden">
            {/* 3D Canvas Viewer */}
            <canvas
              ref={canvasRef}
              className="w-full h-full cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{ touchAction: 'none' }}
            />

            {/* Loading State */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/90 dark:bg-gray-800/90">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">جاري تحميل العارض ثلاثي الأبعاد...</p>
                </div>
              </div>
            )}

            {/* Control Panel */}
            <div className="absolute top-4 left-4 flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={resetView}
                className="bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleZoom(0.2)}
                className="bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleZoom(-0.2)}
                className="bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
            </div>

            {/* AR Button */}
            {isARSupported && (
              <div className="absolute bottom-4 right-4">
                <Button
                  onClick={startARSession}
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                >
                  <Smartphone className="h-4 w-4 mr-2" />
                  عرض بالواقع المعزز
                </Button>
              </div>
            )}

            {/* Instructions */}
            <div className="absolute bottom-4 left-4 bg-black/70 text-white text-sm px-3 py-2 rounded-lg">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>اسحب للدوران • عجلة الماوس للتكبير</span>
              </div>
              {isARSupported && (
                <div className="mt-1 text-xs opacity-80">
                  اضغط على زر AR للعرض بالواقع المعزز
                </div>
              )}
            </div>
          </div>

          {/* Info Panel */}
          <Card className="mt-4">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Box className="h-4 w-4 text-blue-600" />
                  <span>عرض تفاعلي 360°</span>
                </div>
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-green-600" />
                  <span>{isARSupported ? 'متوافق مع AR' : 'AR غير متاح'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ZoomIn className="h-4 w-4 text-purple-600" />
                  <span>تكبير حتى 300%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}