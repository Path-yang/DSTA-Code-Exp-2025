import React, { useState, useCallback, useEffect } from 'react';
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
  Alert,
  ActivityIndicator
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { FontAwesome } from '@expo/vector-icons';
import EnhancedBottomNav from '../../components/EnhancedBottomNav';
import forumService, { ForumPost } from '../services/forumService';
import { useUser } from '../context/UserContext';
import authService from '../services/authService';

export default function ForumScreen() {
  // Get user context
  const { user } = useUser();
  const userId = user?.id;

  // Forum view state: selector, news, or verified community
  const [forumType, setForumType] = useState<'news' | 'verified' | 'my-posts'>('news');
  const [searchText, setSearchText] = useState('');
  const [postText, setPostText] = useState('');
  
  // Posts state
  const [isLoading, setIsLoading] = useState(true);
  const [regularPosts, setRegularPosts] = useState<ForumPost[]>([]);
  const [verifiedPosts, setVerifiedPosts] = useState<ForumPost[]>([]);
  const [userPosts, setUserPosts] = useState<ForumPost[]>([]);
  const [userProfileImage, setUserProfileImage] = useState<string | null>(null);

  // Function to fetch posts
  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      // Initialize sample posts if needed
      await forumService.initializeForumWithSamplePosts();
      
      // Fetch regular posts
      const regular = await forumService.getForumPosts(false);
      setRegularPosts(regular);
      
      // Fetch verified posts
      const verified = await forumService.getForumPosts(true);
      setVerifiedPosts(verified);
      
      // Fetch user's posts
      const userPostsData = await forumService.getUserPosts();
      setUserPosts(userPostsData);
      
      // Get user's profile image
      const profileImg = await forumService.getUserProfileImage();
      setUserProfileImage(profileImg);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Reset to news forum and fetch posts when screen gains focus
  useFocusEffect(
    useCallback(() => {
      setForumType('news');
      fetchPosts();
    }, [fetchPosts])
  );

  // Filter posts based on search text
  const filterPosts = (posts: ForumPost[]) => {
    if (!searchText.trim()) return posts;
    return posts.filter(post => 
      post.title.toLowerCase().includes(searchText.toLowerCase()) ||
      post.content.toLowerCase().includes(searchText.toLowerCase()) ||
      post.tags.some((tag: string) => tag.toLowerCase().includes(searchText.toLowerCase()))
    );
  };

  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInMs = now.getTime() - postDate.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return postDate.toLocaleDateString();
  };

  // Render main post image (left side)
  const renderMainPostImage = (post: ForumPost) => {
    // News Forum posts (id 2 = Instagram, id 3 = Car Rental)
    if (post.id === 2) {
      return (
        <Image
          source={require('../../assets/images/IG scam.jpeg')}
          style={{ width: 60, height: 60, borderRadius: 8 }}
          resizeMode="cover"
        />
      );
    } else if (post.id === 3) {
      return (
        <Image
          source={require('../../assets/images/car rental spf .jpeg')}
          style={{ width: 60, height: 60, borderRadius: 8 }}
          resizeMode="cover"
        />
      );
    } else if (post.id === 1) {
      // Verified Community - Ahmad's bank scam post
      return (
        <Image
          source={require('../../assets/images/bank scam.jpeg')}
          style={{ width: 60, height: 60, borderRadius: 8 }}
          resizeMode="cover"
        />
      );
    } else if (post.id === 4) {
      // Verified Community - Lee's shopee scam post
      return (
        <Image
          source={require('../../assets/images/shopee scam.jpeg')}
          style={{ width: 60, height: 60, borderRadius: 8 }}
          resizeMode="cover"
        />
      );
    } else {
      // Default for other posts
      return (
        <FontAwesome 
          name="file-text" 
          size={30} 
          color="#666" 
        />
      );
    }
  };

  // Render user avatar for posts (right side - profile pictures)
  const renderPostAvatar = (post: ForumPost) => {
    const isCurrentUserPost = post.author_id === userId;
    
    if (isCurrentUserPost && userProfileImage) {
      // Show user's profile image for their own posts
      if (userProfileImage.startsWith('https://')) {
        return (
          <Image
            source={{ uri: userProfileImage }}
            style={{ width: 28, height: 28, borderRadius: 14 }}
            resizeMode="cover"
          />
        );
      } else {
        return (
          <FontAwesome 
            name={userProfileImage as any} 
            size={20} 
            color="#fff" 
          />
        );
      }
    }
    
    // Use Instagram logo for Instagram Official (post id 2)
    if (post.id === 2) {
      return (
        <Image
          source={require('../../assets/images/IG.jpeg')}
          style={{ width: 24, height: 24, borderRadius: 12 }}
          resizeMode="cover"
        />
      );
    } else if (post.id === 3) {
      // Use SPF logo for Singapore Police Force (post id 3)
      return (
        <Image
          source={require('../../assets/images/SPF.jpeg')}
          style={{ width: 24, height: 24, borderRadius: 12 }}
          resizeMode="cover"
        />
      );
    } else if (post.id === 1) {
      // Use Ahmad's profile picture for post id 1
      return (
        <Image
          source={require('../../assets/images/Ahmad.jpeg')}
          style={{ width: 24, height: 24, borderRadius: 12 }}
          resizeMode="cover"
        />
      );
    } else if (post.id === 4) {
      // Use Lee's profile picture for post id 4
      return (
        <Image
          source={require('../../assets/images/Lee.jpeg')}
          style={{ width: 24, height: 24, borderRadius: 12 }}
          resizeMode="cover"
        />
      );
    } else {
      return (
        <FontAwesome 
          name={typeof post.author_avatar === 'string' && post.author_avatar.length > 2 ? post.author_avatar as any : 'user'} 
          size={24} 
          color="#fff" 
        />
      );
    }
  };

  const handleCreatePost = (isVerified?: boolean) => {
    const url = isVerified ? '/create-post?verified=true' : '/create-post';
    router.push(url);
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

  const handleDeletePost = (postId: number) => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const success = await forumService.deleteForumPost(postId);
              if (success) {
                // Update user posts list
                setUserPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
                Alert.alert('Success', 'Post deleted successfully');
              } else {
                Alert.alert('Error', 'Failed to delete post');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to delete post');
            }
          }
        }
      ]
    );
  };

  const handleLikePost = async (postId: number) => {
    try {
      const result = await forumService.likeForumPostWithValidation(postId);
      if (result.success) {
        // Refresh posts to show updated like count
        fetchPosts();
      } else if (result.alreadyLiked) {
        Alert.alert('Already Liked', 'You have already liked this post');
      } else {
        Alert.alert('Error', 'Failed to like post');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to like post');
    }
  };

  const handleViewPost = async (postId: number) => {
    // Increment view count when user taps on a post
    await forumService.incrementPostViews(postId);
    // Could navigate to detailed post view here in the future
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Initialize default profile images if none exist
        authService.initializeDefaultProfileImages();
        
        // Load user's profile image
        const profileImage = await forumService.getUserProfileImage();
        setUserProfileImage(profileImage);
        
        // Initialize forum with sample posts
        await forumService.initializeForumWithSamplePosts();
        
        // Load posts based on forum type
        const posts = await forumService.getForumPosts(forumType === 'verified');
        if (forumType === 'my-posts') {
          const myPosts = await forumService.getUserPosts();
          setUserPosts(myPosts);
        } else {
          setUserPosts(posts);
        }
      } catch (error) {
        console.error('Error loading forum data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [forumType]);

  // My Posts View
  if (forumType === 'my-posts') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1 }}>
          <StatusBar barStyle="light-content" backgroundColor="#000" />
          {/* Header with back to selector */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>My Posts</Text>
              <TouchableOpacity onPress={() => setForumType('news')} style={styles.selectionButton}>
                <FontAwesome name="newspaper-o" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
          
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#e74c3c" />
              <Text style={styles.loadingText}>Loading posts...</Text>
            </View>
          ) : userPosts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <FontAwesome name="file-text-o" size={60} color="#333" />
              <Text style={styles.emptyText}>You haven't created any posts yet</Text>
              <TouchableOpacity 
                style={styles.createEmptyButton}
                onPress={() => handleCreatePost()}
              >
                <Text style={styles.createEmptyButtonText}>Create Your First Post</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView contentContainerStyle={styles.postsContainer} showsVerticalScrollIndicator={true} persistentScrollbar={true} indicatorStyle="white">
              {userPosts.map((post) => (
                <View key={post.id} style={styles.postCard}>
                  <View style={styles.postHeader}>
                    <View style={styles.postImageContainer}>
                      <View style={styles.postImage}>
                        {renderMainPostImage(post)}
                      </View>
                    </View>
                    <Text style={styles.postTitle}>{post.title}</Text>
                    <TouchableOpacity 
                      style={styles.deleteButton}
                      onPress={() => post.id && handleDeletePost(post.id)}
                    >
                      <FontAwesome name="trash" size={18} color="#e74c3c" />
                    </TouchableOpacity>
                  </View>
                  {post.content ? <Text style={styles.postDescription}>{post.content}</Text> : null}
                  <View style={styles.tagsContainer}>
                    {post.tags.map((tag: string, i: number) => (
                      <View key={i} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                  <View style={styles.postStats}>
                    <View style={styles.statItem}>
                      <FontAwesome name="eye" size={14} color="#666" />
                      <Text style={styles.statText}>{post.views || 0}</Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.statItem}
                      onPress={() => post.id && handleLikePost(post.id)}
                    >
                      <FontAwesome name="heart" size={14} color="#e74c3c" />
                      <Text style={styles.statText}>{post.likes || 0}</Text>
                    </TouchableOpacity>
                    <View style={styles.statItem}>
                      <FontAwesome name="comment" size={14} color="#666" />
                      <Text style={styles.statText}>{post.comments_count || 0}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
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

  // Render Verified Scam Hunter Community
  if (forumType === 'verified') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1 }}>
          <StatusBar barStyle="light-content" backgroundColor="#000" />
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>Verified Scam Hunter Community</Text>
              <View style={styles.headerButtons}>
                <TouchableOpacity onPress={() => setForumType('news')} style={styles.selectionButton}>
                  <FontAwesome name="newspaper-o" size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setForumType('my-posts')} style={[styles.selectionButton, styles.myPostsButton]}>
                  <FontAwesome name="edit" size={18} color="#8B4513" />
                </TouchableOpacity>
              </View>
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
          </View>

          {/* Create Post Section */}
          <View style={styles.createPostContainer}>
            <View style={styles.createPostAvatar}>
              {userProfileImage ? (
                userProfileImage.startsWith('https://') ? (
                  <Image
                    source={{ uri: userProfileImage }}
                    style={{ width: 36, height: 36, borderRadius: 18 }}
                    resizeMode="cover"
                  />
                ) : (
                  <FontAwesome name={userProfileImage as any} size={28} color="#fff" />
                )
              ) : (
                <FontAwesome name="user" size={28} color="#fff" />
              )}
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
            <TouchableOpacity style={styles.createPostButton} onPress={() => handleCreatePost(true)}>
              <Text style={styles.createPostButtonText}>Create Post</Text>
            </TouchableOpacity>
          </View>

          {/* Forum Posts */}
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#e74c3c" />
              <Text style={styles.loadingText}>Loading posts...</Text>
            </View>
          ) : (
            <ScrollView contentContainerStyle={styles.postsContainer} showsVerticalScrollIndicator={true} persistentScrollbar={true} indicatorStyle="white">
              {filterPosts(verifiedPosts).map((post) => (
                <View key={post.id} style={styles.postCard}>
                  <View style={styles.postHeader}>
                    <View style={styles.postImageContainer}>
                      <View style={styles.postImage}>
                        {renderMainPostImage(post)}
                      </View>
                    </View>
                    <Text style={styles.postTitle}>{post.title}</Text>
                    <View style={styles.postAuthor}>
                      {renderPostAvatar(post)}
                    </View>
                  </View>
                  {post.content ? (
                    <Text style={styles.postDescription}>{post.content}</Text>
                  ) : null}
                  <View style={styles.tagsContainer}>
                    {post.tags.map((tag: string, i: number) => (
                      <View key={i} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                  <View style={styles.postStats}>
                    <View style={styles.statItem}>
                      <FontAwesome name="eye" size={14} color="#666" />
                      <Text style={styles.statText}>{post.views || 0}</Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.statItem}
                      onPress={() => post.id && handleLikePost(post.id)}
                    >
                      <FontAwesome name="heart" size={14} color="#e74c3c" />
                      <Text style={styles.statText}>{post.likes || 0}</Text>
                    </TouchableOpacity>
                    <View style={styles.statItem}>
                      <FontAwesome name="comment" size={14} color="#666" />
                      <Text style={styles.statText}>{post.comments_count || 0}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
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
            <View style={styles.headerButtons}>
              <TouchableOpacity onPress={() => setForumType('verified')} style={styles.selectionButton}>
                <FontAwesome name="shield" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setForumType('my-posts')} style={[styles.selectionButton, styles.myPostsButton]}>
                <FontAwesome name="edit" size={18} color="#8B4513" />
              </TouchableOpacity>
            </View>
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
        </View>

        {/* Create Post Section */}
        <View style={styles.createPostContainer}>
          <View style={styles.createPostAvatar}>
            {userProfileImage ? (
              userProfileImage.startsWith('https://') ? (
                <Image
                  source={{ uri: userProfileImage }}
                  style={{ width: 36, height: 36, borderRadius: 18 }}
                  resizeMode="cover"
                />
              ) : (
                <FontAwesome name={userProfileImage as any} size={28} color="#fff" />
              )
            ) : (
              <FontAwesome name="user" size={28} color="#fff" />
            )}
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
          <TouchableOpacity style={styles.createPostButton} onPress={() => handleCreatePost()}>
            <Text style={styles.createPostButtonText}>Create Post</Text>
          </TouchableOpacity>
        </View>

        {/* Forum Posts */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#e74c3c" />
            <Text style={styles.loadingText}>Loading posts...</Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.postsContainer} showsVerticalScrollIndicator={true} persistentScrollbar={true} indicatorStyle="white">
            {filterPosts(regularPosts).map((post) => (
              <View key={post.id} style={styles.postCard}>
                <View style={styles.postHeader}>
                  <View style={styles.postImageContainer}>
                    <View style={styles.postImage}>
                      {renderMainPostImage(post)}
                    </View>
                  </View>
                  <Text style={styles.postTitle}>{post.title}</Text>
                  <View style={styles.postAuthor}>
                    {renderPostAvatar(post)}
                  </View>
                </View>
                {post.content ? (
                  <Text style={styles.postDescription}>{post.content}</Text>
                ) : null}
                <View style={styles.tagsContainer}>
                  {post.tags.map((tag: string, i: number) => (
                    <View key={i} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.postStats}>
                  <View style={styles.statItem}>
                    <FontAwesome name="eye" size={14} color="#666" />
                    <Text style={styles.statText}>{post.views || 0}</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.statItem}
                    onPress={() => post.id && handleLikePost(post.id)}
                  >
                    <FontAwesome name="heart" size={14} color="#e74c3c" />
                    <Text style={styles.statText}>{post.likes || 0}</Text>
                  </TouchableOpacity>
                  <View style={styles.statItem}>
                    <FontAwesome name="comment" size={14} color="#666" />
                    <Text style={styles.statText}>{post.comments_count || 0}</Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
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
  headerButtons: {
    flexDirection: 'row',
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
    overflow: 'hidden',
  },
  postImageAsset: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  postImageText: {
    fontSize: 24,
    textAlign: 'center',
  },
  scamBadge: {
    position: 'absolute',
    top: 5,
    left: 5,
    backgroundColor: '#27ae60',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 1,
  },
  scamBadgeText: {
    color: '#fff',
    fontSize: 8,
  },
  postTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  postAuthor: {
    width: 32,
    height: 32,
    backgroundColor: '#8B4513',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
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
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: 5,
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
  myPostsButton: {
    marginLeft: 10,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  emptyText: {
    color: '#aaa',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  createEmptyButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  createEmptyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  deleteButton: {
    padding: 8,
  },
}); 