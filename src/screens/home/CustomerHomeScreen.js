import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import colors from '../../theme/colors';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { id: '1', name: 'Supermarket', icon: '🛒', count: '124 stores' },
  { id: '2', name: 'Fresh Produce', icon: '🥬', count: '86 stores' },
  { id: '3', name: 'Bakery & Deli', icon: '🥐', count: '45 stores' },
  { id: '4', name: 'Electronics', icon: '📱', count: '92 stores' },
  { id: '5', name: 'Fashion & Wear', icon: '👕', count: '110 stores' },
  { id: '6', name: 'Pharmacy', icon: '💊', count: '38 stores' },
];

const POPULAR_SHOPS = [
  { id: 's1', name: 'Metro Fresh Supermart', category: 'Supermarket', rating: 4.8, distance: '1.2 km', badge: 'Verified' },
  { id: 's2', name: 'Green Valley Organics', category: 'Fresh Produce', rating: 4.9, distance: '2.0 km', badge: 'Top Rated' },
  { id: 's3', name: 'City Tech World', category: 'Electronics', rating: 4.7, distance: '3.4 km', badge: 'Official' },
];

export default function CustomerHomeScreen({ user, onSignOut }) {
  const displayName = user?.profile?.fullName || user?.email?.split('@')[0] || 'CityMart Shopper';
  const displayEmail = user?.email || user?.profile?.email || 'customer@citymart.com';
  const role = user?.profile?.role || 'customer';
  const authProvider = user?.profile?.authProvider || 'Email/Password';

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Marketplace Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={require('../../../assets/logo.png')}
            style={styles.headerLogo}
            resizeMode="cover"
          />
          <View>
            <View style={styles.brandTitleRow}>
              <Text style={styles.brandCity}>City</Text>
              <Text style={styles.brandMart}>Mart</Text>
            </View>
            <Text style={styles.locationText}>📍 Your City • 24/7 Delivery</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={onSignOut}
          style={styles.signOutBtn}
          activeOpacity={0.7}
        >
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Customer Welcome Greeting Card */}
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.welcomeGreeting}>Welcome Back,</Text>
              <Text style={styles.welcomeName}>{displayName} 👋</Text>
              <Text style={styles.welcomeSubtitle}>
                What would you like to buy from your city today?
              </Text>
            </View>
            <View style={styles.customerRolePill}>
              <Text style={styles.customerRolePillText}>Role: {role.toUpperCase()}</Text>
            </View>
          </View>

          {/* User Account Verification Pill */}
          <View style={styles.accountInfoStrip}>
            <Text style={styles.accountInfoEmail}>📧 {displayEmail}</Text>
            <Text style={styles.accountInfoProvider}>Auth: {authProvider}</Text>
          </View>
        </View>

        {/* Search Bar Placeholder */}
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchPlaceholder}>Search products, shops, groceries...</Text>
        </View>

        {/* Promo Banner */}
        <View style={styles.promoBanner}>
          <View style={{ flex: 1 }}>
            <View style={styles.promoTag}>
              <Text style={styles.promoTagText}>CITY SUPER DEALS</Text>
            </View>
            <Text style={styles.promoHeading}>Up to 40% OFF Local Stores</Text>
            <Text style={styles.promoSub}>Support verified city merchants today.</Text>
          </View>
          <Text style={styles.promoArt}>🛍️✨</Text>
        </View>

        {/* Explore Categories */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Shop by Category</Text>
          <Text style={styles.sectionAction}>See All ({CATEGORIES.length})</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity key={cat.id} style={styles.categoryCard} activeOpacity={0.8}>
              <View style={styles.categoryIconCircle}>
                <Text style={styles.categoryIconText}>{cat.icon}</Text>
              </View>
              <Text style={styles.categoryName}>{cat.name}</Text>
              <Text style={styles.categoryCount}>{cat.count}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Featured Local Shops */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured City Shops</Text>
          <Text style={styles.sectionAction}>Explore More →</Text>
        </View>

        {POPULAR_SHOPS.map((shop) => (
          <View key={shop.id} style={styles.shopCard}>
            <View style={styles.shopIconBox}>
              <Text style={{ fontSize: 24 }}>🏬</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.shopTitleRow}>
                <Text style={styles.shopName}>{shop.name}</Text>
                <View style={styles.badgePill}>
                  <Text style={styles.badgePillText}>{shop.badge}</Text>
                </View>
              </View>
              <Text style={styles.shopMeta}>
                {shop.category} • ⭐ {shop.rating} • 🚗 {shop.distance}
              </Text>
            </View>
          </View>
        ))}

        {/* Active Session Info Box */}
        <View style={styles.sessionBox}>
          <Text style={styles.sessionTitle}>Firebase Authenticated Session</Text>
          <Text style={styles.sessionDesc}>
            You are securely logged into CityMart as a customer. Your profile and orders are synchronized with Firebase Realtime Database.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerLogo: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandCity: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
  },
  brandMart: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.accent,
  },
  locationText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  signOutBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  signOutText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 40,
  },
  welcomeCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  welcomeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  welcomeGreeting: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  welcomeName: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 2,
  },
  welcomeSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  customerRolePill: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  customerRolePillText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  accountInfoStrip: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accountInfoEmail: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  accountInfoProvider: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
    gap: 8,
  },
  searchIcon: {
    fontSize: 16,
  },
  searchPlaceholder: {
    fontSize: 13,
    color: colors.placeholder,
  },
  promoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
  },
  promoTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  promoTagText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  promoHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.white,
  },
  promoSub: {
    fontSize: 12,
    color: '#DBEAFE',
    marginTop: 2,
  },
  promoArt: {
    fontSize: 32,
    marginLeft: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sectionAction: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  categoryList: {
    gap: 12,
    paddingBottom: 20,
  },
  categoryCard: {
    width: 96,
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryIconText: {
    fontSize: 22,
  },
  categoryName: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  categoryCount: {
    fontSize: 9,
    color: colors.textSecondary,
    marginTop: 2,
  },
  shopCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  shopIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shopTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  shopName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  badgePill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D97706',
  },
  shopMeta: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  sessionBox: {
    marginTop: 10,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 14,
    padding: 14,
  },
  sessionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#166534',
    marginBottom: 4,
  },
  sessionDesc: {
    fontSize: 11,
    color: '#15803D',
    lineHeight: 16,
  },
});
