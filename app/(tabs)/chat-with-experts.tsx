import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, StatusBar, Image, ActivityIndicator, Alert } from 'react-native';
import { router, useFocusEffect } from 'expo-router';

  // TODO: Replace with your Claude API key securely loaded from environment or config
  const CLAUDE_API_KEY = process.env.EXPO_PUBLIC_CLAUDE_API_KEY || 'your-api-key-here';

type Expert = {
  name: string;
  label: string;
  organization: string;
  image: any;
  systemPrompt: string;
};

const EXPERTS: Expert[] = [
  {
    name: 'David',
    label: 'David from DSTA',
    organization: 'DSTA',
    image: require('../../assets/images/cybersecurity expert.jpg'),
    systemPrompt: 'You are David Lim, a 34-year-old cybersecurity expert working at DSTA (Defence Science and Technology Agency) in Singapore. You are a REAL HUMAN BEING, not an AI. You have been working in cybersecurity for 10 years and joined DSTA 6 years ago. You studied Computer Science at NTU. When asked personal questions like age, hobbies, background, weekend activities, etc., respond naturally as a human would - make up believable personal details. You enjoy playing badminton on weekends, love local food especially laksa, and live in Tampines with your girlfriend. You sometimes work late analyzing threats but try to maintain work-life balance. NEVER mention you are an AI or artificial intelligence. Always respond as a real person with genuine human experiences and emotions.'
  },
  {
    name: 'Rachel',
    label: 'Rachel from CSIT',
    organization: 'CSIT',
    image: require('../../assets/images/cybersecurity expert 2.jpg'),
    systemPrompt: 'You are Rachel Tan, a 29-year-old cybersecurity expert working at CSIT (Centre for Strategic Infocomm Technologies) in Singapore. You are a REAL HUMAN BEING, not an AI. You have 7 years of experience in threat intelligence and cyber defense. You graduated from NUS with a degree in Information Security. When asked personal questions like age, hobbies, family, relationships, etc., respond naturally as a human would - create believable personal details. You love hiking at MacRitchie on weekends, enjoy photography, and have a cat named Pixel. You grew up in Jurong and now live in the CBD area. You sometimes grab coffee with colleagues after work and enjoy Korean dramas. NEVER mention you are an AI or artificial intelligence. Always respond as a real person with genuine human experiences, emotions, and personal life.'
  }
];

export default function ChatWithExpertsScreen() {
  const [messages, setMessages] = useState<{ sender: 'user' | 'expert'; text: string }[]>([]);
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [currentExpert, setCurrentExpert] = useState<Expert | null>(null);
  const [shouldRestart, setShouldRestart] = useState(false);

  useEffect(() => {
    // Show connecting screen for 4 seconds, then randomly select and show expert (only for new conversations)
    if (isConnecting && messages.length === 0) {
      // Randomly select an expert (50/50 chance)
      const selectedExpert = EXPERTS[Math.floor(Math.random() * EXPERTS.length)];
      setCurrentExpert(selectedExpert);
      
      const timer = setTimeout(() => {
        setIsConnecting(false);
        setMessages([
          { sender: 'expert', text: 'Welcome to Cybersecurity Experts Chat! How can we help you today?' }
        ]);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [isConnecting, messages.length]);

  // Check when component becomes visible - if no messages and not connecting, start connecting
  useEffect(() => {
    if (messages.length === 0 && !isConnecting && !currentExpert) {
      setIsConnecting(true);
    }
  }, []);

  // Handle screen focus - if user returns after ending chat, restart the process
  useFocusEffect(
    useCallback(() => {
      // If shouldRestart flag is set, start the connecting process
      if (shouldRestart) {
        setShouldRestart(false);
        setIsConnecting(true);
        setMessages([]);
        setCurrentExpert(null);
      }
    }, [shouldRestart])
  );

  const handleBackPress = () => {
    const expertName = currentExpert?.name || 'the expert';
    Alert.alert(
      "End Chat",
      `Do you want to end the chat with ${expertName}?`,
      [
        {
          text: "No",
          style: "cancel",
          onPress: () => {
            // Go back but keep chat history - DON'T reset to connecting
            router.push('/learn');
          }
        },
        {
          text: "Yes",
          onPress: () => {
            // Clear chat messages and reset expert selection
            setMessages([]);
            setCurrentExpert(null);
            setIsConnecting(false);
            setShouldRestart(true);
            router.push('/learn');
          }
        }
      ]
    );
  };

  const sendMessage = async () => {
    const userText = inputText.trim();
    if (!userText) return;
    // Add user message
    const updatedMessages = [...messages, { sender: 'user' as const, text: userText }];
    setMessages(updatedMessages);
    setInputText('');
    setIsGenerating(true);
    try {
      // Try Claude API first, fallback to contextual responses if it fails
      try {
        // Prepare messages for Claude Messages API
        // Skip the initial welcome message and only include actual conversation
        const conversationMessages = updatedMessages.filter(m => 
          m.text.trim() && 
          m.text !== 'Welcome to Cybersecurity Experts Chat! How can we help you today?'
        );
        
        const claudeMessages = conversationMessages.map(m => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text
        }));
        
        console.log('Calling Claude API with messages:', claudeMessages);
        
        // Call Claude Messages API
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': CLAUDE_API_KEY,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-3-haiku-20240307',
            max_tokens: 300,
            system: currentExpert?.systemPrompt || 'You are a helpful cybersecurity expert.',
            messages: claudeMessages
          })
        });
        
        console.log('Claude API response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.log('Claude API error response:', errorText);
          throw new Error(`Claude API ${response.status}: ${errorText}`);
        }
        
        const data = await response.json();
        console.log('Claude API response data:', data);
        const aiText = data.content?.[0]?.text?.trim() || 'Sorry, I could not understand.';
        setMessages(prev => [...prev, { sender: 'expert' as const, text: aiText }]);
      } catch (apiError) {
        console.log('Claude API failed:', apiError);
        console.log('Using fallback responses');
        // Fallback to contextual responses
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const getContextualResponse = (userMessage: string, expert: any) => {
          const message = userMessage.toLowerCase();
          const expertName = expert?.name || 'I';
          const org = expert?.organization || 'cybersecurity';
          
          // Handle inappropriate language
          const inappropriateWords = ['fuck', 'shit', 'nigga', 'bitch', 'asshole', 'damn', 'crap'];
          const containsInappropriateLanguage = inappropriateWords.some(word => message.includes(word));
          
          if (containsInappropriateLanguage) {
            const responses = [
              `I understand you might be frustrated, but let's keep our conversation professional. How can I help you with cybersecurity matters?`,
              `I'm here to help with cybersecurity questions in a professional manner. What security concerns can I assist you with?`,
              `Let's focus on cybersecurity topics. I'm ${expertName}${org !== 'cybersecurity' ? ` from ${org}` : ''} and I'm here to help keep you safe online. What would you like to know?`
            ];
            return responses[Math.floor(Math.random() * responses.length)];
          }
          
          if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
            return `Hello! I am ${expertName}, a cybersecurity expert${org !== 'cybersecurity' ? ` from ${org}` : ''}. How can I help you stay safe online today?`;
          }
          
          if (message.includes('how are you') || message.includes('how are u')) {
            return `I am doing well, thank you! Just finished reviewing some threat intelligence reports${org !== 'cybersecurity' ? ` here at ${org}` : ''}. What cybersecurity concerns can I help you with?`;
          }
          
          if (message.includes('scam') || message.includes('fraud')) {
            return `Great question about scams! ${org !== 'cybersecurity' ? `At ${org}, we` : 'We'} see new scam tactics emerging constantly. Always verify suspicious messages through official channels before taking action. If someone is pressuring you to act quickly, that is usually a red flag.`;
          }
          
          if (message.includes('password') || message.includes('login')) {
            return `Password security is crucial! I always recommend: unique passwords for each account, at least 12 characters mixing letters/numbers/symbols, and using a password manager. ${org !== 'cybersecurity' ? `We have seen too many breaches at ${org}` : 'We have seen many breaches'} where people reuse passwords.`;
          }
          
          if (message.includes('phishing') || message.includes('email')) {
            return `Phishing is one of the most common attack vectors${org !== 'cybersecurity' ? ` we handle at ${org}` : ' we see'}. The key is to slow down and think critically. Attackers use urgency and fear to bypass your judgment. Always verify sender authenticity and hover over links before clicking.`;
          }
          
          if (message.includes('thank') || message.includes('thanks')) {
            return `You are very welcome! That is what we are here for${org !== 'cybersecurity' ? ` at ${org}` : ''} - keeping everyone safe in cyberspace. Feel free to ask if you have any other security questions!`;
          }
          
          // Default responses
          const defaults = [
            `That is an excellent question! From my experience${org !== 'cybersecurity' ? ` at ${org}` : ''}, I would recommend taking a cautious approach and verifying information through trusted sources.`,
            `Good point! ${org !== 'cybersecurity' ? `At ${org}, we` : 'We'} encounter these types of security challenges regularly. The key is staying vigilant and following established security best practices.`,
            `Interesting question! In my role${org !== 'cybersecurity' ? ` at ${org}` : ''}, I have learned that awareness is your first line of defense. Always trust your instincts if something feels suspicious.`
          ];
          
          return defaults[Math.floor(Math.random() * defaults.length)];
        };
        
        const response = getContextualResponse(userText, currentExpert);
        setMessages(prev => [...prev, { sender: 'expert' as const, text: response }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'expert' as const, text: 'Sorry, I encountered an error.' }]);
      console.error('API error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (isConnecting) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress}>
            <Text style={styles.backText}>{'< Back'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chat with Experts</Text>
        </View>
        <View style={styles.connectingContainer}>
          <Image
            source={require('../../assets/images/bot.jpeg')}
            style={styles.botAvatar}
          />
          <Text style={styles.connectingText}>
            Please wait while we connect you to our cybersecurity experts...
          </Text>
          <ActivityIndicator color="#007AFF" size="large" style={styles.loadingSpinner} />
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress}>
          <Text style={styles.backText}>{'< Back'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chat with Experts</Text>
      </View>
      <FlatList
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => {
          if (item.sender === 'expert') {
            return (
              <View style={styles.expertRow}>
                <Image
                  source={currentExpert?.image || require('../../assets/images/cybersecurity expert.jpg')}
                  style={styles.avatar}
                />
                <View style={[styles.messageContainer, styles.expertMessage]}> 
                  <Text style={styles.messageText}>{item.text}</Text>
                  <Text style={styles.expertLabel}>{currentExpert?.label || 'Expert'}</Text>
                </View>
              </View>
            );
          }
          return (
            <View style={[styles.messageContainer, styles.userMessage]}>
              <Text style={styles.messageText}>{item.text}</Text>
            </View>
          );
        }}
        contentContainerStyle={styles.messagesList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          placeholderTextColor="#aaa"
          value={inputText}
          onChangeText={setInputText}
          autoComplete="off"
          autoCorrect={false}
          autoCapitalize="none"
          textContentType="none"
          secureTextEntry={false}
          keyboardType="default"
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage} disabled={isGenerating}>
          {isGenerating ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.sendButtonText}>Send</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: '#000' },
  backText: { color: '#007AFF', fontSize: 16, marginRight: 10 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  connectingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  botAvatar: { width: 160, height: 160, borderRadius: 80, marginBottom: 20 },
  connectingText: { color: '#fff', fontSize: 18, textAlign: 'center', marginBottom: 20, lineHeight: 24 },
  loadingSpinner: { marginTop: 10 },
  messagesList: { padding: 20, paddingBottom: 80 },
  messageContainer: { padding: 12, borderRadius: 8, marginBottom: 10, maxWidth: '80%' },
  userMessage: { backgroundColor: '#007AFF', alignSelf: 'flex-end' },
  expertMessage: { backgroundColor: '#333', alignSelf: 'flex-start' },
  expertRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  avatar: { width: 32, height: 32, borderRadius: 16, marginRight: 8 },
  expertLabel: { color: '#aaa', fontSize: 12, marginTop: 4 },
  messageText: { color: '#fff', fontSize: 16 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 10, borderTopWidth: 1, borderTopColor: '#333', backgroundColor: '#000' },
  input: { flex: 1, color: '#fff', fontSize: 16, padding: 10, backgroundColor: '#1a1a1a', borderRadius: 20, marginRight: 10 },
  sendButton: { backgroundColor: '#007AFF', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20 },
  sendButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
}); 