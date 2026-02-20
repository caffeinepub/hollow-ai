import { useState } from 'react';

interface Message {
  id: string;
  content: string;
  timestamp: number;
  isUser: boolean;
}

export function useArtIdeaGenerator() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateArtIdea = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();

    // Specific topic suggestions
    if (lowerInput.includes('animal') || lowerInput.includes('pet')) {
      const animals = [
        'a majestic lion with a flowing mane',
        'a playful dolphin jumping through waves',
        'a wise owl perched on a moonlit branch',
        'a colorful parrot in a tropical setting',
        'a curious cat exploring a garden',
      ];
      return animals[Math.floor(Math.random() * animals.length)];
    }

    if (lowerInput.includes('landscape') || lowerInput.includes('nature') || lowerInput.includes('scenery')) {
      const landscapes = [
        'a serene mountain lake at sunset with reflections',
        'a mystical forest with rays of light filtering through trees',
        'a peaceful beach scene with palm trees and gentle waves',
        'a vibrant autumn forest with colorful leaves',
        'a starry night sky over rolling hills',
      ];
      return landscapes[Math.floor(Math.random() * landscapes.length)];
    }

    if (lowerInput.includes('abstract') || lowerInput.includes('pattern')) {
      const abstracts = [
        'flowing geometric patterns with complementary colors',
        'swirling spirals and circles in warm tones',
        'angular shapes creating a sense of movement',
        'organic flowing lines inspired by nature',
        'a mandala design with intricate details',
      ];
      return abstracts[Math.floor(Math.random() * abstracts.length)];
    }

    if (lowerInput.includes('portrait') || lowerInput.includes('face') || lowerInput.includes('person')) {
      const portraits = [
        'an expressive face showing joy and wonder',
        'a profile silhouette with decorative patterns',
        'a character with unique hairstyle and accessories',
        'hands holding something meaningful',
        'eyes with intricate details and reflections',
      ];
      return portraits[Math.floor(Math.random() * portraits.length)];
    }

    if (lowerInput.includes('fantasy') || lowerInput.includes('magical') || lowerInput.includes('dragon')) {
      const fantasy = [
        'a friendly dragon with colorful scales',
        'a magical castle floating in the clouds',
        'a fairy garden with glowing mushrooms',
        'a phoenix rising from colorful flames',
        'a mystical tree with glowing leaves',
      ];
      return fantasy[Math.floor(Math.random() * fantasy.length)];
    }

    if (lowerInput.includes('space') || lowerInput.includes('planet') || lowerInput.includes('galaxy')) {
      const space = [
        'a colorful nebula with swirling cosmic dust',
        'planets aligned in a vibrant solar system',
        'an astronaut floating among the stars',
        'a rocket ship exploring distant galaxies',
        'a constellation forming a recognizable shape',
      ];
      return space[Math.floor(Math.random() * space.length)];
    }

    if (lowerInput.includes('flower') || lowerInput.includes('plant') || lowerInput.includes('garden')) {
      const flowers = [
        'a bouquet of wildflowers in various colors',
        'a single rose with detailed petals and dewdrops',
        'a field of sunflowers under a blue sky',
        'cherry blossoms on a delicate branch',
        'a cactus garden with blooming flowers',
      ];
      return flowers[Math.floor(Math.random() * flowers.length)];
    }

    if (lowerInput.includes('food') || lowerInput.includes('fruit')) {
      const food = [
        'a colorful fruit bowl with tropical fruits',
        'a steaming cup of coffee with latte art',
        'a slice of layered cake with decorations',
        'fresh vegetables in a market scene',
        'a picnic spread with various treats',
      ];
      return food[Math.floor(Math.random() * food.length)];
    }

    // General creative prompts
    const generalIdeas = [
      'a whimsical treehouse in a giant tree',
      'a cozy reading nook with books and warm lighting',
      'a vintage bicycle with a basket of flowers',
      'a lighthouse on a rocky cliff during a storm',
      'a hot air balloon floating over a countryside',
      'a musical instrument with decorative details',
      'a butterfly with intricate wing patterns',
      'a city skyline at golden hour',
      'a waterfall cascading into a crystal pool',
      'a compass and map for an adventure theme',
      'a steampunk-inspired mechanical creature',
      'a zen garden with rocks and raked sand',
      'a carnival or fair scene with bright colors',
      'an underwater scene with coral and fish',
      'a cozy cabin in a snowy winter landscape',
    ];

    return generalIdeas[Math.floor(Math.random() * generalIdeas.length)];
  };

  const sendMessage = () => {
    if (!input.trim() || isGenerating) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: input.trim(),
      timestamp: Date.now(),
      isUser: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsGenerating(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: `ai-${Date.now()}`,
        content: `How about drawing: ${generateArtIdea(input)}`,
        timestamp: Date.now(),
        isUser: false,
      };

      setMessages((prev) => [...prev, aiResponse]);
      setIsGenerating(false);
    }, 800);
  };

  return {
    messages,
    input,
    setInput,
    sendMessage,
    isGenerating,
  };
}
