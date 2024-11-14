import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Platform,
  Animated,
  Image,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';

const { width, height } = Dimensions.get('window');

const categories = [
  { id: '1', name: 'Music', icon: 'music', color: ['#FF9A8B', '#FF6A88'], image: 'https://images.pexels.com/photos/9361780/pexels-photo-9361780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: '2', name: 'Sports', icon: 'activity', color: ['#4FACFE', '#00F2FE'], image: 'https://images.pexels.com/photos/9361780/pexels-photo-9361780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: '3', name: 'Art', icon: 'feather', color: ['#FA709A', '#FEE140'], image: 'https://images.pexels.com/photos/9361780/pexels-photo-9361780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: '4', name: 'Movies', icon: 'film', color: ['#43E97B', '#38F9D7'], image: 'https://images.pexels.com/photos/9361780/pexels-photo-9361780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: '5', name: 'Food & Drink', icon: 'coffee', color: ['#F6D365', '#FDA085'], image: 'https://images.pexels.com/photos/9361780/pexels-photo-9361780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: '6', name: 'Travel', icon: 'map', color: ['#5EE7DF', '#B490CA'], image: 'https://images.pexels.com/photos/9361780/pexels-photo-9361780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: '7', name: 'Nightlife', icon: 'moon', color: ['#30CFD0', '#330867'], image: 'https://images.pexels.com/photos/9361780/pexels-photo-9361780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: '8', name: 'Comedy', icon: 'smile', color: ['#FF0844', '#FFB199'], image: 'https://images.pexels.com/photos/9361780/pexels-photo-9361780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
];

export default function EventCategoryScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const scrollY = useRef(new Animated.Value(0)).current;

  const renderCategoryItem = ({ item }) => {
    const scaleAnim = new Animated.Value(1);

    const onPressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    };

    const onPressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    };

    const onPress = () => {
      navigation.navigate('EventListing', { category: item.name });
    };

    return (
      <TouchableOpacity
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={onPress}
        activeOpacity={1}
        style={styles.cardContainer}
      >
        <Animated.View style={[styles.categoryCard, { transform: [{ scale: scaleAnim }] }]}>
          <Image source={{ uri: item.image }} style={styles.categoryImage} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.gradient}
          >
            <Icon name={item.icon} size={24} color="#FFFFFF" />
            <Text style={styles.categoryName}>{item.name}</Text>
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={['#4c669f', '#3b5998', '#192f6a']}
          style={styles.headerGradient}
        >
          <Text style={styles.title}>Event Categories</Text>
          <View style={styles.searchContainer}>
            <Icon name="search" size={20} color="#FFFFFF" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search categories..."
              placeholderTextColor="#CCCCCC"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </LinearGradient>
      </View>
      <FlatList
        data={filteredCategories}
        renderItem={renderCategoryItem}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.categoriesList}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    height: height * 0.2,
  },
  headerGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    paddingTop: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    marginHorizontal: 20,
    paddingHorizontal: 15,
    marginTop: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    paddingVertical: 10,
  },
  categoriesList: {
    paddingTop: height * 0.2 + 20, // To ensure content starts below the header
    paddingHorizontal: 10,
    paddingBottom: 80,
  },
  cardContainer: {
    width: '50%',
    padding: 8,
  },
  categoryCard: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    aspectRatio: 1,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 10,
  },
  categoryName: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
