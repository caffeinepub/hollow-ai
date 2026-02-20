import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Music2, Play, Pause, Loader2, Sparkles, Volume2, Download, Share2, Check, Copy } from 'lucide-react';
import { useAudioGeneration, renderBeatPatternToBlob } from '@/hooks/useAudioGeneration';
import { useMusicShare } from '@/hooks/useMusicShare';
import { toast } from 'sonner';
import { useEffect } from 'react';

type SoundType = 'kick' | 'snare' | 'hihat';

export function MusicGenerator() {
  const [prompt, setPrompt] = useState('');
  const [tempo, setTempo] = useState([120]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [selectedSound, setSelectedSound] = useState<SoundType>('kick');
  const [beatPattern, setBeatPattern] = useState<boolean[][]>([
    [true, false, false, false, true, false, false, false], // kick
    [false, false, true, false, false, false, true, false], // snare
    [true, true, true, true, true, true, true, true], // hihat
  ]);

  const { generateAudio, generatedAudio, isGenerating, currentAudioBlob } = useAudioGeneration();
  const { shareMusic, isSharing, shareSuccess, sharedMusicId, copyShareUrl } = useMusicShare();
  const [showShareUrl, setShowShareUrl] = useState(false);
  const [urlCopied, setUrlCopied] = useState(false);
  const [currentMusicType, setCurrentMusicType] = useState<'ai' | 'beat' | null>(null);

  const handleGenerateMusic = async () => {
    if (!prompt.trim()) return;

    try {
      const audioUrl = await generateAudio(prompt);
      setCurrentAudioUrl(audioUrl);
      setCurrentMusicType('ai');
    } catch (error) {
      console.error('Failed to generate music:', error);
      toast.error('Failed to generate music');
    }
  };

  const togglePlayPause = () => {
    if (!audioElement) return;

    if (isPlaying) {
      audioElement.pause();
      setIsPlaying(false);
    } else {
      audioElement.play();
      setIsPlaying(true);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const toggleBeat = (soundIndex: number, beatIndex: number) => {
    const newPattern = [...beatPattern];
    newPattern[soundIndex][beatIndex] = !newPattern[soundIndex][beatIndex];
    setBeatPattern(newPattern);
  };

  const playBeatPattern = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const beatDuration = 60 / tempo[0] / 2;
    const sounds: SoundType[] = ['kick', 'snare', 'hihat'];

    beatPattern[0].forEach((_, beatIndex) => {
      sounds.forEach((sound, soundIndex) => {
        if (beatPattern[soundIndex][beatIndex]) {
          const startTime = audioContext.currentTime + beatIndex * beatDuration;
          playSound(audioContext, sound, startTime);
        }
      });
    });
    setCurrentMusicType('beat');
  };

  const playSound = (audioContext: AudioContext, sound: SoundType, startTime: number) => {
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
  };

  const handleSaveAI = () => {
    if (!currentAudioBlob) {
      toast.error('No audio to save');
      return;
    }

    const url = URL.createObjectURL(currentAudioBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `axora-music-${Date.now()}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Music saved!');
  };

  const handleSaveBeat = async () => {
    try {
      const blob = await renderBeatPatternToBlob(beatPattern, tempo[0]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `axora-beat-${Date.now()}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Beat pattern saved!');
    } catch (error) {
      console.error('Failed to save beat:', error);
      toast.error('Failed to save beat pattern');
    }
  };

  const handleShareAI = () => {
    if (!currentAudioBlob) {
      toast.error('No audio to share');
      return;
    }
    shareMusic({ audioBlob: currentAudioBlob });
  };

  const handleShareBeat = async () => {
    try {
      const blob = await renderBeatPatternToBlob(beatPattern, tempo[0]);
      shareMusic({ audioBlob: blob });
    } catch (error) {
      console.error('Failed to share beat:', error);
      toast.error('Failed to share beat pattern');
    }
  };

  const handleCopyUrl = () => {
    if (sharedMusicId) {
      copyShareUrl(sharedMusicId);
      setUrlCopied(true);
      toast.success('Share link copied to clipboard!');
      setTimeout(() => setUrlCopied(false), 2000);
    }
  };

  useEffect(() => {
    if (shareSuccess && sharedMusicId) {
      setShowShareUrl(true);
      toast.success('Music shared successfully!');
    }
  }, [shareSuccess, sharedMusicId]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music2 className="h-5 w-5 text-primary" />
            Music Generator
          </CardTitle>
          <CardDescription>
            Create beats manually with the sequencer or let AI generate music for you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Beat Sequencer */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Beat Sequencer</h3>
              <div className="flex gap-2">
                <Button onClick={handleSaveBeat} size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button onClick={handleShareBeat} size="sm" variant="outline" disabled={isSharing}>
                  {isSharing ? (
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <Share2 className="h-4 w-4 mr-2" />
                  )}
                  Share
                </Button>
                <Button onClick={playBeatPattern} size="sm" variant="outline">
                  <Play className="h-4 w-4 mr-2" />
                  Play Pattern
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <Label className="w-20 text-sm">Tempo:</Label>
                <Slider
                  value={tempo}
                  onValueChange={setTempo}
                  min={60}
                  max={180}
                  step={1}
                  className="flex-1"
                />
                <span className="text-sm font-mono w-16 text-right">{tempo[0]} BPM</span>
              </div>
            </div>

            <div className="space-y-2">
              {['Kick', 'Snare', 'Hi-Hat'].map((soundName, soundIndex) => (
                <div key={soundName} className="flex items-center gap-2">
                  <span className="text-xs font-medium w-16 text-muted-foreground">{soundName}</span>
                  <div className="flex gap-1 flex-1">
                    {beatPattern[soundIndex].map((isActive, beatIndex) => (
                      <button
                        key={beatIndex}
                        onClick={() => toggleBeat(soundIndex, beatIndex)}
                        className={`h-8 flex-1 rounded border transition-colors ${
                          isActive
                            ? 'bg-primary border-primary'
                            : 'bg-muted border-border hover:bg-muted/80'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sound Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Sound Selection</Label>
            <div className="flex gap-2">
              {(['kick', 'snare', 'hihat'] as SoundType[]).map((sound) => (
                <Button
                  key={sound}
                  variant={selectedSound === sound ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedSound(sound)}
                  className="capitalize"
                >
                  <Volume2 className="h-4 w-4 mr-2" />
                  {sound}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Music Generation */}
      <Card className="border-accent/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            AI Music Generation
          </CardTitle>
          <CardDescription>
            Describe the music you want and let AI generate it for you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="music-prompt">Describe your music</Label>
            <Textarea
              id="music-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., upbeat electronic dance music with a catchy melody"
              className="min-h-[100px]"
            />
          </div>

          <Button
            onClick={handleGenerateMusic}
            disabled={isGenerating || !prompt.trim()}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating Music...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Music
              </>
            )}
          </Button>

          {currentAudioUrl && (
            <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">Generated Music</p>
                <div className="flex gap-2">
                  <Button onClick={handleSaveAI} size="sm" variant="outline">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button onClick={handleShareAI} size="sm" variant="outline" disabled={isSharing}>
                    {isSharing ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : (
                      <Share2 className="h-4 w-4" />
                    )}
                  </Button>
                  <Button onClick={togglePlayPause} size="sm" variant="outline">
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <audio
                ref={setAudioElement}
                src={currentAudioUrl}
                onEnded={handleAudioEnded}
                controls
                className="w-full"
              />
            </div>
          )}

          {showShareUrl && sharedMusicId && (
            <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg space-y-2">
              <p className="text-sm font-semibold text-foreground">Share your music:</p>
              <div className="flex gap-2">
                <Input
                  value={`${window.location.origin}/shared/music/${sharedMusicId}`}
                  readOnly
                  className="flex-1 text-sm"
                />
                <Button
                  size="sm"
                  onClick={handleCopyUrl}
                  variant={urlCopied ? 'default' : 'outline'}
                >
                  {urlCopied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {generatedAudio.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground">Previously Generated</p>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {generatedAudio.map((audio, index) => (
                  <div
                    key={index}
                    className="p-3 bg-muted rounded-lg border border-border space-y-2"
                  >
                    <p className="text-xs text-muted-foreground line-clamp-2">{audio.prompt}</p>
                    <audio src={audio.url} controls className="w-full h-8" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-accent/5 border-accent/20">
        <CardHeader>
          <CardTitle className="text-base">Quick Prompts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              'Relaxing piano melody',
              'Energetic electronic beat',
              'Ambient space sounds',
              'Upbeat pop music',
              'Chill lo-fi hip hop',
              'Epic orchestral theme',
            ].map((example) => (
              <Button
                key={example}
                variant="outline"
                size="sm"
                onClick={() => setPrompt(example)}
                className="justify-start text-left"
              >
                {example}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
