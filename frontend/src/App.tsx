import { ChakraProvider, Box, extendTheme } from '@chakra-ui/react';
import { Chat } from './components/Chat';

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: '#f0e6d2',
        color: '#2c1810',
        backgroundImage: 'url("https://www.transparenttextures.com/patterns/old-map.png")',
        backgroundBlendMode: 'overlay',
      },
    },
  },
  fonts: {
    heading: '"Crimson Text", serif',
    body: '"Crimson Text", serif',
  },
});

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        py={8}
        px={4}
      >
        <Box
          w="full"
          maxW="1200px"
          display="flex"
          bg="#f0e6d2"
          borderRadius="xl"
          boxShadow="0 0 20px rgba(0,0,0,0.3)"
          position="relative"
          overflow="hidden"
          _before={{
            content: '""',
            position: 'absolute',
            top: 0,
            left: '50%',
            width: '1px',
            height: '100%',
            background: 'linear-gradient(to bottom, #8b4513 0%, #d2b48c 50%, #8b4513 100%)',
            boxShadow: '0 0 10px rgba(0,0,0,0.2)',
            zIndex: 2,
          }}
        >
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            height="40px"
            bg="#8b4513"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="#f0e6d2"
            fontFamily="'Crimson Text', serif"
            fontSize="xl"
            textShadow="2px 2px 4px rgba(0,0,0,0.3)"
            zIndex={3}
          >
            Tom Riddle's Diary
          </Box>
          <Box pt="40px" w="full">
            <Chat />
          </Box>
        </Box>
      </Box>
    </ChakraProvider>
  );
}

export default App;
