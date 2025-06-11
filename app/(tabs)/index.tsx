import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from '../context/UserContext';

export default function HomeScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { login, loginAsGuest, register, loading } = useUser();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in both email and password');
      return;
    }

    try {
      setIsLoading(true);
      const result = await login(email.trim(), password);

      if (result.success) {
        Alert.alert('Success', 'Login successful!', [
          { text: 'OK', onPress: () => router.push('/scam-detection') }
        ]);
      } else {
        let errorMessage = 'Login failed';

        if (result.error) {
          if (typeof result.error === 'string') {
            errorMessage = result.error;
          } else if (result.error.non_field_errors) {
            errorMessage = result.error.non_field_errors[0];
          } else if (result.error.detail) {
            errorMessage = result.error.detail;
          } else {
            errorMessage = 'Invalid email or password';
          }
        }

        Alert.alert('Login Failed', errorMessage);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = () => {
    console.log('Sign Up pressed');
    router.push('/register');
  };

  const handleGuestMode = () => {
    console.log('Continue as Guest pressed');
    loginAsGuest();
    router.push('/scam-detection');
  };

  const handleForgotPassword = () => {
    Alert.alert('Forgot Password', 'Password reset functionality will be available soon!');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />

      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Image
            source={require('@/assets/images/sigmashield-logo.jpeg')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.logoText}>SIGMASHIELD</Text>
        <Text style={styles.logoSubtext}>SCAN BEFORE YOU GET SCAMMED</Text>
      </View>

      {/* Login Form */}
      <View style={styles.formContainer}>
        <Text style={styles.label}>Username:</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          placeholderTextColor="#666"
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
        />

        <Text style={styles.label}>Password:</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          placeholderTextColor="#666"
          secureTextEntry
          autoComplete="password"
        />

        <TouchableOpacity style={styles.forgotPassword} onPress={handleForgotPassword}>
          <Text style={styles.forgotPasswordText}>Forget Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.loginButton, isLoading && styles.disabledButton]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <Text style={styles.loginButtonText}>LOGIN</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.guestButton} onPress={handleGuestMode}>
          <Text style={styles.guestButtonText}>Continue as Guest</Text>
        </TouchableOpacity>

        <View style={styles.signupContainer}>
          <Text style={styles.newUserText}>New User? </Text>
          <TouchableOpacity onPress={handleSignUp}>
            <Text style={styles.signupText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 30,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  logoCircle: {
    marginBottom: 20,
  },
  lockIcon: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockText: {
    fontSize: 30,
  },
  logoText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 5,
  },
  logoSubtext: {
    color: '#888',
    fontSize: 10,
    letterSpacing: 1,
    textAlign: 'center',
  },
  formContainer: {
    flex: 1.5,
    paddingTop: 20,
    marginHorizontal: 35,
  },
  label: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    backgroundColor: '#333',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 10,
    marginBottom: 30,
  },
  forgotPasswordText: {
    color: '#888',
    fontSize: 18,
    textDecorationLine: 'underline',
  },
  loginButton: {
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  guestButton: {
    alignItems: 'center',
    marginBottom: 30,
  },
  guestButtonText: {
    color: '#888',
    fontSize: 18,
    textDecorationLine: 'underline',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  newUserText: {
    color: '#888',
    fontSize: 18,
  },
  signupText: {
    color: '#fff',
    fontSize: 18,
    textDecorationLine: 'underline',
  },
  logoImage: {
    width: 300,
    height: 200,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#888',
  },
});