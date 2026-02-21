import { useState } from 'react';

export interface SearchVideo {
  id: string;
  author: string;
  url: string;
  thumbnailUrl: string;
  sourceUrl: string;
  width: number;
  height: number;
  duration: number;
  description: string | null;
}

export function useVideoSearch() {
  const [searchResults, setSearchResults] = useState<SearchVideo[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const searchVideos = async (query: string) => {
    if (!query.trim()) {
      setSearchError('Please enter a search term');
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      // Use free sample videos from various sources
      // These are publicly available sample videos that don't require API keys
      const sampleVideos = [
        {
          id: 'sample-1',
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          thumbnail: 'https://picsum.photos/id/237/400/300',
          description: 'Big Buck Bunny - Sample Video',
          duration: 596,
        },
        {
          id: 'sample-2',
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          thumbnail: 'https://picsum.photos/id/1025/400/300',
          description: 'Elephants Dream - Sample Video',
          duration: 653,
        },
        {
          id: 'sample-3',
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          thumbnail: 'https://picsum.photos/id/10/400/300',
          description: 'For Bigger Blazes - Sample Video',
          duration: 15,
        },
        {
          id: 'sample-4',
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
          thumbnail: 'https://picsum.photos/id/20/400/300',
          description: 'For Bigger Escapes - Sample Video',
          duration: 15,
        },
        {
          id: 'sample-5',
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
          thumbnail: 'https://picsum.photos/id/30/400/300',
          description: 'For Bigger Fun - Sample Video',
          duration: 60,
        },
        {
          id: 'sample-6',
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
          thumbnail: 'https://picsum.photos/id/40/400/300',
          description: 'For Bigger Joyrides - Sample Video',
          duration: 15,
        },
        {
          id: 'sample-7',
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
          thumbnail: 'https://picsum.photos/id/50/400/300',
          description: 'For Bigger Meltdowns - Sample Video',
          duration: 15,
        },
        {
          id: 'sample-8',
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
          thumbnail: 'https://picsum.photos/id/60/400/300',
          description: 'Sintel - Sample Video',
          duration: 888,
        },
        {
          id: 'sample-9',
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
          thumbnail: 'https://picsum.photos/id/70/400/300',
          description: 'Subaru Outback - Sample Video',
          duration: 30,
        },
        {
          id: 'sample-10',
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
          thumbnail: 'https://picsum.photos/id/80/400/300',
          description: 'Tears of Steel - Sample Video',
          duration: 734,
        },
        {
          id: 'sample-11',
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
          thumbnail: 'https://picsum.photos/id/90/400/300',
          description: 'Volkswagen GTI Review - Sample Video',
          duration: 30,
        },
        {
          id: 'sample-12',
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
          thumbnail: 'https://picsum.photos/id/100/400/300',
          description: 'We Are Going On Bullrun - Sample Video',
          duration: 30,
        },
      ];

      // Shuffle and return videos to simulate search results
      const shuffled = [...sampleVideos].sort(() => Math.random() - 0.5);
      
      const videos: SearchVideo[] = shuffled.map((video) => ({
        id: video.id,
        author: 'Sample Videos',
        url: video.url,
        thumbnailUrl: video.thumbnail,
        sourceUrl: 'https://goo.gl/vjxQVl',
        width: 1280,
        height: 720,
        duration: video.duration,
        description: `${video.description} - Related to "${query}"`,
      }));

      setSearchResults(videos);
    } catch (error) {
      console.error('Video search error:', error);
      if (error instanceof Error) {
        setSearchError(error.message);
      } else {
        setSearchError('Failed to search videos. Please try again.');
      }
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return {
    searchVideos,
    searchResults,
    isSearching,
    searchError,
  };
}
