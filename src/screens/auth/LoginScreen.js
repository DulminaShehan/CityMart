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
} from 'react-native';
import colors from '../../theme/colors';
import CustomInput from '../../components/CustomInput';
import PrimaryButton from '../../components/PrimaryButton';
import CityIcon from '../../components/CityIcon';

const { width } = Dimensions.get('window');

export default function LoginScreen({ navigation, onNavigateToVendorReg }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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
      // Future integration with Firebase Authentication
      // e.g., await signInWithEmailAndPassword(auth, email, password)
      setTimeout(() => {
        setIsLoading(false);
        Alert.alert(
          'Login Attempt',
          `Signing in as ${email.trim()}.\n\nFirebase authentication integration ready. Once credentials are provided, this connects to your live Firebase project.`,
          [{ text: 'OK' }]
        );
      }, 900);
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Login Failed', error.message || 'An error occurred during login.');
    }
  };

  const handleForgotPassword = () => {
    if (!email.trim() || !validateEmail(email)) {
      Alert.alert(
        'Forgot Password',
        'Please enter your registered email address above first to receive password reset instructions.'
      );
      return;
    }

    Alert.alert(
      'Password Reset',
      `Password reset link will be sent to ${email.trim()} once Firebase is configured.`,
      [{ text: 'OK' }]
    );
  };

  const handleSocialLogin = (provider) => {
    Alert.alert(
      `${provider} Sign-In`,
      `${provider} authentication will be enabled once OAuth credentials are configured.`,
      [{ text: 'Got it' }]
    );
  };

  const handleSignUpNavigation = () => {
    if (navigation && navigation.navigate) {
      navigation.navigate('Register');
    } else {
      Alert.alert('Sign Up', 'Navigating to registration screen...');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
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
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
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
                onPress={() => handleSocialLogin('Google')}
              >
                <CityIcon name="google" size={18} color="#EA4335" />
                <Text style={styles.socialButtonText}>Google</Text>
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

            {/* Shop Owner Registration Action */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onNavigateToVendorReg}
              style={styles.vendorActionBox}
            >
              <Text style={styles.vendorActionIcon}>🏪</Text>
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
    paddingBottom: 0,
    justifyContent: 'space-between',
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoContainer: {
    width: 86,
    height: 86,
    borderRadius: 22,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 12,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 18,
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
    fontWeight: '500',
    color: colors.textSecondary,
    marginTop: 3,
    letterSpacing: 0.2,
  },
  formCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 16,
  },
  greetingTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  greetingSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  forgotPasswordRow: {
    alignItems: 'flex-end',
    marginTop: -4,
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  loginButton: {
    marginBottom: 18,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 18,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 44,
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  socialButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  footerPrompt: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  signUpLink: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  vendorActionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FEF3C7',
    borderWidth: 1.2,
    borderColor: '#F59E0B',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
  },
  vendorActionIcon: {
    fontSize: 24,
  },
  vendorActionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400E',
  },
  vendorActionSub: {
    fontSize: 12,
    fontWeight: '600',
    color: '#B45309',
    marginTop: 1,
  },
  decorativeFooter: {
    position: 'relative',
    height: 85,
    marginHorizontal: -22,
    marginTop: 10,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  skylineSilhouette: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 5,
    position: 'absolute',
    bottom: 22,
    width: '100%',
    opacity: 0.32,
  },
  building: {
    backgroundColor: colors.primary,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    alignItems: 'center',
    paddingTop: 6,
    gap: 4,
  },
  spire: {
    width: 2,
    height: 8,
    backgroundColor: colors.primary,
    position: 'absolute',
    top: -8,
  },
  windowRow: {
    flexDirection: 'row',
    gap: 3,
  },
  windowDot: {
    width: 3.5,
    height: 3.5,
    backgroundColor: colors.accent,
    borderRadius: 1,
  },
  waveLayerOrange: {
    position: 'absolute',
    bottom: 0,
    left: -15,
    right: -15,
    height: 26,
    backgroundColor: colors.accent,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 44,
    transform: [{ rotate: '-1.2deg' }],
  },
  waveLayerBlue: {
    position: 'absolute',
    bottom: -6,
    left: -10,
    right: -10,
    height: 24,
    backgroundColor: colors.primary,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 30,
    transform: [{ rotate: '1deg' }],
  },
});
