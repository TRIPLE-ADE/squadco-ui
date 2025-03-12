import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { COLORS } from '@/constants/theme';

type IconName = 'home' | 'wallet' | 'trending-up' | 'person' | 'cash';

interface AnimatedIconProps {
  color: string;
  size: number;
  focused: boolean;
  name: IconName;
}

const AnimatedIcon: React.FC<AnimatedIconProps> = ({ color, size, focused, name }) => {
  const animatedValue = React.useRef(new Animated.Value(focused ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: focused ? 1 : 0,
      useNativeDriver: true,
      tension: 50,
      friction: 7
    }).start();
  }, [focused]);

  const scale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2]
  });

  const iconName = `${name}${focused ? '' : '-outline'}` as keyof typeof Ionicons.glyphMap;

  return (
    <Animated.View style={[
      styles.iconContainer,
      { transform: [{ scale }] },
      focused && styles.activeIconContainer
    ]}>
      <Ionicons 
        name={iconName}
        size={size} 
        color={color}
      />
    </Animated.View>
  );
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#5B37B7',
        tabBarInactiveTintColor: '#666',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          width: '100%',
          height: 80,
          backgroundColor: COLORS.white,
          ...Platform.select({
            ios: {
              shadowColor: COLORS.black,
              shadowOffset: { width: 0, height: -3 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
            },
            android: {
              elevation: 5,
            },
          }),
        },
        tabBarItemStyle: {
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          paddingTop: 10,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: (props) => <AnimatedIcon {...props} name="home" />,
        }}
      />
      <Tabs.Screen
        name="savings"
        options={{
          title: 'Savings',
          tabBarIcon: (props) => <AnimatedIcon {...props} name="wallet" />,
        }}
      />
      <Tabs.Screen
        name="payments"
        options={{
          title: 'Payments',
          tabBarIcon: (props) => <AnimatedIcon {...props} name="cash" />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: (props) => <AnimatedIcon {...props} name="person" />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    borderTopWidth: 3,
    paddingTop: 5,
    borderTopColor: COLORS.white,
  },
  activeIconContainer: {
    borderTopColor: '#5B37B7',
    width: '100%',
  },
});
