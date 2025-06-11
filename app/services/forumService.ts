// import AsyncStorage from '@react-native-async-storage/async-storage'; // disabled due to module issue
import authService from './authService';

const ALL_POSTS_KEY = 'forum_posts_all';

// In-memory storage as temporary replacement for AsyncStorage
let memoryStorage: { [key: string]: string } = {};

// Helper functions to replace AsyncStorage
const getItem = async (key: string): Promise<string | null> => {
  return memoryStorage[key] || null;
};

const setItem = async (key: string, value: string): Promise<void> => {
  memoryStorage[key] = value;
};

export interface ForumPost {
  id: number;
  author_id: number;
  author_name: string;
  author_avatar: string;
  title: string;
  content: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  views: number;
  likes: number;
  comments_count: number;
  is_verified_community: boolean;
}

class ForumService {
  private async readAllPosts(): Promise<ForumPost[]> {
    const data = await getItem(ALL_POSTS_KEY);
    return data ? JSON.parse(data) : [];
  }

  private async writeAllPosts(posts: ForumPost[]): Promise<void> {
    await setItem(ALL_POSTS_KEY, JSON.stringify(posts));
  }

  async getForumPosts(isVerified?: boolean): Promise<ForumPost[]> {
    const all = await this.readAllPosts();
    if (isVerified === undefined) return all;
    return all.filter(p => p.is_verified_community === isVerified);
  }

  async getUserPosts(): Promise<ForumPost[]> {
    const user = await authService.getStoredUserData();
    if (!user) return [];
    const all = await this.readAllPosts();
    return all.filter(p => p.author_id === user.id);
  }

  async createForumPost(data: {
    title: string;
    content: string;
    tags: string[];
    isVerified?: boolean;
  }): Promise<{ success: boolean; post?: ForumPost; error?: any }> {
    try {
      const user = await authService.getStoredUserData();
      if (!user) throw new Error('User not found');

      const all = await this.readAllPosts();
      const timestamp = Date.now();
      const isVerified = !!data.isVerified;
      const post: ForumPost = {
        id: timestamp,
        author_id: user.id,
        author_name: user.name,
        author_avatar: user.profile.avatar || '',
        title: data.title,
        content: data.content,
        tags: data.tags,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        views: 0,
        likes: 0,
        comments_count: 0,
        is_verified_community: isVerified,
      };
      const updated = [post, ...all];
      await this.writeAllPosts(updated);

      // update user stats
      await authService.updateStats({ forum_posts: 1 });
      return { success: true, post };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async deleteForumPost(postId: number): Promise<boolean> {
    try {
      const all = await this.readAllPosts();
      const updated = all.filter(p => p.id !== postId);
      await this.writeAllPosts(updated);

      // update user stats
      await authService.updateStats({ forum_posts: -1 });
      return true;
    } catch {
      return false;
    }
  }

  async likeForumPost(postId: number): Promise<boolean> {
    try {
      const all = await this.readAllPosts();
      const updated = all.map(p => {
        if (p.id === postId) return { ...p, likes: p.likes + 1 };
        return p;
      });
      await this.writeAllPosts(updated);
      return true;
    } catch {
      return false;
    }
  }

  async incrementPostViews(postId: number): Promise<boolean> {
    try {
      const all = await this.readAllPosts();
      const updated = all.map(p => {
        if (p.id === postId) return { ...p, views: p.views + 1 };
        return p;
      });
      await this.writeAllPosts(updated);
      return true;
    } catch {
      return false;
    }
  }

  // Track liked posts to prevent double-liking
  private async getUserLikedPosts(): Promise<number[]> {
    const user = await authService.getStoredUserData();
    if (!user) return [];
    const data = await getItem(`liked_posts_${user.id}`);
    return data ? JSON.parse(data) : [];
  }

  private async addToUserLikedPosts(postId: number): Promise<void> {
    const user = await authService.getStoredUserData();
    if (!user) return;
    const likedPosts = await this.getUserLikedPosts();
    if (!likedPosts.includes(postId)) {
      likedPosts.push(postId);
      await setItem(`liked_posts_${user.id}`, JSON.stringify(likedPosts));
    }
  }

  async likeForumPostWithValidation(postId: number): Promise<{ success: boolean; alreadyLiked?: boolean }> {
    try {
      const likedPosts = await this.getUserLikedPosts();
      if (likedPosts.includes(postId)) {
        return { success: false, alreadyLiked: true };
      }

      const all = await this.readAllPosts();
      const updated = all.map(p => {
        if (p.id === postId) return { ...p, likes: p.likes + 1 };
        return p;
      });
      await this.writeAllPosts(updated);
      await this.addToUserLikedPosts(postId);
      return { success: true };
    } catch {
      return { success: false };
    }
  }

  async isPostLikedByUser(postId: number): Promise<boolean> {
    const likedPosts = await this.getUserLikedPosts();
    return likedPosts.includes(postId);
  }

  // Initialize forum with sample posts if empty
  async initializeForumWithSamplePosts(): Promise<void> {
    try {
      const existingPosts = await this.readAllPosts();
      if (existingPosts.length > 0) return; // Already has posts

      const samplePosts: ForumPost[] = [
        {
          id: 1,
          author_id: 0,
          author_name: "Ahmad Rahman",
          author_avatar: "user-circle",
          title: "Exposed: Bank SMS Scam That Nearly Got Me",
          content: "Almost transferred money after receiving a convincing SMS claiming my bank account was compromised. The scammers even knew my partial account details! Here's how I realized it was fake and what red flags to watch for.",
          tags: ["sms scam", "banking", "personal experience", "red flags"],
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          views: 1247,
          likes: 89,
          comments_count: 23,
          is_verified_community: true
        },
        {
          id: 2,
          author_id: 0,
          author_name: "Instagram Official",
          author_avatar: "instagram",
          title: "Official Warning: Instagram Giveaway Scams on the Rise",
          content: "Instagram Security Team alerts users about fraudulent giveaway accounts impersonating verified brands. These scams collect personal information for identity theft. Always verify giveaways through official brand channels and check for verified badges.",
          tags: ["instagram", "giveaway", "official", "security alert"],
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          views: 956,
          likes: 67,
          comments_count: 15,
          is_verified_community: false
        },
        {
          id: 3,
          author_id: 0,
          author_name: "Singapore Police Force",
          author_avatar: "shield",
          title: "SPF Advisory: Car Rental Deposit Scams",
          content: "Singapore Police Force warns against fake car rental websites demanding upfront deposits. Scammers create convincing rental platforms to steal payment information. Always verify rental companies through official directories and avoid suspicious advance payments.",
          tags: ["car rental", "deposit scam", "spf", "official advisory"],
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
          updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          views: 423,
          likes: 34,
          comments_count: 8,
          is_verified_community: false
        },
        {
          id: 4,
          author_id: 0,
          author_name: "Lee Wei Ming",
          author_avatar: "user",
          title: "Shopee Fake Seller Scam: How I Lost $200 But Learned a Lesson",
          content: "Bought what I thought was a great deal on Shopee - iPhone 15 Pro for $300. Seller had good reviews (all fake) and convincing photos. After payment, got blocked immediately. Sharing the warning signs I missed so others don't fall for this.",
          tags: ["shopee scam", "fake seller", "e-commerce", "personal experience"],
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
          updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          views: 789,
          likes: 56,
          comments_count: 12,
          is_verified_community: true
        }
      ];

      await this.writeAllPosts(samplePosts);
    } catch (error) {
      console.error('Error initializing sample posts:', error);
    }
  }

  // Get user's profile image
  async getUserProfileImage(): Promise<string | null> {
    return await authService.getProfileImage();
  }

  // Set user's profile image
  async setUserProfileImage(imageUrl: string): Promise<void> {
    await authService.setProfileImage(imageUrl);
  }
}

export default new ForumService(); 