import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  StatusBar,
  SafeAreaView,
  Image 
} from 'react-native';

export default function HomeScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Login pressed:', { username, password });
    // We'll add actual login logic later
  };

  const handleSignUp = () => {
    console.log('Sign Up pressed');
    // We'll add sign up navigation later
  };
  const handleGuestMode = () => {
    console.log('Continue as Guest pressed');
    // We'll add guest mode navigation later
  };

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
          value={username}
          onChangeText={setUsername}
          placeholder=""
          placeholderTextColor="#666"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password:</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder=""
          placeholderTextColor="#666"
          secureTextEntry
        />

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Forget Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>LOGIN</Text>
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
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 30,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  label: {
    color: '#fff',
    fontSize: 16,
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
    fontSize: 14,
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
    fontSize: 14,
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
    fontSize: 14,
  },
  signupText: {
    color: '#fff',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  logoImage: {
    width: 80,
    height: 80,
  },
});