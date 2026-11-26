import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import colors from '../../theme/colors';
import PrimaryButton from '../../components/PrimaryButton';
import StepIndicator from '../../components/StepIndicator';
import DocumentPickerCard from '../../components/DocumentPickerCard';
import { useShopRegistration } from '../../context/ShopRegistrationContext';

export default function ShopRegistrationStep4({ onNext, onPrev }) {
  const { documents, updateDocument } = useShopRegistration();

  const handleAttachSampleLogo = () => {
    updateDocument('logo', {
      uri: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300',
      name: 'shop_logo.png',
      type: 'image/png',
    });
  };

  const handleAttachSampleCover = () => {
    updateDocument('cover', {
      uri: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
      name: 'storefront_cover.jpg',
      type: 'image/jpeg',
    });
  };

  const handleAttachSampleBusinessDoc = () => {
    updateDocument('businessDoc', {
      name: 'City_Business_License_2024.pdf',
      size: '1.4 MB',
      status: 'Uploaded',
    });
  };

  const handleAttachSampleIdDoc = () => {
    updateDocument('idDoc', {
      name: 'Owner_Government_ID.pdf',
      size: '2.1 MB',
      status: 'Uploaded',
    });
  };

  const handleNext = () => {
    // Both identity verification & business compliance are essential
    if (!documents.logo) {
      Alert.alert('Shop Logo Required', 'Please attach your official store logo.');
      return;
    }

    if (!documents.idDoc) {
      Alert.alert(
        'Owner ID Required',
        'Please attach an owner identification document for security and fraud prevention.'
      );
      return;
    }

    onNext();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <StepIndicator currentStep={4} />

        <View style={styles.contentCard}>
          <Text style={styles.stepTitle}>Step 4: Media & Documents</Text>
          <Text style={styles.stepSubtitle}>
            Upload your shop branding and legal verification documents. High-quality storefront photos increase customer trust by 45%.
          </Text>

          {/* Shop Logo */}
          <DocumentPickerCard
            title="Shop Logo"
            description="Square image displayed as your store avatar (1:1 aspect ratio)"
            type="image"
            file={documents.logo}
            onPickSample={handleAttachSampleLogo}
            onRemove={() => updateDocument('logo', null)}
            isRequired
          />

          {/* Shop Cover Image */}
          <DocumentPickerCard
            title="Storefront Cover Image"
            description="Banner photo appearing at the top of your shop page (16:9 banner)"
            type="image"
            file={documents.cover}
            onPickSample={handleAttachSampleCover}
            onRemove={() => updateDocument('cover', null)}
            isRequired={false}
          />

          {/* Business Registration Doc */}
          <DocumentPickerCard
            title="Business Registration Document"
            description="Company incorporation, tax certificate, or commercial trade permit"
            type="document"
            file={documents.businessDoc}
            onPickSample={handleAttachSampleBusinessDoc}
            onRemove={() => updateDocument('businessDoc', null)}
            isRequired={false}
          />

          {/* Owner ID Document */}
          <DocumentPickerCard
            title="Owner Identification Document"
            description="Government-issued ID, Driver's License, or Passport"
            type="document"
            file={documents.idDoc}
            onPickSample={handleAttachSampleIdDoc}
            onRemove={() => updateDocument('idDoc', null)}
            isRequired
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
              title="Review Application →"
              onPress={handleNext}
              style={styles.nextBtn}
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
