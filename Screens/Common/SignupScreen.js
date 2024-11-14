import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import uploadImage from '../../services/Cloudinary';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {launchImageLibrary} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';

const ShimmerButton = ({text, onPress, style}) => (
  <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
    <LinearGradient
      colors={['#4A148C', '#7B1FA2']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
      style={styles.buttonGradient}>
      <Text style={styles.buttonText}>{text}</Text>
    </LinearGradient>
  </TouchableOpacity>
);

const SignupScreen = () => {
  const [isEventManager, setIsEventManager] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [eventExperience, setEventExperience] = useState('');
  const [avatarUri, setAvatarUri] = useState(null);

  const navigation = useNavigation();

  const handleChoosePhoto = () => {
    const options = {mediaType: 'photo', noData: true};
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
        Alert.alert('Error', 'Failed to pick an image. Please try again.');
      } else if (response.assets && response.assets.length > 0) {
        setAvatarUri(response.assets[0].uri);
      }
    });
  };

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword || !fullName) {
      Alert.alert('Error', 'Please fill out all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      const user = userCredential.user;

      let photoURL = null;
      if (avatarUri) {
        photoURL = await uploadImage(avatarUri);
      }

      await user.updateProfile({
        displayName: fullName,
        photoURL: photoURL,
      });

      await firestore()
        .collection('users')
        .doc(user.uid)
        .set({
          fullName,
          email,
          role: isEventManager ? 'Event Manager' : 'Regular User',
          companyName: isEventManager ? companyName : null,
          eventExperience: isEventManager ? eventExperience : null,
        });

      Alert.alert('Success', 'Account created successfully!');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Signup Error', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <LinearGradient
        colors={['#4A148C', '#7B1FA2']}
        style={styles.headerGradient}>
        <Text style={styles.title}>Create Account</Text>
      </LinearGradient>
      <View style={styles.formContainer}>
        <TouchableOpacity
          onPress={handleChoosePhoto}
          style={styles.avatarContainer}>
          {avatarUri ? (
            <Image source={{uri: avatarUri}} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Icon name="camera" size={40} color="#FFFFFF" />
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Sign up as Event Manager</Text>
          <Switch
            value={isEventManager}
            onValueChange={setIsEventManager}
            trackColor={{false: '#767577', true: '#7B1FA2'}}
            thumbColor={isEventManager ? '#ffffff' : '#f4f3f4'}
          />
        </View>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholderTextColor="#888"
        />

        {isEventManager && (
          <View>
            <TextInput
              style={styles.input}
              placeholder="Company Name"
              value={companyName}
              onChangeText={setCompanyName}
              placeholderTextColor="#888"
            />
            <TextInput
              style={styles.input}
              placeholder="Years of Event Management Experience"
              value={eventExperience}
              onChangeText={setEventExperience}
              keyboardType="numeric"
              placeholderTextColor="#888"
            />
          </View>
        )}

        <ShimmerButton
          text="Sign Up"
          onPress={handleSignup}
          style={styles.signupButton}
        />

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}>Already have an account? Log In</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
  },
  headerGradient: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  formContainer: {
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#ffffff',
    marginTop: -30,
  },
  avatarContainer: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4A148C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 25,
    marginBottom: 15,
    paddingHorizontal: 20,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
  },
  button: {
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 15,
  },
  buttonGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  signupButton: {
    marginTop: 10,
  },
  loginLink: {
    textAlign: 'center',
    color: '#4A148C',
    marginTop: 15,
  },
});

export default SignupScreen;
