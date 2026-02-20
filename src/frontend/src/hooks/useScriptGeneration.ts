import { useState } from 'react';

export interface ScriptMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: number;
}

export function useScriptGeneration() {
  const [messages, setMessages] = useState<ScriptMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateScript = async (userRequest: string): Promise<void> => {
    setIsGenerating(true);

    // Add user message
    const userMessage: ScriptMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: userRequest,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 700));

    // Generate mock script based on user request
    const generatedScript = generateMockScript(userRequest);

    const aiMessage: ScriptMessage = {
      id: `ai-${Date.now()}`,
      type: 'ai',
      content: generatedScript,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, aiMessage]);
    setIsGenerating(false);
  };

  const clearHistory = () => {
    setMessages([]);
  };

  return {
    messages,
    isGenerating,
    generateScript,
    clearHistory,
  };
}

function generateMockScript(request: string): string {
  const lowerRequest = request.toLowerCase();

  // React component
  if (lowerRequest.includes('react') || lowerRequest.includes('component')) {
    return `import React, { useState } from 'react';

export function MyComponent() {
  const [count, setCount] = useState(0);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Counter: {count}</h1>
      <button 
        onClick={() => setCount(count + 1)}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Increment
      </button>
    </div>
  );
}`;
  }

  // Python script
  if (lowerRequest.includes('python')) {
    return `def main():
    """Main function for the script"""
    print("Hello from Python!")
    
    # Example list processing
    numbers = [1, 2, 3, 4, 5]
    squared = [n ** 2 for n in numbers]
    
    print(f"Original: {numbers}")
    print(f"Squared: {squared}")

if __name__ == "__main__":
    main()`;
  }

  // JavaScript/Node.js
  if (lowerRequest.includes('javascript') || lowerRequest.includes('node')) {
    return `// Node.js script example
const fs = require('fs');
const path = require('path');

async function main() {
  console.log('Script started...');
  
  // Example: Read and process data
  const data = { message: 'Hello World', timestamp: Date.now() };
  
  console.log('Processing:', data);
  
  // Your logic here
  return data;
}

main()
  .then(result => console.log('Success:', result))
  .catch(err => console.error('Error:', err));`;
  }

  // API/fetch
  if (lowerRequest.includes('api') || lowerRequest.includes('fetch')) {
    return `async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    const data = await response.json();
    console.log('Data received:', data);
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

fetchData();`;
  }

  // Calculator/math
  if (lowerRequest.includes('calculator') || lowerRequest.includes('math')) {
    return `class Calculator {
  add(a, b) {
    return a + b;
  }
  
  subtract(a, b) {
    return a - b;
  }
  
  multiply(a, b) {
    return a * b;
  }
  
  divide(a, b) {
    if (b === 0) {
      throw new Error('Cannot divide by zero');
    }
    return a / b;
  }
}

// Usage
const calc = new Calculator();
console.log('5 + 3 =', calc.add(5, 3));
console.log('10 - 4 =', calc.subtract(10, 4));
console.log('6 * 7 =', calc.multiply(6, 7));
console.log('15 / 3 =', calc.divide(15, 3));`;
  }

  // Form validation
  if (lowerRequest.includes('form') || lowerRequest.includes('validation')) {
    return `function validateForm(formData) {
  const errors = {};
  
  // Email validation
  if (!formData.email || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  // Password validation
  if (!formData.password || formData.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }
  
  // Name validation
  if (!formData.name || formData.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

// Example usage
const result = validateForm({
  email: 'user@example.com',
  password: 'securepass123',
  name: 'John Doe'
});

console.log(result);`;
  }

  // Default generic script
  return `// Script generated based on your request
function processData(input) {
  console.log('Processing:', input);
  
  // Add your logic here
  const result = {
    input: input,
    processed: true,
    timestamp: new Date().toISOString()
  };
  
  return result;
}

// Example usage
const data = processData('${request.slice(0, 30)}...');
console.log('Result:', data);

// TODO: Customize this script based on your specific needs`;
}
