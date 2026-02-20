import { useRef, useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Eraser, Trash2, Send, Sparkles, Palette, Download, Share2, Check, Copy } from 'lucide-react';
import { useCanvasDrawing } from '../hooks/useCanvasDrawing';
import { useArtIdeaGenerator } from '../hooks/useArtIdeaGenerator';
import { useArtworkShare } from '../hooks/useArtworkShare';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function ArtCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    isDrawing,
    color,
    brushSize,
    setColor,
    setBrushSize,
    startDrawing,
    draw,
    stopDrawing,
    clearCanvas,
    isErasing,
    setIsErasing,
  } = useCanvasDrawing(canvasRef);

  const { messages, input, setInput, sendMessage, isGenerating } = useArtIdeaGenerator();
  const { shareArtwork, isSharing, shareSuccess, sharedArtworkId, copyShareUrl, reset } = useArtworkShare();
  const [showShareUrl, setShowShareUrl] = useState(false);
  const [urlCopied, setUrlCopied] = useState(false);

  const colors = [
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#45B7D1', // Blue
    '#FFA07A', // Coral
    '#98D8C8', // Mint
    '#F7DC6F', // Yellow
    '#BB8FCE', // Purple
    '#85C1E2', // Sky Blue
    '#F8B88B', // Peach
    '#FFFFFF', // White
    '#000000', // Black
    '#808080', // Gray
  ];

  const handleSendIdea = () => {
    if (input.trim()) {
      sendMessage();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendIdea();
    }
  };

  const handleSave = () => {
    if (!canvasRef.current) return;

    canvasRef.current.toBlob((blob) => {
      if (!blob) {
        toast.error('Failed to save artwork');
        return;
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `axora-art-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Artwork saved!');
    });
  };

  const handleShare = () => {
    shareArtwork({ canvasRef });
  };

  const handleCopyUrl = () => {
    if (sharedArtworkId) {
      copyShareUrl(sharedArtworkId);
      setUrlCopied(true);
      toast.success('Share link copied to clipboard!');
      setTimeout(() => setUrlCopied(false), 2000);
    }
  };

  useEffect(() => {
    if (shareSuccess && sharedArtworkId) {
      setShowShareUrl(true);
      toast.success('Artwork shared successfully!');
    }
  }, [shareSuccess, sharedArtworkId]);

  return (
    <div className="h-full flex flex-col lg:flex-row gap-3 sm:gap-4">
      {/* Canvas Area */}
      <div className="flex-1 flex flex-col gap-3 sm:gap-4 min-h-[400px] lg:min-h-0">
        <Card className="flex-1 p-3 sm:p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <h2 className="text-base sm:text-lg font-semibold text-foreground">Art Canvas</h2>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} size="sm" variant="outline" className="min-h-[44px]">
                <Download className="h-4 w-4" />
              </Button>
              <Button onClick={handleShare} size="sm" variant="outline" disabled={isSharing} className="min-h-[44px]">
                {isSharing ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <Share2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex-1 bg-white rounded-lg overflow-hidden touch-none">
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-full cursor-crosshair"
            />
          </div>

          {showShareUrl && sharedArtworkId && (
            <div className="mt-3 p-2 sm:p-3 bg-accent/10 border border-accent/20 rounded-lg space-y-2">
              <p className="text-xs sm:text-sm font-semibold text-foreground">Share your artwork:</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  value={`${window.location.origin}/shared/art/${sharedArtworkId}`}
                  readOnly
                  className="flex-1 text-xs sm:text-sm min-h-[44px]"
                />
                <Button
                  size="sm"
                  onClick={handleCopyUrl}
                  variant={urlCopied ? 'default' : 'outline'}
                  className="min-h-[44px]"
                >
                  {urlCopied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setColor(c);
                    setIsErasing(false);
                  }}
                  className={cn(
                    'w-full sm:w-10 h-10 rounded-lg border-2 transition-all min-h-[44px]',
                    color === c && !isErasing ? 'border-primary scale-110' : 'border-border'
                  )}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>

            <div className="space-y-2">
              <Label className="text-xs sm:text-sm">Brush Size: {brushSize}px</Label>
              <Slider
                value={[brushSize]}
                onValueChange={(v) => setBrushSize(v[0])}
                min={1}
                max={50}
                step={1}
                className="w-full"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={() => setIsErasing(!isErasing)}
                variant={isErasing ? 'default' : 'outline'}
                size="sm"
                className="flex-1 min-h-[44px]"
              >
                <Eraser className="h-4 w-4 mr-2" />
                Eraser
              </Button>
              <Button onClick={clearCanvas} variant="outline" size="sm" className="flex-1 min-h-[44px]">
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* AI Chat Panel */}
      <Card className="w-full lg:w-80 xl:w-96 flex flex-col h-[400px] lg:h-auto">
        <div className="p-3 sm:p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
            <h3 className="text-sm sm:text-base font-semibold text-foreground">AI Art Ideas</h3>
          </div>
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
            Get creative suggestions for your artwork
          </p>
        </div>

        <ScrollArea className="flex-1 p-3 sm:p-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-xs sm:text-sm text-muted-foreground text-center px-4">
                Ask for art ideas or inspiration!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    'p-2 sm:p-3 rounded-lg',
                    message.isUser
                      ? 'bg-primary text-primary-foreground ml-4'
                      : 'bg-muted mr-4'
                  )}
                >
                  <p className="text-xs sm:text-sm break-words">{message.content}</p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <Separator />

        <div className="p-3 sm:p-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask for art ideas..."
              className="flex-1 min-h-[44px] text-sm sm:text-base"
            />
            <Button
              onClick={handleSendIdea}
              disabled={isGenerating || !input.trim()}
              size="icon"
              className="shrink-0 min-h-[44px] min-w-[44px]"
            >
              {isGenerating ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
