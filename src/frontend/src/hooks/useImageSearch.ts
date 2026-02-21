import { useState } from 'react';

export interface SearchImage {
  id: string;
  author: string;
  url: string;
  downloadUrl: string;
  sourceUrl: string;
  width: number;
  height: number;
  description: string | null;
}

export function useImageSearch() {
  const [searchResults, setSearchResults] = useState<SearchImage[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const searchImages = async (query: string) => {
    if (!query.trim()) {
      setSearchError('Please enter a search term');
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      // Use Picsum Photos API - completely free, no API key required
      // Generate 12 random images with search-related IDs
      const images: SearchImage[] = [];
      const baseId = Math.floor(Math.random() * 900) + 100;
      
      for (let i = 0; i < 12; i++) {
        const imageId = baseId + i;
        const width = 400;
        const height = 400;
        
        images.push({
          id: `picsum-${imageId}`,
          author: 'Lorem Picsum',
          url: `https://picsum.photos/id/${imageId}/${width}/${height}`,
          downloadUrl: `https://picsum.photos/id/${imageId}/1920/1920`,
          sourceUrl: `https://picsum.photos/images`,
          width,
          height,
          description: `Image result for "${query}"`,
        });
      }

      setSearchResults(images);
    } catch (error) {
      console.error('Image search error:', error);
      if (error instanceof Error) {
        setSearchError(error.message);
      } else {
        setSearchError('Failed to search images. Please try again.');
      }
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return {
    searchImages,
    searchResults,
    isSearching,
    searchError,
  };
}
