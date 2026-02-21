import { useState } from 'react';

interface GeneratedAudio {
  url: string;
  prompt: string;
  timestamp: number;
  blob?: Blob;
}

export function useAudioGeneration() {
  const [generatedAudio, setGeneratedAudio] = useState<GeneratedAudio[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentAudioBlob, setCurrentAudioBlob] = useState<Blob | null>(null);

  const generateAudio = async (prompt: string) => {
    setIsGenerating(true);
    
    try {
      // Simulate AI audio generation with a delay
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Create a simple synthesized audio using Web Audio API with webkit fallback
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContextClass();
      const duration = 3; // 3 seconds
      const sampleRate = audioContext.sampleRate;
      const numSamples = duration * sampleRate;
      
      // Create an offline audio context for rendering with webkit fallback
      const OfflineAudioContextClass = window.OfflineAudioContext || (window as any).webkitOfflineAudioContext;
      const offlineContext = new OfflineAudioContextClass(1, numSamples, sampleRate);
      
      // Generate a simple melody based on the prompt length
      const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25]; // C major scale
      const noteDuration = 0.3;
      const numNotes = Math.min(prompt.length % 8 + 4, 10);
      
      for (let i = 0; i < numNotes; i++) {
        const oscillator = offlineContext.createOscillator();
        const gainNode = offlineContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(offlineContext.destination);
        
        // Select note based on prompt characters
        const noteIndex = (prompt.charCodeAt(i % prompt.length) + i) % notes.length;
        oscillator.frequency.value = notes[noteIndex];
        oscillator.type = 'sine';
        
        // Envelope
        const startTime = i * noteDuration;
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + noteDuration);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + noteDuration);
      }
      
      // Render the audio
      const audioBuffer = await offlineContext.startRendering();
      
      // Convert AudioBuffer to WAV blob
      const wavBlob = audioBufferToWav(audioBuffer);
      const audioUrl = URL.createObjectURL(wavBlob);
      
      setCurrentAudioBlob(wavBlob);
      
      const newAudio: GeneratedAudio = {
        url: audioUrl,
        prompt,
        timestamp: Date.now(),
        blob: wavBlob,
      };
      
      setGeneratedAudio(prev => [newAudio, ...prev]);
      
      return audioUrl;
    } catch (error) {
      console.error('Error generating audio:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateAudio,
    generatedAudio,
    isGenerating,
    currentAudioBlob,
  };
}

// Helper function to convert AudioBuffer to WAV blob
export function audioBufferToWav(buffer: AudioBuffer): Blob {
  const length = buffer.length * buffer.numberOfChannels * 2;
  const arrayBuffer = new ArrayBuffer(44 + length);
  const view = new DataView(arrayBuffer);
  const channels: Float32Array[] = [];
  let offset = 0;
  let pos = 0;

  // Write WAV header
  const setUint16 = (data: number) => {
    view.setUint16(pos, data, true);
    pos += 2;
  };
  const setUint32 = (data: number) => {
    view.setUint32(pos, data, true);
    pos += 4;
  };

  // "RIFF" chunk descriptor
  setUint32(0x46464952); // "RIFF"
  setUint32(36 + length); // file length - 8
  setUint32(0x45564157); // "WAVE"

  // "fmt " sub-chunk
  setUint32(0x20746d66); // "fmt "
  setUint32(16); // subchunk1size
  setUint16(1); // audio format (1 = PCM)
  setUint16(buffer.numberOfChannels);
  setUint32(buffer.sampleRate);
  setUint32(buffer.sampleRate * 2 * buffer.numberOfChannels); // byte rate
  setUint16(buffer.numberOfChannels * 2); // block align
  setUint16(16); // bits per sample

  // "data" sub-chunk
  setUint32(0x61746164); // "data"
  setUint32(length);

  // Write interleaved data
  for (let i = 0; i < buffer.numberOfChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

  while (pos < arrayBuffer.byteLength) {
    for (let i = 0; i < buffer.numberOfChannels; i++) {
      let sample = Math.max(-1, Math.min(1, channels[i][offset]));
      sample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(pos, sample, true);
      pos += 2;
    }
    offset++;
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

// Helper function to render beat pattern to audio blob
export async function renderBeatPatternToBlob(
  beatPattern: boolean[][],
  tempo: number
): Promise<Blob> {
  // Use webkit fallback for Safari compatibility
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  const audioContext = new AudioContextClass();
  const beatDuration = 60 / tempo / 2;
  const totalDuration = beatPattern[0].length * beatDuration;
  const sampleRate = audioContext.sampleRate;
  const numSamples = Math.ceil(totalDuration * sampleRate);

  const OfflineAudioContextClass = window.OfflineAudioContext || (window as any).webkitOfflineAudioContext;
  const offlineContext = new OfflineAudioContextClass(1, numSamples, sampleRate);
  const sounds: ('kick' | 'snare' | 'hihat')[] = ['kick', 'snare', 'hihat'];

  beatPattern[0].forEach((_, beatIndex) => {
    sounds.forEach((sound, soundIndex) => {
      if (beatPattern[soundIndex][beatIndex]) {
        const startTime = beatIndex * beatDuration;
        playSound(offlineContext, sound, startTime);
      }
    });
  });

  const audioBuffer = await offlineContext.startRendering();
  return audioBufferToWav(audioBuffer);
}

function playSound(
  audioContext: OfflineAudioContext,
  sound: 'kick' | 'snare' | 'hihat',
  startTime: number
) {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  if (sound === 'kick') {
    oscillator.frequency.setValueAtTime(150, startTime);
    oscillator.frequency.exponentialRampToValueAtTime(0.01, startTime + 0.5);
    gainNode.gain.setValueAtTime(1, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);
    oscillator.type = 'sine';
  } else if (sound === 'snare') {
    oscillator.frequency.setValueAtTime(200, startTime);
    gainNode.gain.setValueAtTime(0.5, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);
    oscillator.type = 'triangle';
  } else if (sound === 'hihat') {
    oscillator.frequency.setValueAtTime(8000, startTime);
    gainNode.gain.setValueAtTime(0.3, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1);
    oscillator.type = 'square';
  }

  oscillator.start(startTime);
  oscillator.stop(startTime + 0.5);
}
