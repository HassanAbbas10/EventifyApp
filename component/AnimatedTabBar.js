import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';

const {width} = Dimensions.get('window');
const TAB_BAR_HEIGHT = 67;

const TABS = [
  {id: 'Home', emoji: '🏠', label: 'Home'},

  {id: 'Ticket', emoji: '🎫', label: 'Ticket'},
  {id: 'Category', emoji: '🗂', label: 'Category'},
  {id: 'Notification', emoji: '🔔', label: 'Notification'},
  {id: 'Profile', emoji: '👤', label: 'Profile'},
];

const TabButton = ({emoji, label, isSelected, onPress}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: isSelected ? -10 : 0,
        useNativeDriver: true,
        friction: 8,
        tension: 40,
      }),
      Animated.timing(opacityAnim, {
        toValue: isSelected ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isSelected]);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 100,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
    onPress();
  };

  return (
    <Pressable onPress={handlePress} style={styles.tabButton}>
      <Animated.View
        style={[
          styles.tabContent,
          {
            transform: [{scale: scaleAnim}, {translateY}],
          },
        ]}>
        <Text style={styles.emoji}>{emoji}</Text>
        <Animated.View
          style={[
            styles.labelContainer,
            {
              opacity: opacityAnim,
              transform: [
                {
                  translateY: opacityAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [10, 0],
                  }),
                },
              ],
            },
          ]}>
          <Text style={styles.label}>{label}</Text>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};

const AnimatedTabBar = ({navigation}) => {
  const [selectedTab, setSelectedTab] = useState('Home');
  const slideAnim = useRef(new Animated.Value(0)).current;

  const handleTabPress = (tabId, index) => {
    setSelectedTab(tabId);

    Animated.spring(slideAnim, {
      toValue: index * (width / TABS.length),
      friction: 12,
      tension: 40,
      useNativeDriver: true,
    }).start();

    navigation.navigate(tabId);
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.slideIndicator,
          {
            transform: [{translateX: slideAnim}],
          },
        ]}
      />
      {TABS.map((tab, index) => (
        <TabButton
          key={tab.id}
          emoji={tab.emoji}
          label={tab.label}
          isSelected={selectedTab === tab.id}
          onPress={() => handleTabPress(tab.id, index)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#e0f7fa', // Light teal background for cool aesthetic
    height: TAB_BAR_HEIGHT,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  slideIndicator: {
    position: 'absolute',
    width: width / TABS.length - 20,
    height: 54,
    borderRadius: 32,
    backgroundColor: '#80deea', // Medium teal for the active indicator
    bottom: 15,
    left: 10,
  },
  tabButton: {
    width: width / TABS.length,
    height: TAB_BAR_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  tabContent: {
    alignItems: 'center',
  },
  emoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  labelContainer: {
    position: 'absolute',
    top: 36,
    backgroundColor: '#4dd0e1', // Darker teal for label background
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 12,
  },
  label: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default AnimatedTabBar;
