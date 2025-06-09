import React, { useState } from 'react';
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
import { router } from 'expo-router';

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
    avatar: '👨‍💼',
    tags: ['finance', 'scam', 'cybersecurity'],
    views: '651,324 Views',
    likes: '36,6545 Likes',
    comments: '56 comments',
    image: '🔒'
  },
  {
    id: '2',
    title: 'The Instagram Giveaway Trap That Cost Influencers Their Accounts – What You Need to Know',
    description: 'Fake contests, cloned accounts, and how scammers exploit your followers...',
    author: 'Sarah Kim',
    avatar: '👩‍💻',
    tags: ['social media', 'phishing', 'scam'],
    views: '244,564 Views',
    likes: '10,920 Likes',
    comments: '184 comments',
    image: '⚠️'
  }
];

export default function ForumScreen() {
  const [searchText, setSearchText] = useState('');
  const [postText, setPostText] = useState('');

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
    console.log('Forum pressed');
    router.push('/forum');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Forum</Text>
      </View>

      {/* Search and Profile Bar */}
      <View style={styles.topBar}>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search..."
            placeholderTextColor="#666"
          />
        </View>
        <TouchableOpacity style={styles.chatIcon}>
          <Text style={styles.chatIconText}>💬</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.notificationIcon}>
          <Text style={styles.notificationIconText}>🔔</Text>
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.profileIcon}>
          <Text style={styles.profileIconText}>👨‍💼</Text>
        </TouchableOpacity>
      </View>

      {/* Create Post Section */}
      <View style={styles.createPostContainer}>
        <View style={styles.createPostAvatar}>
          <Text style={styles.createPostAvatarText}>👨‍💼</Text>
        </View>
        <TextInput
          style={styles.createPostInput}
          value={postText}
          onChangeText={setPostText}
          placeholder="Let's share what going..."
          placeholderTextColor="#666"
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
                  <Text style={styles.postImageText}>{post.image}</Text>
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
                <Text style={styles.authorAvatar}>{post.avatar}</Text>
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

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={handleHome}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={handleLearn}>
          <Text style={styles.navIcon}>📚</Text>
          <Text style={styles.navText}>Learn</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={handleStats}>
          <Text style={styles.navIcon}>📊</Text>
          <Text style={styles.navText}>Analytics</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.activeNavItem]} onPress={handleForum}>
          <Text style={styles.navIcon}>💬</Text>
          <Text style={[styles.navText, styles.activeNavText]}>Forum</Text>
        </TouchableOpacity>
      </View>
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
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
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
    fontSize: 18,
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
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#2a2a2a',
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'space-around',
  },
  navItem: {
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 5,
  },
  navText: {
    color: '#fff',
    fontSize: 12,
  },
  activeNavItem: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  activeNavText: {
    color: '#007AFF',
  },
}); 