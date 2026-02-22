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

  // Curated free video sources organized by category with metadata
  const videoDatabase = {
    nature: [
      { url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', keywords: ['nature', 'forest', 'wildlife', 'outdoor', 'green', 'tree', 'animal', 'bunny', 'rabbit'], desc: 'Forest Wildlife', duration: 596 },
      { url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', keywords: ['nature', 'dream', 'fantasy', 'elephant', 'animal', 'wildlife'], desc: 'Nature Documentary', duration: 653 },
      { url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', keywords: ['nature', 'landscape', 'escape', 'outdoor', 'scenic', 'mountain', 'sky'], desc: 'Natural Landscapes', duration: 15 },
    ],
    animals: [
      { url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', keywords: ['animal', 'wildlife', 'bunny', 'rabbit', 'pet', 'cute', 'creature'], desc: 'Wildlife Animals', duration: 596 },
      { url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', keywords: ['animal', 'elephant', 'wildlife', 'mammal', 'creature'], desc: 'Animal Kingdom', duration: 653 },
    ],
    technology: [
      { url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', keywords: ['tech', 'technology', 'computer', 'digital', 'innovation', 'electronic', 'device'], desc: 'Tech Innovation', duration: 15 },
      { url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', keywords: ['tech', 'technology', 'digital', 'fun', 'entertainment', 'gadget'], desc: 'Digital Technology', duration: 60 },
    ],
    sports: [
      { url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', keywords: ['sport', 'action', 'game', 'athletic', 'active', 'exercise', 'joyride'], desc: 'Action Sports', duration: 15 },
      { url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4', keywords: ['sport', 'extreme', 'action', 'car', 'racing', 'offroad'], desc: 'Extreme Sports', duration: 30 },
    ],
    city: [
      { url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', keywords: ['city', 'urban', 'building', 'architecture', 'downtown', 'street', 'skyline'], desc: 'Urban Cityscape', duration: 15 },
      { url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', keywords: ['city', 'night', 'urban', 'lights', 'downtown', 'nightlife'], desc: 'City Lights', duration: 15 },
    ],
    people: [
      { url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', keywords: ['people', 'person', 'human', 'portrait', 'lifestyle', 'social', 'fun'], desc: 'People & Lifestyle', duration: 60 },
      { url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4', keywords: ['people', 'person', 'human', 'story', 'drama', 'character', 'group'], desc: 'Human Stories', duration: 888 },
    ],
    travel: [
      { url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', keywords: ['travel', 'trip', 'adventure', 'journey', 'vacation', 'explore', 'escape'], desc: 'Travel Adventures', duration: 15 },
      { url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4', keywords: ['travel', 'road', 'trip', 'journey', 'adventure', 'drive'], desc: 'Road Trip', duration: 30 },
    ],
    car: [
      { url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4', keywords: ['car', 'vehicle', 'auto', 'automobile', 'drive', 'suv', 'offroad'], desc: 'Automotive Excellence', duration: 30 },
      { url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4', keywords: ['car', 'vehicle', 'auto', 'sports', 'review', 'drive', 'performance'], desc: 'Sports Car Review', duration: 30 },
      { url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4', keywords: ['car', 'racing', 'vehicle', 'speed', 'race', 'fast'], desc: 'Racing Action', duration: 30 },
    ],
  };

  const searchVideos = async (query: string) => {
    if (!query.trim()) {
      setSearchError('Please enter a search term');
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const searchTerm = query.toLowerCase().trim();
      const searchWords = searchTerm.split(/\s+/);
      
      // Collect all videos with their relevance scores
      const scoredVideos: Array<{ video: any; score: number; category: string }> = [];
      
      // Score each video based on keyword matches
      for (const [category, videos] of Object.entries(videoDatabase)) {
        for (const video of videos) {
          let score = 0;
          
          // Check each search word against video keywords and description
          for (const searchWord of searchWords) {
            // Exact keyword match
            if (video.keywords.some(keyword => keyword === searchWord)) {
              score += 10;
            }
            // Partial keyword match
            else if (video.keywords.some(keyword => keyword.includes(searchWord) || searchWord.includes(keyword))) {
              score += 5;
            }
            // Description match
            if (video.desc.toLowerCase().includes(searchWord)) {
              score += 3;
            }
            // Category match
            if (category.includes(searchWord) || searchWord.includes(category)) {
              score += 2;
            }
          }
          
          // Only include videos with some relevance
          if (score > 0) {
            scoredVideos.push({ video, score, category });
          }
        }
      }
      
      // Sort by score (highest first) and take top 12
      scoredVideos.sort((a, b) => b.score - a.score);
      const topVideos = scoredVideos.slice(0, 12);
      
      // If no matches found, show a diverse selection from all categories
      if (topVideos.length === 0) {
        const allVideos = Object.values(videoDatabase).flat();
        const shuffled = [...allVideos].sort(() => Math.random() - 0.5).slice(0, 12);
        
        const videos: SearchVideo[] = shuffled.map((video, index) => ({
          id: `video-${searchTerm}-${index}`,
          author: 'Free Video Source',
          url: video.url,
          thumbnailUrl: `https://source.unsplash.com/400x300/?${encodeURIComponent(searchTerm)}&sig=${index}`,
          sourceUrl: 'https://goo.gl/vjxQVl',
          width: 1280,
          height: 720,
          duration: video.duration,
          description: `${video.desc} - Related to "${query}"`,
        }));
        
        setSearchResults(videos);
        return;
      }
      
      // Map scored videos to SearchVideo format with relevant thumbnails
      const videos: SearchVideo[] = topVideos.map((item, index) => {
        // Use the most relevant keyword for thumbnail
        const relevantKeyword = item.video.keywords[0] || searchTerm;
        
        return {
          id: `video-${searchTerm}-${index}`,
          author: 'Free Video Source',
          url: item.video.url,
          thumbnailUrl: `https://source.unsplash.com/400x300/?${encodeURIComponent(relevantKeyword)}&sig=${index}`,
          sourceUrl: 'https://goo.gl/vjxQVl',
          width: 1280,
          height: 720,
          duration: item.video.duration,
          description: `${item.video.desc} - Matches "${query}" (${item.category})`,
        };
      });

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
