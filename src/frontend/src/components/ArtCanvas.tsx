import { useRef, useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Palette, Eraser, Trash2, Download, Share2, Sparkles, Send, Loader2, Check, Copy, X } from 'lucide-react';
import { useCanvasDrawing } from '../hooks/useCanvasDrawing';
import { useArtIdeaGenerator } from '../hooks/useArtIdeaGenerator';
import { useArtworkShare } from '../hooks/useArtworkShare';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const COLORS = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
  '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
];

export function ArtCanvas() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const {
    isDrawing,
    color,
    brushSize,
    isErasing,
    setColor,
    setBrushSize,
    setIsErasing,
    startDrawing,
    draw,
    stopDrawing,
    clearCanvas,
  } = useCanvasDrawing(canvasRef);

  const { messages, input, setInput, sendMessage, isGenerating } = useArtIdeaGenerator();
  const { shareArtwork, isSharing, shareSuccess, sharedArtworkId, copyShareUrl } = useArtworkShare();
  
  const [showShareUrl, setShowShareUrl] = useState(false);
  const [urlCopied, setUrlCopied] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = Math.min(500, window.innerHeight - 300);
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `artwork-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Artwork saved!');
    });
  };

  const handleShare = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    shareArtwork({ canvasRef });
  };

  const handleSendPrompt = () => {
    if (!input.trim()) return;
    sendMessage();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendPrompt();
    }
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 relative">
      {/* Close Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate({ to: '/' })}
        className="absolute top-0 right-0 z-10 h-10 w-10 rounded-full hover:bg-destructive/10 hover:text-destructive"
        aria-label="Close and return to main menu"
      >
        <X className="h-5 w-5" />
      </Button>

      <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Palette className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Art Canvas
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Draw your masterpiece and get AI-powered creative suggestions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Canvas */}
            <div ref={containerRef} className="border-2 border-border rounded-lg overflow-hidden bg-white">
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="touch-none cursor-crosshair w-full"
              />
            </div>

            {/* Controls */}
            <div className="space-y-4">
              {/* Color Palette */}
              <div className="space-y-2">
                <Label className="text-xs sm:text-sm">Color</Label>
                <div className="flex gap-2 flex-wrap">
                  {COLORS.map((colorOption) => (
                    <button
                      key={colorOption}
                      onClick={() => {
                        setColor(colorOption);
                        setIsErasing(false);
                      }}
                      className={`w-10 h-10 sm:w-8 sm:h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                        color === colorOption && !isErasing ? 'border-primary scale-110' : 'border-border'
                      }`}
                      style={{ backgroundColor: colorOption }}
                      aria-label={`Select color ${colorOption}`}
                    />
                  ))}
                </div>
              </div>

              {/* Brush Size */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs sm:text-sm">Brush Size</Label>
                  <span className="text-xs sm:text-sm font-mono">{brushSize}px</span>
                </div>
                <Slider
                  value={[brushSize]}
                  onValueChange={(v) => setBrushSize(v[0])}
                  min={1}
                  max={50}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={isErasing ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setIsErasing(!isErasing)}
                  className="min-h-[44px]"
                >
                  <Eraser className="h-4 w-4 mr-2" />
                  Eraser
                </Button>
                <Button variant="outline" size="sm" onClick={clearCanvas} className="min-h-[44px]">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear
                </Button>
                <Button variant="outline" size="sm" onClick={handleSave} className="min-h-[44px]">
                  <Download className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" size="sm" onClick={handleShare} disabled={isSharing} className="min-h-[44px]">
                  {isSharing ? (
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <Share2 className="h-4 w-4 mr-2" />
                  )}
                  Share
                </Button>
              </div>

              {showShareUrl && sharedArtworkId && (
                <div className="p-3 sm:p-4 bg-success/10 border border-success/20 rounded-lg space-y-2">
                  <p className="text-xs sm:text-sm font-semibold text-success">Artwork Shared Successfully!</p>
                  <div className="flex gap-2">
                    <Input
                      value={`${window.location.origin}/shared/${sharedArtworkId}`}
                      readOnly
                      className="flex-1 text-xs sm:text-sm"
                    />
                    <Button onClick={handleCopyUrl} size="sm" variant="outline" className="min-h-[44px]">
                      {urlCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Chat Panel */}
      <div className="lg:col-span-1">
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Sparkles className="h-4 w-4 text-accent" />
              AI Art Ideas
            </CardTitle>
            <CardDescription className="text-xs">
              Get creative suggestions and inspiration
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col space-y-3 min-h-0">
            <ScrollArea className="flex-1 pr-3">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center space-y-2 p-4">
                    <Sparkles className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground mx-auto" />
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Ask for drawing ideas or inspiration
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-2 sm:p-3 rounded-lg ${
                        message.isUser
                          ? 'bg-primary/20 ml-4'
                          : 'bg-muted mr-4'
                      }`}
                    >
                      <p className="text-xs sm:text-sm break-words">{message.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            <div className="space-y-2 pt-2 border-t">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g., Give me ideas for drawing a sunset..."
                className="min-h-[60px] text-xs sm:text-sm resize-none"
                rows={2}
              />
              <Button
                onClick={handleSendPrompt}
                disabled={isGenerating || !input.trim()}
                size="sm"
                className="w-full min-h-[44px]"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                    Thinking...
                  </>
                ) : (
                  <>
                    <Send className="h-3 w-3 mr-2" />
                    Get Ideas
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
