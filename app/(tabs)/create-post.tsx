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
    Alert,
    ActivityIndicator
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import forumService from '../services/forumService';

export default function CreatePostScreen() {
    const [postTitle, setPostTitle] = useState('');
    const [postContent, setPostContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [isPosting, setIsPosting] = useState(false);

    const params = useLocalSearchParams();
    const isVerified = params.verified === 'true';

    // Available tags for scam-related posts
    const availableTags = [
        'scam', 'phishing', 'cybersecurity', 'finance', 'social media',
        'payment', 'OTP', 'government', 'alert', 'warning', 'prevention'
    ];

    const handleBack = () => {
        router.push('/forum');
    };

    const toggleTag = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    const handleCreatePost = async () => {
        if (!postTitle.trim()) {
            Alert.alert('Error', 'Please enter a post title');
            return;
        }

        if (!postContent.trim()) {
            Alert.alert('Error', 'Please enter post content');
            return;
        }

        if (selectedTags.length === 0) {
            Alert.alert('Error', 'Please select at least one tag');
            return;
        }

        setIsPosting(true);

        try {
            // Create post using forum service
            const result = await forumService.createForumPost({
                title: postTitle,
                content: postContent,
                image_url: imageUrl.trim() || undefined,
                tags: selectedTags,
                isVerified
            });

            if (result.success) {
                // Clear the form entries
                setPostTitle('');
                setPostContent('');
                setImageUrl('');
                setSelectedTags([]);

                // Show success alert and navigate back to forum page
                Alert.alert(
                    'Success',
                    'Your post has been created successfully!',
                    [{ text: 'OK', onPress: () => router.push('/forum') }]
                );
            } else {
                Alert.alert('Error', result.error?.message || 'Failed to create post. Please try again.');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to create post. Please try again.');
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <FontAwesome name="arrow-left" size={20} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Create Post</Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Post Title */}
                <View style={styles.inputSection}>
                    <Text style={styles.label}>Post Title</Text>
                    <TextInput
                        style={styles.titleInput}
                        value={postTitle}
                        onChangeText={setPostTitle}
                        placeholder="Enter your post title..."
                        placeholderTextColor="#666"
                        maxLength={100}
                    />
                    <Text style={styles.charCount}>{postTitle.length}/100</Text>
                </View>

                {/* Post Content */}
                <View style={styles.inputSection}>
                    <Text style={styles.label}>Post Content</Text>
                    <TextInput
                        style={styles.contentInput}
                        value={postContent}
                        onChangeText={setPostContent}
                        placeholder="Share your experience, warnings, or insights about scams..."
                        placeholderTextColor="#666"
                        multiline={true}
                        textAlignVertical="top"
                        maxLength={500}
                    />
                    <Text style={styles.charCount}>{postContent.length}/500</Text>
                </View>

                {/* Image URL */}
                <View style={styles.inputSection}>
                    <Text style={styles.label}>Image URL (Optional)</Text>
                    <TextInput
                        style={styles.titleInput}
                        value={imageUrl}
                        onChangeText={setImageUrl}
                        placeholder="https://example.com/image.jpg"
                        placeholderTextColor="#666"
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType="url"
                    />
                    <Text style={styles.helperText}>Add an image URL to include a visual with your post</Text>
                </View>

                {/* Tags Selection */}
                <View style={styles.inputSection}>
                    <Text style={styles.label}>Tags (Select relevant tags)</Text>
                    <View style={styles.tagsContainer}>
                        {availableTags.map((tag) => (
                            <TouchableOpacity
                                key={tag}
                                style={[
                                    styles.tagOption,
                                    selectedTags.includes(tag) && styles.selectedTagOption
                                ]}
                                onPress={() => toggleTag(tag)}
                            >
                                <Text style={[
                                    styles.tagOptionText,
                                    selectedTags.includes(tag) && styles.selectedTagOptionText
                                ]}>
                                    {tag}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Guidelines */}
                <View style={styles.guidelinesSection}>
                    <Text style={styles.guidelinesTitle}>Posting Guidelines</Text>
                    <Text style={styles.guidelinesText}>
                        • Share accurate information about scams{'\n'}
                        • Include specific details when reporting scams{'\n'}
                        • Be respectful to other community members{'\n'}
                        • Use appropriate tags for better visibility{'\n'}
                        • Avoid sharing personal sensitive information
                    </Text>
                </View>
            </ScrollView>

            {/* Create Post Button */}
            <View style={styles.bottomSection}>
                <TouchableOpacity
                    style={[styles.createButton, isPosting && styles.disabledButton]}
                    onPress={handleCreatePost}
                    disabled={isPosting}
                >
                    {isPosting ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <>
                            <FontAwesome name="plus" size={16} color="#fff" style={styles.createButtonIcon} />
                            <Text style={styles.createButtonText}>Create Post</Text>
                        </>
                    )}
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
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
    },
    headerSpacer: {
        width: 30,
    },
    content: {
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    inputSection: {
        marginBottom: 25,
    },
    label: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    titleInput: {
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        padding: 15,
        color: '#fff',
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#333',
    },
    contentInput: {
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        padding: 15,
        color: '#fff',
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#333',
        minHeight: 120,
    },
    charCount: {
        color: '#666',
        fontSize: 12,
        textAlign: 'right',
        marginTop: 5,
    },
    helperText: {
        fontSize: 12,
        color: '#888',
        marginTop: 4,
        fontStyle: 'italic',
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 5,
    },
    tagOption: {
        backgroundColor: '#1a1a1a',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 8,
        margin: 5,
        borderWidth: 1,
        borderColor: '#333',
    },
    selectedTagOption: {
        backgroundColor: '#e74c3c',
        borderColor: '#e74c3c',
    },
    tagOptionText: {
        color: '#aaa',
        fontSize: 14,
    },
    selectedTagOptionText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    guidelinesSection: {
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        padding: 15,
        marginBottom: 20,
    },
    guidelinesTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    guidelinesText: {
        color: '#aaa',
        fontSize: 14,
        lineHeight: 22,
    },
    bottomSection: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: '#333',
    },
    createButton: {
        backgroundColor: '#e74c3c',
        borderRadius: 25,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
    },
    disabledButton: {
        backgroundColor: '#666',
    },
    createButtonIcon: {
        marginRight: 8,
    },
    createButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
}); 