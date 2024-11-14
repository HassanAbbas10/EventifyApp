import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
  Animated,
  Dimensions,
} from 'react-native';
import {LinearGradient} from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';

const TEAL = '#87CEEB';
const LIGHT_TEAL = '#48D1CC';
const MINT = '#FAFAFA';

const {width, height} = Dimensions.get('window');
const TAB_BAR_HEIGHT = 60;

const featuredEvents = [
  {
    id: '1',
    title: 'Tech Conference 2024',
    date: 'Mar 15-17',
    location: 'San Francisco',
    image:
      'https://images.pexels.com/photos/1141853/pexels-photo-1141853.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: '2',
    title: 'Music Festival',
    date: 'Apr 5-7',
    location: 'Los Angeles',
    image:
      'https://images.pexels.com/photos/2525903/pexels-photo-2525903.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: '3',
    title: 'Food & Wine Expo',
    date: 'May 20-22',
    location: 'New York',
    image:
      'https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: '4',
    title: 'Art Exhibition',
    date: 'Jun 10-12',
    location: 'Chicago',
    image:
      'https://images.pexels.com/photos/1797192/pexels-photo-1797192.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
];

const upcomingEvents = [
  {id: '1', name: 'Web Development Workshop', date: 'Mar 25', time: '2:00 PM'},
  {id: '2', name: 'Networking Mixer', date: 'Apr 2', time: '6:30 PM'},
  {id: '3', name: 'Marketing Seminar', date: 'Apr 10', time: '10:00 AM'},
];

const categories = [
  {id: '1', name: 'Conferences', icon: 'calendar-outline'},
  {id: '2', name: 'Workshops', icon: 'people-outline'},
  {id: '3', name: 'Concerts', icon: 'musical-notes'},
  {id: '4', name: 'Networking', icon: 'share-social'},
];

const HomeScreen = () => {
  const [userName, setUserName] = useState('Orion');
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fetch user name and start fade animation
    const user = auth().currentUser;
    if (user) {
      setUserName(user.displayName || 'User');
    }

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const renderFeaturedEvent = ({item, index}) => {
    const inputRange = [-1, 0, 200 * index, 200 * (index + 2)];
    const scale = scrollY.interpolate({
      inputRange,
      outputRange: [1, 1, 1, 0.8],
      extrapolate: 'clamp',
    });
    const opacity = scrollY.interpolate({
      inputRange,
      outputRange: [1, 1, 1, 0.3],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        style={[styles.featuredEventCard, {transform: [{scale}], opacity}]}>
        <Image source={{uri: item.image}} style={styles.featuredEventImage} />
        <LinearGradient
          colors={[TEAL, LIGHT_TEAL]}
          style={styles.featuredEventInfo}>
          <Text style={styles.featuredEventTitle}>{item.title}</Text>
          <Text style={styles.featuredEventDetails}>{item.date}</Text>
          <Text style={styles.featuredEventDetails}>{item.location}</Text>
        </LinearGradient>
      </Animated.View>
    );
  };

  const renderCategory = ({item}) => (
    <TouchableOpacity style={styles.categoryButton}>
      <View>
        <LinearGradient
          colors={[LIGHT_TEAL, TEAL]}
          style={styles.categoryGradient}>
          <Icon name={item.icon} size={30} color={MINT} />
          <Text style={styles.categoryButtonText}>{item.name}</Text>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );

  const renderUpcomingEvent = ({item}) => (
    <Animated.View style={[styles.upcomingEventItem, {opacity: fadeAnim}]}>
      <View>
        <Text style={styles.upcomingEventName}>{item.name}</Text>
        <Text style={styles.upcomingEventDetails}>
          {item.date} at {item.time}
        </Text>
      </View>
      <TouchableOpacity style={styles.registerButton}>
        <LinearGradient
          colors={[TEAL, LIGHT_TEAL]}
          style={styles.registerGradient}>
          <Text style={styles.registerButtonText}>Register</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  return (<>
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={TEAL} />
      <Animated.ScrollView
        contentContainerStyle={styles.scrollViewContent}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: true},
        )}
        scrollEventThrottle={16}>
        <LinearGradient colors={[TEAL, LIGHT_TEAL]} style={styles.header}>
          <Text style={styles.welcomeText}>Welcome back, {userName}!</Text>
          <View style={styles.searchContainer}>
            <Icon
              name="search"
              size={20}
              color="#999"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for events"
              placeholderTextColor="#999"
            />
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Featured Events</Text>
          <FlatList
            data={featuredEvents}
            renderItem={renderFeaturedEvent}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredEventsList}
          />

          <Text style={styles.sectionTitle}>Categories</Text>
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={item => item.id}
            numColumns={2}
            columnWrapperStyle={styles.categoryRow}
          />

          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          <FlatList
            data={upcomingEvents}
            renderItem={renderUpcomingEvent}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MINT,
  },
  scrollViewContent: {
    paddingBottom: TAB_BAR_HEIGHT,
  },
  header: {
    padding: 16,
    paddingTop: 60,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  content: {
    padding: 16,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: TEAL,
    marginBottom: 16,
  },
  featuredEventsList: {
    paddingBottom: 16,
  },
  featuredEventCard: {
    width: 280,
    borderRadius: 16,
    marginRight: 16,
    overflow: 'hidden',
    elevation: 5,
  },
  featuredEventImage: {
    width: '100%',
    height: 150,
  },
  featuredEventInfo: {
    padding: 16,
  },
  featuredEventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  featuredEventDetails: {
    fontSize: 14,
    color: MINT,
  },
  categoryRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  categoryButton: {
    width: '48%',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
  },
  categoryGradient: {
    padding: 16,
    alignItems: 'center',
  },
  categoryButtonText: {
    marginTop: 8,
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
  },
  upcomingEventItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
  },
  upcomingEventName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: TEAL,
    marginBottom: 4,
  },
  upcomingEventDetails: {
    fontSize: 14,
    color: '#666',
  },
  registerButton: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  registerGradient: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
