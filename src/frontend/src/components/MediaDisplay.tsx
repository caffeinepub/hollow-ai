import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Image, Video, Loader2, Download, X, Info, Search, ExternalLink, Play } from 'lucide-react';
import { useImageSearch } from '../hooks/useImageSearch';
import { useVideoSearch } from '../hooks/useVideoSearch';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export function MediaDisplay() {
  const navigate = useNavigate();
  const [imageSearchQuery, setImageSearchQuery] = useState('');
  const [videoSearchQuery, setVideoSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'images' | 'videos'>('images');
  
  const { searchImages, searchResults: imageResults, isSearching: isSearchingImages, searchError: imageSearchError } = useImageSearch();
  const { searchVideos, searchResults: videoResults, isSearching: isSearchingVideos, searchError: videoSearchError } = useVideoSearch();

  // Auto-search for images when query changes
  useEffect(() => {
    if (activeTab !== 'images' || !imageSearchQuery.trim()) {
      return;
    }

    const timeoutId = setTimeout(() => {
      searchImages(imageSearchQuery).catch(() => {
        // Error handling is done in the hook
      });
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [imageSearchQuery, activeTab]);

  // Auto-search for videos when query changes
  useEffect(() => {
    if (activeTab !== 'videos' || !videoSearchQuery.trim()) {
      return;
    }

    const timeoutId = setTimeout(() => {
      searchVideos(videoSearchQuery).catch(() => {
        // Error handling is done in the hook
      });
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [videoSearchQuery, activeTab]);

  const handleDownloadImage = (url: string, index: number) => {
    fetch(url)
      .then(res => res.blob())
      .then(blob => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `image-${index + 1}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
        toast.success('Image downloaded!');
      })
      .catch(() => {
        toast.error('Failed to download image');
      });
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4 sm:space-y-6 relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate({ to: '/' })}
        className="absolute top-0 right-0 z-10 h-10 w-10 rounded-full hover:bg-destructive/10 hover:text-destructive"
        aria-label="Close and return to main menu"
      >
        <X className="h-5 w-5" />
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Search className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            Media Search
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Search for real images and videos from the web - no API key required!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4 border-primary/20 bg-primary/5">
            <Info className="h-4 w-4 text-primary" />
            <AlertDescription className="text-xs sm:text-sm">
              <strong>Real web search:</strong> Find actual images and videos matching your search terms instantly!
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="images" className="w-full" onValueChange={(value) => setActiveTab(value as 'images' | 'videos')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="images" className="text-xs sm:text-sm">
                <Image className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Image Search
              </TabsTrigger>
              <TabsTrigger value="videos" className="text-xs sm:text-sm">
                <Video className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Video Search
              </TabsTrigger>
            </TabsList>

            <TabsContent value="images" className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="Search for images... (e.g., 'nature', 'city', 'people', 'animals', 'sunset')"
                  value={imageSearchQuery}
                  onChange={(e) => setImageSearchQuery(e.target.value)}
                  className="text-xs sm:text-sm"
                />
                {isSearchingImages && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Searching for real images...
                  </div>
                )}
              </div>

              {imageSearchError && (
                <Alert variant="destructive">
                  <AlertDescription className="text-xs sm:text-sm">
                    {imageSearchError}
                  </AlertDescription>
                </Alert>
              )}

              {imageResults.length > 0 ? (
                <>
                  <Alert className="border-muted bg-muted/20">
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      Images from <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="underline font-medium">Unsplash</a> - high-quality photos matching your search term.
                    </AlertDescription>
                  </Alert>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {imageResults.map((image, index) => (
                      <Card key={image.id} className="overflow-hidden">
                        <div className="relative aspect-square">
                          <img
                            src={image.url}
                            alt={image.description || `Image ${index + 1}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <CardContent className="p-2 sm:p-3 space-y-2">
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              Photo by <span className="font-medium">{image.author}</span>
                            </p>
                            {image.description && (
                              <p className="text-xs text-muted-foreground/80 line-clamp-2">
                                {image.description}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownloadImage(image.downloadUrl, index)}
                              className="flex-1 text-xs"
                            >
                              <Download className="mr-1 sm:mr-2 h-3 w-3" />
                              Download
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => window.open(image.sourceUrl, '_blank')}
                              className="flex-1 text-xs"
                              title="View source"
                            >
                              <ExternalLink className="mr-1 sm:mr-2 h-3 w-3" />
                              Source
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8 sm:py-12 text-muted-foreground">
                  <Search className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 opacity-50" />
                  <p className="text-xs sm:text-sm font-medium">Search for real images from the web</p>
                  <p className="text-xs mt-1 sm:mt-2">Enter a search term to find actual photos matching your query</p>
                  <p className="text-xs mt-2 text-muted-foreground/60">Try: "nature", "city", "people", "animals", "sunset"</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="videos" className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="Search for videos... (e.g., 'nature', 'animals', 'sports', 'technology', 'city')"
                  value={videoSearchQuery}
                  onChange={(e) => setVideoSearchQuery(e.target.value)}
                  className="text-xs sm:text-sm"
                />
                {isSearchingVideos && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Searching for relevant videos...
                  </div>
                )}
              </div>

              {videoSearchError && (
                <Alert variant="destructive">
                  <AlertDescription className="text-xs sm:text-sm">
                    {videoSearchError}
                  </AlertDescription>
                </Alert>
              )}

              {videoResults.length > 0 ? (
                <>
                  <Alert className="border-muted bg-muted/20">
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      Videos curated and matched to your search term - free to use and share.
                    </AlertDescription>
                  </Alert>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {videoResults.map((video, index) => (
                      <Card key={video.id} className="overflow-hidden">
                        <div className="relative aspect-video group cursor-pointer" onClick={() => setSelectedVideo(video.url)}>
                          <img
                            src={video.thumbnailUrl}
                            alt={video.description || `Video ${index + 1}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                            <div className="bg-white/90 rounded-full p-3 sm:p-4 group-hover:scale-110 transition-transform">
                              <Play className="h-6 w-6 sm:h-8 sm:w-8 text-primary" fill="currentColor" />
                            </div>
                          </div>
                          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            {formatDuration(video.duration)}
                          </div>
                        </div>
                        <CardContent className="p-2 sm:p-3 space-y-2">
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              By <span className="font-medium">{video.author}</span>
                            </p>
                            {video.description && (
                              <p className="text-xs text-muted-foreground/80 line-clamp-2">
                                {video.description}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedVideo(video.url)}
                              className="flex-1 text-xs"
                            >
                              <Play className="mr-1 sm:mr-2 h-3 w-3" />
                              Play
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => window.open(video.sourceUrl, '_blank')}
                              className="flex-1 text-xs"
                              title="View source"
                            >
                              <ExternalLink className="mr-1 sm:mr-2 h-3 w-3" />
                              Source
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8 sm:py-12 text-muted-foreground">
                  <Video className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 opacity-50" />
                  <p className="text-xs sm:text-sm font-medium">Search for relevant videos</p>
                  <p className="text-xs mt-1 sm:mt-2">Enter a search term to find videos matching your query</p>
                  <p className="text-xs mt-2 text-muted-foreground/60">Try: "nature", "animals", "sports", "technology", "city"</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={!!selectedVideo} onOpenChange={(open) => !open && setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Video Preview</DialogTitle>
          </DialogHeader>
          {selectedVideo && (
            <div className="aspect-video">
              <video
                src={selectedVideo}
                controls
                autoPlay
                className="w-full h-full rounded-lg"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
