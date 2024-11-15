import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Easing } from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import Svg, { Circle, G, Path } from 'react-native-svg';

const { width, height } = Dimensions.get('window');
const CIRCLE_COUNT = 8;
const CIRCLE_SIZE = 10;

export default function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const circleAnims = useRef(Array(CIRCLE_COUNT).fill(0).map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 6000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ),
      ...circleAnims.map((anim, index) =>
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: 1,
              duration: 1000,
              delay: index * 100,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0,
              duration: 1000,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ])
        )
      ),
    ]).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const renderCircles = () => {
    return circleAnims.map((anim, index) => {
      const angle = (index / CIRCLE_COUNT) * Math.PI * 2;
      const x = Math.cos(angle) * 40;
      const y = Math.sin(angle) * 40;
      const scale = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.5, 1.5],
      });
      const opacity = anim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0.3, 1, 0.3],
      });

      return (
        <Animated.View
          key={index}
          style={[
            styles.circle,
            {
              transform: [
                { translateX: x },
                { translateY: y },
                { scale },
              ],
              opacity,
            },
          ]}
        />
      );
    });
  };

  return (
    <LinearGradient colors={['#8A2BE2', '#4B0082', '#800080']} style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <Animated.View style={[styles.iconContainer, { transform: [{ rotate: spin }] }]}>
          <Svg height="120" width="120" viewBox="0 0 24 24">
            <Circle cx="12" cy="12" r="10" fill="#E6E6FA" />
            <G fill="#8A2BE2">
              <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
              <Path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
            </G>
          </Svg>
          <View style={styles.circleContainer}>
            {renderCircles()}
          </View>
        </Animated.View>
        <Text style={styles.title}>Eventify</Text>
        <Text style={styles.subtitle}>Manage Your Events with Ease</Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleContainer: {
    position: 'absolute',
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    position: 'absolute',
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: '#E6E6FA',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 18,
    color: '#E6E6FA',
    marginTop: 10,
  },
});