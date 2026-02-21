import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Volume2, Loader2, BookOpen } from 'lucide-react';
import { useDictionarySearch } from '@/hooks/useDictionarySearch';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function DictionaryView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [queriedWord, setQueriedWord] = useState('');
  const { data: wordData, isLoading, error, refetch } = useDictionarySearch(queriedWord);
  const { speak, isSpeaking } = useTextToSpeech();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      setQueriedWord(searchTerm.trim().toLowerCase());
      refetch();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handlePronounce = () => {
    if (wordData?.word) {
      speak(wordData.word);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <BookOpen className="h-6 w-6 text-primary" />
            Dictionary
          </CardTitle>
          <CardDescription>
            Search from over 250,000 words with AI-powered pronunciation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search Input */}
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter a word to search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 min-h-[44px]"
            />
            <Button
              onClick={handleSearch}
              disabled={!searchTerm.trim() || isLoading}
              className="min-h-[44px] min-w-[44px]"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              <span className="ml-2 hidden sm:inline">Search</span>
            </Button>
          </div>

          {/* Results Display */}
          {queriedWord && !isLoading && (
            <div className="space-y-4">
              {error ? (
                <Alert variant="destructive">
                  <AlertDescription>
                    Word not found. The word "{queriedWord}" does not exist in our dictionary. Please try another word.
                  </AlertDescription>
                </Alert>
              ) : wordData ? (
                <Card className="border-border bg-muted/30">
                  <CardContent className="pt-6 space-y-4">
                    {/* Word and Pronunciation */}
                    <div className="flex items-center justify-between gap-4">
                      <h2 className="text-3xl font-bold text-foreground capitalize">
                        {wordData.word}
                      </h2>
                      <Button
                        onClick={handlePronounce}
                        disabled={isSpeaking}
                        variant="outline"
                        size="lg"
                        className="min-h-[44px] min-w-[44px]"
                      >
                        <Volume2 
                          className={`h-5 w-5 ${isSpeaking ? 'animate-pulse text-primary' : ''}`} 
                        />
                        <span className="ml-2 hidden sm:inline">
                          {isSpeaking ? 'Speaking...' : 'Pronounce'}
                        </span>
                      </Button>
                    </div>

                    {/* Definition */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                        Definition
                      </h3>
                      <p className="text-base leading-relaxed text-foreground">
                        {wordData.definition}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : null}
            </div>
          )}

          {/* Initial State */}
          {!queriedWord && (
            <div className="text-center py-12 space-y-4">
              <div className="flex justify-center">
                <div className="rounded-full bg-primary/10 p-6">
                  <BookOpen className="h-12 w-12 text-primary" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">
                  Start Your Word Search
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Enter any word in the search box above to discover its meaning and hear how it's pronounced with AI voice synthesis.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
