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
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import colors from '../../theme/colors';
import CustomInput from '../../components/CustomInput';
import PrimaryButton from '../../components/PrimaryButton';
import CityIcon from '../../components/CityIcon';
import { signIn, sendPasswordReset } from '../../services/authService';
import {
  initiateGoogleSignIn,
  initiateFacebookSignIn,
  initiateAppleSignIn,
} from '../../services/socialAuthService';

const { width } = Dimensions.get('window');

export default function LoginScreen({
  navigation,
  onNavigateToVendorReg,
  onNavigateToRegister,
  onLoginSuccess,
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Email format validator
  const validateEmail = (val) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(val.trim());
  };

  const handleValidation = () => {
    const currentErrors = {};

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

    setErrors(currentErrors);
    return Object.keys(currentErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!handleValidation()) {
      return;
    }

    setIsLoading(true);
    try {
      const user = await signIn({ email, password });
      setIsLoading(false);

      if (onLoginSuccess) {
        onLoginSuccess(user);
      } else {
        Alert.alert(
          'Login Successful! 🎉',
          `Welcome back, ${user.profile?.fullName || email}!\nRole: ${user.profile?.role || 'Customer'}`
        );
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert(
        'Authentication Notice',
        error.message || 'Unable to sign in. Please verify your credentials.'
      );
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim() || !validateEmail(email)) {
      Alert.alert(
        'Email Required',
        'Please enter your registered email address above first to receive password reset instructions.'
      );
      return;
    }

    setIsResetting(true);
    try {
      await sendPasswordReset(email.trim());
      setIsResetting(false);
      Alert.alert(
        'Password Reset Email Sent 📨',
        `A password reset link has been dispatched to ${email.trim()}. Please check your inbox and spam folder.`
      );
    } catch (error) {
      setIsResetting(false);
      Alert.alert(
        'Password Reset Notice',
        error.message || 'Unable to send password reset email at this time.'
      );
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      if (provider === 'Google') {
        setIsGoogleLoading(true);
        const result = await initiateGoogleSignIn((user) => {
          if (onLoginSuccess) {
            onLoginSuccess(user);
          }
        });
        setIsGoogleLoading(false);

        if (!result) return;

        if (result.status === 'success') {
          if (onLoginSuccess) {
            onLoginSuccess(result.user);
          } else {
            Alert.alert(
              'Google Sign-In Successful! 🎉',
              `Welcome, ${result.user?.profile?.fullName || result.user?.email}!\nRole: ${result.user?.profile?.role || 'Customer'}`
            );
          }
          return;
        }

        if (result.status === 'opened') {
          Alert.alert(result.title || 'Google Sign-In', result.message || 'Opening Google sign-in...', [{ text: 'OK' }]);
          return;
        }

        if (result.status === 'cancelled') {
          // Gracefully dismissed by user - no intrusive error alert needed
          return;
        }

        if (result.status === 'missing_config' || result.status === 'platform_notice') {
          Alert.alert(result.title, result.instructions, [{ text: 'Understood' }]);
          return;
        }

        if (result.status === 'notice') {
          Alert.alert(result.title || 'Configuration Notice', result.message, [{ text: 'OK' }]);
          return;
        }

        if (result.status === 'error') {
          Alert.alert('Google Sign-In Notice', result.message || 'Authentication could not be completed.');
          return;
        }
      } else if (provider === 'Facebook') {
        const result = await initiateFacebookSignIn();
        if (!result) return;
        if (result.status === 'missing_config') {
          Alert.alert(result.title, result.instructions, [{ text: 'Understood' }]);
        } else if (result.status === 'opened') {
          Alert.alert('Facebook Sign-In', result.message || 'Sign-in prompt opened.', [{ text: 'OK' }]);
        } else if (result.status === 'error') {
          Alert.alert('Facebook Error', result.message);
        }
      } else if (provider === 'Apple') {
        const result = await initiateAppleSignIn();
        if (!result) return;
        if (result.status === 'platform_notice') {
          Alert.alert(result.title, result.instructions, [{ text: 'Understood' }]);
        }
      }
    } catch (err) {
      setIsGoogleLoading(false);
      Alert.alert(`${provider} Sign-In`, err.message || 'Social sign-in failed.');
    }
  };

  const handleSignUpNavigation = () => {
    if (onNavigateToRegister) {
      onNavigateToRegister();
    } else if (navigation && navigation.navigate) {
      navigation.navigate('Register');
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
          {/* Header Brand Section */}
          <View style={styles.brandSection}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../../../assets/logo.png')}
                style={styles.logo}
                resizeMode="cover"
              />
            </View>

            {/* CityMart Title */}
            <View style={styles.brandTitleRow}>
              <Text style={styles.brandCity}>City</Text>
              <Text style={styles.brandMart}>Mart</Text>
            </View>

            {/* Tagline */}
            <Text style={styles.tagline}>Your City. Your Marketplace.</Text>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            <Text style={styles.greetingTitle}>Welcome Back 👋</Text>
            <Text style={styles.greetingSubtitle}>Sign in to continue to CityMart.</Text>

            {/* Email Input */}
            <CustomInput
              label="Email Address"
              placeholder="name@citymart.com"
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

            {/* Password Input */}
            <CustomInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
              }}
              leftIconName="lock"
              isPassword
              error={errors.password}
            />

            {/* Forgot Password */}
            <View style={styles.forgotPasswordRow}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleForgotPassword}
                disabled={isResetting}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.forgotPasswordText}>
                  {isResetting ? 'Sending...' : 'Forgot Password?'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <PrimaryButton
              title="Log In"
              onPress={handleLogin}
              loading={isLoading}
              style={styles.loginButton}
            />

            {/* Social Login Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Login Buttons */}
            <View style={styles.socialRow}>
              {/* Google */}
              <TouchableOpacity
                style={styles.socialButton}
                activeOpacity={0.8}
                disabled={isGoogleLoading}
                onPress={() => handleSocialLogin('Google')}
              >
                {isGoogleLoading ? (
                  <ActivityIndicator size="small" color="#EA4335" />
                ) : (
                  <>
                    <CityIcon name="google" size={18} color="#EA4335" />
                    <Text style={styles.socialButtonText}>Google</Text>
                  </>
                )}
              </TouchableOpacity>

              {/* Apple */}
              <TouchableOpacity
                style={styles.socialButton}
                activeOpacity={0.8}
                onPress={() => handleSocialLogin('Apple')}
              >
                <CityIcon name="apple" size={18} color="#000000" />
                <Text style={styles.socialButtonText}>Apple</Text>
              </TouchableOpacity>

              {/* Facebook */}
              <TouchableOpacity
                style={styles.socialButton}
                activeOpacity={0.8}
                onPress={() => handleSocialLogin('Facebook')}
              >
                <CityIcon name="facebook" size={18} color="#1877F2" />
                <Text style={styles.socialButtonText}>Facebook</Text>
              </TouchableOpacity>
            </View>

            {/* Sign Up Footer */}
            <View style={styles.footerRow}>
              <Text style={styles.footerPrompt}>Don't have an account? </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleSignUpNavigation}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.signUpLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>

            {/* Shop Owner Registration Callout Box at Bottom */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onNavigateToVendorReg}
              style={styles.vendorActionBox}
            >
              <View style={styles.vendorIconBadge}>
                <Text style={styles.vendorActionIcon}>🏪</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.vendorActionTitle}>Own a Store or Business?</Text>
                <Text style={styles.vendorActionSub}>Register as a CityMart Shop Owner →</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Decorative City Skyline and Wave Banner */}
          <View style={styles.decorativeFooter}>
            {/* Skyline Buildings Silhouette */}
            <View style={styles.skylineSilhouette}>
              <View style={[styles.building, { height: 32, width: 20 }]} />
              <View style={[styles.building, { height: 50, width: 28 }]}>
                <View style={styles.windowRow}>
                  <View style={styles.windowDot} />
                  <View style={styles.windowDot} />
                </View>
                <View style={styles.windowRow}>
                  <View style={styles.windowDot} />
                  <View style={styles.windowDot} />
                </View>
              </View>
              <View style={[styles.building, { height: 65, width: 34 }]}>
                <View style={styles.spire} />
                <View style={styles.windowRow}>
                  <View style={styles.windowDot} />
                  <View style={styles.windowDot} />
                </View>
                <View style={styles.windowRow}>
                  <View style={styles.windowDot} />
                  <View style={styles.windowDot} />
                </View>
              </View>
              <View style={[styles.building, { height: 42, width: 26 }]}>
                <View style={styles.windowRow}>
                  <View style={styles.windowDot} />
                  <View style={styles.windowDot} />
                </View>
              </View>
              <View style={[styles.building, { height: 28, width: 18 }]} />
            </View>

            {/* Flowing Curved Waves in Brand Colors */}
            <View style={styles.waveLayerOrange} />
            <View style={styles.waveLayerBlue} />
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
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 24,
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoContainer: {
    width: 76,
    height: 76,
    borderRadius: 20,
    backgroundColor: colors.white,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 10,
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
    fontSize: 28,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -0.5,
  },
  brandMart: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.accent,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: 2,
    letterSpacing: 0.2,
  },
  formCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 22,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  greetingTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  greetingSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  forgotPasswordRow: {
    alignItems: 'flex-end',
    marginBottom: 16,
    marginTop: -4,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  loginButton: {
    marginBottom: 20,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    paddingHorizontal: 12,
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 20,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  socialButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  footerPrompt: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  signUpLink: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  vendorActionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderWidth: 1.5,
    borderColor: '#FCD34D',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 12,
  },
  vendorIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vendorActionIcon: {
    fontSize: 18,
  },
  vendorActionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400E',
  },
  vendorActionSub: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D97706',
    marginTop: 2,
  },
  decorativeFooter: {
    marginTop: 24,
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    height: 90,
  },
  skylineSilhouette: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 6,
    position: 'absolute',
    bottom: 22,
    zIndex: 1,
  },
  building: {
    backgroundColor: '#CBD5E1',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    alignItems: 'center',
    paddingTop: 4,
  },
  spire: {
    position: 'absolute',
    top: -12,
    width: 2,
    height: 12,
    backgroundColor: '#94A3B8',
  },
  windowRow: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 4,
  },
  windowDot: {
    width: 3,
    height: 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
  },
  waveLayerOrange: {
    position: 'absolute',
    bottom: 8,
    left: -20,
    right: -20,
    height: 24,
    backgroundColor: colors.accent,
    borderTopLeftRadius: 60,
    borderTopRightRadius: 80,
    opacity: 0.9,
    transform: [{ rotate: '-1.5deg' }],
  },
  waveLayerBlue: {
    position: 'absolute',
    bottom: -6,
    left: -20,
    right: -20,
    height: 24,
    backgroundColor: colors.primary,
    borderTopLeftRadius: 80,
    borderTopRightRadius: 60,
  },
});
