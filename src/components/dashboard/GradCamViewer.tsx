import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Layers, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface GradCamViewerProps {
  originalImage: string;
  gradCamImage?: string;
  maskImage?: string;
}

export function GradCamViewer({ originalImage, gradCamImage, maskImage }: GradCamViewerProps) {
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showMask, setShowMask] = useState(false);
  const [heatmapOpacity, setHeatmapOpacity] = useState([0.6]);
  const [zoom, setZoom] = useState(1);

  // Generate mock heatmap overlay effect with CSS
  const heatmapStyle = showHeatmap ? {
    background: `
      radial-gradient(ellipse 30% 35% at 45% 55%, rgba(255, 0, 0, ${heatmapOpacity[0] * 0.7}) 0%, transparent 70%),
      radial-gradient(ellipse 25% 30% at 60% 45%, rgba(255, 165, 0, ${heatmapOpacity[0] * 0.5}) 0%, transparent 60%),
      radial-gradient(ellipse 20% 25% at 35% 65%, rgba(255, 255, 0, ${heatmapOpacity[0] * 0.4}) 0%, transparent 50%)
    `,
    mixBlendMode: 'multiply' as const,
  } : {};

  const maskStyle = showMask ? {
    background: `radial-gradient(ellipse 50% 60% at 50% 50%, rgba(0, 200, 150, 0.3) 0%, rgba(0, 200, 150, 0.1) 60%, transparent 80%)`,
    mixBlendMode: 'overlay' as const,
  } : {};

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Explainable AI Visualization</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant={showMask ? "default" : "outline"}
              size="sm"
              onClick={() => setShowMask(!showMask)}
              className="h-8 text-xs"
            >
              <Layers className="h-3 w-3 mr-1" />
              Mask
            </Button>
            <Button
              variant={showHeatmap ? "default" : "outline"}
              size="sm"
              onClick={() => setShowHeatmap(!showHeatmap)}
              className="h-8 text-xs"
            >
              {showHeatmap ? <Eye className="h-3 w-3 mr-1" /> : <EyeOff className="h-3 w-3 mr-1" />}
              Grad-CAM
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Image Viewer */}
        <div className="relative bg-muted/50 rounded-xl overflow-hidden border border-border">
          <motion.div
            className="aspect-square w-full flex items-center justify-center p-4"
            animate={{ scale: zoom }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="relative w-full h-full">
              <img
                src={originalImage}
                alt="X-ray with analysis"
                className="w-full h-full object-contain rounded-lg"
              />
              {/* Heatmap Overlay */}
              {showHeatmap && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 rounded-lg pointer-events-none"
                  style={heatmapStyle}
                />
              )}
              {/* Mask Overlay */}
              {showMask && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 rounded-lg pointer-events-none"
                  style={maskStyle}
                />
              )}
            </div>
          </motion.div>

          {/* Zoom Controls */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-background/80 backdrop-blur-sm rounded-lg p-1 shadow-md">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setZoom(1)}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="px-2 text-xs font-medium text-muted-foreground min-w-[3rem] text-center">
              {(zoom * 100).toFixed(0)}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setZoom(Math.min(2, zoom + 0.25))}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Controls */}
        {showHeatmap && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Heatmap Intensity</label>
              <span className="text-sm text-muted-foreground">{(heatmapOpacity[0] * 100).toFixed(0)}%</span>
            </div>
            <Slider
              value={heatmapOpacity}
              onValueChange={setHeatmapOpacity}
              min={0}
              max={1}
              step={0.05}
              className="w-full"
            />
          </motion.div>
        )}

        {/* Legend */}
        <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-300" />
            <span className="text-xs text-muted-foreground">Low attention</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-300" />
            <span className="text-xs text-muted-foreground">Medium attention</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-red-500 to-red-300" />
            <span className="text-xs text-muted-foreground">High attention</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
