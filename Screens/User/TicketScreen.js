import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from '@react-native-community/blur';

const { width } = Dimensions.get('window');

const tickets = [
  {
    id: '1',
    eventName: 'TechConf 2024',
    date: 'June 15-17, 2024',
    location: 'San Francisco, CA',
    image: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    price: 299,
    category: 'TECH',
  },
  {
    id: '2',
    eventName: 'Music Festival',
    date: 'July 20-22, 2024',
    location: 'Austin, TX',
    image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    price: 199,
    category: 'MUSIC',
  },
  {
    id: '3',
    eventName: 'Food & Wine Expo',
    date: 'August 5-7, 2024',
    location: 'New York, NY',
    image: 'https://images.pexels.com/photos/1267696/pexels-photo-1267696.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    price: 149,
    category: 'FOOD',
  },
];

const TicketScreen = () => {
  const navigation = useNavigation();
  const scrollY = new Animated.Value(0);
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = ['ALL', 'TECH', 'MUSIC', 'FOOD'];

  const filteredTickets = selectedCategory === 'ALL' 
    ? tickets 
    : tickets.filter(ticket => ticket.category === selectedCategory);

  const renderTicketItem = ({ item, index }) => {
    const inputRange = [
      -1,
      0,
      (150 + 32) * index,
      (150 + 32) * (index + 2)
    ];

    const scale = scrollY.interpolate({
      inputRange,
      outputRange: [1, 1, 1, 0.8],
    });

    const opacity = scrollY.interpolate({
      inputRange,
      outputRange: [1, 1, 1, 0.5],
    });

    return (
      <Animated.View style={[
        styles.ticketItem,
        { transform: [{ scale }], opacity }
      ]}>
        <TouchableOpacity
          onPress={() => navigation.navigate('TicketDetail', { ticketId: item.id })}
          activeOpacity={0.8}
        >
          <Image source={{ uri: item.image }} style={styles.ticketImage} />
          <LinearGradient
            colors={['rgba(138, 43, 226, 0.7)', 'rgba(75, 0, 130, 0.95)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ticketContent}
          >
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
            <Text style={styles.eventName}>{item.eventName}</Text>
            <View style={styles.infoContainer}>
              <Icon name="calendar" size={14} color="#E6E6FA" />
              <Text style={styles.eventInfo}>{item.date}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Icon name="map-pin" size={14} color="#E6E6FA" />
              <Text style={styles.eventInfo}>{item.location}</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>${item.price}</Text>
              <TouchableOpacity style={styles.buyButton}>
                <Text style={styles.buyButtonText}>BUY NOW</Text>
                <Icon name="chevron-right" size={20} color="#4B0082" />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderCategoryItem = (category) => (
    <TouchableOpacity
      key={category}
      style={[
        styles.categoryItem,
        selectedCategory === category && styles.categoryItemActive
      ]}
      onPress={() => setSelectedCategory(category)}
    >
      <Text style={[
        styles.categoryItemText,
        selectedCategory === category && styles.categoryItemTextActive
      ]}>
        {category}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#8A2BE2', '#4B0082']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Available Tickets</Text>
      </LinearGradient>

      <View style={styles.categoriesContainer}>
        {categories.map(renderCategoryItem)}
      </View>

      <Animated.FlatList
        data={filteredTickets}
        renderItem={renderTicketItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.ticketList}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E6E6FA',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  categoriesContainer: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-between',
  },
  categoryItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#8A2BE2',
  },
  categoryItemActive: {
    backgroundColor: '#8A2BE2',
  },
  categoryItemText: {
    color: '#8A2BE2',
    fontSize: 12,
    fontWeight: 'bold',
  },
  categoryItemTextActive: {
    color: '#FFFFFF',
  },
  ticketList: {
    padding: 16,
  },
  ticketItem: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#8A2BE2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  ticketImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  ticketContent: {
    padding: 16,
  },
  categoryBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(138, 43, 226, 0.2)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E6E6FA',
  },
  categoryText: {
    color: '#E6E6FA',
    fontSize: 12,
    fontWeight: 'bold',
  },
  eventName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    textShadowColor: '#8A2BE2',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventInfo: {
    fontSize: 14,
    color: '#E6E6FA',
    marginLeft: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E6E6FA',
  },
  buyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6E6FA',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  buyButtonText: {
    color: '#4B0082',
    fontWeight: 'bold',
    marginRight: 4,
  },
});

export default TicketScreen;