import { ChakraProvider, Box, Container, Text, extendTheme, GlobalStyle } from '@chakra-ui/react';
import { Chat } from './components/Chat';

// Import Google Fonts in the document head
const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: '#2c1810',
        color: '#2c1810',
        backgroundImage: 'url("https://images.unsplash.com/photo-1654124803544-427d66db4415?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        margin: 0,
        padding: 0,
      },
    },
  },
  fonts: {
    heading: '"Crimson Text", serif',
    body: '"Crimson Text", serif',
    handwriting: '"Caveat", cursive',
  },
});

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Box
        minH="100vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p={2}
        position="relative"
      >
        <Container maxW="900px" position="relative" zIndex={1} p={0}>
          <Box
            bg="rgba(249, 243, 233, 0.08)"
            borderRadius="xl"
            boxShadow="2xl"
            overflow="hidden"
            position="relative"
            maxW="900px"
            mx="auto"
            _before={{
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 0,
              backdropFilter: 'blur(10px)', // Stronger blur behind UI
              WebkitBackdropFilter: 'blur(10px)',
              pointerEvents: 'none',
            }}
            _after={{
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'url("https://www.transparenttextures.com/patterns/old-paper.png")',
              opacity: 0.05,
              pointerEvents: 'none',
              zIndex: 1,
            }}
          >
            <Box
              bg="rgba(139, 69, 19, 0.12)"
              p={4}
              textAlign="center"
              borderBottom="2px solid #6b3410"
              position="relative"
              zIndex={2}
            >
              <Text
                fontSize="2xl"
                fontWeight="bold"
                color="white"
                fontFamily="'Crimson Text', serif"
                textShadow="2px 2px 4px rgba(0,0,0,0.3)"
              >
                Tom Riddle's Diary
              </Text>
            </Box>
            <Chat />
          </Box>
        </Container>
      </Box>
    </ChakraProvider>
  );
}

export default App;
