import React, { useState, useCallback } from 'react';
import {
  SafeAreaView,
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SwipeListView } from 'react-native-swipe-list-view';

const initialNotifications = [
  {
    id: '1',
    type: 'event_reminder',
    title: 'Team Meeting',
    message: "Don't forget about the team meeting at 2 PM today.",
    timestamp: '10:30 AM',
    read: false,
    iconName: 'calendar',
  },
  {
    id: '2',
    type: 'price_alert',
    title: 'Price Drop Alert',
    message: "The item you've been watching is now on sale!",
    timestamp: 'Yesterday',
    read: true,
    iconName: 'pricetag',
  },
  {
    id: '3',
    type: 'new_event',
    title: 'New Event Added',
    message: 'A new event has been added to your calendar.',
    timestamp: '2 days ago',
    read: false,
    iconName: 'add-circle',
  },
];

const NotificationCard = ({ notification }) => (
  <Animated.View style={[styles.card, { backgroundColor: notification.read ? '#FFFFFF' : '#F0F8FF' }]}>
    <View style={styles.iconContainer}>
      <Icon name={notification.iconName} size={24} color="#007AFF" />
    </View>
    <View style={styles.contentContainer}>
      <Text style={styles.title}>{notification.title}</Text>
      <Text style={styles.message}>{notification.message}</Text>
      <Text style={styles.timestamp}>{notification.timestamp}</Text>
    </View>
    {!notification.read && <View style={styles.unreadIndicator} />}
  </Animated.View>
);

const EmptyState = () => (
  <View style={styles.emptyState}>
    <Icon name="notifications-off-outline" size={64} color="#CCCCCC" />
    <Text style={styles.emptyStateText}>No notifications</Text>
  </View>
);

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  const clearAll = () => {
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to clear all notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', onPress: () => setNotifications([]), style: 'destructive' },
      ]
    );
  };

  const renderHiddenItem = (data, rowMap) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={() => deleteNotification(data.item.id)}
      >
        <Icon name="trash-outline" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );

  const onSwipeValueChange = (swipeData) => {
    const { key, value } = swipeData;
    if (value < -75) {
      markAsRead(key);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F8F8" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity onPress={clearAll}>
          <Text style={styles.clearAllButton}>Clear All</Text>
        </TouchableOpacity>
      </View>
      <SwipeListView
        data={notifications}
        renderItem={({ item }) => <NotificationCard notification={item} />}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-75}
        disableRightSwipe
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={EmptyState}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#007AFF" />
        }
        onSwipeValueChange={onSwipeValueChange}
        useNativeDriver
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  clearAllButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  listContainer: {
    flexGrow: 1,
  },
  card: {
    flexDirection: 'row',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 12,
    color: '#999999',
    fontWeight: '500',
  },
  unreadIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
    alignSelf: 'center',
    marginLeft: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#999999',
    marginTop: 16,
    fontWeight: '500',
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
    margin: 8,
    marginBottom: 16,
    borderRadius: 16,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  backRightBtnRight: {
    backgroundColor: '#FF3B30',
    right: 0,
  },
});
