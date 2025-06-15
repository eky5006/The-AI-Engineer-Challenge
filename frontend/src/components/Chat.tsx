import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Grid,
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
  const [developerMessage, setDeveloperMessage] = useState('You are Tom Riddle from the Harry Potter universe. You are speaking to me from inside your diary as I\'m writing to you');
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
    setMessages((prev) => [...prev, `You: ${userMessage}`]);

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
          newMessages[newMessages.length - 1] = `Tom Riddle: ${response}`;
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
    <Container maxW="container.xl" p={0}>
      <Grid templateColumns="1fr 1fr" gap={0} h="calc(100vh - 120px)">
        {/* Left Page */}
        <Box
          p={4}
          bg="rgba(249, 243, 233, 0.07)"
          position="relative"
          _before={{
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("https://www.transparenttextures.com/patterns/old-paper.png")',
            opacity: 0.03,
            pointerEvents: 'none',
          }}
        >
          <VStack spacing={6} align="stretch" position="relative" zIndex={1}>
            {error && (
              <Alert status="error" bg="red.100" color="red.800">
                <AlertIcon />
                {error}
              </Alert>
            )}

            <FormControl>
              <FormLabel color="#2c1810" fontSize="lg">Developer Message</FormLabel>
              <Textarea
                value={developerMessage}
                onChange={(e) => setDeveloperMessage(e.target.value)}
                placeholder="Enter the developer message..."
                bg="rgba(255, 255, 255, 0.9)"
                color="#2c1810"
                borderColor="#8b4513"
                _hover={{ borderColor: '#8b4513' }}
                _focus={{ borderColor: '#8b4513', boxShadow: '0 0 0 1px #8b4513' }}
                fontFamily="'Caveat', cursive"
                fontSize="2xl"
                minH="200px"
              />
            </FormControl>

            <FormControl>
              <FormLabel color="#2c1810" fontSize="lg">API Key</FormLabel>
              <Input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your OpenAI API key..."
                bg="rgba(255, 255, 255, 0.9)"
                color="#2c1810"
                borderColor="#8b4513"
                _hover={{ borderColor: '#8b4513' }}
                _focus={{ borderColor: '#8b4513', boxShadow: '0 0 0 1px #8b4513' }}
                fontFamily="'Caveat', cursive"
                fontSize="lg"
                height="50px"
              />
            </FormControl>
          </VStack>
        </Box>

        {/* Right Page */}
        <Box
          p={4}
          bg="rgba(249, 243, 233, 0.07)"
          position="relative"
          _before={{
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("https://www.transparenttextures.com/patterns/old-paper.png")',
            opacity: 0.03,
            pointerEvents: 'none',
          }}
        >
          <VStack spacing={6} align="stretch" h="full" position="relative" zIndex={1}>
            <Box
              flex={1}
              overflowY="auto"
              pr={4}
              sx={{
                '&::-webkit-scrollbar': {
                  width: '4px',
                },
                '&::-webkit-scrollbar-track': {
                  width: '6px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#8b4513',
                  borderRadius: '24px',
                },
              }}
            >
              {messages.map((message, index) => (
                <Text 
                  key={index} 
                  mb={6} 
                  color="#2c1810"
                  fontFamily="'Caveat', cursive"
                  fontSize="2xl"
                  lineHeight="1.8"
                  whiteSpace="pre-wrap"
                  _before={{
                    content: '""',
                    display: 'block',
                    width: '100%',
                    height: '1px',
                    bg: '#8b4513',
                    mb: 4,
                    opacity: 0.3,
                  }}
                >
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
                  placeholder="Write in the diary..."
                  disabled={isLoading}
                  bg="rgba(255, 255, 255, 0.9)"
                  color="#2c1810"
                  borderColor="#8b4513"
                  _hover={{ borderColor: '#8b4513' }}
                  _focus={{ borderColor: '#8b4513', boxShadow: '0 0 0 1px #8b4513' }}
                  fontFamily="'Caveat', cursive"
                  fontSize="2xl"
                  height="50px"
                />
                <Button
                  type="submit"
                  isLoading={isLoading}
                  width="full"
                  bg="#8b4513"
                  color="white"
                  _hover={{ bg: '#6b3410' }}
                  fontFamily="'Crimson Text', serif"
                  fontSize="lg"
                  height="50px"
                >
                  Send Message
                </Button>
              </VStack>
            </form>
          </VStack>
        </Box>
      </Grid>
    </Container>
  );
}; 