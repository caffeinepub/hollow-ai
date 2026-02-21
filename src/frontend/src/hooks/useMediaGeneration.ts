import { useState } from 'react';

interface GeneratedMedia {
  url: string;
  prompt: string;
  timestamp: number;
}

interface PromptAnalysis {
  primaryColor: string;
  hasCircles: boolean;
  hasSquares: boolean;
  hasTriangles: boolean;
  hasStars: boolean;
  hasWaves: boolean;
  hasSpiral: boolean;
  hasGradient: boolean;
  hasPattern: boolean;
  hasRotation: boolean;
  hasPulse: boolean;
  hasFloat: boolean;
  hasZoom: boolean;
  subject: string | null;
  subjectType: 'human' | 'animal' | 'object' | 'plant' | 'scene' | null;
  action: string | null;
  setting: string | null;
  timeOfDay: string | null;
  weather: string | null;
  emotion: string | null;
  style: string | null;
  gender: string | null;
  age: string | null;
  materialType: string | null;
  lightingCondition: string | null;
  surfaceTexture: string | null;
  depthOfField: boolean;
  detailLevel: 'high' | 'medium' | 'low';
}

interface Shape {
  x: number;
  y: number;
  size: number;
  depth: number;
}

export function useMediaGeneration() {
  const [generatedImages, setGeneratedImages] = useState<GeneratedMedia[]>([]);
  const [generatedVideos, setGeneratedVideos] = useState<GeneratedMedia[]>([]);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);

  const analyzePrompt = (prompt: string): PromptAnalysis => {
    const lower = prompt.toLowerCase();
    
    const colors = {
      red: ['red', 'crimson', 'scarlet', 'ruby'],
      blue: ['blue', 'azure', 'navy', 'ocean', 'sky', 'water'],
      green: ['green', 'emerald', 'forest', 'nature', 'grass'],
      yellow: ['yellow', 'gold', 'sun', 'sunshine'],
      purple: ['purple', 'violet', 'lavender'],
      orange: ['orange', 'sunset', 'fire', 'flame'],
      pink: ['pink', 'rose', 'magenta'],
      black: ['black', 'dark', 'night', 'shadow'],
      white: ['white', 'light', 'bright', 'snow'],
      brown: ['brown', 'tan', 'beige', 'earth'],
    };
    
    let primaryColor = '#3b82f6';
    for (const [color, keywords] of Object.entries(colors)) {
      if (keywords.some(k => lower.includes(k))) {
        const colorMap: Record<string, string> = {
          red: '#ef4444',
          blue: '#3b82f6',
          green: '#10b981',
          yellow: '#f59e0b',
          purple: '#8b5cf6',
          orange: '#f97316',
          pink: '#ec4899',
          black: '#1f2937',
          white: '#f3f4f6',
          brown: '#92400e',
        };
        primaryColor = colorMap[color];
        break;
      }
    }
    
    const hasCircles = /circle|round|ball|sphere|dot/i.test(prompt);
    const hasSquares = /square|box|cube|rectangle/i.test(prompt);
    const hasTriangles = /triangle|pyramid|arrow/i.test(prompt);
    const hasStars = /star|sparkle|twinkle/i.test(prompt);
    const hasWaves = /wave|ocean|water|flow|ripple/i.test(prompt);
    const hasSpiral = /spiral|swirl|vortex/i.test(prompt);
    const hasGradient = /gradient|fade|blend|smooth/i.test(prompt);
    const hasPattern = /pattern|texture|grid|mosaic/i.test(prompt);
    
    const hasRotation = /rotate|spin|turn|revolve/i.test(prompt);
    const hasPulse = /pulse|beat|throb|glow/i.test(prompt);
    const hasFloat = /float|drift|hover|fly/i.test(prompt);
    const hasZoom = /zoom|grow|expand|shrink/i.test(prompt);
    
    const humanSubjects = {
      'man': ['man', 'male', 'gentleman', 'guy', 'boy', 'father', 'dad'],
      'woman': ['woman', 'female', 'lady', 'girl', 'mother', 'mom'],
      'person': ['person', 'people', 'human', 'individual'],
      'child': ['child', 'kid', 'toddler', 'baby'],
      'elderly': ['elderly', 'senior', 'old person', 'grandparent'],
    };
    
    const animalSubjects = {
      'cat': ['cat', 'kitten', 'feline'],
      'dog': ['dog', 'puppy', 'canine'],
      'bird': ['bird', 'eagle', 'hawk', 'sparrow', 'robin', 'crow'],
      'horse': ['horse', 'stallion', 'mare', 'pony'],
      'fish': ['fish', 'goldfish', 'shark', 'whale', 'dolphin'],
      'lion': ['lion', 'lioness'],
      'elephant': ['elephant'],
      'bear': ['bear', 'grizzly', 'polar bear'],
      'deer': ['deer', 'elk', 'moose'],
      'rabbit': ['rabbit', 'bunny', 'hare'],
    };
    
    const objectSubjects = {
      'tree': ['tree', 'oak', 'pine', 'maple', 'willow'],
      'flower': ['flower', 'rose', 'tulip', 'daisy', 'sunflower', 'lily'],
      'car': ['car', 'vehicle', 'automobile', 'sedan', 'suv'],
      'house': ['house', 'home', 'building', 'cottage', 'cabin'],
      'mountain': ['mountain', 'peak', 'hill', 'cliff'],
      'boat': ['boat', 'ship', 'yacht', 'sailboat'],
      'bicycle': ['bicycle', 'bike', 'cycle'],
      'book': ['book', 'novel', 'tome'],
      'chair': ['chair', 'seat', 'armchair'],
      'table': ['table', 'desk'],
    };
    
    const actions = {
      'jumping jacks': ['jumping jacks', 'jumping jack', 'star jumps'],
      'running': ['running', 'run', 'jogging', 'jog', 'sprinting'],
      'walking': ['walking', 'walk', 'strolling'],
      'jumping': ['jumping', 'jump', 'leap', 'leaping'],
      'waving': ['waving', 'wave', 'waving hand'],
      'dancing': ['dancing', 'dance'],
      'sitting': ['sitting', 'sit', 'seated'],
      'standing': ['standing', 'stand'],
      'exercising': ['exercising', 'exercise', 'workout', 'training'],
      'stretching': ['stretching', 'stretch'],
      'swimming': ['swimming', 'swim'],
      'cycling': ['cycling', 'biking', 'riding bike'],
      'reading': ['reading', 'read'],
      'writing': ['writing', 'write'],
      'cooking': ['cooking', 'cook', 'preparing food'],
      'eating': ['eating', 'eat', 'dining'],
      'sleeping': ['sleeping', 'sleep', 'napping', 'resting'],
      'thinking': ['thinking', 'think', 'pondering'],
      'smiling': ['smiling', 'smile', 'grinning'],
      'laughing': ['laughing', 'laugh'],
      'crying': ['crying', 'cry', 'weeping'],
      'playing': ['playing', 'play'],
      'working': ['working', 'work'],
      'relaxing': ['relaxing', 'relax'],
    };
    
    const settings = {
      'forest': ['forest', 'woods', 'jungle', 'woodland'],
      'beach': ['beach', 'shore', 'seaside', 'coast'],
      'mountain': ['mountain', 'mountains', 'peak', 'alpine'],
      'city': ['city', 'urban', 'downtown', 'street', 'metropolis'],
      'park': ['park', 'garden', 'playground'],
      'home': ['home', 'house', 'room', 'living room', 'bedroom', 'kitchen'],
      'office': ['office', 'workplace', 'desk'],
      'gym': ['gym', 'fitness center', 'workout room'],
      'restaurant': ['restaurant', 'cafe', 'diner'],
      'school': ['school', 'classroom', 'university', 'college'],
      'space': ['space', 'cosmos', 'galaxy', 'stars', 'universe'],
      'underwater': ['underwater', 'ocean', 'sea', 'aquatic'],
    };
    
    const timeOfDayMap = {
      'morning': ['morning', 'dawn', 'sunrise', 'early'],
      'noon': ['noon', 'midday', 'afternoon'],
      'evening': ['evening', 'dusk', 'sunset'],
      'night': ['night', 'midnight', 'dark'],
    };
    
    const weatherMap = {
      'sunny': ['sunny', 'clear', 'bright'],
      'rainy': ['rainy', 'rain', 'wet', 'storm'],
      'snowy': ['snowy', 'snow', 'winter'],
      'cloudy': ['cloudy', 'overcast', 'gray'],
      'foggy': ['foggy', 'fog', 'mist', 'misty'],
    };
    
    const emotionMap = {
      'happy': ['happy', 'joyful', 'cheerful', 'delighted'],
      'sad': ['sad', 'unhappy', 'melancholy', 'depressed'],
      'angry': ['angry', 'mad', 'furious', 'enraged'],
      'surprised': ['surprised', 'shocked', 'amazed', 'astonished'],
      'peaceful': ['peaceful', 'calm', 'serene', 'tranquil'],
      'excited': ['excited', 'enthusiastic', 'energetic'],
    };
    
    const styleMap = {
      'realistic': ['realistic', 'photorealistic', 'lifelike', 'natural', 'real'],
      'artistic': ['artistic', 'painterly', 'impressionist'],
      'cartoon': ['cartoon', 'animated', 'comic'],
      'abstract': ['abstract', 'modern', 'contemporary'],
    };
    
    const materialMap = {
      'skin': ['skin', 'flesh', 'human', 'person', 'man', 'woman'],
      'metal': ['metal', 'metallic', 'steel', 'iron', 'chrome', 'aluminum'],
      'glass': ['glass', 'transparent', 'crystal', 'window'],
      'fabric': ['fabric', 'cloth', 'textile', 'clothing', 'shirt', 'pants'],
      'wood': ['wood', 'wooden', 'timber', 'tree'],
      'stone': ['stone', 'rock', 'marble', 'granite'],
      'water': ['water', 'liquid', 'ocean', 'sea', 'lake'],
      'fur': ['fur', 'hair', 'animal', 'cat', 'dog'],
    };
    
    const lightingMap = {
      'natural': ['natural', 'daylight', 'sunlight', 'outdoor'],
      'studio': ['studio', 'professional', 'portrait'],
      'golden hour': ['golden hour', 'sunset', 'sunrise', 'warm'],
      'overcast': ['overcast', 'cloudy', 'diffused', 'soft'],
      'dramatic': ['dramatic', 'contrast', 'shadow', 'dark'],
      'backlit': ['backlit', 'silhouette', 'rim light'],
    };
    
    const textureMap = {
      'smooth': ['smooth', 'polished', 'glossy', 'shiny'],
      'rough': ['rough', 'textured', 'coarse', 'bumpy'],
      'soft': ['soft', 'fluffy', 'fuzzy', 'plush'],
      'hard': ['hard', 'solid', 'rigid', 'firm'],
      'wet': ['wet', 'moist', 'damp', 'slick'],
      'dry': ['dry', 'arid', 'parched'],
    };
    
    let subject: string | null = null;
    let subjectType: 'human' | 'animal' | 'object' | 'plant' | 'scene' | null = null;
    let gender: string | null = null;
    let age: string | null = null;
    
    for (const [subj, keywords] of Object.entries(humanSubjects)) {
      if (keywords.some(k => lower.includes(k))) {
        subject = subj;
        subjectType = 'human';
        if (subj === 'man') gender = 'male';
        if (subj === 'woman') gender = 'female';
        if (subj === 'child') age = 'young';
        if (subj === 'elderly') age = 'old';
        break;
      }
    }
    
    if (!subject) {
      for (const [subj, keywords] of Object.entries(animalSubjects)) {
        if (keywords.some(k => lower.includes(k))) {
          subject = subj;
          subjectType = 'animal';
          break;
        }
      }
    }
    
    if (!subject) {
      for (const [subj, keywords] of Object.entries(objectSubjects)) {
        if (keywords.some(k => lower.includes(k))) {
          subject = subj;
          if (['tree', 'flower'].includes(subj)) {
            subjectType = 'plant';
          } else if (['mountain'].includes(subj)) {
            subjectType = 'scene';
          } else {
            subjectType = 'object';
          }
          break;
        }
      }
    }
    
    let action: string | null = null;
    for (const [actionName, keywords] of Object.entries(actions)) {
      if (keywords.some(k => lower.includes(k))) {
        action = actionName;
        break;
      }
    }
    
    let setting: string | null = null;
    for (const [settingName, keywords] of Object.entries(settings)) {
      if (keywords.some(k => lower.includes(k))) {
        setting = settingName;
        break;
      }
    }
    
    let timeOfDay: string | null = null;
    for (const [time, keywords] of Object.entries(timeOfDayMap)) {
      if (keywords.some(k => lower.includes(k))) {
        timeOfDay = time;
        break;
      }
    }
    
    let weather: string | null = null;
    for (const [w, keywords] of Object.entries(weatherMap)) {
      if (keywords.some(k => lower.includes(k))) {
        weather = w;
        break;
      }
    }
    
    let emotion: string | null = null;
    for (const [e, keywords] of Object.entries(emotionMap)) {
      if (keywords.some(k => lower.includes(k))) {
        emotion = e;
        break;
      }
    }
    
    let style: string | null = null;
    for (const [s, keywords] of Object.entries(styleMap)) {
      if (keywords.some(k => lower.includes(k))) {
        style = s;
        break;
      }
    }
    
    let materialType: string | null = null;
    for (const [mat, keywords] of Object.entries(materialMap)) {
      if (keywords.some(k => lower.includes(k))) {
        materialType = mat;
        break;
      }
    }
    
    let lightingCondition: string | null = null;
    for (const [light, keywords] of Object.entries(lightingMap)) {
      if (keywords.some(k => lower.includes(k))) {
        lightingCondition = light;
        break;
      }
    }
    if (!lightingCondition && timeOfDay) {
      lightingCondition = timeOfDay === 'noon' ? 'natural' : timeOfDay === 'night' ? 'dramatic' : 'golden hour';
    }
    
    let surfaceTexture: string | null = null;
    for (const [tex, keywords] of Object.entries(textureMap)) {
      if (keywords.some(k => lower.includes(k))) {
        surfaceTexture = tex;
        break;
      }
    }
    
    const depthOfField = /portrait|close.?up|face|detail/i.test(prompt) || subjectType === 'human';
    const detailLevel: 'high' | 'medium' | 'low' = 'high';
    
    return {
      primaryColor,
      hasCircles,
      hasSquares,
      hasTriangles,
      hasStars,
      hasWaves,
      hasSpiral,
      hasGradient,
      hasPattern,
      hasRotation,
      hasPulse,
      hasFloat,
      hasZoom,
      subject,
      subjectType,
      action,
      setting,
      timeOfDay,
      weather,
      emotion,
      style,
      gender,
      age,
      materialType,
      lightingCondition,
      surfaceTexture,
      depthOfField,
      detailLevel,
    };
  };

  const lightenColor = (color: string, percent: number): string => {
    const num = parseInt(color.replace('#', ''), 16);
    const r = Math.min(255, ((num >> 16) & 0xff) + Math.round(255 * (percent / 100)));
    const g = Math.min(255, ((num >> 8) & 0xff) + Math.round(255 * (percent / 100)));
    const b = Math.min(255, (num & 0xff) + Math.round(255 * (percent / 100)));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  };

  const darkenColor = (color: string, percent: number): string => {
    const num = parseInt(color.replace('#', ''), 16);
    const r = Math.max(0, ((num >> 16) & 0xff) - Math.round(255 * (percent / 100)));
    const g = Math.max(0, ((num >> 8) & 0xff) - Math.round(255 * (percent / 100)));
    const b = Math.max(0, (num & 0xff) - Math.round(255 * (percent / 100)));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  };

  const applyAdvancedLighting = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    baseColor: string,
    lightingCondition: string | null,
    materialType: string | null
  ) => {
    const isMetallic = materialType === 'metal';
    const isSkin = materialType === 'skin';
    const isGlass = materialType === 'glass';
    
    const lightAngle = lightingCondition === 'backlit' ? Math.PI * 0.75 : Math.PI * 0.25;
    const lightX = x + Math.cos(lightAngle) * radius * 2;
    const lightY = y + Math.sin(lightAngle) * radius * 2;
    
    const gradient = ctx.createRadialGradient(
      lightX * 0.3 + x * 0.7,
      lightY * 0.3 + y * 0.7,
      0,
      x,
      y,
      radius * 1.2
    );
    
    if (isSkin) {
      gradient.addColorStop(0, lightenColor(baseColor, 45));
      gradient.addColorStop(0.15, lightenColor(baseColor, 30));
      gradient.addColorStop(0.35, lightenColor(baseColor, 15));
      gradient.addColorStop(0.55, baseColor);
      gradient.addColorStop(0.75, darkenColor(baseColor, 12));
      gradient.addColorStop(0.9, darkenColor(baseColor, 25));
      gradient.addColorStop(1, darkenColor(baseColor, 40));
    } else if (isMetallic) {
      gradient.addColorStop(0, lightenColor(baseColor, 60));
      gradient.addColorStop(0.2, lightenColor(baseColor, 40));
      gradient.addColorStop(0.4, baseColor);
      gradient.addColorStop(0.6, darkenColor(baseColor, 20));
      gradient.addColorStop(0.8, darkenColor(baseColor, 35));
      gradient.addColorStop(1, darkenColor(baseColor, 50));
    } else if (isGlass) {
      gradient.addColorStop(0, lightenColor(baseColor, 70));
      gradient.addColorStop(0.3, lightenColor(baseColor, 50));
      gradient.addColorStop(0.5, baseColor);
      gradient.addColorStop(0.7, darkenColor(baseColor, 10));
      gradient.addColorStop(1, darkenColor(baseColor, 20));
    } else {
      gradient.addColorStop(0, lightenColor(baseColor, 35));
      gradient.addColorStop(0.25, lightenColor(baseColor, 20));
      gradient.addColorStop(0.5, baseColor);
      gradient.addColorStop(0.75, darkenColor(baseColor, 15));
      gradient.addColorStop(1, darkenColor(baseColor, 30));
    }
    
    return gradient;
  };

  const addPhotorealisticNoise = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    intensity: number = 0.015
  ) => {
    const imageData = ctx.getImageData(x, y, width, height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * intensity * 255;
      const perlinNoise = Math.sin(i * 0.01) * Math.cos(i * 0.02) * intensity * 128;
      const combinedNoise = noise + perlinNoise * 0.3;
      
      data[i] = Math.max(0, Math.min(255, data[i] + combinedNoise));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + combinedNoise));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + combinedNoise));
    }
    
    ctx.putImageData(imageData, x, y);
  };

  const applyColorGrading = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    timeOfDay: string | null,
    weather: string | null
  ) => {
    const imageData = ctx.getImageData(x, y, width, height);
    const data = imageData.data;
    
    let rShift = 0, gShift = 0, bShift = 0;
    let contrast = 1.1;
    let saturation = 1.15;
    
    if (timeOfDay === 'morning') {
      rShift = 15;
      gShift = 10;
      bShift = -5;
      saturation = 1.2;
    } else if (timeOfDay === 'evening') {
      rShift = 25;
      gShift = 5;
      bShift = -15;
      saturation = 1.25;
    } else if (timeOfDay === 'night') {
      rShift = -10;
      gShift = -5;
      bShift = 15;
      contrast = 1.3;
      saturation = 0.9;
    }
    
    if (weather === 'rainy') {
      saturation = 0.85;
      contrast = 1.05;
      bShift += 10;
    } else if (weather === 'sunny') {
      saturation = 1.3;
      rShift += 10;
      gShift += 5;
    }
    
    for (let i = 0; i < data.length; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];
      
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      r = gray + saturation * (r - gray);
      g = gray + saturation * (g - gray);
      b = gray + saturation * (b - gray);
      
      r = ((r / 255 - 0.5) * contrast + 0.5) * 255;
      g = ((g / 255 - 0.5) * contrast + 0.5) * 255;
      b = ((b / 255 - 0.5) * contrast + 0.5) * 255;
      
      r += rShift;
      g += gShift;
      b += bShift;
      
      data[i] = Math.max(0, Math.min(255, r));
      data[i + 1] = Math.max(0, Math.min(255, g));
      data[i + 2] = Math.max(0, Math.min(255, b));
    }
    
    ctx.putImageData(imageData, x, y);
  };

  const applyDepthOfFieldBlur = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    focalX: number,
    focalY: number,
    focalRadius: number
  ) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const tempData = new Uint8ClampedArray(data);
    
    const blurRadius = 8;
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const dx = x - focalX;
        const dy = y - focalY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const blurAmount = Math.max(0, Math.min(1, (distance - focalRadius) / (focalRadius * 2)));
        
        if (blurAmount > 0.1) {
          let r = 0, g = 0, b = 0, count = 0;
          const currentBlur = Math.floor(blurRadius * blurAmount);
          
          for (let by = -currentBlur; by <= currentBlur; by += 2) {
            for (let bx = -currentBlur; bx <= currentBlur; bx += 2) {
              const sx = Math.max(0, Math.min(width - 1, x + bx));
              const sy = Math.max(0, Math.min(height - 1, y + by));
              const idx = (sy * width + sx) * 4;
              
              r += tempData[idx];
              g += tempData[idx + 1];
              b += tempData[idx + 2];
              count++;
            }
          }
          
          const idx = (y * width + x) * 4;
          data[idx] = r / count;
          data[idx + 1] = g / count;
          data[idx + 2] = b / count;
        }
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
  };

  const drawUltraRealisticHuman = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    scale: number,
    pose: string,
    gender: string | null,
    age: string | null,
    lighting: string | null,
    emotion: string | null
  ) => {
    const skinTones = [
      '#fde7d6', '#f4d3b0', '#e8b896', '#d4a574',
      '#c68642', '#a67c52', '#8d5524', '#5c3317'
    ];
    const skinTone = skinTones[Math.floor(Math.random() * skinTones.length)];
    
    const headRadius = 40 * scale;
    const headY = y;
    
    ctx.save();
    
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 20 * scale;
    ctx.shadowOffsetX = 5 * scale;
    ctx.shadowOffsetY = 8 * scale;
    
    ctx.fillStyle = applyAdvancedLighting(ctx, x, headY, headRadius, skinTone, lighting, 'skin');
    ctx.beginPath();
    ctx.arc(x, headY, headRadius, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.shadowColor = 'transparent';
    
    const highlightGradient = ctx.createRadialGradient(
      x - headRadius * 0.25,
      headY - headRadius * 0.25,
      0,
      x - headRadius * 0.25,
      headY - headRadius * 0.25,
      headRadius * 0.4
    );
    highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
    highlightGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.15)');
    highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = highlightGradient;
    ctx.beginPath();
    ctx.arc(x, headY, headRadius, 0, Math.PI * 2);
    ctx.fill();
    
    const rimLightGradient = ctx.createLinearGradient(
      x - headRadius,
      headY,
      x + headRadius,
      headY
    );
    rimLightGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
    rimLightGradient.addColorStop(0.85, 'rgba(255, 255, 255, 0)');
    rimLightGradient.addColorStop(0.95, 'rgba(255, 255, 255, 0.3)');
    rimLightGradient.addColorStop(1, 'rgba(255, 255, 255, 0.5)');
    ctx.fillStyle = rimLightGradient;
    ctx.beginPath();
    ctx.arc(x, headY, headRadius, 0, Math.PI * 2);
    ctx.fill();
    
    const eyeY = headY - headRadius * 0.15;
    const eyeSpacing = headRadius * 0.35;
    
    [-1, 1].forEach(side => {
      const eyeX = x + side * eyeSpacing;
      
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(eyeX, eyeY, headRadius * 0.18, headRadius * 0.12, 0, 0, Math.PI * 2);
      ctx.fill();
      
      const irisGradient = ctx.createRadialGradient(
        eyeX,
        eyeY,
        0,
        eyeX,
        eyeY,
        headRadius * 0.1
      );
      const irisColors = ['#1e3a8a', '#059669', '#92400e', '#6b7280'];
      const irisColor = irisColors[Math.floor(Math.random() * irisColors.length)];
      irisGradient.addColorStop(0, darkenColor(irisColor, 20));
      irisGradient.addColorStop(0.6, irisColor);
      irisGradient.addColorStop(1, lightenColor(irisColor, 10));
      ctx.fillStyle = irisGradient;
      ctx.beginPath();
      ctx.arc(eyeX, eyeY, headRadius * 0.1, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(eyeX, eyeY, headRadius * 0.05, 0, Math.PI * 2);
      ctx.fill();
      
      const catchlightGradient = ctx.createRadialGradient(
        eyeX - headRadius * 0.02,
        eyeY - headRadius * 0.02,
        0,
        eyeX - headRadius * 0.02,
        eyeY - headRadius * 0.02,
        headRadius * 0.025
      );
      catchlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      catchlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = catchlightGradient;
      ctx.beginPath();
      ctx.arc(eyeX - headRadius * 0.02, eyeY - headRadius * 0.02, headRadius * 0.025, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.strokeStyle = darkenColor(skinTone, 30);
      ctx.lineWidth = headRadius * 0.015;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(eyeX - headRadius * 0.2, eyeY - headRadius * 0.15);
      ctx.quadraticCurveTo(eyeX, eyeY - headRadius * 0.18, eyeX + headRadius * 0.2, eyeY - headRadius * 0.15);
      ctx.stroke();
    });
    
    const noseX = x;
    const noseY = headY + headRadius * 0.1;
    ctx.strokeStyle = darkenColor(skinTone, 20);
    ctx.lineWidth = headRadius * 0.02;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(noseX, noseY - headRadius * 0.15);
    ctx.lineTo(noseX, noseY);
    ctx.moveTo(noseX, noseY);
    ctx.quadraticCurveTo(noseX - headRadius * 0.05, noseY + headRadius * 0.05, noseX - headRadius * 0.08, noseY);
    ctx.stroke();
    
    const mouthY = headY + headRadius * 0.35;
    const mouthWidth = headRadius * 0.4;
    const smiling = emotion === 'happy' || emotion === 'excited';
    
    ctx.strokeStyle = darkenColor(skinTone, 35);
    ctx.lineWidth = headRadius * 0.025;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x - mouthWidth / 2, mouthY);
    if (smiling) {
      ctx.quadraticCurveTo(x, mouthY + headRadius * 0.1, x + mouthWidth / 2, mouthY);
    } else {
      ctx.quadraticCurveTo(x, mouthY - headRadius * 0.02, x + mouthWidth / 2, mouthY);
    }
    ctx.stroke();
    
    const hairColor = ['#1a1a1a', '#3d2817', '#8b4513', '#daa520', '#c0c0c0'][Math.floor(Math.random() * 5)];
    ctx.fillStyle = applyAdvancedLighting(ctx, x, headY - headRadius, headRadius * 0.6, hairColor, lighting, 'fur');
    ctx.beginPath();
    ctx.ellipse(x, headY - headRadius * 0.5, headRadius * 1.1, headRadius * 0.7, 0, Math.PI, 0);
    ctx.fill();
    
    for (let i = 0; i < 30; i++) {
      const angle = Math.PI + (Math.random() - 0.5) * Math.PI * 0.8;
      const length = headRadius * (0.3 + Math.random() * 0.4);
      const startX = x + Math.cos(angle) * headRadius * 0.9;
      const startY = headY - headRadius * 0.5 + Math.sin(angle) * headRadius * 0.6;
      
      ctx.strokeStyle = hairColor;
      ctx.lineWidth = headRadius * 0.015;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(startX + Math.cos(angle) * length, startY + Math.sin(angle) * length);
      ctx.stroke();
    }
    
    const bodyY = headY + headRadius + 10 * scale;
    const bodyWidth = headRadius * 1.8;
    const bodyHeight = headRadius * 2.5;
    
    const clothingColors = ['#1e40af', '#dc2626', '#059669', '#7c3aed', '#1f2937'];
    const clothingColor = clothingColors[Math.floor(Math.random() * clothingColors.length)];
    
    ctx.fillStyle = applyAdvancedLighting(ctx, x, bodyY + bodyHeight / 2, bodyWidth / 2, clothingColor, lighting, 'fabric');
    ctx.beginPath();
    ctx.roundRect(x - bodyWidth / 2, bodyY, bodyWidth, bodyHeight, headRadius * 0.2);
    ctx.fill();
    
    ctx.strokeStyle = darkenColor(clothingColor, 20);
    ctx.lineWidth = headRadius * 0.02;
    ctx.beginPath();
    ctx.moveTo(x, bodyY);
    ctx.lineTo(x, bodyY + bodyHeight);
    ctx.stroke();
    
    const drawArm = (side: number, angle: number) => {
      const shoulderX = x + side * bodyWidth * 0.45;
      const shoulderY = bodyY + headRadius * 0.3;
      const armLength = headRadius * 1.8;
      
      const upperArmEndX = shoulderX + Math.cos(angle) * armLength * 0.5;
      const upperArmEndY = shoulderY + Math.sin(angle) * armLength * 0.5;
      
      ctx.strokeStyle = applyAdvancedLighting(ctx, shoulderX, shoulderY, headRadius * 0.3, clothingColor, lighting, 'fabric');
      ctx.lineWidth = headRadius * 0.35;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(shoulderX, shoulderY);
      ctx.lineTo(upperArmEndX, upperArmEndY);
      ctx.stroke();
      
      const forearmEndX = upperArmEndX + Math.cos(angle + 0.3) * armLength * 0.5;
      const forearmEndY = upperArmEndY + Math.sin(angle + 0.3) * armLength * 0.5;
      
      ctx.strokeStyle = applyAdvancedLighting(ctx, upperArmEndX, upperArmEndY, headRadius * 0.25, skinTone, lighting, 'skin');
      ctx.lineWidth = headRadius * 0.3;
      ctx.beginPath();
      ctx.moveTo(upperArmEndX, upperArmEndY);
      ctx.lineTo(forearmEndX, forearmEndY);
      ctx.stroke();
      
      ctx.fillStyle = applyAdvancedLighting(ctx, forearmEndX, forearmEndY, headRadius * 0.2, skinTone, lighting, 'skin');
      ctx.beginPath();
      ctx.arc(forearmEndX, forearmEndY, headRadius * 0.2, 0, Math.PI * 2);
      ctx.fill();
    };
    
    if (pose === 'jumping jacks') {
      drawArm(-1, -Math.PI * 0.35);
      drawArm(1, -Math.PI * 0.65);
    } else if (pose === 'waving') {
      drawArm(-1, Math.PI * 0.5);
      drawArm(1, -Math.PI * 0.4);
    } else if (pose === 'running') {
      drawArm(-1, -Math.PI * 0.2);
      drawArm(1, Math.PI * 0.6);
    } else {
      drawArm(-1, Math.PI * 0.45);
      drawArm(1, Math.PI * 0.45);
    }
    
    const drawLeg = (side: number, angle: number) => {
      const hipX = x + side * bodyWidth * 0.25;
      const hipY = bodyY + bodyHeight;
      const legLength = headRadius * 2.2;
      
      const kneeX = hipX + Math.cos(angle) * legLength * 0.5;
      const kneeY = hipY + Math.sin(angle) * legLength * 0.5;
      
      const pantsColor = darkenColor(clothingColor, 15);
      ctx.strokeStyle = applyAdvancedLighting(ctx, hipX, hipY, headRadius * 0.35, pantsColor, lighting, 'fabric');
      ctx.lineWidth = headRadius * 0.4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(hipX, hipY);
      ctx.lineTo(kneeX, kneeY);
      ctx.stroke();
      
      const footX = kneeX + Math.cos(angle + 0.2) * legLength * 0.5;
      const footY = kneeY + Math.sin(angle + 0.2) * legLength * 0.5;
      
      ctx.strokeStyle = applyAdvancedLighting(ctx, kneeX, kneeY, headRadius * 0.3, pantsColor, lighting, 'fabric');
      ctx.lineWidth = headRadius * 0.35;
      ctx.beginPath();
      ctx.moveTo(kneeX, kneeY);
      ctx.lineTo(footX, footY);
      ctx.stroke();
      
      const shoeColor = '#1f2937';
      ctx.fillStyle = applyAdvancedLighting(ctx, footX, footY, headRadius * 0.25, shoeColor, lighting, 'fabric');
      ctx.beginPath();
      ctx.ellipse(footX, footY, headRadius * 0.3, headRadius * 0.15, 0, 0, Math.PI * 2);
      ctx.fill();
    };
    
    if (pose === 'jumping jacks') {
      drawLeg(-1, Math.PI * 0.55);
      drawLeg(1, Math.PI * 0.45);
    } else if (pose === 'running') {
      drawLeg(-1, Math.PI * 0.4);
      drawLeg(1, Math.PI * 0.6);
    } else {
      drawLeg(-1, Math.PI * 0.5);
      drawLeg(1, Math.PI * 0.5);
    }
    
    ctx.restore();
  };

  const drawPhotorealisticBackground = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    setting: string | null,
    timeOfDay: string | null,
    weather: string | null
  ) => {
    let skyTop = '#87ceeb';
    let skyBottom = '#e0f2fe';
    let groundColor = '#86a361';
    
    if (timeOfDay === 'morning') {
      skyTop = '#fbbf24';
      skyBottom = '#fde68a';
    } else if (timeOfDay === 'evening') {
      skyTop = '#f97316';
      skyBottom = '#fcd34d';
    } else if (timeOfDay === 'night') {
      skyTop = '#0f172a';
      skyBottom = '#1e293b';
    }
    
    if (weather === 'rainy') {
      skyTop = darkenColor(skyTop, 30);
      skyBottom = darkenColor(skyBottom, 20);
    } else if (weather === 'sunny') {
      skyTop = lightenColor(skyTop, 10);
      skyBottom = lightenColor(skyBottom, 15);
    }
    
    const skyGradient = ctx.createLinearGradient(0, 0, 0, height * 0.6);
    skyGradient.addColorStop(0, skyTop);
    skyGradient.addColorStop(0.5, skyBottom);
    skyGradient.addColorStop(1, lightenColor(skyBottom, 10));
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, width, height * 0.6);
    
    if (timeOfDay !== 'night') {
      const sunX = timeOfDay === 'morning' ? width * 0.2 : timeOfDay === 'evening' ? width * 0.8 : width * 0.5;
      const sunY = timeOfDay === 'noon' ? height * 0.15 : height * 0.25;
      
      const sunGlow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 80);
      sunGlow.addColorStop(0, 'rgba(255, 255, 200, 0.8)');
      sunGlow.addColorStop(0.3, 'rgba(255, 255, 150, 0.4)');
      sunGlow.addColorStop(0.6, 'rgba(255, 255, 100, 0.2)');
      sunGlow.addColorStop(1, 'rgba(255, 255, 100, 0)');
      ctx.fillStyle = sunGlow;
      ctx.fillRect(0, 0, width, height);
      
      const sunGradient = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 40);
      sunGradient.addColorStop(0, '#fffacd');
      sunGradient.addColorStop(0.7, '#ffd700');
      sunGradient.addColorStop(1, '#ffa500');
      ctx.fillStyle = sunGradient;
      ctx.beginPath();
      ctx.arc(sunX, sunY, 40, 0, Math.PI * 2);
      ctx.fill();
    }
    
    const groundGradient = ctx.createLinearGradient(0, height * 0.6, 0, height);
    groundGradient.addColorStop(0, lightenColor(groundColor, 20));
    groundGradient.addColorStop(0.5, groundColor);
    groundGradient.addColorStop(1, darkenColor(groundColor, 15));
    ctx.fillStyle = groundGradient;
    ctx.fillRect(0, height * 0.6, width, height * 0.4);
    
    for (let i = 0; i < 200; i++) {
      const gx = Math.random() * width;
      const gy = height * 0.6 + Math.random() * height * 0.4;
      const size = Math.random() * 2;
      ctx.fillStyle = `rgba(${100 + Math.random() * 50}, ${120 + Math.random() * 50}, ${80 + Math.random() * 30}, ${0.3 + Math.random() * 0.4})`;
      ctx.fillRect(gx, gy, size, size);
    }
    
    if (weather === 'rainy') {
      ctx.strokeStyle = 'rgba(200, 220, 255, 0.3)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 100; i++) {
        const rx = Math.random() * width;
        const ry = Math.random() * height;
        ctx.beginPath();
        ctx.moveTo(rx, ry);
        ctx.lineTo(rx - 5, ry + 20);
        ctx.stroke();
      }
    }
  };

  const generateImage = async (prompt: string) => {
    setIsGeneratingImage(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      setIsGeneratingImage(false);
      return;
    }
    
    const analysis = analyzePrompt(prompt);
    
    drawPhotorealisticBackground(
      ctx,
      canvas.width,
      canvas.height,
      analysis.setting,
      analysis.timeOfDay,
      analysis.weather
    );
    
    if (analysis.subjectType === 'human' && analysis.action) {
      const centerX = canvas.width / 2;
      const centerY = canvas.height * 0.55;
      
      drawUltraRealisticHuman(
        ctx,
        centerX,
        centerY,
        1.2,
        analysis.action,
        analysis.gender,
        analysis.age,
        analysis.lightingCondition,
        analysis.emotion
      );
      
      if (analysis.depthOfField) {
        applyDepthOfFieldBlur(ctx, canvas.width, canvas.height, centerX, centerY, 200);
      }
    } else {
      const shapes: Shape[] = [];
      const numShapes = 8 + Math.floor(Math.random() * 12);
      
      for (let i = 0; i < numShapes; i++) {
        const x = Math.random() * canvas.width;
        const y = canvas.height * 0.3 + Math.random() * canvas.height * 0.5;
        const size = 40 + Math.random() * 120;
        const depth = Math.random();
        
        shapes.push({ x, y, size, depth });
      }
      
      shapes.sort((a, b) => a.depth - b.depth);
      
      shapes.forEach((shape) => {
        const depthScale = 0.5 + shape.depth * 0.5;
        const actualSize = shape.size * depthScale;
        
        ctx.save();
        ctx.globalAlpha = 0.7 + shape.depth * 0.3;
        
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 15 * depthScale;
        ctx.shadowOffsetX = 5 * depthScale;
        ctx.shadowOffsetY = 8 * depthScale;
        
        const shapeColor = analysis.primaryColor;
        ctx.fillStyle = applyAdvancedLighting(
          ctx,
          shape.x,
          shape.y,
          actualSize / 2,
          shapeColor,
          analysis.lightingCondition,
          analysis.materialType
        );
        
        if (analysis.hasCircles || (!analysis.hasSquares && !analysis.hasTriangles)) {
          ctx.beginPath();
          ctx.arc(shape.x, shape.y, actualSize / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (analysis.hasSquares) {
          ctx.beginPath();
          ctx.roundRect(
            shape.x - actualSize / 2,
            shape.y - actualSize / 2,
            actualSize,
            actualSize,
            actualSize * 0.1
          );
          ctx.fill();
        } else if (analysis.hasTriangles) {
          ctx.beginPath();
          ctx.moveTo(shape.x, shape.y - actualSize / 2);
          ctx.lineTo(shape.x + actualSize / 2, shape.y + actualSize / 2);
          ctx.lineTo(shape.x - actualSize / 2, shape.y + actualSize / 2);
          ctx.closePath();
          ctx.fill();
        }
        
        ctx.restore();
      });
    }
    
    applyColorGrading(
      ctx,
      0,
      0,
      canvas.width,
      canvas.height,
      analysis.timeOfDay,
      analysis.weather
    );
    
    addPhotorealisticNoise(ctx, 0, 0, canvas.width, canvas.height, 0.012);
    
    const url = canvas.toDataURL('image/png');
    const newImage: GeneratedMedia = {
      url,
      prompt,
      timestamp: Date.now(),
    };
    
    setGeneratedImages(prev => [newImage, ...prev]);
    setIsGeneratingImage(false);
  };

  const generateVideo = async (prompt: string) => {
    setIsGeneratingVideo(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const canvas = document.createElement('canvas');
    canvas.width = 854;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      setIsGeneratingVideo(false);
      return;
    }
    
    const analysis = analyzePrompt(prompt);
    const fps = 30;
    const duration = 3;
    const totalFrames = fps * duration;
    
    const stream = canvas.captureStream(fps);
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9',
      videoBitsPerSecond: 5000000,
    });
    
    const chunks: Blob[] = [];
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };
    
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const newVideo: GeneratedMedia = {
        url,
        prompt,
        timestamp: Date.now(),
      };
      setGeneratedVideos(prev => [newVideo, ...prev]);
      setIsGeneratingVideo(false);
    };
    
    mediaRecorder.start();
    
    let frame = 0;
    const animate = () => {
      if (frame >= totalFrames) {
        mediaRecorder.stop();
        return;
      }
      
      const progress = frame / totalFrames;
      const easeProgress = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      
      drawPhotorealisticBackground(
        ctx,
        canvas.width,
        canvas.height,
        analysis.setting,
        analysis.timeOfDay,
        analysis.weather
      );
      
      if (analysis.subjectType === 'human' && analysis.action) {
        const centerX = canvas.width / 2;
        let centerY = canvas.height * 0.55;
        let poseAngle = 0;
        
        if (analysis.action === 'jumping jacks') {
          const jumpCycle = Math.sin(progress * Math.PI * 6);
          centerY -= Math.abs(jumpCycle) * 30;
          poseAngle = jumpCycle;
        } else if (analysis.action === 'running') {
          const runCycle = Math.sin(progress * Math.PI * 8);
          centerY += runCycle * 10;
        } else if (analysis.action === 'jumping') {
          const jumpHeight = Math.sin(progress * Math.PI) * 80;
          centerY -= jumpHeight;
        } else if (analysis.action === 'waving') {
          poseAngle = Math.sin(progress * Math.PI * 4) * 0.3;
        }
        
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(poseAngle * 0.05);
        ctx.translate(-centerX, -centerY);
        
        drawUltraRealisticHuman(
          ctx,
          centerX,
          centerY,
          1.0,
          analysis.action,
          analysis.gender,
          analysis.age,
          analysis.lightingCondition,
          analysis.emotion
        );
        
        ctx.restore();
        
        const prevImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const motionBlurStrength = 0.15;
        ctx.globalAlpha = motionBlurStrength;
        ctx.putImageData(prevImageData, 0, 0);
        ctx.globalAlpha = 1.0;
        
      } else {
        const numShapes = 5;
        for (let i = 0; i < numShapes; i++) {
          const angle = (progress * Math.PI * 2) + (i * Math.PI * 2 / numShapes);
          const radius = 150 + Math.sin(progress * Math.PI * 2) * 50;
          const x = canvas.width / 2 + Math.cos(angle) * radius;
          const y = canvas.height / 2 + Math.sin(angle) * radius;
          const size = 60 + Math.sin(progress * Math.PI * 4 + i) * 20;
          
          ctx.save();
          ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
          ctx.shadowBlur = 15;
          ctx.shadowOffsetX = 5;
          ctx.shadowOffsetY = 8;
          
          ctx.fillStyle = applyAdvancedLighting(
            ctx,
            x,
            y,
            size / 2,
            analysis.primaryColor,
            analysis.lightingCondition,
            analysis.materialType
          );
          
          if (analysis.hasCircles || (!analysis.hasSquares && !analysis.hasTriangles)) {
            ctx.beginPath();
            ctx.arc(x, y, size / 2, 0, Math.PI * 2);
            ctx.fill();
          } else if (analysis.hasSquares) {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);
            ctx.fillRect(-size / 2, -size / 2, size, size);
            ctx.restore();
          }
          
          ctx.restore();
        }
      }
      
      applyColorGrading(
        ctx,
        0,
        0,
        canvas.width,
        canvas.height,
        analysis.timeOfDay,
        analysis.weather
      );
      
      if (frame % 3 === 0) {
        addPhotorealisticNoise(ctx, 0, 0, canvas.width, canvas.height, 0.01);
      }
      
      frame++;
      requestAnimationFrame(animate);
    };
    
    animate();
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
