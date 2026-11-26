import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import colors from '../../theme/colors';
import PrimaryButton from '../../components/PrimaryButton';
import { useShopRegistration } from '../../context/ShopRegistrationContext';

export default function ShopWelcomeScreen({ onStartRegistration, onCheckStatus, onBackToLogin }) {
  const { fillSampleData } = useShopRegistration();

  const benefits = [
    {
      icon: '🏪',
      title: 'Citywide Customer Reach',
      desc: 'Connect with thousands of active buyers shopping directly in your local area.',
    },
    {
      icon: '⚡',
      title: 'Fast & Secure Payouts',
      desc: 'Transparent transactions, instant cash-on-delivery tracking, and regular direct payouts.',
    },
    {
      icon: '📦',
      title: 'Inventory & Order Control',
      desc: 'Manage stock levels, accept incoming orders, and track fulfillment in real-time.',
    },
    {
      icon: '📈',
      title: 'Shop Analytics & Growth',
      desc: 'View sales performance, top selling products, and customer reviews.',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header Card */}
        <View style={styles.headerSection}>
          <View style={styles.logoBadge}>
            <Image
              source={require('../../../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.title}>Become a CityMart Shop Owner</Text>
          <Text style={styles.subtitle}>
            Your City. Your Marketplace. Set up your official store and start selling to local customers today.
          </Text>
        </View>

        {/* Benefits Grid */}
        <View style={styles.benefitsContainer}>
          <Text style={styles.sectionHeader}>Why Sell on CityMart?</Text>
          {benefits.map((b, index) => (
            <View key={index} style={styles.benefitCard}>
              <View style={styles.iconCircle}>
                <Text style={styles.benefitIcon}>{b.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.benefitTitle}>{b.title}</Text>
                <Text style={styles.benefitDesc}>{b.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Quick Demo Pre-fill helper */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            fillSampleData();
            onStartRegistration();
          }}
          style={styles.demoFillBtn}
        >
          <Text style={styles.demoFillText}>⚡ Quick Test: Auto-fill Demo Shop Data</Text>
        </TouchableOpacity>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <PrimaryButton
            title="Start Shop Registration →"
            onPress={onStartRegistration}
            style={styles.primaryBtn}
          />

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onCheckStatus}
            style={styles.checkStatusBtn}
          >
            <Text style={styles.checkStatusText}>
              Already registered? Check Application Status
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onBackToLogin}
            style={styles.loginLink}
          >
            <Text style={styles.loginLinkText}>
              Back to Customer Login
            </Text>
          </TouchableOpacity>
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
    padding: 20,
    paddingBottom: 30,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 10,
  },
  logoBadge: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 16,
  },
  logo: {
    width: 66,
    height: 66,
    borderRadius: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  benefitsContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  benefitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 14,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitIcon: {
    fontSize: 22,
  },
  benefitTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  benefitDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17,
  },
  demoFillBtn: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  demoFillText: {
    color: '#B45309',
    fontSize: 13,
    fontWeight: '700',
  },
  actionSection: {
    gap: 12,
    alignItems: 'center',
  },
  primaryBtn: {
    marginBottom: 2,
  },
  checkStatusBtn: {
    paddingVertical: 8,
  },
  checkStatusText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  loginLink: {
    paddingVertical: 6,
  },
  loginLinkText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
});
