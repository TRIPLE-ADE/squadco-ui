import React from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

interface AnimationProps {
  style?: any;
  size?: number;
  loop?: boolean;
  autoPlay?: boolean;
}

export const LoadingAnimation = ({
  style,
  size = 100,
  loop = true,
  autoPlay = true,
}: AnimationProps) => (
  <View style={[styles.container, { width: size, height: size }, style]}>
    <LottieView
      source={require('../../assets/animations/loading.json')}
      autoPlay={autoPlay}
      loop={loop}
      style={{ width: size, height: size }}
    />
  </View>
);

export const SuccessAnimation = ({
  style,
  size = 100,
  loop = false,
  autoPlay = true,
}: AnimationProps) => (
  <View style={[styles.container, { width: size, height: size }, style]}>
    <LottieView
      source={require('../../assets/animations/success.json')}
      autoPlay={autoPlay}
      loop={loop}
      style={{ width: size, height: size }}
    />
  </View>
);

export const EmptyStateAnimation = ({
  style,
  size = 200,
  loop = true,
  autoPlay = true,
}: AnimationProps) => (
  <View style={[styles.container, { width: size, height: size }, style]}>
    <LottieView
      source={require('../../assets/animations/empty-state.json')}
      autoPlay={autoPlay}
      loop={loop}
      style={{ width: size, height: size }}
    />
  </View>
);

export const SavingsAnimation = ({
  style,
  size = 200,
  loop = true,
  autoPlay = true,
}: AnimationProps) => (
  <View style={[styles.container, { width: size, height: size }, style]}>
    <LottieView
      source={require('../../assets/animations/savings.json')}
      autoPlay={autoPlay}
      loop={loop}
      style={{ width: size, height: size }}
    />
  </View>
);

export const InvestmentAnimation = ({
  style,
  size = 200,
  loop = true,
  autoPlay = true,
}: AnimationProps) => (
  <View style={[styles.container, { width: size, height: size }, style]}>
    <LottieView
      source={require('../../assets/animations/investment.json')}
      autoPlay={autoPlay}
      loop={loop}
      style={{ width: size, height: size }}
    />
  </View>
);

export const CelebrationAnimation = ({
  style,
  size = 200,
  loop = false,
  autoPlay = true,
}: AnimationProps) => (
  <View style={[styles.container, { width: size, height: size }, style]}>
    <LottieView
      source={require('../../assets/animations/celebration.json')}
      autoPlay={autoPlay}
      loop={loop}
      style={{ width: size, height: size }}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 