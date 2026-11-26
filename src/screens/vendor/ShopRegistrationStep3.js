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

export default function ShopRegistrationStep3({ onNext, onPrev }) {
  const { addressInfo, updateAddressInfo } = useShopRegistration();
  const [errors, setErrors] = useState({});

  const handleNext = () => {
    const err = {};

    if (!addressInfo.country.trim()) {
      err.country = 'Country is required';
    }

    if (!addressInfo.city.trim()) {
      err.city = 'City is required';
    }

    if (!addressInfo.state.trim()) {
      err.state = 'Province / State is required';
    }

    if (!addressInfo.streetAddress.trim()) {
      err.streetAddress = 'Street address is required';
    }

    if (!addressInfo.postalCode.trim()) {
      err.postalCode = 'Postal / Zip code is required';
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
          <StepIndicator currentStep={3} />

          <View style={styles.contentCard}>
            <Text style={styles.stepTitle}>Step 3: Physical Address</Text>
            <Text style={styles.stepSubtitle}>
              Provide your physical store or dispatch location. This helps CityMart connect you with nearby local customers and delivery couriers.
            </Text>

            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <CustomInput
                  label="Country *"
                  placeholder="e.g. United States"
                  value={addressInfo.country}
                  onChangeText={(val) => {
                    updateAddressInfo('country', val);
                    if (errors.country) setErrors((prev) => ({ ...prev, country: null }));
                  }}
                  error={errors.country}
                />
              </View>
              <View style={{ flex: 1 }}>
                <CustomInput
                  label="State / Province *"
                  placeholder="e.g. New York"
                  value={addressInfo.state}
                  onChangeText={(val) => {
                    updateAddressInfo('state', val);
                    if (errors.state) setErrors((prev) => ({ ...prev, state: null }));
                  }}
                  error={errors.state}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <CustomInput
                  label="City *"
                  placeholder="e.g. Brooklyn"
                  value={addressInfo.city}
                  onChangeText={(val) => {
                    updateAddressInfo('city', val);
                    if (errors.city) setErrors((prev) => ({ ...prev, city: null }));
                  }}
                  error={errors.city}
                />
              </View>
              <View style={{ flex: 1 }}>
                <CustomInput
                  label="Postal Code *"
                  placeholder="e.g. 11217"
                  value={addressInfo.postalCode}
                  onChangeText={(val) => {
                    updateAddressInfo('postalCode', val);
                    if (errors.postalCode) setErrors((prev) => ({ ...prev, postalCode: null }));
                  }}
                  keyboardType="numeric"
                  error={errors.postalCode}
                />
              </View>
            </View>

            <CustomInput
              label="Street Address *"
              placeholder="e.g. 458 Atlantic Avenue, Suite 2B"
              value={addressInfo.streetAddress}
              onChangeText={(val) => {
                updateAddressInfo('streetAddress', val);
                if (errors.streetAddress) setErrors((prev) => ({ ...prev, streetAddress: null }));
              }}
              error={errors.streetAddress}
            />

            <CustomInput
              label="Google Maps Location Link (Optional)"
              placeholder="e.g. https://maps.google.com/?q=..."
              value={addressInfo.googleMapsLocation}
              onChangeText={(val) => updateAddressInfo('googleMapsLocation', val)}
              autoCapitalize="none"
              keyboardType="url"
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
                title="Next: Documents →"
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
  row: {
    flexDirection: 'row',
    gap: 12,
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
