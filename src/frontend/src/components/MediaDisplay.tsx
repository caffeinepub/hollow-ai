import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Image, Video, Upload, Loader2, Sparkles } from 'lucide-react';
import { useMediaGeneration } from '../hooks/useMediaGeneration';

export function MediaDisplay() {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imagePrompt, setImagePrompt] = useState('');
  const [videoPrompt, setVideoPrompt] = useState('');

  const { generateImage, generateVideo, generatedImages, generatedVideos, isGeneratingImage, isGeneratingVideo } = useMediaGeneration();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadingImage(false);
          return 0;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingVideo(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadingVideo(false);
          return 0;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) return;
    await generateImage(imagePrompt);
    setImagePrompt('');
  };

  const handleGenerateVideo = async () => {
    if (!videoPrompt.trim()) return;
    await generateVideo(videoPrompt);
    setVideoPrompt('');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5 text-primary" />
            Media Gallery
          </CardTitle>
          <CardDescription>
            Generate AI images and videos or upload your own educational media
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="images" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="images">Images</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
            </TabsList>

            <TabsContent value="images" className="space-y-4 mt-4">
              {/* AI Image Generation */}
              <Card className="border-primary/30 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    AI Image Generation
                  </CardTitle>
                  <CardDescription>
                    Describe the image you want to create
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={imagePrompt}
                      onChange={(e) => setImagePrompt(e.target.value)}
                      placeholder="e.g., A colorful diagram of the solar system"
                      className="flex-1"
                      disabled={isGeneratingImage}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleGenerateImage();
                        }
                      }}
                    />
                    <Button
                      onClick={handleGenerateImage}
                      disabled={!imagePrompt.trim() || isGeneratingImage}
                      className="gap-2"
                    >
                      {isGeneratingImage ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          Generate
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Upload Section */}
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Image className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-4">
                  Or upload your own images
                </p>
                <label htmlFor="image-upload">
                  <Button asChild disabled={uploadingImage}>
                    <span className="cursor-pointer">
                      {uploadingImage ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading {uploadProgress}%
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Image
                        </>
                      )}
                    </span>
                  </Button>
                </label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                />
              </div>

              {/* Generated Images Gallery */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {generatedImages.length > 0 ? (
                  generatedImages.map((img, index) => (
                    <Card key={index} className="overflow-hidden">
                      <div className="aspect-square bg-muted flex items-center justify-center relative">
                        <img
                          src={img.url}
                          alt={img.prompt}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-3">
                        <p className="text-xs text-muted-foreground line-clamp-2">{img.prompt}</p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="overflow-hidden">
                    <div className="aspect-square bg-muted flex items-center justify-center">
                      <Image className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <CardContent className="p-3">
                      <p className="text-sm text-muted-foreground">No images yet</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="videos" className="space-y-4 mt-4">
              {/* AI Video Generation */}
              <Card className="border-accent/30 bg-accent/5">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-accent" />
                    AI Video Generation
                  </CardTitle>
                  <CardDescription>
                    Describe the animated video you want to create
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={videoPrompt}
                      onChange={(e) => setVideoPrompt(e.target.value)}
                      placeholder="e.g., An animated explanation of photosynthesis"
                      className="flex-1"
                      disabled={isGeneratingVideo}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleGenerateVideo();
                        }
                      }}
                    />
                    <Button
                      onClick={handleGenerateVideo}
                      disabled={!videoPrompt.trim() || isGeneratingVideo}
                      className="gap-2"
                    >
                      {isGeneratingVideo ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          Generate
                        </>
                      )}
                    </Button>
                  </div>
                  {isGeneratingVideo && (
                    <p className="text-xs text-muted-foreground">
                      Video generation may take a moment...
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Upload Section */}
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-4">
                  Or upload your own videos
                </p>
                <label htmlFor="video-upload">
                  <Button asChild disabled={uploadingVideo}>
                    <span className="cursor-pointer">
                      {uploadingVideo ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading {uploadProgress}%
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Video
                        </>
                      )}
                    </span>
                  </Button>
                </label>
                <input
                  id="video-upload"
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={handleVideoUpload}
                  disabled={uploadingVideo}
                />
              </div>

              {/* Generated Videos Gallery */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {generatedVideos.length > 0 ? (
                  generatedVideos.map((vid, index) => (
                    <Card key={index} className="overflow-hidden">
                      <div className="aspect-video bg-muted flex items-center justify-center relative">
                        <video
                          src={vid.url}
                          controls
                          className="w-full h-full object-cover"
                        >
                          Your browser does not support the video tag.
                        </video>
                      </div>
                      <CardContent className="p-3">
                        <p className="text-xs text-muted-foreground line-clamp-2">{vid.prompt}</p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="overflow-hidden">
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      <Video className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <CardContent className="p-3">
                      <p className="text-sm text-muted-foreground">No videos yet</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="bg-accent/5 border-accent/20">
        <CardHeader>
          <CardTitle className="text-base">About AI Media Generation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Use AI to generate educational images and animated videos based on your descriptions. 
            All generated media is stored securely and can be accessed anytime from your gallery.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

