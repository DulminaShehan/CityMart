import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { ShopRegistrationProvider, useShopRegistration } from '../../context/ShopRegistrationContext';
import ShopWelcomeScreen from './ShopWelcomeScreen';
import ShopRegistrationStep1 from './ShopRegistrationStep1';
import ShopRegistrationStep2 from './ShopRegistrationStep2';
import ShopRegistrationStep3 from './ShopRegistrationStep3';
import ShopRegistrationStep4 from './ShopRegistrationStep4';
import ShopRegistrationReviewScreen from './ShopRegistrationReviewScreen';
import ShopRegistrationSuccessScreen from './ShopRegistrationSuccessScreen';
import ShopApplicationStatusScreen from './ShopApplicationStatusScreen';

function RegistrationFlow({ onBackToLogin }) {
  // Screens: 'welcome' | 'step1' | 'step2' | 'step3' | 'step4' | 'review' | 'success' | 'status'
  const [screen, setScreen] = useState('welcome');
  const { resetRegistrationForm, goToStep } = useShopRegistration();

  const handleEditStep = (stepNumber) => {
    goToStep(stepNumber);
    switch (stepNumber) {
      case 1:
        setScreen('step1');
        break;
      case 2:
        setScreen('step2');
        break;
      case 3:
        setScreen('step3');
        break;
      case 4:
        setScreen('step4');
        break;
      default:
        setScreen('review');
        break;
    }
  };

  const renderCurrentScreen = () => {
    switch (screen) {
      case 'welcome':
        return (
          <ShopWelcomeScreen
            onStartRegistration={() => setScreen('step1')}
            onCheckStatus={() => setScreen('status')}
            onBackToLogin={onBackToLogin}
          />
        );
      case 'step1':
        return (
          <ShopRegistrationStep1
            onNext={() => setScreen('step2')}
            onCancel={() => setScreen('welcome')}
          />
        );
      case 'step2':
        return (
          <ShopRegistrationStep2
            onNext={() => setScreen('step3')}
            onPrev={() => setScreen('step1')}
          />
        );
      case 'step3':
        return (
          <ShopRegistrationStep3
            onNext={() => setScreen('step4')}
            onPrev={() => setScreen('step2')}
          />
        );
      case 'step4':
        return (
          <ShopRegistrationStep4
            onNext={() => setScreen('review')}
            onPrev={() => setScreen('step3')}
          />
        );
      case 'review':
        return (
          <ShopRegistrationReviewScreen
            onEditStep={handleEditStep}
            onPrev={() => setScreen('step4')}
            onSubmitSuccess={(shopId) => setScreen('success')}
          />
        );
      case 'success':
        return (
          <ShopRegistrationSuccessScreen
            onCheckStatus={() => setScreen('status')}
            onGoHome={() => {
              resetRegistrationForm();
              setScreen('welcome');
            }}
          />
        );
      case 'status':
        return (
          <ShopApplicationStatusScreen
            onResubmit={() => setScreen('step1')}
            onGoHome={() => setScreen('welcome')}
            onEnterDashboard={() => {
              Alert.alert(
                'Shop Dashboard',
                'Shop approved! The Vendor Dashboard features (Add Products, Inventory, Orders) are accessed when logged in with this approved account.',
                [{ text: 'OK' }]
              );
            }}
          />
        );
      default:
        return (
          <ShopWelcomeScreen
            onStartRegistration={() => setScreen('step1')}
            onCheckStatus={() => setScreen('status')}
            onBackToLogin={onBackToLogin}
          />
        );
    }
  };

  return <View style={styles.container}>{renderCurrentScreen()}</View>;
}

export default function ShopRegistrationNavigator({ onBackToLogin }) {
  return (
    <ShopRegistrationProvider>
      <RegistrationFlow onBackToLogin={onBackToLogin} />
    </ShopRegistrationProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
