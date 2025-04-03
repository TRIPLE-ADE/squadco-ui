import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT, SIZES, SHADOWS } from '../../constants/theme';
import { useAuth } from '@/context/auth-context';

// Dummy data
const USER_PROFILE = {
  name: 'John Doe',
  email: 'john.doe@university.edu',
  studentId: 'STU123456',
  university: 'Sample University',
  profileImage: 'https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff',
};

const MENU_ITEMS = [
  {
    id: 'personal',
    title: 'Personal Information',
    icon: 'person',
    route: '/profile/personal',
  },
  {
    id: 'bank',
    title: 'Bank Accounts',
    icon: 'card',
    route: '/profile/bank-accounts',
  },
  {
    id: 'notifications',
    title: 'Notifications',
    icon: 'notifications',
    route: '/profile/notifications',
  },
  {
    id: 'security',
    title: 'Security',
    icon: 'shield',
    route: '/profile/security',
  },
  {
    id: 'help',
    title: 'Help & Support',
    icon: 'help-circle',
    route: '/profile/help',
  },
  {
    id: 'about',
    title: 'About App',
    icon: 'information-circle',
    route: '/profile/about',
  },
];

const ProfileScreen = () => {
  const { logout } = useAuth();
  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => router.push('/profile/settings')}
        >
          <Ionicons name="settings-outline" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image
            source={{ uri: USER_PROFILE.profileImage }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{USER_PROFILE.name}</Text>
            <Text style={styles.email}>{USER_PROFILE.email}</Text>
            <View style={styles.studentInfo}>
              <Text style={styles.studentId}>{USER_PROFILE.studentId}</Text>
              <Text style={styles.university}>{USER_PROFILE.university}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push('/profile/edit')}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {MENU_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => router.push(item.route)}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name={item.icon} size={24} color={COLORS.primary} />
                <Text style={styles.menuItemTitle}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={COLORS.gray500} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => logout()}
        >
          <Ionicons name="log-out" size={24} color={COLORS.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: SIZES.large,
    paddingTop: SIZES.xxLarge + SIZES.medium,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontFamily: FONT.bold,
    fontSize: SIZES.large,
    color: COLORS.white,
  },
  settingsButton: {
    padding: SIZES.small,
  },
  content: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.medium,
    padding: SIZES.large,
    margin: SIZES.medium,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: SIZES.medium,
  },
  profileInfo: {
    alignItems: 'center',
  },
  name: {
    fontFamily: FONT.bold,
    fontSize: SIZES.large,
    color: COLORS.text,
    marginBottom: SIZES.small,
  },
  email: {
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
    color: COLORS.gray500,
    marginBottom: SIZES.small,
  },
  studentInfo: {
    alignItems: 'center',
  },
  studentId: {
    fontFamily: FONT.medium,
    fontSize: SIZES.small,
    color: COLORS.primary,
    marginBottom: 4,
  },
  university: {
    fontFamily: FONT.regular,
    fontSize: SIZES.small,
    color: COLORS.gray500,
  },
  editButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.large,
    paddingVertical: SIZES.small,
    borderRadius: SIZES.small,
    marginTop: SIZES.medium,
  },
  editButtonText: {
    fontFamily: FONT.medium,
    fontSize: SIZES.medium,
    color: COLORS.white,
  },
  menuContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.medium,
    margin: SIZES.medium,
    marginTop: 0,
    ...SHADOWS.small,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SIZES.large,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemTitle: {
    fontFamily: FONT.medium,
    fontSize: SIZES.medium,
    color: COLORS.text,
    marginLeft: SIZES.medium,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    padding: SIZES.large,
    margin: SIZES.medium,
    marginTop: 0,
    borderRadius: SIZES.medium,
    ...SHADOWS.small,
  },
  logoutText: {
    fontFamily: FONT.medium,
    fontSize: SIZES.medium,
    color: COLORS.error,
    marginLeft: SIZES.small,
  },
  versionContainer: {
    alignItems: 'center',
    padding: SIZES.large,
  },
  versionText: {
    fontFamily: FONT.regular,
    fontSize: SIZES.small,
    color: COLORS.gray500,
  },
});

export default ProfileScreen; 