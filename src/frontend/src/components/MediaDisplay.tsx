import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Image, Video, Sparkles, Loader2, Upload } from 'lucide-react';
import { useMediaGeneration } from '../hooks/useMediaGeneration';
import { Progress } from '@/components/ui/progress';

export function MediaDisplay() {
  const [imagePrompt, setImagePrompt] = useState('');
  const [videoPrompt, setVideoPrompt] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const {
    generatedImages,
    generatedVideos,
    generateImage,
    generateVideo,
    isGeneratingImage,
    isGeneratingVideo,
  } = useMediaGeneration();

  const handleGenerateImage = () => {
    if (imagePrompt.trim()) {
      generateImage(imagePrompt);
      setImagePrompt('');
    }
  };

  const handleGenerateVideo = () => {
    if (videoPrompt.trim()) {
      generateVideo(videoPrompt);
      setVideoPrompt('');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            AI Media Generator
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Generate images and videos using AI or upload your own media
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="images" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-auto min-h-[44px]">
              <TabsTrigger value="images" className="gap-2 min-h-[44px] text-xs sm:text-sm">
                <Image className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Images</span>
              </TabsTrigger>
              <TabsTrigger value="videos" className="gap-2 min-h-[44px] text-xs sm:text-sm">
                <Video className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Videos</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="images" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Textarea
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  placeholder="Describe the image you want to generate..."
                  className="min-h-[80px] sm:min-h-[100px] text-sm sm:text-base"
                />
                <Button
                  onClick={handleGenerateImage}
                  disabled={isGeneratingImage || !imagePrompt.trim()}
                  className="w-full min-h-[44px]"
                >
                  {isGeneratingImage ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Image
                    </>
                  )}
                </Button>
              </div>

              {generatedImages.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-4">
                  {generatedImages.map((image, index) => (
                    <div key={index} className="space-y-2">
                      <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                        <img
                          src={image.url}
                          alt={image.prompt}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {image.prompt}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="videos" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Textarea
                  value={videoPrompt}
                  onChange={(e) => setVideoPrompt(e.target.value)}
                  placeholder="Describe the video you want to generate..."
                  className="min-h-[80px] sm:min-h-[100px] text-sm sm:text-base"
                />
                <Button
                  onClick={handleGenerateVideo}
                  disabled={isGeneratingVideo || !videoPrompt.trim()}
                  className="w-full min-h-[44px]"
                >
                  {isGeneratingVideo ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Video
                    </>
                  )}
                </Button>
              </div>

              {generatedVideos.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mt-4">
                  {generatedVideos.map((video, index) => (
                    <div key={index} className="space-y-2">
                      <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                        <video
                          src={video.url}
                          controls
                          className="w-full h-full"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {video.prompt}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="bg-accent/5 border-accent/20">
        <CardHeader>
          <CardTitle className="text-sm sm:text-base">Quick Prompts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              'A serene mountain landscape at sunset',
              'A futuristic city with flying cars',
              'A cute robot learning to paint',
              'An underwater coral reef scene',
            ].map((example) => (
              <Button
                key={example}
                variant="outline"
                size="sm"
                onClick={() => setImagePrompt(example)}
                className="justify-start text-left h-auto py-2 sm:py-3 min-h-[44px] text-xs sm:text-sm"
              >
                {example}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
