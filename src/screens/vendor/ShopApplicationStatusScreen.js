import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import colors from '../../theme/colors';
import PrimaryButton from '../../components/PrimaryButton';
import { useShopRegistration } from '../../context/ShopRegistrationContext';
import { getShopApplicationStatus } from '../../services/shopRegistrationService';

export default function ShopApplicationStatusScreen({
  onResubmit,
  onGoHome,
  onEnterDashboard,
}) {
  const { submittedShopId, ownerInfo } = useShopRegistration();
  const [shopData, setShopData] = useState(null);
  const [activeStatus, setActiveStatus] = useState('pending'); // 'pending' | 'under_review' | 'approved' | 'rejected'

  useEffect(() => {
    async function loadStatus() {
      const data = await getShopApplicationStatus(submittedShopId, ownerInfo?.email);
      if (data) {
        setShopData(data);
        setActiveStatus(data.status || 'pending');
      }
    }
    loadStatus();
  }, [submittedShopId]);

  // Status configuration definitions
  const statusConfigs = {
    pending: {
      badgeColor: '#FEF3C7',
      badgeText: '#B45309',
      label: '● Pending Admin Review',
      icon: '⏳',
      title: 'Application Received',
      headline: 'Your registration is queued for verification.',
      description:
        'Our CityMart compliance team will review your business license and owner ID. Applications are typically processed within 24 to 48 business hours.',
      stepIndex: 1,
    },
    under_review: {
      badgeColor: colors.primaryLight,
      badgeText: colors.primaryDark,
      label: '● Under Active Review',
      icon: '🔍',
      title: 'Documents Under Review',
      headline: 'A compliance officer is currently verifying your records.',
      description:
        'Your shop documents and address details are being authenticated. No further action is required from you at this time.',
      stepIndex: 2,
    },
    approved: {
      badgeColor: '#ECFDF5',
      badgeText: '#059669',
      label: '✓ Approved & Active',
      icon: '🎉',
      title: 'Congratulations! Shop Approved',
      headline: 'Welcome to CityMart! Your shop is now officially open.',
      description:
        'You have full seller permissions. You can now list your catalog, configure delivery zones, and start receiving orders from city residents.',
      stepIndex: 3,
    },
    rejected: {
      badgeColor: '#FEE2E2',
      badgeText: '#DC2626',
      label: '✕ Needs Attention / Rejected',
      icon: '⚠️',
      title: 'Application Rejected',
      headline: 'Action required to proceed with registration.',
      description:
        'Our compliance team encountered an issue with your submitted documents. Please review the reason below and submit an updated application.',
      stepIndex: 1,
    },
  };

  const currentConfig = statusConfigs[activeStatus] || statusConfigs.pending;

  const sellingFeatures = [
    { icon: '📦', title: 'Add & List Products', desc: 'Create items with pricing, photos, and stock counts' },
    { icon: '📊', title: 'Manage Inventory', desc: 'Real-time stock alerts and barcode cataloging' },
    { icon: '🚚', title: 'Manage Orders', desc: 'Accept customer orders and track delivery dispatch' },
    { icon: '📈', title: 'Vendor Analytics', desc: 'Daily revenue, payout reports, and customer ratings' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Bar */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onGoHome} style={styles.backBtn}>
            <Text style={styles.backBtnText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Application Status</Text>
          <View style={{ width: 50 }} />
        </View>

        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.iconCircle}>
            <Text style={styles.largeIcon}>{currentConfig.icon}</Text>
          </View>

          <View style={[styles.badge, { backgroundColor: currentConfig.badgeColor }]}>
            <Text style={[styles.badgeText, { color: currentConfig.badgeText }]}>
              {currentConfig.label}
            </Text>
          </View>

          <Text style={styles.cardTitle}>{currentConfig.title}</Text>
          <Text style={styles.cardHeadline}>{currentConfig.headline}</Text>
          <Text style={styles.cardDescription}>{currentConfig.description}</Text>

          {/* Rejection Reason Notice (Only shown if status is rejected) */}
          {activeStatus === 'rejected' && (
            <View style={styles.rejectionNotice}>
              <Text style={styles.rejectionHeader}>Admin Review Notes:</Text>
              <Text style={styles.rejectionText}>
                {shopData?.rejectionReason ||
                  'The uploaded Owner Identification Document was unreadable or expired. Please upload a clear photo or PDF of a valid government ID (Passport, Driver License, or National ID).'}
              </Text>
              <PrimaryButton
                title="Update & Resubmit Application →"
                onPress={onResubmit}
                style={styles.resubmitBtn}
              />
            </View>
          )}

          {/* Approved Selling Features (Only shown if approved) */}
          {activeStatus === 'approved' && (
            <View style={styles.unlockedFeaturesSection}>
              <Text style={styles.unlockedHeader}>Unlocked Selling Privileges:</Text>
              {sellingFeatures.map((f, i) => (
                <View key={i} style={styles.featureItem}>
                  <Text style={styles.featureIcon}>{f.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.featureTitle}>{f.title}</Text>
                    <Text style={styles.featureDesc}>{f.desc}</Text>
                  </View>
                </View>
              ))}

              <PrimaryButton
                title="Enter Shop Dashboard →"
                onPress={onEnterDashboard}
                style={styles.dashboardBtn}
              />
            </View>
          )}
        </View>

        {/* Application Timeline Card */}
        <View style={styles.timelineCard}>
          <Text style={styles.timelineHeading}>Application Milestone Timeline</Text>

          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, styles.timelineDotActive]}>
              <Text style={styles.dotCheck}>✓</Text>
            </View>
            <View style={styles.timelineTextContainer}>
              <Text style={styles.timelineStepTitle}>1. Registration Submitted</Text>
              <Text style={styles.timelineStepDate}>
                {shopData?.createdAt ? new Date(shopData.createdAt).toLocaleDateString() : 'Completed'}
              </Text>
            </View>
          </View>

          <View style={styles.timelineConnector} />

          <View style={styles.timelineItem}>
            <View
              style={[
                styles.timelineDot,
                ['under_review', 'approved'].includes(activeStatus) && styles.timelineDotActive,
              ]}
            >
              <Text style={styles.dotCheck}>
                {['under_review', 'approved'].includes(activeStatus) ? '✓' : '2'}
              </Text>
            </View>
            <View style={styles.timelineTextContainer}>
              <Text style={styles.timelineStepTitle}>2. Compliance Verification</Text>
              <Text style={styles.timelineStepDate}>
                {activeStatus === 'under_review' ? 'In progress right now' : 'Admin review team'}
              </Text>
            </View>
          </View>

          <View style={styles.timelineConnector} />

          <View style={styles.timelineItem}>
            <View
              style={[
                styles.timelineDot,
                activeStatus === 'approved' && styles.timelineDotSuccess,
                activeStatus === 'rejected' && styles.timelineDotError,
              ]}
            >
              <Text style={styles.dotCheck}>
                {activeStatus === 'approved' ? '✓' : activeStatus === 'rejected' ? '✕' : '3'}
              </Text>
            </View>
            <View style={styles.timelineTextContainer}>
              <Text style={styles.timelineStepTitle}>3. Account Activation & Seller Onboarding</Text>
              <Text style={styles.timelineStepDate}>
                {activeStatus === 'approved' ? 'Activated & Ready to sell' : 'Pending final decision'}
              </Text>
            </View>
          </View>
        </View>

        {/* Interactive Status Switcher (for immediate testing & client review) */}
        <View style={styles.demoControlBox}>
          <Text style={styles.demoControlTitle}>🛠 Demo: Test All 4 Registration Statuses</Text>
          <View style={styles.demoButtonsRow}>
            {(['pending', 'under_review', 'approved', 'rejected']).map((s) => (
              <TouchableOpacity
                key={s}
                onPress={() => setActiveStatus(s)}
                style={[
                  styles.demoPill,
                  activeStatus === s && styles.demoPillActive,
                ]}
              >
                <Text
                  style={[
                    styles.demoPillText,
                    activeStatus === s && styles.demoPillTextActive,
                  ]}
                >
                  {s.replace('_', ' ')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity onPress={onGoHome} style={styles.homeLink}>
          <Text style={styles.homeLinkText}>Return to Customer App</Text>
        </TouchableOpacity>
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
    paddingBottom: 36,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  backBtn: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  backBtnText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  statusCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 22,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 16,
  },
  iconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  largeIcon: {
    fontSize: 34,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 6,
  },
  cardHeadline: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 10,
  },
  rejectionNotice: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1.5,
    borderColor: '#FECACA',
    borderRadius: 12,
    padding: 16,
    marginTop: 18,
    width: '100%',
  },
  rejectionHeader: {
    fontSize: 13,
    fontWeight: '800',
    color: '#991B1B',
    marginBottom: 6,
  },
  rejectionText: {
    fontSize: 13,
    color: '#B91C1C',
    lineHeight: 18,
    marginBottom: 14,
  },
  resubmitBtn: {
    backgroundColor: '#DC2626',
  },
  unlockedFeaturesSection: {
    marginTop: 18,
    width: '100%',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  unlockedHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: '#047857',
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F0FDF4',
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
  featureIcon: {
    fontSize: 20,
  },
  featureTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  featureDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  dashboardBtn: {
    marginTop: 10,
    backgroundColor: '#059669',
  },
  timelineCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  timelineHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 14,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timelineDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineDotActive: {
    backgroundColor: colors.primary,
  },
  timelineDotSuccess: {
    backgroundColor: '#10B981',
  },
  timelineDotError: {
    backgroundColor: colors.error,
  },
  dotCheck: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.white,
  },
  timelineTextContainer: {
    flex: 1,
  },
  timelineStepTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  timelineStepDate: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  timelineConnector: {
    width: 2,
    height: 16,
    backgroundColor: colors.border,
    marginLeft: 12,
    marginVertical: 2,
  },
  demoControlBox: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  demoControlTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 10,
    textAlign: 'center',
  },
  demoButtonsRow: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
  },
  demoPill: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  demoPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  demoPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  demoPillTextActive: {
    color: colors.white,
  },
  homeLink: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  homeLinkText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});
