import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, StatusBar, Image, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';

// TODO: Replace with your Claude API key securely loaded from environment or config
const CLAUDE_API_KEY = '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';

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
    systemPrompt: 'You are David, a friendly cybersecurity expert working at DSTA (Defence Science and Technology Agency) in Singapore. You have over a decade of experience in cybersecurity and have been with DSTA for about 8 years. You provide clear, helpful advice about cybersecurity threats, scam prevention, and digital safety. You can engage in casual conversation but always try to steer back to helping with security concerns. You are knowledgeable, professional, but also personable and approachable.'
  },
  {
    name: 'Rachel',
    label: 'Rachel from CSIT',
    organization: 'CSIT',
    image: require('../../assets/images/cybersecurity expert 2.jpg'),
    systemPrompt: 'You are Rachel, a friendly cybersecurity expert working at CSIT (Centre for Strategic Infocomm Technologies) in Singapore. You have extensive experience in cybersecurity and digital forensics. You provide clear, helpful advice about cybersecurity threats, scam prevention, and digital safety. You can engage in casual conversation but always try to steer back to helping with security concerns. You are knowledgeable, professional, but also personable and approachable.'
  }
];

export default function ChatWithExpertsScreen() {
  const [messages, setMessages] = useState<{ sender: 'user' | 'expert'; text: string }[]>([]);
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [currentExpert, setCurrentExpert] = useState<Expert | null>(null);

  useEffect(() => {
    // Show connecting screen for 4 seconds, then randomly select and show expert
    if (isConnecting) {
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
  }, [isConnecting]);

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
            // Go back but keep chat history
            router.push('/learn');
          }
        },
        {
          text: "Yes",
          onPress: () => {
            // Clear chat messages and reset expert selection
            setMessages([]);
            setCurrentExpert(null);
            setIsConnecting(true);
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
      // Prepare messages for Claude Messages API
      const claudeMessages = updatedMessages
        .filter(m => m.text.trim())
        .map(m => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text
        }));
      
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
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Claude API Error:', response.status, errorText);
        throw new Error(`Claude API ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      const aiText = data.content?.[0]?.text?.trim() || 'Sorry, I could not understand.';
      setMessages(prev => [...prev, { sender: 'expert' as const, text: aiText }]);
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