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
      // Use Unsplash Source API with search terms - completely free, no API key required
      // We'll fetch multiple images by using different random seeds
      const images: SearchImage[] = [];
      const searchTerm = encodeURIComponent(query.trim());
      
      // Generate 12 unique images using different seeds for variety
      for (let i = 0; i < 12; i++) {
        const seed = `${query}-${Date.now()}-${i}`;
        const width = 400;
        const height = 400;
        
        // Fetch the image with the search term - Unsplash will return relevant images
        // Using different sig values ensures we get different images for the same search
        const imageUrl = `https://source.unsplash.com/400x400/?${searchTerm}&sig=${Date.now()}-${i}`;
        
        try {
          // Fetch to get the final redirected URL
          const response = await fetch(imageUrl);
          const finalUrl = response.url;
          
          images.push({
            id: `unsplash-${seed}-${i}`,
            author: 'Unsplash Contributor',
            url: finalUrl,
            downloadUrl: finalUrl.replace(/\?.*$/, '?w=1920&q=80'),
            sourceUrl: 'https://unsplash.com',
            width,
            height,
            description: `${query} - Photo ${i + 1}`,
          });
        } catch (err) {
          console.error(`Failed to fetch image ${i}:`, err);
          // Fallback to direct URL if fetch fails
          images.push({
            id: `unsplash-fallback-${i}`,
            author: 'Unsplash Contributor',
            url: imageUrl,
            downloadUrl: imageUrl,
            sourceUrl: 'https://unsplash.com',
            width,
            height,
            description: `${query} - Photo ${i + 1}`,
          });
        }
      }

      if (images.length === 0) {
        throw new Error('No images found for your search term');
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
