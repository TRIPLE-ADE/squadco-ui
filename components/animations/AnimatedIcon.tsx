import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface AnimatedIconProps {
  name: keyof typeof Ionicons.glyphMap;
  size: number;
  color: string;
  focused?: boolean;
}

const AnimatedIcon = ({ name, size, color, focused = false }: AnimatedIconProps) => {
  const AnimatedIonicons = Animated.createAnimatedComponent(Ionicons);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withSpring(focused ? 1.2 : 1, {
            damping: 10,
            stiffness: 100,
          }),
        },
      ],
    };
  });

  return (
    <AnimatedIonicons
      name={name}
      size={size}
      color={color}
      style={animatedStyle}
    />
  );
};

export default AnimatedIcon; 