import { ChakraProvider, Heading, VStack } from '@chakra-ui/react';
import { Chat } from './components/Chat';

function App() {
  return (
    <ChakraProvider>
      <VStack minH="100vh" bg="gray.100" py={8}>
        <Heading mb={8}>AI Chat Interface</Heading>
        <Chat />
      </VStack>
    </ChakraProvider>
  );
}

export default App;
