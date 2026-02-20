import { useState } from 'react';

export interface TranslationPair {
  id: string;
  sourceText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  timestamp: number;
}

export function useTranslation() {
  const [translations, setTranslations] = useState<TranslationPair[]>([]);
  const [isTranslating, setIsTranslating] = useState(false);

  const translate = async (
    text: string,
    sourceLanguage: string,
    targetLanguage: string
  ): Promise<void> => {
    setIsTranslating(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 500));

    // Generate mock translation
    const translatedText = generateMockTranslation(text, sourceLanguage, targetLanguage);

    const newTranslation: TranslationPair = {
      id: `${Date.now()}-${Math.random()}`,
      sourceText: text,
      translatedText,
      sourceLanguage,
      targetLanguage,
      timestamp: Date.now(),
    };

    setTranslations((prev) => [...prev, newTranslation]);
    setIsTranslating(false);
  };

  const clearHistory = () => {
    setTranslations([]);
  };

  return {
    translations,
    isTranslating,
    translate,
    clearHistory,
  };
}

function generateMockTranslation(
  text: string,
  sourceLanguage: string,
  targetLanguage: string
): string {
  // Simple mock translation - in a real app, this would call a translation API
  const greetings: Record<string, string> = {
    English: 'Hello',
    Spanish: 'Hola',
    French: 'Bonjour',
    German: 'Hallo',
    Chinese: '你好',
    Japanese: 'こんにちは',
    Arabic: 'مرحبا',
    Italian: 'Ciao',
    Portuguese: 'Olá',
    Russian: 'Привет',
    Korean: '안녕하세요',
    Hindi: 'नमस्ते',
  };

  const thanks: Record<string, string> = {
    English: 'Thank you',
    Spanish: 'Gracias',
    French: 'Merci',
    German: 'Danke',
    Chinese: '谢谢',
    Japanese: 'ありがとう',
    Arabic: 'شكرا',
    Italian: 'Grazie',
    Portuguese: 'Obrigado',
    Russian: 'Спасибо',
    Korean: '감사합니다',
    Hindi: 'धन्यवाद',
  };

  const lowerText = text.toLowerCase();

  // Check for common phrases
  if (lowerText.includes('hello') || lowerText.includes('hi')) {
    return greetings[targetLanguage] || `[${targetLanguage} translation of: ${text}]`;
  }

  if (lowerText.includes('thank')) {
    return thanks[targetLanguage] || `[${targetLanguage} translation of: ${text}]`;
  }

  // Default mock translation
  return `[${targetLanguage} translation of: ${text}]`;
}
