import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Toast } from "toastify-react-native";
import { COLORS, FONT, SIZES } from "@/constants/theme";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import api from "@/services/api";

const signUpSchema = z
  .object({
    firstName: z.string().min(3, "First name is required"),
    lastName: z.string().min(3, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    userType: z.enum(["STUDENT", "MERCHANT"]),
    contributors: z
      .array(
        z.object({
          name: z.string().min(3, "Name is required"),
          email: z.string().email("Invalid email"),
          relationship: z.string().min(3, "Relationship is required"),
        })
      )
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const SignUpScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      userType: "STUDENT",
      contributors: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "contributors",
  });

  const handleSignUp = async (data: any) => {
    setIsLoading(true);
    try {
      // TODO: Implement actual login logic
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulated delay
      // const response = await api.post("auth/create-user/", data);

      Toast.success("Account created successfully! 🎉");
      router.replace("/(auth)/login");
    } catch (error) {
      Toast.error("Something went wrong, please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Start your financial journey</Text>
        </View>

        <View style={styles.form}>
          {/* Full Name */}
          <Controller
            control={control}
            name="firstName"
            render={({ field }) => (
              <Input
                label="First Name"
                placeholder="Enter your first name"
                value={field.value}
                onChangeText={field.onChange}
                error={errors.firstName?.message}
                leftIcon={
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color={COLORS.gray400}
                  />
                }
              />
            )}
          />

          {/* Last Name */}
          <Controller
            control={control}
            name="lastName"
            render={({ field }) => (
              <Input
                label="Last Name"
                placeholder="Enter your last name"
                value={field.value}
                onChangeText={field.onChange}
                error={errors.lastName?.message}
                leftIcon={
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color={COLORS.gray400}
                  />
                }
              />
            )}
          />

          {/* Email */}
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <Input
                label="Email"
                placeholder="Enter your email"
                value={field.value}
                onChangeText={field.onChange}
                error={errors.email?.message}
                keyboardType="email-address"
                autoCapitalize="none"
                leftIcon={
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color={COLORS.gray400}
                  />
                }
              />
            )}
          />

          {/* Password */}
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <Input
                label="Password"
                placeholder="Create a password"
                value={field.value}
                onChangeText={field.onChange}
                error={errors.password?.message}
                secureTextEntry={!showPassword}
                leftIcon={
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={COLORS.gray400}
                  />
                }
                rightIcon={
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color={COLORS.gray400}
                    />
                  </TouchableOpacity>
                }
              />
            )}
          />

          {/* Confirm Password */}
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field }) => (
              <Input
                label="Confirm Password"
                placeholder="Confirm your password"
                value={field.value}
                onChangeText={field.onChange}
                error={errors.confirmPassword?.message}
                secureTextEntry={!showConfirmPassword}
                leftIcon={
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={COLORS.gray400}
                  />
                }
                rightIcon={
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Ionicons
                      name={
                        showConfirmPassword ? "eye-off-outline" : "eye-outline"
                      }
                      size={20}
                      color={COLORS.gray400}
                    />
                  </TouchableOpacity>
                }
              />
            )}
          />
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.sectionTitle}>Contributors</Text>
            <TouchableOpacity
              onPress={() => setShowInfo(!showInfo)}
              style={{ marginLeft: 5 }}
            >
              <Ionicons
                name="information-circle-outline"
                size={20}
                color={COLORS.primary} 
              />
            </TouchableOpacity>
          </View>

          {showInfo && (
            <Text style={styles.description}>
              Contributors are individuals who support your financial journey by
              contributing funds. You can add family members, friends, or
              mentors.
            </Text>
          )}

          {fields.map((item, index) => (
            <View key={item.id} style={styles.contributorContainer}>
              <Controller
                control={control}
                name={`contributors.${index}.name`}
                render={({ field }) => (
                  <Input
                    label="Name"
                    value={field.value}
                    onChangeText={field.onChange}
                    error={errors.contributors?.[index]?.name?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name={`contributors.${index}.email`}
                render={({ field }) => (
                  <Input
                    label="Email"
                    value={field.value}
                    onChangeText={field.onChange}
                    error={errors.contributors?.[index]?.email?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name={`contributors.${index}.relationship`}
                render={({ field }) => (
                  <Input
                    label="Relationship"
                    value={field.value}
                    onChangeText={field.onChange}
                    error={errors.contributors?.[index]?.relationship?.message}
                  />
                )}
              />
              <TouchableOpacity onPress={() => remove(index)}>
                <Text style={styles.removeButton}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity
            onPress={() =>
              append({
                name: "",
                email: "",
                relationship: "",
              })
            }
          >
            <Text style={styles.addButton}>+ Add Contributor</Text>
          </TouchableOpacity>
        </View>
        <Button
          title="Create Account"
          loading={isloading}
          onPress={handleSubmit(handleSignUp)}
        />
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
            <Text style={styles.footerLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  contentContainer: { padding: SIZES.large,  },
  header: { marginBottom: SIZES.large },
  title: { fontFamily: FONT.bold, fontSize: SIZES.xxLarge },
  form: {
    marginVertical: SIZES.large,
  },
  subtitle: {
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
    color: COLORS.gray500,
  },
  sectionTitle: {
    fontFamily: FONT.bold,
    fontSize: SIZES.large,
  },
  description: {
    fontSize: SIZES.medium,
    color: COLORS.gray500,
    marginBottom: SIZES.small,
  },
  contributorContainer: { marginVertical: SIZES.medium },
  addButton: { color: COLORS.primary, fontWeight: "bold" },
  removeButton: {
    color: COLORS.error,
    fontWeight: "bold",
    marginTop: SIZES.small,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: SIZES.large,
    marginBottom: 100,
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
});

export default SignUpScreen;
