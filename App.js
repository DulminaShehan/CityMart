import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import CustomerHomeScreen from './src/screens/home/CustomerHomeScreen';
import ShopRegistrationNavigator from './src/screens/vendor/ShopRegistrationNavigator';
import colors from './src/theme/colors';

export default function App() {
  // 'login' | 'register' | 'shop_registration' | 'customer_home'
  const [currentScreen, setCurrentScreen] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor="#F8FAFC" />

      {/* Screen Routing (Top Header Nav Bar Removed for Clean Professional UI) */}
      <View style={styles.content}>
        {currentScreen === 'login' && (
          <LoginScreen
            onNavigateToVendorReg={() => setCurrentScreen('shop_registration')}
            onNavigateToRegister={() => setCurrentScreen('register')}
            onLoginSuccess={(user) => {
              setCurrentUser(user);
              setCurrentScreen('customer_home');
            }}
          />
        )}

        {currentScreen === 'register' && (
          <RegisterScreen
            onBackToLogin={() => setCurrentScreen('login')}
            onRegisterSuccess={(user) => {
              setCurrentUser(user);
              setCurrentScreen('customer_home');
            }}
          />
        )}

        {currentScreen === 'shop_registration' && (
          <ShopRegistrationNavigator
            onBackToLogin={() => setCurrentScreen('login')}
          />
        )}

        {currentScreen === 'customer_home' && (
          <CustomerHomeScreen
            user={currentUser}
            onSignOut={() => {
              setCurrentUser(null);
              setCurrentScreen('login');
            }}
          />
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
  content: {
    flex: 1,
  },
});
