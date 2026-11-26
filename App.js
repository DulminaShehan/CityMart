import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import LoginScreen from './src/screens/auth/LoginScreen';
import ShopRegistrationNavigator from './src/screens/vendor/ShopRegistrationNavigator';
import colors from './src/theme/colors';

export default function App() {
  // 'login' | 'shop_registration'
  const [currentModule, setCurrentModule] = useState('shop_registration');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor="#F8FAFC" />

      {/* Global Module Quick Switcher (Top Navigation Bar) */}
      <View style={styles.moduleSwitcherBar}>
        <TouchableOpacity
          onPress={() => setCurrentModule('login')}
          style={[
            styles.switcherTab,
            currentModule === 'login' && styles.switcherTabActive,
          ]}
        >
          <Text
            style={[
              styles.switcherText,
              currentModule === 'login' && styles.switcherTextActive,
            ]}
          >
            Customer Login
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setCurrentModule('shop_registration')}
          style={[
            styles.switcherTab,
            currentModule === 'shop_registration' && styles.switcherTabActive,
          ]}
        >
          <Text
            style={[
              styles.switcherText,
              currentModule === 'shop_registration' && styles.switcherTextActive,
            ]}
          >
            🏪 Shop Owner Registration
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content Rendering */}
      <View style={styles.content}>
        {currentModule === 'login' ? (
          <LoginScreen onNavigateToVendorReg={() => setCurrentModule('shop_registration')} />
        ) : (
          <ShopRegistrationNavigator onBackToLogin={() => setCurrentModule('login')} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  moduleSwitcherBar: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 8,
  },
  switcherTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  switcherTabActive: {
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  switcherText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  switcherTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
});
