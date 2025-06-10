import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, StatusBar, Image } from 'react-native';
import { router } from 'expo-router';

export default function ChatWithExpertsScreen() {
  const [messages, setMessages] = useState<{ sender: 'user' | 'expert'; text: string }[]>([
    { sender: 'expert', text: 'Welcome to Cybersecurity Experts Chat! How can we help you today?' }
  ]);
  const [inputText, setInputText] = useState('');

  const sendMessage = () => {
    if (!inputText.trim()) return;
    setMessages(prev => [...prev, { sender: 'user', text: inputText.trim() }]);
    setInputText('');
    // TODO: Send message to experts via WebSocket or API
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'expert', text: 'Thank you for your question. We will respond shortly.' }]);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/learn')}>
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
                  source={require('@/assets/images/cybersecurity expert.jpg')}
                  style={styles.avatar}
                />
                <View style={[styles.messageContainer, styles.expertMessage]}> 
                  <Text style={styles.messageText}>{item.text}</Text>
                  <Text style={styles.expertLabel}>David from DSTA</Text>
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
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
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