import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  Platform,
} from 'react-native';
import colors from '../../theme/colors';
import PrimaryButton from '../../components/PrimaryButton';
import { useShopRegistration } from '../../context/ShopRegistrationContext';

export default function ShopRegistrationSuccessScreen({
  onCheckStatus,
  onGoHome,
}) {
  const { shopInfo, submittedShopId } = useShopRegistration();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        {/* Animated Celebration Icon */}
        <View style={styles.iconCircle}>
          <Text style={styles.checkIcon}>🎉</Text>
        </View>

        <Text style={styles.title}>Registration Submitted!</Text>

        <View style={styles.messageBox}>
          <Text style={styles.highlightText}>
            "Your shop registration has been submitted successfully. Our admin team will review your application."
          </Text>
        </View>

        {/* Application Summary Card */}
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Shop Name</Text>
            <Text style={styles.value}>{shopInfo.shopName || 'CityMart Store'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Reference ID</Text>
            <Text style={styles.codeText}>{submittedShopId || 'REF-CM-99821'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Initial Status</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>● Pending Admin Review</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Estimated Review</Text>
            <Text style={styles.value}>24 – 48 Business Hours</Text>
          </View>
        </View>

        <Text style={styles.infoNote}>
          You will receive real-time notifications once an administrator reviews your business documents.
        </Text>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <PrimaryButton
            title="Track Application Status →"
            onPress={onCheckStatus}
            style={styles.primaryBtn}
          />
          <PrimaryButton
            title="Back to Login / Home"
            variant="outline"
            onPress={onGoHome}
            style={styles.secondaryBtn}
            textStyle={{ color: colors.textSecondary }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#ECFDF5',
    borderWidth: 3,
    borderColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  checkIcon: {
    fontSize: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  messageBox: {
    backgroundColor: colors.primaryLight,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    padding: 14,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
  },
  highlightText: {
    fontSize: 14,
    color: colors.primaryDark,
    lineHeight: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  detailsCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 18,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  label: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  value: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  codeText: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: colors.primary,
  },
  statusBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
  infoNote: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  actions: {
    width: '100%',
    gap: 12,
  },
  primaryBtn: {},
  secondaryBtn: {
    borderColor: colors.border,
  },
});
