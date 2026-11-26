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
import CategorySelector from '../../components/CategorySelector';
import { useShopRegistration } from '../../context/ShopRegistrationContext';

export default function ShopRegistrationStep2({ onNext, onPrev }) {
  const { shopInfo, updateShopInfo, ownerInfo } = useShopRegistration();
  const [errors, setErrors] = useState({});

  const validateEmail = (val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

  const handleNext = () => {
    const err = {};

    if (!shopInfo.shopName.trim()) {
      err.shopName = 'Official shop / business name is required';
    }

    if (!shopInfo.description.trim()) {
      err.description = 'Shop description is required';
    } else if (shopInfo.description.trim().length < 15) {
      err.description = 'Description should be at least 15 characters';
    }

    if (!shopInfo.category) {
      err.category = 'Please select a shop category';
    }

    if (shopInfo.shopEmail && !validateEmail(shopInfo.shopEmail)) {
      err.shopEmail = 'Enter a valid shop email address';
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
          <StepIndicator currentStep={2} />

          <View style={styles.contentCard}>
            <Text style={styles.stepTitle}>Step 2: Shop Details</Text>
            <Text style={styles.stepSubtitle}>
              Tell us about your business. This information will appear on your public store page in CityMart.
            </Text>

            <CustomInput
              label="Shop Name *"
              placeholder="e.g. Metro Fashion Hub"
              value={shopInfo.shopName}
              onChangeText={(val) => {
                updateShopInfo('shopName', val);
                if (errors.shopName) setErrors((prev) => ({ ...prev, shopName: null }));
              }}
              leftIconName="mail"
              autoCapitalize="words"
              error={errors.shopName}
            />

            <CategorySelector
              selectedCategory={shopInfo.category}
              onSelectCategory={(val) => {
                updateShopInfo('category', val);
                if (errors.category) setErrors((prev) => ({ ...prev, category: null }));
              }}
              error={errors.category}
            />

            <CustomInput
              label="Shop Description *"
              placeholder="Describe the items you sell, your specialties, and what customers love about your store..."
              value={shopInfo.description}
              onChangeText={(val) => {
                updateShopInfo('description', val);
                if (errors.description) setErrors((prev) => ({ ...prev, description: null }));
              }}
              multiline
              numberOfLines={3}
              inputStyle={{ height: 80, textAlignVertical: 'top' }}
              error={errors.description}
            />

            <CustomInput
              label="Shop Official Email"
              placeholder={`Optional (defaults to ${ownerInfo.email || 'owner email'})`}
              value={shopInfo.shopEmail}
              onChangeText={(val) => {
                updateShopInfo('shopEmail', val);
                if (errors.shopEmail) setErrors((prev) => ({ ...prev, shopEmail: null }));
              }}
              leftIconName="mail"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.shopEmail}
            />

            <CustomInput
              label="Shop Phone Number"
              placeholder={`Optional (defaults to ${ownerInfo.mobile || 'owner mobile'})`}
              value={shopInfo.shopMobile}
              onChangeText={(val) => updateShopInfo('shopMobile', val)}
              leftIconName="mail"
              keyboardType="phone-pad"
            />

            <CustomInput
              label="Business Registration Number (Optional)"
              placeholder="e.g. BRN-2024-88912"
              value={shopInfo.businessRegistrationNumber}
              onChangeText={(val) => updateShopInfo('businessRegistrationNumber', val)}
              autoCapitalize="characters"
            />

            <View style={styles.buttonRow}>
              <PrimaryButton
                title="← Back"
                variant="outline"
                onPress={onPrev}
                style={styles.backBtn}
                textStyle={{ color: colors.textSecondary }}
              />
              <PrimaryButton
                title="Next: Address →"
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
  backBtn: {
    flex: 1,
    borderColor: colors.border,
  },
  nextBtn: {
    flex: 2,
  },
});
