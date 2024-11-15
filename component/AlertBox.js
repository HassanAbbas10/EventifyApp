import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import LottieView from 'lottie-react-native';

const AlertBox = ({
  visible,
  title,
  message,
  onClose,
  type = 'info',
  lottieSource,
  customStyles = {},
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return '#4B0082';
      case 'error':
        return '#8B008B';
      case 'warning':
        return '#9400D3';
      default:
        return '#800080';
    }
  };

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <Animated.View
        style={[
          styles.container,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
            backgroundColor: getBackgroundColor(),
          },
          customStyles.container,
        ]}
      >
        {lottieSource && (
          <LottieView
            source={typeof lottieSource === 'string' ? { uri: lottieSource } : lottieSource}
            autoPlay
            loop
            style={styles.lottie}
          />
        )}
        <Text style={[styles.title, customStyles.title]}>{title}</Text>
        <Text style={[styles.message, customStyles.message]}>{message}</Text>
        <TouchableOpacity
          style={[styles.button, customStyles.button]}
          onPress={onClose}
        >
          <Text style={[styles.buttonText, customStyles.buttonText]}>OK</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '80%',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  lottie: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#E6E6FA',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AlertBox;
