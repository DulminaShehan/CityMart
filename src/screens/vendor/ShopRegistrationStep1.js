import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import colors from '../../theme/colors';
import CustomInput from '../../components/CustomInput';
import PrimaryButton from '../../components/PrimaryButton';
import StepIndicator from '../../components/StepIndicator';
import { useShopRegistration } from '../../context/ShopRegistrationContext';

export default function ShopRegistrationStep1({ onNext, onCancel }) {
  const { ownerInfo, updateOwnerInfo } = useShopRegistration();
  const [errors, setErrors] = useState({});

  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

  const handleNext = () => {
    console.log('[Step1] handleNext called with:', ownerInfo);
    const err = {};

    if (!ownerInfo.fullName.trim()) {
      err.fullName = 'Full Name is required';
    }

    if (!ownerInfo.email.trim()) {
      err.email = 'Email address is required';
    } else if (!validateEmail(ownerInfo.email)) {
      err.email = 'Enter a valid email address';
    }

    if (!ownerInfo.mobile.trim()) {
      err.mobile = 'Mobile phone number is required';
    }

    if (!ownerInfo.password) {
      err.password = 'Password is required';
    } else if (ownerInfo.password.length < 6) {
      err.password = 'Password must be at least 6 characters';
    }

    if (!ownerInfo.confirmPassword) {
      err.confirmPassword = 'Confirm your password';
    } else if (ownerInfo.password !== ownerInfo.confirmPassword) {
      err.confirmPassword = 'Passwords do not match';
    }

    setErrors(err);

    if (Object.keys(err).length === 0) {
      onNext();
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
          <StepIndicator currentStep={1} />

          <View style={styles.contentCard}>
            <Text style={styles.stepTitle}>Step 1: Owner Information</Text>
            <Text style={styles.stepSubtitle}>
              Create your vendor account credentials. You will use this email and password to log in and manage your shop.
            </Text>

            <CustomInput
              label="Full Name *"
              placeholder="e.g. John Doe"
              value={ownerInfo.fullName}
              onChangeText={(val) => {
                updateOwnerInfo('fullName', val);
                if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: null }));
              }}
              leftIconName="mail"
              autoCapitalize="words"
              error={errors.fullName}
            />

            <CustomInput
              label="Email Address *"
              placeholder="e.g. owner@example.com"
              value={ownerInfo.email}
              onChangeText={(val) => {
                updateOwnerInfo('email', val);
                if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
              }}
              leftIconName="mail"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />

            <CustomInput
              label="Mobile Number *"
              placeholder="e.g. +1 555-019-2834"
              value={ownerInfo.mobile}
              onChangeText={(val) => {
                updateOwnerInfo('mobile', val);
                if (errors.mobile) setErrors((prev) => ({ ...prev, mobile: null }));
              }}
              leftIconName="mail"
              keyboardType="phone-pad"
              error={errors.mobile}
            />

            <CustomInput
              label="Account Password *"
              placeholder="Minimum 6 characters"
              value={ownerInfo.password}
              onChangeText={(val) => {
                updateOwnerInfo('password', val);
                if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
              }}
              leftIconName="lock"
              isPassword
              error={errors.password}
            />

            <CustomInput
              label="Confirm Password *"
              placeholder="Re-enter your password"
              value={ownerInfo.confirmPassword}
              onChangeText={(val) => {
                updateOwnerInfo('confirmPassword', val);
                if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: null }));
              }}
              leftIconName="lock"
              isPassword
              error={errors.confirmPassword}
            />

            <View style={styles.buttonRow}>
              <PrimaryButton
                title="Cancel"
                variant="outline"
                onPress={onCancel}
                style={styles.cancelBtn}
                textStyle={{ color: colors.textSecondary }}
              />
              <PrimaryButton
                title="Next: Shop Info →"
                onPress={handleNext}
                style={styles.nextBtn}
              />
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
    padding: 16,
    paddingBottom: 32,
  },
  contentCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  stepSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 20,
    lineHeight: 18,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  cancelBtn: {
    flex: 1,
    borderColor: colors.border,
  },
  nextBtn: {
    flex: 2,
  },
});
