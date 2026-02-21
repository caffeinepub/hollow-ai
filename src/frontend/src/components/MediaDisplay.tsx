import { useState } from 'react';
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
  
  const { searchImages, searchResults: imageResults, isSearching: isSearchingImages, searchError: imageSearchError } = useImageSearch();
  const { searchVideos, searchResults: videoResults, isSearching: isSearchingVideos, searchError: videoSearchError } = useVideoSearch();

  const handleSearchImages = async () => {
    if (!imageSearchQuery.trim()) return;
    
    try {
      await searchImages(imageSearchQuery);
      if (imageResults.length > 0) {
        toast.success(`Found ${imageResults.length} images!`);
      }
    } catch (error) {
      toast.error('Failed to search images');
    }
  };

  const handleSearchVideos = async () => {
    if (!videoSearchQuery.trim()) return;
    
    try {
      await searchVideos(videoSearchQuery);
      if (videoResults.length > 0) {
        toast.success(`Found ${videoResults.length} videos!`);
      }
    } catch (error) {
      toast.error('Failed to search videos');
    }
  };

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
            Search for images and videos from the web - no API key required!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4 border-primary/20 bg-primary/5">
            <Info className="h-4 w-4 text-primary" />
            <AlertDescription className="text-xs sm:text-sm">
              <strong>Free web search:</strong> Find images and videos instantly without any setup or authentication!
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="images" className="w-full">
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
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSearchImages();
                    }
                  }}
                />
                <Button
                  onClick={handleSearchImages}
                  disabled={!imageSearchQuery.trim() || isSearchingImages}
                  className="w-full text-xs sm:text-sm"
                >
                  {isSearchingImages ? (
                    <>
                      <Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                      Searching images...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      Search Images
                    </>
                  )}
                </Button>
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
                      Images provided by <a href="https://picsum.photos" target="_blank" rel="noopener noreferrer" className="underline font-medium">Lorem Picsum</a> - free placeholder images for your projects.
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
                  <p className="text-xs sm:text-sm font-medium">Search for images from the web</p>
                  <p className="text-xs mt-1 sm:mt-2">Enter a search term above to find high-quality photos</p>
                  <p className="text-xs mt-2 text-muted-foreground/60">Try: "nature", "city", "people", "animals", "sunset"</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="videos" className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="Search for videos... (e.g., 'nature', 'animals', 'sports', 'technology')"
                  value={videoSearchQuery}
                  onChange={(e) => setVideoSearchQuery(e.target.value)}
                  className="text-xs sm:text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSearchVideos();
                    }
                  }}
                />
                <Button
                  onClick={handleSearchVideos}
                  disabled={!videoSearchQuery.trim() || isSearchingVideos}
                  className="w-full text-xs sm:text-sm"
                >
                  {isSearchingVideos ? (
                    <>
                      <Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                      Searching videos...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      Search Videos
                    </>
                  )}
                </Button>
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
                      Sample videos from public sources - free to use for testing and development.
                    </AlertDescription>
                  </Alert>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {videoResults.map((video, index) => (
                      <Card key={video.id} className="overflow-hidden">
                        <div className="relative aspect-video bg-muted">
                          <img
                            src={video.thumbnailUrl}
                            alt={video.description || `Video ${index + 1}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors">
                            <Button
                              size="icon"
                              variant="secondary"
                              className="h-12 w-12 rounded-full"
                              onClick={() => setSelectedVideo(video.url)}
                            >
                              <Play className="h-6 w-6" />
                            </Button>
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
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedVideo(video.url)}
                            className="w-full text-xs"
                          >
                            <Play className="mr-1 sm:mr-2 h-3 w-3" />
                            Watch Video
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8 sm:py-12 text-muted-foreground">
                  <Video className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 opacity-50" />
                  <p className="text-xs sm:text-sm font-medium">Search for videos from the web</p>
                  <p className="text-xs mt-1 sm:mt-2">Enter a search term above to find sample videos</p>
                  <p className="text-xs mt-2 text-muted-foreground/60">Try: "nature", "animals", "sports", "technology"</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Video Player</DialogTitle>
          </DialogHeader>
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            {selectedVideo && (
              <video
                src={selectedVideo}
                controls
                autoPlay
                className="w-full h-full"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
