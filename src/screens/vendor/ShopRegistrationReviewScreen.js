import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import colors from '../../theme/colors';
import PrimaryButton from '../../components/PrimaryButton';
import StepIndicator from '../../components/StepIndicator';
import { useShopRegistration } from '../../context/ShopRegistrationContext';
import { submitShopRegistration } from '../../services/shopRegistrationService';

export default function ShopRegistrationReviewScreen({
  onEditStep,
  onSubmitSuccess,
  onPrev,
}) {
  const {
    ownerInfo,
    shopInfo,
    addressInfo,
    documents,
    isSubmitting,
    setIsSubmitting,
    setSubmittedShopId,
  } = useShopRegistration();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await submitShopRegistration({
        owner: ownerInfo,
        shop: shopInfo,
        address: addressInfo,
        documents: documents,
      });

      setIsSubmitting(false);
      setSubmittedShopId(result.shopId);
      onSubmitSuccess(result.shopId);
    } catch (error) {
      setIsSubmitting(false);
      Alert.alert(
        'Submission Error',
        error.message || 'Could not complete registration. Please check your data and try again.'
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <StepIndicator currentStep={5} />

        <View style={styles.contentCard}>
          <Text style={styles.stepTitle}>Step 5: Review & Submit</Text>
          <Text style={styles.stepSubtitle}>
            Please carefully review your shop registration details before submitting. You can edit any section using the edit buttons.
          </Text>

          {/* Section 1: Owner Info */}
          <View style={styles.reviewSection}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeading}>👤 Owner Information</Text>
              <TouchableOpacity
                onPress={() => onEditStep(1)}
                style={styles.editBtn}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Full Name</Text>
              <Text style={styles.detailValue}>{ownerInfo.fullName || '—'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Email Address</Text>
              <Text style={styles.detailValue}>{ownerInfo.email || '—'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Mobile Phone</Text>
              <Text style={styles.detailValue}>{ownerInfo.mobile || '—'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Account Role</Text>
              <View style={styles.roleChip}>
                <Text style={styles.roleChipText}>Shop Owner (Vendor)</Text>
              </View>
            </View>
          </View>

          {/* Section 2: Shop Details */}
          <View style={styles.reviewSection}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeading}>🏪 Shop Details</Text>
              <TouchableOpacity
                onPress={() => onEditStep(2)}
                style={styles.editBtn}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Shop Name</Text>
              <Text style={styles.detailValueBold}>{shopInfo.shopName || '—'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Category</Text>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>{shopInfo.category}</Text>
              </View>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Description</Text>
              <Text style={[styles.detailValue, { flex: 1, textAlign: 'right' }]} numberOfLines={2}>
                {shopInfo.description || '—'}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Shop Contact</Text>
              <Text style={styles.detailValue}>
                {shopInfo.shopEmail || ownerInfo.email}
              </Text>
            </View>
            {shopInfo.businessRegistrationNumber ? (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Reg. Number</Text>
                <Text style={styles.detailValue}>{shopInfo.businessRegistrationNumber}</Text>
              </View>
            ) : null}
          </View>

          {/* Section 3: Address */}
          <View style={styles.reviewSection}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeading}>📍 Store Location</Text>
              <TouchableOpacity
                onPress={() => onEditStep(3)}
                style={styles.editBtn}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Address</Text>
              <Text style={[styles.detailValue, { flex: 1, textAlign: 'right' }]}>
                {addressInfo.streetAddress}, {addressInfo.city}, {addressInfo.state}{' '}
                {addressInfo.postalCode}, {addressInfo.country}
              </Text>
            </View>
            {addressInfo.googleMapsLocation ? (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Maps Link</Text>
                <Text style={[styles.detailValue, { color: colors.primary }]} numberOfLines={1}>
                  {addressInfo.googleMapsLocation}
                </Text>
              </View>
            ) : null}
          </View>

          {/* Section 4: Documents & Media */}
          <View style={styles.reviewSection}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeading}>📄 Branding & Documents</Text>
              <TouchableOpacity
                onPress={() => onEditStep(4)}
                style={styles.editBtn}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.mediaSummaryRow}>
              <View style={styles.mediaItem}>
                <Text style={styles.mediaLabel}>Shop Logo</Text>
                {documents.logo?.uri ? (
                  <Image source={{ uri: documents.logo.uri }} style={styles.thumbImage} />
                ) : (
                  <View style={styles.missingThumb}>
                    <Text style={styles.missingText}>No Logo</Text>
                  </View>
                )}
              </View>

              <View style={styles.mediaItem}>
                <Text style={styles.mediaLabel}>Cover Image</Text>
                {documents.cover?.uri ? (
                  <Image source={{ uri: documents.cover.uri }} style={styles.thumbCover} />
                ) : (
                  <View style={styles.missingThumb}>
                    <Text style={styles.missingText}>None</Text>
                  </View>
                )}
              </View>
            </View>

            <View style={[styles.detailRow, { marginTop: 8 }]}>
              <Text style={styles.detailLabel}>Owner ID Document</Text>
              <Text style={styles.detailValueSuccess}>
                ✓ {documents.idDoc?.name || 'Attached'}
              </Text>
            </View>

            {documents.businessDoc ? (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Business License</Text>
                <Text style={styles.detailValueSuccess}>
                  ✓ {documents.businessDoc?.name}
                </Text>
              </View>
            ) : null}
          </View>

          {/* Terms & Conditions Notice */}
          <View style={styles.termsBox}>
            <Text style={styles.termsText}>
              By tapping <Text style={{ fontWeight: '700' }}>Submit Registration</Text>, you certify that all information submitted is accurate and agree to the CityMart Marketplace Vendor Agreement and local trade compliance policies.
            </Text>
          </View>

          <View style={styles.buttonRow}>
            <PrimaryButton
              title="← Back"
              variant="outline"
              onPress={onPrev}
              disabled={isSubmitting}
              style={styles.backBtn}
              textStyle={{ color: colors.textSecondary }}
            />
            <PrimaryButton
              title="Submit Registration"
              onPress={handleSubmit}
              loading={isSubmitting}
              style={styles.submitBtn}
            />
          </View>
        </View>
      </ScrollView>
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
  reviewSection: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  editBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: colors.primaryLight,
    borderRadius: 6,
  },
  editText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  detailLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '500',
  },
  detailValueBold: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '700',
  },
  detailValueSuccess: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
  roleChip: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  roleChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4F46E5',
  },
  categoryBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  mediaSummaryRow: {
    flexDirection: 'row',
    gap: 16,
    marginVertical: 4,
  },
  mediaItem: {
    alignItems: 'center',
    gap: 6,
  },
  mediaLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  thumbImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  thumbCover: {
    width: 100,
    height: 60,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  missingThumb: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  missingText: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  termsBox: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 10,
    padding: 12,
    marginVertical: 14,
  },
  termsText: {
    fontSize: 11,
    color: '#92400E',
    lineHeight: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  backBtn: {
    flex: 1,
    borderColor: colors.border,
  },
  submitBtn: {
    flex: 2,
  },
});
