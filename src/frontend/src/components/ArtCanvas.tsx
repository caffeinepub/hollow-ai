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
    }, 'image/png');
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
    <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Canvas Area */}
      <div className="lg:col-span-2 space-y-4">
        <Card className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              Drawing Canvas
            </h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                title="Save artwork"
              >
                <Download className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                disabled={isSharing}
                title="Share artwork"
              >
                {isSharing ? (
                  <>
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Sharing...
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </>
                )}
              </Button>
              <Button
                variant={isErasing ? 'default' : 'outline'}
                size="sm"
                onClick={() => setIsErasing(!isErasing)}
              >
                <Eraser className="h-4 w-4 mr-2" />
                Eraser
              </Button>
              <Button variant="outline" size="sm" onClick={clearCanvas}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>

          {showShareUrl && sharedArtworkId && (
            <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg space-y-2">
              <p className="text-sm font-semibold text-foreground">Share your artwork:</p>
              <div className="flex gap-2">
                <Input
                  value={`${window.location.origin}/shared/art/${sharedArtworkId}`}
                  readOnly
                  className="flex-1 text-sm"
                />
                <Button
                  size="sm"
                  onClick={handleCopyUrl}
                  variant={urlCopied ? 'default' : 'outline'}
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

          <Separator />

          {/* Color Palette */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Color</Label>
            <div className="grid grid-cols-12 gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setColor(c);
                    setIsErasing(false);
                  }}
                  className={cn(
                    'w-8 h-8 rounded-md border-2 transition-all hover:scale-110',
                    color === c && !isErasing ? 'border-primary ring-2 ring-primary/50' : 'border-border'
                  )}
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
          </div>

          {/* Brush Size */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Brush Size</Label>
              <span className="text-sm text-muted-foreground">{brushSize}px</span>
            </div>
            <Slider
              value={[brushSize]}
              onValueChange={(value) => setBrushSize(value[0])}
              min={1}
              max={50}
              step={1}
              className="w-full"
            />
          </div>

          {/* Canvas */}
          <div className="border-2 border-border rounded-lg overflow-hidden bg-white">
            <canvas
              ref={canvasRef}
              width={800}
              height={500}
              className="w-full cursor-crosshair touch-none"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
          </div>
        </Card>
      </div>

      {/* AI Idea Generator Chat */}
      <div className="lg:col-span-1">
        <Card className="h-full flex flex-col">
          <div className="p-4 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              Art Ideas
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Ask for drawing inspiration
            </p>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <Sparkles className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Ask me for drawing ideas and inspiration!
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      'p-3 rounded-lg text-sm',
                      message.isUser
                        ? 'bg-primary text-primary-foreground ml-4'
                        : 'bg-card border border-border mr-4'
                    )}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <p
                      className={cn(
                        'text-xs mt-1',
                        message.isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
                      )}
                    >
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="What should I draw?"
                disabled={isGenerating}
                className="flex-1"
              />
              <Button
                onClick={handleSendIdea}
                disabled={!input.trim() || isGenerating}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
