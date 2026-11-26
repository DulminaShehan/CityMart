import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  SafeAreaView,
} from 'react-native';
import colors from '../../theme/colors';
import CustomInput from '../../components/CustomInput';
import PrimaryButton from '../../components/PrimaryButton';
import { createAccount, saveCustomerProfile } from '../../services/authService';

export default function RegisterScreen({ onBackToLogin, onRegisterSuccess }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (val) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(val.trim());
  };

  const handleValidation = () => {
    const currentErrors = {};

    if (!fullName.trim()) {
      currentErrors.fullName = 'Full Name is required';
    } else if (fullName.trim().length < 2) {
      currentErrors.fullName = 'Name must be at least 2 characters';
    }

    if (!email.trim()) {
      currentErrors.email = 'Email address is required';
    } else if (!validateEmail(email)) {
      currentErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      currentErrors.password = 'Password is required';
    } else if (password.length < 6) {
      currentErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      currentErrors.confirmPassword = 'Confirm your password';
    } else if (password !== confirmPassword) {
      currentErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(currentErrors);
    return Object.keys(currentErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!handleValidation()) return;

    setIsLoading(true);
    try {
      // 1. Firebase Auth account creation
      const authResult = await createAccount({ email, password });
      
      // 2. Save customer profile in Firebase Realtime Database
      // Note: role is strictly 'customer'
      const customerProfile = await saveCustomerProfile(
        authResult.userId,
        {
          fullName: fullName.trim(),
          email: email.trim(),
          role: 'customer',
          authProvider: 'password',
        },
        authResult.idToken
      );

      setIsLoading(false);
      Alert.alert(
        'Welcome to CityMart! 🎉',
        `Account successfully created for ${fullName.trim()}.\n\nRole: Customer\nEmail: ${email.trim()}`,
        [
          {
            text: 'Start Shopping',
            onPress: () => {
              if (onRegisterSuccess) {
                onRegisterSuccess({
                  userId: authResult.userId,
                  email: authResult.email,
                  idToken: authResult.idToken,
                  profile: customerProfile,
                });
              } else if (onBackToLogin) {
                onBackToLogin();
              }
            },
          },
        ]
      );
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Registration Notice', error.message || 'Failed to complete registration.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top Bar with Back Button */}
          <View style={styles.topBar}>
            <TouchableOpacity
              onPress={onBackToLogin}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <Text style={styles.backButtonText}>← Back to Login</Text>
            </TouchableOpacity>
          </View>

          {/* Header Brand */}
          <View style={styles.brandSection}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../../../assets/logo.png')}
                style={styles.logo}
                resizeMode="cover"
              />
            </View>
            <View style={styles.brandTitleRow}>
              <Text style={styles.brandCity}>City</Text>
              <Text style={styles.brandMart}>Mart</Text>
            </View>
            <Text style={styles.tagline}>Your City. Your Marketplace.</Text>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Create Customer Account</Text>
            <Text style={styles.formSubtitle}>
              Join CityMart to explore thousands of local shops, fresh produce, and exclusive deals.
            </Text>

            {/* Role Badge Indicator */}
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeIcon}>🛍️</Text>
              <Text style={styles.roleBadgeText}>Registering as Customer</Text>
            </View>

            <CustomInput
              label="Full Name"
              placeholder="e.g. John Doe"
              value={fullName}
              onChangeText={(text) => {
                setFullName(text);
                if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: null }));
              }}
              leftIconName="user"
              error={errors.fullName}
            />

            <CustomInput
              label="Email Address"
              placeholder="e.g. john@example.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
              }}
              leftIconName="mail"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />

            <CustomInput
              label="Password"
              placeholder="Create strong password (min 6 chars)"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
              }}
              leftIconName="lock"
              isPassword
              error={errors.password}
            />

            <CustomInput
              label="Confirm Password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: null }));
              }}
              leftIconName="lock"
              isPassword
              error={errors.confirmPassword}
            />

            <PrimaryButton
              title="Create Account"
              onPress={handleRegister}
              loading={isLoading}
              style={{ marginTop: 12 }}
            />

            {/* Already have an account */}
            <View style={styles.footerRow}>
              <Text style={styles.footerPrompt}>Already have an account? </Text>
              <TouchableOpacity onPress={onBackToLogin} activeOpacity={0.7}>
                <Text style={styles.loginLink}>Log In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 40,
  },
  topBar: {
    marginBottom: 8,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  backButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  brandSection: {
    alignItems: 'center',
    marginVertical: 14,
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: colors.white,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 8,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandCity: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -0.5,
  },
  brandMart: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.accent,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: 2,
  },
  formCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  formSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 14,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 16,
    gap: 6,
  },
  roleBadgeIcon: {
    fontSize: 13,
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
  },
  footerPrompt: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  loginLink: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
});
