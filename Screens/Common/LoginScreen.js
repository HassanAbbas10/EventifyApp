import React, { useState, useRef, useEffect } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Alert,
  KeyboardAvoidingView,
  Platform,
  View,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Svg, { Circle, Path, G } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 10000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      const userDoc = await firestore().collection('users').doc(user.uid).get();
      const userData = userDoc.data();

      if (userData && userData.role) {
        Alert.alert('Login Successful', `Welcome back, ${userData.fullName}!`);
      } else {
        Alert.alert('Login Successful', 'Welcome back!');
      }

      await AsyncStorage.setItem('userToken', user.uid);

      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });
    } catch (error) {
      console.error('Login failed:', error);
      Alert.alert('Login Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <LinearGradient
        colors={['#8A2BE2', '#4B0082', '#800080']}
        style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Animated.View
            style={[
              styles.formContainer,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}>
            <Animated.View style={[styles.logoContainer, { transform: [{ scale: pulseAnim }, { rotate: spin }] }]}>
              <Svg height="120" width="120" viewBox="0 0 24 24">
                <Circle cx="12" cy="12" r="11" fill="#E6E6FA" />
                <G fill="#8A2BE2">
                  <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                  <Path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                  <Path d="M17 12a5 5 0 11-10 0 5 5 0 0110 0z" />
                </G>
              </Svg>
            </Animated.View>
            <Text style={styles.title}>Welcome Back</Text>

            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#8A2BE2"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#8A2BE2"
            />

            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={handleLogin}
              disabled={isLoading}>
              <LinearGradient
                colors={['#9400D3', '#8A2BE2', '#9932CC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}>
                {isLoading ? (
                  <View style={styles.loaderContainer}>
                    <Text style={styles.buttonText}>Logging In...</Text>
                    <Animated.View style={[styles.loader, { transform: [{ rotate: pulseAnim.interpolate({
                      inputRange: [1, 1.1],
                      outputRange: ['0deg', '360deg']
                    }) }] }]} />
                  </View>
                ) : (
                  <Text style={styles.buttonText}>Login</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('Signup')}
              style={styles.signup}>
              <Text style={styles.signupText}>
                Don't have an account? Sign up
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    padding: 30,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#8A2BE2',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#8A2BE2',
    borderWidth: 1,
    borderRadius: 25,
    marginBottom: 20,
    paddingHorizontal: 20,
    fontSize: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    color: '#8A2BE2',
  },
  buttonContainer: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    marginTop: 10,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderTopColor: 'transparent',
    marginLeft: 10,
  },
  forgotPassword: {
    marginTop: 20,
    alignSelf: 'center',
  },
  forgotPasswordText: {
    color: '#8A2BE2',
    fontSize: 16,
  },
  signup: {
    marginTop: 20,
    alignSelf: 'center',
  },
  signupText: {
    color: '#8A2BE2',
    fontSize: 16,
  },
});

export default LoginScreen;