import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

// Constants
import { COLORS, FONT, SIZES } from '@/constants/theme';

// Components
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';

// Context
import { useAuth } from '@/context/auth-context';
import { Toast } from 'toastify-react-native';

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const LoginScreen = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    setIsLoading(true);
    if (!validateForm()) return;
    try {
      await login(formData.email, formData.password);
      Toast.success('Login successful! Redirecting...');
    } catch (error) {
      console.error('Login error:', error);
      Toast.error('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="dark" />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            Log in to continue managing your finances
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Email"
            placeholder="Enter your email"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Ionicons name="mail-outline" size={20} color={COLORS.gray400} />}
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
            error={errors.password}
            secureTextEntry={!showPassword}
            leftIcon={<Ionicons name="lock-closed-outline" size={20} color={COLORS.gray400} />}
            rightIcon={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={COLORS.gray400}
                />
              </TouchableOpacity>
            }
          />

          <TouchableOpacity
            style={styles.forgotPassword}
            // onPress={() => router.push('/auth/forgot-password')}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <Button
          title="Log In"
          onPress={handleLogin}
          loading={isLoading}
          style={styles.button}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
            <Text style={styles.footerLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: SIZES.large,
    paddingBottom: 100,
  },
  header: {
    marginTop: SIZES.xxLarge,
    marginBottom: SIZES.large,
  },
  title: {
    fontFamily: FONT.bold,
    fontSize: SIZES.xxLarge,
    color: COLORS.text,
    marginBottom: SIZES.small,
  },
  subtitle: {
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
    color: COLORS.gray500,
  },
  form: {
    marginVertical: SIZES.large,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: SIZES.small,
  },
  forgotPasswordText: {
    fontFamily: FONT.medium,
    fontSize: SIZES.small,
    color: COLORS.primary,
  },
  button: {
    marginTop: SIZES.medium,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SIZES.large,
  },
  footerText: {
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
    color: COLORS.gray500,
    marginRight: SIZES.small,
  },
  footerLink: {
    fontFamily: FONT.medium,
    fontSize: SIZES.medium,
    color: COLORS.primary,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SIZES.large,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.gray300,
  },
  dividerText: {
    fontFamily: FONT.medium,
    fontSize: SIZES.small,
    color: COLORS.gray500,
    marginHorizontal: SIZES.medium,
  },
  socialButton: {
    marginTop: SIZES.small,
  },
});

export default LoginScreen; 