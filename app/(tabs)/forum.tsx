import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { FontAwesome } from '@expo/vector-icons';
import EnhancedBottomNav from '../../components/EnhancedBottomNav';

interface ForumPost {
  id: string;
  title: string;
  description: string;
  author: string;
  avatar: string;
  tags: string[];
  views: string;
  likes: string;
  comments: string;
  image?: string;
}

const mockPosts: ForumPost[] = [
  {
    id: '1',
    title: 'How This WhatsApp Scam Drained $10,000 From an NUS Student\'s Bank Account – And How You Can Avoid It',
    description: '',
    author: 'Alex Chen',
    avatar: 'user',
    tags: ['finance', 'scam', 'cybersecurity'],
    views: '651,324 Views',
    likes: '36,6545 Likes',
    comments: '56 comments',
    image: 'lock'
  },
  {
    id: '2',
    title: 'The Instagram Giveaway Trap That Cost Influencers Their Accounts – What You Need to Know',
    description: 'Fake contests, cloned accounts, and how scammers exploit your followers...',
    author: 'Sarah Kim',
    avatar: 'user',
    tags: ['social media', 'phishing', 'scam'],
    views: '244,564 Views',
    likes: '10,920 Likes',
    comments: '184 comments',
    image: 'exclamation-triangle'
  }
];

// Mock posts for Verified Scam Hunter Community
const mockVerifiedPosts: ForumPost[] = [
  {
    id: 'v1',
    title: 'Govt Portal Phishing Attack Analysis',
    description: 'Community breakdown of the recent phishing scam targeting govt portals.',
    author: 'Hunter A',
    avatar: 'user-secret',
    tags: ['phishing', 'government', 'alert'],
    views: '1,234 Views',
    likes: '123 Likes',
    comments: '45 comments',
    image: 'shield'
  },
  {
    id: 'v2',
    title: 'Payment App OTP Scam Detailed Report',
    description: "Scammers are requesting OTPs via SMS. Here's how to spot and prevent it.",
    author: 'Hunter B',
    avatar: 'user-secret',
    tags: ['payment', 'OTP', 'scam'],
    views: '987 Views',
    likes: '76 Likes',
    comments: '32 comments',
    image: 'exclamation-triangle'
  }
];

export default function ForumScreen() {
  // Forum view state: selector, news, or verified community
  const [forumType, setForumType] = useState<'news' | 'verified'>('news');

  const [searchText, setSearchText] = useState('');
  const [postText, setPostText] = useState('');

  // Reset to news forum when screen gains focus
  useFocusEffect(
    useCallback(() => {
      setForumType('news');
    }, [])
  );

  const handleCreatePost = () => {
    if (postText.trim()) {
      console.log('Creating post:', postText);
      setPostText('');
      // Here you would typically send the post to your backend
    }
  };

  const handleHome = () => {
    router.push('/scam-detection');
  };

  const handleLearn = () => {
    console.log('Learn pressed');
    router.push('/learn');
  };

  const handleStats = () => {
    console.log('Analytics pressed');
    router.push('/analytics');
  };

  const handleForum = () => {
    // Already in forum tab: reset to news
    setForumType('news');
  };

  const handleMyInfo = () => {
    router.push('/(tabs)/my-info');
  };

  // Render Verified Scam Hunter Community
  if (forumType === 'verified') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1 }}>
          <StatusBar barStyle="light-content" backgroundColor="#000" />
          {/* Header with back to selector */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>Verified Scam Hunter Community</Text>
              <TouchableOpacity onPress={() => setForumType('news')} style={styles.selectionButton}>
                <FontAwesome name="newspaper-o" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView contentContainerStyle={styles.postsContainer} showsVerticalScrollIndicator={true} persistentScrollbar={true} indicatorStyle="white">
            {mockVerifiedPosts.map((post) => (
              <View key={post.id} style={styles.postCard}>
                <View style={styles.postHeader}>
                  <View style={styles.postImageContainer}>
                    <View style={styles.postImage}>
                      <FontAwesome name={post.image as any} size={24} color="#fff" />
                    </View>
                  </View>
                  <Text style={styles.postTitle}>{post.title}</Text>
                  <View style={styles.postAuthor}><FontAwesome name={post.avatar as any} size={20} color="#fff" /></View>
                </View>
                {post.description ? <Text style={styles.postDescription}>{post.description}</Text> : null}
                <View style={styles.tagsContainer}>{post.tags.map((tag, i) => <View key={i} style={styles.tag}><Text style={styles.tagText}>{tag}</Text></View>)}</View>
                <View style={styles.postStats}><Text style={styles.statText}>{post.views}</Text><Text style={styles.statText}>{post.likes}</Text><Text style={styles.statText}>{post.comments}</Text></View>
              </View>
            ))}
          </ScrollView>
        </View>
        {/* Enhanced Bottom Navigation */}
        <EnhancedBottomNav
          onTabPress={(tabId) => {
            switch (tabId) {
              case 'home':
                handleHome();
                break;
              case 'learn':
                handleLearn();
                break;
              case 'analytics':
                handleStats();
                break;
              case 'forum':
                handleForum();
                break;
              case 'myInfo':
                handleMyInfo();
                break;
            }
          }}
        />
      </SafeAreaView>
    );
  }
  // Default: existing News Forum UI
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>News Forum</Text>
            <TouchableOpacity onPress={() => setForumType('verified')} style={styles.selectionButton}>
              <FontAwesome name="shield" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search and Profile Bar */}
        <View style={styles.topBar}>
          <View style={styles.searchContainer}>
            <FontAwesome name="search" size={18} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Search..."
              placeholderTextColor="#666"
              autoComplete="off"
              autoCorrect={false}
              autoCapitalize="none"
              textContentType="none"
              secureTextEntry={false}
            />
          </View>
          <TouchableOpacity style={styles.chatIcon}>
            <FontAwesome name="comments" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.notificationIcon}>
            <FontAwesome name="bell" size={20} color="#fff" />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileIcon}>
            <FontAwesome name="user" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Create Post Section */}
        <View style={styles.createPostContainer}>
          <View style={styles.createPostAvatar}>
            <FontAwesome name="user" size={20} color="#fff" />
          </View>
          <TextInput
            style={styles.createPostInput}
            value={postText}
            onChangeText={setPostText}
            placeholder="Let's share what going..."
            placeholderTextColor="#666"
            autoComplete="off"
            autoCorrect={true}
            autoCapitalize="sentences"
            textContentType="none"
            secureTextEntry={false}
            multiline={true}
          />
          <TouchableOpacity style={styles.createPostButton} onPress={handleCreatePost}>
            <Text style={styles.createPostButtonText}>Create Post</Text>
          </TouchableOpacity>
        </View>

        {/* Forum Posts */}
        <ScrollView contentContainerStyle={styles.postsContainer} showsVerticalScrollIndicator={true} persistentScrollbar={true} indicatorStyle="white">
          {mockPosts.map((post) => (
            <View key={post.id} style={styles.postCard}>
              <View style={styles.postHeader}>
                <View style={styles.postImageContainer}>
                  <View style={styles.postImage}>
                    <FontAwesome name={post.image as any} size={24} color="#fff" />
                    {post.id === '1' && (
                      <View style={styles.scamBadge}>
                        <Text style={styles.scamBadgeText}>SCAM</Text>
                      </View>
                    )}
                    {post.id === '2' && (
                      <View style={styles.scamAlertBadge}>
                        <Text style={styles.scamAlertBadgeText}>SCAM ALERT</Text>
                      </View>
                    )}
                  </View>
                </View>
                <Text style={styles.postTitle}>{post.title}</Text>
                <View style={styles.postAuthor}>
                  <FontAwesome name={post.avatar as any} size={20} color="#fff" />
                </View>
              </View>
              {post.description ? (
                <Text style={styles.postDescription}>{post.description}</Text>
              ) : null}
              <View style={styles.tagsContainer}>
                {post.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.postStats}>
                <Text style={styles.statText}>{post.views}</Text>
                <Text style={styles.statText}>{post.likes}</Text>
                <Text style={styles.statText}>{post.comments}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Enhanced Bottom Navigation */}
      <EnhancedBottomNav
        onTabPress={(tabId) => {
          switch (tabId) {
            case 'home':
              handleHome();
              break;
            case 'learn':
              handleLearn();
              break;
            case 'analytics':
              handleStats();
              break;
            case 'forum':
              handleForum();
              break;
            case 'myInfo':
              handleMyInfo();
              break;
          }
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#1a1a1a',
    marginHorizontal: 20,
    borderRadius: 25,
    marginBottom: 20,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  chatIcon: {
    marginLeft: 15,
  },
  chatIconText: {
    fontSize: 20,
  },
  notificationIcon: {
    marginLeft: 15,
    position: 'relative',
  },
  notificationIconText: {
    fontSize: 20,
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    backgroundColor: '#e74c3c',
    borderRadius: 4,
  },
  profileIcon: {
    marginLeft: 15,
    backgroundColor: '#8B4513',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIconText: {
    fontSize: 20,
  },
  createPostContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#1a1a1a',
    marginHorizontal: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  createPostAvatar: {
    backgroundColor: '#8B4513',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  createPostAvatarText: {
    fontSize: 20,
  },
  createPostInput: {
    flex: 1,
    color: '#666',
    fontSize: 16,
    backgroundColor: '#333',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 15,
  },
  createPostButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  createPostButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  postsContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 120,
  },
  postCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  postImageContainer: {
    marginRight: 12,
  },
  postImage: {
    width: 60,
    height: 60,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postImageText: {
    fontSize: 24,
    textAlign: 'center',
  },
  scamBadge: {
    position: 'absolute',
    top: -5,
    left: -5,
    backgroundColor: '#27ae60',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  scamBadgeText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 'bold',
  },
  scamAlertBadge: {
    position: 'absolute',
    top: -5,
    left: -8,
    backgroundColor: '#e74c3c',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  scamAlertBadgeText: {
    color: '#fff',
    fontSize: 7,
    fontWeight: 'bold',
  },
  postTitle: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  postAuthor: {
    marginLeft: 12,
  },
  authorAvatar: {
    width: 32,
    height: 32,
    backgroundColor: '#8B4513',
    borderRadius: 16,
    textAlign: 'center',
    lineHeight: 32,
    fontSize: 20,
  },
  postDescription: {
    color: '#aaa',
    fontSize: 14,
    fontWeight: 'normal',
    lineHeight: 18,
    marginBottom: 12,
    marginLeft: 72,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    marginLeft: 72,
  },
  tag: {
    backgroundColor: '#333',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    color: '#aaa',
    fontSize: 11,
  },
  postStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statText: {
    marginHorizontal: 10,
    color: '#666',
    fontSize: 12,
  },
  selectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  selectionButton: {
    backgroundColor: '#666',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    minWidth: 50,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectionButtonIcon: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
  },
  selectionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  headerLink: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 