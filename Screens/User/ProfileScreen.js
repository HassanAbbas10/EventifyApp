import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
  ScrollView,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from 'react-native';
import uploadImage from '../../services/Cloudinary';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import { launchImageLibrary } from 'react-native-image-picker';


const ShimmerButton = ({title, onPress, style, textStyle, colors}) => (
  <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
    <LinearGradient
      colors={colors}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
      style={styles.buttonGradient}>
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </LinearGradient>
  </TouchableOpacity>
);

const CustomInput = ({value, onChangeText, placeholder, style}) => (
  <View style={[styles.inputContainer, style]}>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      style={styles.input}
      placeholderTextColor="#A0AEC0"
    />
  </View>
);

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [authUser, setAuthUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState('');
  const [newAvatarUri, setAvatarUri] = useState(null);

  useEffect(() => {
    const firebaseUser = auth().currentUser;
    setAuthUser(firebaseUser);
    setNewDisplayName(firebaseUser?.displayName || '');

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleLogout = () => {
    auth()
      .signOut()
      .then(() => {
        console.log('User signed out!');
        navigation.navigate('Login');
      })
      .catch(error => {
        console.log('Error signing out: ', error);
        Alert.alert('Error', 'Failed to sign out. Please try again.');
      });
  };

  const handleEditProfile = () => {
    setIsEditing(!isEditing);
  };

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



  const handleSaveProfile = async () => {
    const firebaseUser = auth().currentUser;
  
    if (firebaseUser) {
      let updateObject = {};
  
      // Only update display name if it's changed
      if (newDisplayName !== firebaseUser.displayName) {
        updateObject.displayName = newDisplayName;
      }
  
      // Only update avatar if it's changed
      if (newAvatarUri && newAvatarUri !== firebaseUser.photoURL) {
        try {
          const photoURL = await uploadImage(newAvatarUri); // Upload image to Cloudinary
          if (photoURL) {
            updateObject.photoURL = photoURL;
          }
        } catch (error) {
          console.log('Error uploading image: ', error);
          Alert.alert('Error', 'Failed to upload avatar image. Please try again.');
          return;
        }
      }
  
      // Update user profile if there's any change
      if (Object.keys(updateObject).length > 0) {
        firebaseUser
          .updateProfile(updateObject)
          .then(async () => {
            // Reload user info to reflect the changes
            await firebaseUser.reload(); // Refresh user data
            setAuthUser(auth().currentUser); // Update the local state with the refreshed data
            setIsEditing(false); // Disable editing mode
            setAvatarUri(null); // Reset avatar URI after save
          })
          .catch(error => {
            console.log('Error updating profile: ', error);
            Alert.alert('Error', 'Failed to update profile. Please try again.');
          });
      } else {
        setIsEditing(false); // No changes, just close editing mode
      }
    }
  };
  return (
    <SafeAreaView style={[styles.safeArea, {paddingTop: insets.top}]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Animated.View style={[styles.container, {opacity: fadeAnim}]}>
          <LinearGradient
            colors={['#1D3557', '#457B9D']}
            style={styles.headerGradient}>
            <View style={styles.header}>
              <TouchableOpacity
                onPress={isEditing ? handleChoosePhoto : null}
                style={styles.avatarContainer}>
                <Image
                  source={{
                    uri:
                      newAvatarUri ||
                      authUser?.photoURL ||
                      'https://via.placeholder.com/150',
                  }}
                  style={styles.avatar}
                />
                {isEditing && (
                  <View style={styles.editAvatarOverlay}>
                    <Icon name="camera" size={24} color="#FFFFFF" />
                  </View>
                )}
              </TouchableOpacity>
              {isEditing ? (
                <CustomInput
                  value={newDisplayName}
                  onChangeText={setNewDisplayName}
                  placeholder="Display Name"
                  style={styles.nameInput}
                />
              ) : (
                <Text style={styles.name}>
                  {authUser?.displayName || 'Jane Doe'}
                </Text>
              )}
            </View>
          </LinearGradient>

          <View style={styles.content}>
            <View style={styles.card}>
              <View style={styles.infoRow}>
                <Icon name="mail-outline" size={24} color="#4A5568" />
                <Text style={styles.label}>Email</Text>
                <Text style={styles.value}>
                  {authUser?.email || 'Not available'}
                </Text>
              </View>
              <View style={styles.separator} />
              <View style={styles.infoRow}>
                <Icon name="call-outline" size={24} color="#4A5568" />
                <Text style={styles.label}>Phone</Text>
                <Text style={styles.value}>
                  {authUser?.phoneNumber || 'Not available'}
                </Text>
              </View>
              <View style={styles.separator} />
              <View style={styles.infoRow}>
                <Icon name="location-outline" size={24} color="#4A5568" />
                <Text style={styles.label}>Location</Text>
                <Text style={styles.value}>New York, USA</Text>
              </View>
              <View style={styles.separator} />
              <View style={styles.infoRow}>
                <Icon name="calendar-outline" size={24} color="#4A5568" />
                <Text style={styles.label}>Member Since</Text>
                <Text style={styles.value}>
                  {authUser?.metadata?.creationTime
                    ? new Date(authUser.metadata.creationTime).toDateString()
                    : 'N/A'}
                </Text>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <ShimmerButton
                title={isEditing ? 'Save Changes' : 'Edit Profile'}
                onPress={isEditing ? handleSaveProfile : handleEditProfile}
                style={styles.editButton}
                colors={['#4facfe', '#00f2fe']}
              />
              <ShimmerButton
                title="Logout"
                onPress={handleLogout}
                style={styles.logoutButton}
                textStyle={styles.logoutButtonText}
                colors={['#E76F51', '#F4A261']}
              />
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  header: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  editAvatarOverlay: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    padding: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  nameInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    color: '#FFFFFF',
    width: '80%',
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: '#4A5568',
    marginLeft: 10,
  },
  value: {
    fontSize: 16,
    color: '#4A5568',
    marginLeft: 'auto',
  },
  separator: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 8,
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    flex: 1,
    marginRight: 10,
  },
  logoutButton: {
    flex: 1,
    marginLeft: 10,
  },
  buttonGradient: {
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logoutButtonText: {
    color: '#FFFFFF',
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  input: {
    fontSize: 16,
    color: '#4A5568',
  },
});
