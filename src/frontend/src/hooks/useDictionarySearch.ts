import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Word } from '../backend';

export function useDictionarySearch(word: string) {
  const { actor, isFetching: isActorFetching } = useActor();

  return useQuery<Word>({
    queryKey: ['dictionary', word],
    queryFn: async () => {
      if (!actor || !word) {
        throw new Error('Actor not initialized or word is empty');
      }
      
      // Normalize the word to lowercase for case-insensitive search
      const normalizedWord = word.toLowerCase().trim();
      
      try {
        const result = await actor.getWord(normalizedWord);
        return result;
      } catch (error) {
        throw new Error(`Word not found: ${word}`);
      }
    },
    enabled: !!actor && !isActorFetching && !!word,
    retry: false,
    staleTime: Infinity, // Dictionary data doesn't change often
  });
}
