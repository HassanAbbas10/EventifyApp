import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

const eventData = {
  id: '1',
  name: 'TechConf 2024',
  date: 'June 15-17, 2024',
  location: 'San Francisco, CA',
  image: 'https://images.pexels.com/photos/15262989/pexels-photo-15262989/free-photo-of-closeup-of-an-illuminated-analogue-sound-mixer.jpeg?auto=compress&cs=tinysrgb&w=600',
  description: 'Join us for the biggest tech conference of the year, featuring keynotes from industry leaders, hands-on workshops, and networking opportunities.',
  ticketTypes: [
    { id: '1', name: 'General Admission', price: 299 },
    { id: '2', name: 'VIP Access', price: 599 },
    { id: '3', name: 'Workshop Pass', price: 199 },
  ],
};

const TickerDetailScreen = () => {
  const navigation = useNavigation();
  const [selectedTickets, setSelectedTickets] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTicketSelection = (ticketId, quantity) => {
    setSelectedTickets(prev => ({
      ...prev,
      [ticketId]: Math.max(0, quantity),
    }));
  };

  const calculateTotal = () => {
    return Object.entries(selectedTickets).reduce((total, [ticketId, quantity]) => {
      const ticket = eventData.ticketTypes.find(t => t.id === ticketId);
      return total + (ticket ? ticket.price * quantity : 0);
    }, 0);
  };

  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      Alert.alert(
        'Purchase Successful',
        'Your tickets have been booked successfully!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <LinearGradient colors={['#4FD1C5', '#2B6CB0']} style={styles.headerGradient}>
          <Image source={{ uri: eventData.image }} style={styles.eventImage} />
          <View style={styles.eventDetails}>
            <Text style={styles.eventName}>{eventData.name}</Text>
            <Text style={styles.eventInfo}>{eventData.date}</Text>
            <Text style={styles.eventInfo}>{eventData.location}</Text>
          </View>
        </LinearGradient>

        <View style={styles.descriptionContainer}>
          <Text style={styles.eventDescription}>{eventData.description}</Text>
        </View>

        <View style={styles.ticketSection}>
          <Text style={styles.sectionTitle}>Select Tickets</Text>
          {eventData.ticketTypes.map((ticket, index) => (
            <LinearGradient
              key={ticket.id}
              colors={['#6EE7B7', '#3B82F6']}
              style={[styles.ticketItem, { backgroundColor: index % 2 === 0 ? '#E0F7FA' : '#E3F2FD' }]}
            >
              <View>
                <Text style={styles.ticketName}>{ticket.name}</Text>
                <Text style={styles.ticketPrice}>${ticket.price}</Text>
              </View>
              <View style={styles.quantityControl}>
                <TouchableOpacity
                  onPress={() => handleTicketSelection(ticket.id, (selectedTickets[ticket.id] || 0) - 1)}
                  style={[styles.quantityButton, { backgroundColor: '#EF4444' }]}
                >
                  <Icon name="minus" size={20} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{selectedTickets[ticket.id] || 0}</Text>
                <TouchableOpacity
                  onPress={() => handleTicketSelection(ticket.id, (selectedTickets[ticket.id] || 0) + 1)}
                  style={[styles.quantityButton, { backgroundColor: '#10B981' }]}
                >
                  <Icon name="plus" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          ))}
        </View>

        <LinearGradient colors={['#38A169', '#2C7A7B']} style={styles.totalSection}>
          <Text style={styles.totalText}>Total: ${calculateTotal()}</Text>
        </LinearGradient>

        <TouchableOpacity
          onPress={handleCheckout}
          disabled={calculateTotal() === 0 || isProcessing}
          style={styles.checkoutButtonContainer}
        >
          <LinearGradient
            colors={calculateTotal() === 0 || isProcessing ? ['#E2E8F0', '#CBD5E0'] : ['#38B2AC', '#3182CE']}
            style={styles.checkoutButton}
          >
            <Text style={styles.checkoutButtonText}>
              {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollContent: {
    paddingBottom: 80,
  },
  headerGradient: {
    paddingBottom: 30,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  eventImage: {
    width: '100%',
    height: 220,
  },
  eventDetails: {
    padding: 16,
  },
  eventName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  eventInfo: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  descriptionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    margin: 16,
    padding: 16,
    elevation: 2,
  },
  eventDescription: {
    fontSize: 16,
    color: '#4A5568',
  },
  ticketSection: {
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 16,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A202C',
    marginBottom: 16,
    textAlign: 'center',
  },
  ticketItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  ticketName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
  },
  ticketPrice: {
    fontSize: 14,
    color: '#718096',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 34,
    height: 34,
    borderRadius: 17,
    marginHorizontal: 8,
  },
  quantityText: {
    fontSize: 16,
    color: '#2D3748',
  },
  totalSection: {
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 16,
    borderRadius: 10,
  },
  totalText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  checkoutButtonContainer: {
    marginHorizontal: 16,
    marginBottom: 32,
  },
  checkoutButton: {
    borderRadius: 25,
    paddingVertical: 14,
  },
  checkoutButtonText: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    color: '#FFFFFF',
  },
});

export default TickerDetailScreen;
