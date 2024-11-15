import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Animated,
  Image,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';

import { height, width } from '../Common/Styles/Dimension';

const categories = [
  { id: '1', name: 'Music', icon: 'music', image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
  { id: '2', name: 'Sports', icon: 'activity', image: 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
  { id: '3', name: 'Art', icon: 'feather', image: 'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
  { id: '4', name: 'Movies', icon: 'film', image: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
  { id: '5', name: 'Food & Drink', icon: 'coffee', image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
  { id: '6', name: 'Travel', icon: 'map', image: 'https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
  { id: '7', name: 'Nightlife', icon: 'moon', image: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
  { id: '8', name: 'Comedy', icon: 'smile', image: 'https://images.pexels.com/photos/7234263/pexels-photo-7234263.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
];

export default function EventCategoryScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const scrollY = useRef(new Animated.Value(0)).current;

  const renderCategoryItem = ({ item, index }) => {
    const inputRange = [-1, 0, (index + 1) * 200, (index + 2) * 200];
    const scale = scrollY.interpolate({
      inputRange,
      outputRange: [1, 1, 1, 0.8],
    });
    const opacity = scrollY.interpolate({
      inputRange,
      outputRange: [1, 1, 1, 0],
    });

    return (
      <Animated.View style={[styles.cardContainer, { transform: [{ scale }], opacity }]}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Home', { category: item.name })}
          activeOpacity={0.8}
          style={styles.card}
        >
          <Image 
            source={{ uri: item.image }} 
            style={styles.categoryImage} 
            resizeMode="cover"
          />
          <LinearGradient
            colors={['rgba(138, 43, 226, 0.6)', 'rgba(75, 0, 130, 0.8)']}
            style={styles.gradient}
          >
            <Icon name={item.icon} size={30} color="#FFFFFF" />
            <Text style={styles.categoryName}>{item.name}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [height * 0.25, height * 0.15],
    extrapolate: 'clamp',
  });

  const titleFontSize = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [32, 24],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Animated.View style={[styles.headerContainer]}>
        <LinearGradient
          colors={['#8A2BE2', '#4B0082', '#800080']}
          style={styles.headerGradient}
        >
          <Animated.Text style={[styles.title]}>
            Event Categories
          </Animated.Text>
          <View style={styles.searchContainer}>
            <Icon name="search" size={20} color="#FFFFFF" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search categories..."
              placeholderTextColor="#E6E6FA"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Adjust FlatList to start below header and avoid white space above */}
      <Animated.FlatList
        data={filteredCategories}
        renderItem={renderCategoryItem}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.categoriesList}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
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
    overflow: 'hidden',
  },
  headerGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  title: {
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
    paddingTop: height * 0.15, // Adjust this so the content starts after the header
    paddingHorizontal: 10,
    paddingBottom: 70, // Adjust bottom padding to ensure content is above tab bar
  },
  cardContainer: {
    width: '50%',
    aspectRatio: 1,
    padding: 8,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
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
  },
});
