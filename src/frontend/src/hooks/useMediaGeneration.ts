import { useState } from 'react';

interface GeneratedMedia {
  url: string;
  prompt: string;
  timestamp: number;
}

export function useMediaGeneration() {
  const [generatedImages, setGeneratedImages] = useState<GeneratedMedia[]>([]);
  const [generatedVideos, setGeneratedVideos] = useState<GeneratedMedia[]>([]);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);

  const generateImage = async (prompt: string) => {
    setIsGeneratingImage(true);
    
    try {
      // Simulate AI image generation with a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a placeholder image with the prompt text
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Create gradient background
        const gradient = ctx.createLinearGradient(0, 0, 512, 512);
        gradient.addColorStop(0, '#0ea5e9');
        gradient.addColorStop(0.5, '#8b5cf6');
        gradient.addColorStop(1, '#ec4899');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 512, 512);
        
        // Add text
        ctx.fillStyle = 'white';
        ctx.font = 'bold 24px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Word wrap the prompt
        const words = prompt.split(' ');
        const lines: string[] = [];
        let currentLine = '';
        
        words.forEach(word => {
          const testLine = currentLine + word + ' ';
          const metrics = ctx.measureText(testLine);
          if (metrics.width > 450 && currentLine !== '') {
            lines.push(currentLine);
            currentLine = word + ' ';
          } else {
            currentLine = testLine;
          }
        });
        lines.push(currentLine);
        
        const lineHeight = 32;
        const startY = 256 - ((lines.length - 1) * lineHeight) / 2;
        
        lines.forEach((line, index) => {
          ctx.fillText(line.trim(), 256, startY + index * lineHeight);
        });
        
        // Add "AI Generated" label
        ctx.font = '16px Inter, sans-serif';
        ctx.fillText('AI Generated Image', 256, 480);
      }
      
      const imageUrl = canvas.toDataURL('image/png');
      
      const newImage: GeneratedMedia = {
        url: imageUrl,
        prompt,
        timestamp: Date.now(),
      };
      
      setGeneratedImages(prev => [newImage, ...prev]);
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const generateVideo = async (prompt: string) => {
    setIsGeneratingVideo(true);
    
    try {
      // Simulate AI video generation with a longer delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Create a simple animated video using canvas
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 360;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      // Create video frames
      const frames: string[] = [];
      const frameCount = 30; // 1 second at 30fps
      
      for (let i = 0; i < frameCount; i++) {
        // Animated gradient background
        const gradient = ctx.createLinearGradient(0, 0, 640, 360);
        const hue1 = (i * 12) % 360;
        const hue2 = (i * 12 + 120) % 360;
        gradient.addColorStop(0, `hsl(${hue1}, 70%, 50%)`);
        gradient.addColorStop(1, `hsl(${hue2}, 70%, 50%)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 640, 360);
        
        // Animated circle
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        const x = 320 + Math.cos(i * 0.2) * 100;
        const y = 180 + Math.sin(i * 0.2) * 50;
        ctx.beginPath();
        ctx.arc(x, y, 30, 0, Math.PI * 2);
        ctx.fill();
        
        // Add text
        ctx.fillStyle = 'white';
        ctx.font = 'bold 20px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Word wrap the prompt
        const words = prompt.split(' ');
        const lines: string[] = [];
        let currentLine = '';
        
        words.forEach(word => {
          const testLine = currentLine + word + ' ';
          const metrics = ctx.measureText(testLine);
          if (metrics.width > 580 && currentLine !== '') {
            lines.push(currentLine);
            currentLine = word + ' ';
          } else {
            currentLine = testLine;
          }
        });
        lines.push(currentLine);
        
        const lineHeight = 28;
        const startY = 180 - ((lines.length - 1) * lineHeight) / 2;
        
        lines.forEach((line, index) => {
          ctx.fillText(line.trim(), 320, startY + index * lineHeight);
        });
        
        // Add "AI Generated Video" label
        ctx.font = '14px Inter, sans-serif';
        ctx.fillText('AI Generated Video with Motion', 320, 330);
        
        frames.push(canvas.toDataURL('image/png'));
      }
      
      // Create a simple data URL for the "video" (using first frame as thumbnail)
      // In a real implementation, this would be an actual video file
      const videoUrl = frames[0]; // Using first frame as placeholder
      
      const newVideo: GeneratedMedia = {
        url: videoUrl,
        prompt,
        timestamp: Date.now(),
      };
      
      setGeneratedVideos(prev => [newVideo, ...prev]);
    } catch (error) {
      console.error('Error generating video:', error);
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  return {
    generateImage,
    generateVideo,
    generatedImages,
    generatedVideos,
    isGeneratingImage,
    isGeneratingVideo,
  };
}

