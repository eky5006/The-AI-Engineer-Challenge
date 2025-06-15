import { useState, useRef, useEffect } from 'react';
import {
  Box,
  VStack,
  Input,
  Button,
  Text,
  useToast,
  Container,
  Textarea,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { api } from '../services/api';

export const Chat = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [userMessage, setUserMessage] = useState('');
  const [developerMessage, setDeveloperMessage] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const toast = useToast();

  useEffect(() => {
    checkApiHealth();
  }, []);

  const checkApiHealth = async () => {
    try {
      await api.checkHealth();
      setError(null);
    } catch (err) {
      setError('Backend API is not accessible. Please make sure the FastAPI server is running on http://localhost:8000');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!userMessage.trim() || !developerMessage.trim() || !apiKey.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    setMessages((prev) => [...prev, `User: ${userMessage}`]);

    try {
      const stream = await api.sendChatMessage({
        user_message: userMessage,
        developer_message: developerMessage,
        api_key: apiKey,
      });

      const reader = stream.getReader();
      let response = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = new TextDecoder().decode(value);
        response += text;
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = `Assistant: ${response}`;
          return newMessages;
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
      setUserMessage('');
    }
  };

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={4} align="stretch">
        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}

        <FormControl>
          <FormLabel>Developer Message</FormLabel>
          <Textarea
            value={developerMessage}
            onChange={(e) => setDeveloperMessage(e.target.value)}
            placeholder="Enter the developer message..."
          />
        </FormControl>

        <FormControl>
          <FormLabel>API Key</FormLabel>
          <Input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your OpenAI API key..."
          />
        </FormControl>

        <Box
          borderWidth={1}
          borderRadius="md"
          p={4}
          height="400px"
          overflowY="auto"
          bg="gray.50"
        >
          {messages.map((message, index) => (
            <Text key={index} mb={2}>
              {message}
            </Text>
          ))}
          <div ref={messagesEndRef} />
        </Box>

        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <Input
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
            />
            <Button
              type="submit"
              colorScheme="blue"
              isLoading={isLoading}
              width="full"
            >
              Send Message
            </Button>
          </VStack>
        </form>
      </VStack>
    </Container>
  );
}; 