import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

// Mock types since they're not in the backend anymore
interface Message {
  id: string;
  content: string;
  timestamp: bigint;
}

interface SessionView {
  id: string;
  messages: Message[];
  lastActive: bigint;
}

// Local storage key for sessions
const SESSIONS_STORAGE_KEY = 'neroxa-chat-sessions';

// Helper functions for localStorage
function getStoredSessions(): SessionView[] {
  try {
    const stored = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    // Convert timestamp strings back to bigints
    return parsed.map((session: any) => ({
      ...session,
      lastActive: BigInt(session.lastActive),
      messages: session.messages.map((msg: any) => ({
        ...msg,
        timestamp: BigInt(msg.timestamp),
      })),
    }));
  } catch (error) {
    console.error('Failed to load sessions from localStorage:', error);
    return [];
  }
}

function saveStoredSessions(sessions: SessionView[]): void {
  try {
    // Convert bigints to strings for JSON serialization
    const serializable = sessions.map((session) => ({
      ...session,
      lastActive: session.lastActive.toString(),
      messages: session.messages.map((msg) => ({
        ...msg,
        timestamp: msg.timestamp.toString(),
      })),
    }));
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(serializable));
  } catch (error) {
    console.error('Failed to save sessions to localStorage:', error);
  }
}

// AI Response Generator
export function generateAIResponse(userMessage: string, conversationHistory: Message[]): string {
  const lowerMessage = userMessage.toLowerCase().trim();
  
  // Extract previous context
  const recentMessages = conversationHistory.slice(-6); // Last 3 exchanges
  const hasContext = recentMessages.length > 0;
  
  // Greetings
  if (/^(hi|hello|hey|greetings|good morning|good afternoon|good evening)/.test(lowerMessage)) {
    const greetings = [
      "Hello! I'm Axora AI, your learning companion. I'm here to help you with homework, explain concepts, or just chat about what you're learning. What would you like to explore today?",
      "Hi there! Great to see you. I can help with math problems, explain difficult topics, or answer questions about any subject. What's on your mind?",
      "Hey! Welcome back. Whether you need help with assignments, want to learn something new, or have questions, I'm here for you. How can I assist?",
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }
  
  // Math-related questions
  if (/\b(math|calculate|solve|equation|algebra|geometry|calculus|trigonometry|\d+\s*[\+\-\*\/\^]\s*\d+)\b/i.test(lowerMessage)) {
    if (/how (do|can) (i|you)|what is|explain/i.test(lowerMessage)) {
      return "I'd be happy to help you understand this math concept! Let me break it down step by step. First, let's identify what we're working with. Could you share the specific problem or concept you'd like me to explain? I can walk you through the solution process and help you understand the reasoning behind each step.";
    }
    return "I can help you with that math problem! For the best learning experience, let me guide you through the solution step by step. This way, you'll understand not just the answer, but the process. Would you like me to explain the concept first, or should we dive right into solving it?";
  }
  
  // Science questions
  if (/\b(science|physics|chemistry|biology|experiment|theory|hypothesis)\b/i.test(lowerMessage)) {
    return "That's a fascinating science question! Science is all about understanding how the world works. Let me help you explore this topic. The key concepts here involve understanding the underlying principles. Would you like me to explain the theory, provide examples, or help you understand how this applies to real-world situations?";
  }
  
  // History questions
  if (/\b(history|historical|war|ancient|civilization|century|era|period)\b/i.test(lowerMessage)) {
    return "History helps us understand where we came from and how we got here. That's an interesting historical topic! To give you the most helpful answer, I should consider the context, the time period, and the key events involved. What specific aspect would you like to explore? I can discuss causes, effects, key figures, or the broader historical significance.";
  }
  
  // Language and writing
  if (/\b(write|essay|grammar|spelling|sentence|paragraph|composition|literature)\b/i.test(lowerMessage)) {
    return "Writing is a powerful skill! I can help you improve your writing, understand grammar rules, or analyze literature. For essays, I recommend starting with a clear thesis, organizing your thoughts into paragraphs, and supporting your arguments with evidence. What specific aspect of writing would you like help with?";
  }
  
  // Programming/coding
  if (/\b(code|coding|program|programming|javascript|python|html|css|algorithm)\b/i.test(lowerMessage)) {
    return "Coding is an amazing skill to learn! I can help you understand programming concepts, debug code, or explain algorithms. The key to learning programming is practice and understanding the logic behind the code. What programming challenge are you working on? I can explain concepts, help you think through the problem, or review your approach.";
  }
  
  // Homework help
  if (/\b(homework|assignment|project|due|deadline|study|test|exam|quiz)\b/i.test(lowerMessage)) {
    return "I'm here to help you with your homework! My goal is to help you understand the material, not just get answers. Let's work through this together. Can you tell me more about the assignment? What subject is it for, and what specific part are you finding challenging? I'll guide you through the thinking process.";
  }
  
  // Questions (who, what, where, when, why, how)
  if (/^(who|what|where|when|why|how|can you|could you|would you|do you|does|is|are)\b/i.test(lowerMessage)) {
    if (hasContext) {
      return "That's a great follow-up question! Based on what we've been discussing, let me provide more detail. The answer involves understanding several key points. Let me explain this clearly so it makes sense in the context of our conversation.";
    }
    return "That's an excellent question! To give you a thorough answer, let me break this down. The key to understanding this is looking at it from multiple angles. I'll explain the main concepts and how they connect, so you get a complete picture.";
  }
  
  // Thank you / appreciation
  if (/\b(thank|thanks|appreciate|helpful|great|awesome|perfect)\b/i.test(lowerMessage)) {
    return "You're very welcome! I'm glad I could help. Remember, learning is a journey, and asking questions is a sign of curiosity and intelligence. Is there anything else you'd like to explore or any other topic you need help with?";
  }
  
  // Confusion or difficulty
  if (/\b(confused|don't understand|difficult|hard|stuck|lost|help)\b/i.test(lowerMessage)) {
    return "I understand that this can be challenging, but don't worry - we'll work through it together! Sometimes topics seem difficult until we break them down into smaller, manageable pieces. Let's take it step by step. Can you tell me specifically which part is confusing? I'll explain it in a different way that might make more sense.";
  }
  
  // Goodbye
  if (/^(bye|goodbye|see you|later|gotta go|have to go)/.test(lowerMessage)) {
    return "Goodbye! It was great helping you today. Remember, I'm always here whenever you need assistance with learning. Keep up the great work, and don't hesitate to come back with more questions. Happy learning!";
  }
  
  // Check for context from previous messages
  if (hasContext) {
    const lastAssistantMessage = recentMessages.reverse().find(m => m.content.startsWith('Assistant:'));
    if (lastAssistantMessage) {
      return "I see you're continuing our discussion. Let me build on what we talked about earlier. This connects to the previous topic because understanding these relationships helps create a complete picture. What specific aspect would you like me to clarify or expand on?";
    }
  }
  
  // Default educational response
  const defaultResponses = [
    "That's an interesting topic! I'm here to help you learn and understand. To give you the most helpful response, could you provide a bit more detail about what you're trying to learn or accomplish? The more specific you are, the better I can tailor my explanation to your needs.",
    "I appreciate you sharing that with me. As your learning companion, I want to make sure I understand what you need help with. Could you tell me more about the context? Are you working on an assignment, trying to understand a concept, or exploring a topic out of curiosity?",
    "Thanks for reaching out! I'm designed to help students learn effectively. To provide the most valuable assistance, I'd like to understand your question better. What subject area does this relate to, and what would you like to achieve or understand?",
    "I'm here to support your learning journey! Every question is an opportunity to grow. To help you most effectively, could you elaborate on what you're asking? Whether it's homework help, concept explanation, or general learning, I'm ready to assist.",
  ];
  
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

export function useChatSessions() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const sessionsQuery = useQuery<SessionView[]>({
    queryKey: ['sessions'],
    queryFn: async () => {
      // Load sessions from localStorage
      return getStoredSessions();
    },
    enabled: !!actor,
  });

  const addMessageMutation = useMutation({
    mutationFn: async ({ sessionId, content }: { sessionId: string; content: string }) => {
      if (!actor) throw new Error('Actor not initialized');

      const message: Message = {
        id: `${Date.now()}-${Math.random()}`,
        content,
        timestamp: BigInt(Date.now() * 1_000_000),
      };

      // Update localStorage
      const sessions = getStoredSessions();
      const sessionIndex = sessions.findIndex((s) => s.id === sessionId);
      
      if (sessionIndex >= 0) {
        sessions[sessionIndex].messages.push(message);
        sessions[sessionIndex].lastActive = BigInt(Date.now() * 1_000_000);
      } else {
        // Create new session if it doesn't exist
        sessions.push({
          id: sessionId,
          messages: [message],
          lastActive: BigInt(Date.now() * 1_000_000),
        });
      }
      
      saveStoredSessions(sessions);
      return message;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['session', variables.sessionId] });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });

  const createNewSession = async (): Promise<string | null> => {
    if (!actor) return null;

    try {
      // Create a new session ID
      const sessionId = `session-${Date.now()}`;
      
      // Add to localStorage
      const sessions = getStoredSessions();
      sessions.push({
        id: sessionId,
        messages: [],
        lastActive: BigInt(Date.now() * 1_000_000),
      });
      saveStoredSessions(sessions);
      
      // Invalidate queries to refresh the session list
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      
      return sessionId;
    } catch (error) {
      console.error('Failed to create session:', error);
      return null;
    }
  };

  return {
    sessions: sessionsQuery.data || [],
    isLoading: sessionsQuery.isLoading,
    addMessage: (sessionId: string, content: string) =>
      addMessageMutation.mutateAsync({ sessionId, content }),
    isAddingMessage: addMessageMutation.isPending,
    createNewSession,
  };
}

export function useSession(sessionId: string) {
  const { actor } = useActor();

  return useQuery<SessionView>({
    queryKey: ['session', sessionId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      
      // Load from localStorage
      const sessions = getStoredSessions();
      const session = sessions.find((s) => s.id === sessionId);
      
      if (session) {
        return session;
      }
      
      // Return empty session if not found
      return {
        id: sessionId,
        messages: [],
        lastActive: BigInt(Date.now() * 1_000_000),
      };
    },
    enabled: !!actor && !!sessionId,
  });
}
