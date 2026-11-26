import React, { createContext, useContext, useState } from 'react';

const ShopRegistrationContext = createContext();

const initialOwnerState = {
  fullName: '',
  email: '',
  mobile: '',
  password: '',
  confirmPassword: '',
};

const initialShopState = {
  shopName: '',
  description: '',
  category: 'General Retail',
  shopMobile: '',
  shopEmail: '',
  businessRegistrationNumber: '',
};

const initialAddressState = {
  country: '',
  state: '',
  city: '',
  streetAddress: '',
  postalCode: '',
  googleMapsLocation: '',
};

const initialDocumentsState = {
  logo: null,       // { uri, name, type }
  cover: null,      // { uri, name, type }
  businessDoc: null,// { name, size, status, uri }
  idDoc: null,      // { name, size, status, uri }
};

export const SHOP_CATEGORIES = [
  { id: 'fashion', label: 'Fashion & Apparel', icon: '👗' },
  { id: 'electronics', label: 'Electronics & Gadgets', icon: '📱' },
  { id: 'grocery', label: 'Grocery & Supermarket', icon: '🛒' },
  { id: 'beauty', label: 'Health & Beauty', icon: '💄' },
  { id: 'home', label: 'Home & Furniture', icon: '🛋' },
  { id: 'restaurant', label: 'Food & Restaurants', icon: '🍔' },
  { id: 'books', label: 'Books & Stationery', icon: '📚' },
  { id: 'sports', label: 'Sports & Outdoors', icon: '⚽' },
  { id: 'automotive', label: 'Automotive & Parts', icon: '🚗' },
  { id: 'general', label: 'General Retail', icon: '🏪' },
];

export function ShopRegistrationProvider({ children }) {
  // Navigation step: 1 (Owner), 2 (Shop), 3 (Address), 4 (Docs), 5 (Review)
  const [currentStep, setCurrentStep] = useState(1);
  const [ownerInfo, setOwnerInfo] = useState(initialOwnerState);
  const [shopInfo, setShopInfo] = useState(initialShopState);
  const [addressInfo, setAddressInfo] = useState(initialAddressState);
  const [documents, setDocuments] = useState(initialDocumentsState);
  
  const [submittedShopId, setSubmittedShopId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Field change handlers
  const updateOwnerInfo = (field, value) => {
    setOwnerInfo((prev) => ({ ...prev, [field]: value }));
  };

  const updateShopInfo = (field, value) => {
    setShopInfo((prev) => ({ ...prev, [field]: value }));
  };

  const updateAddressInfo = (field, value) => {
    setAddressInfo((prev) => ({ ...prev, [field]: value }));
  };

  const updateDocument = (key, fileObject) => {
    setDocuments((prev) => ({ ...prev, [key]: fileObject }));
  };

  // Step navigation
  const nextStep = () => {
    if (currentStep < 5) setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const goToStep = (stepNumber) => {
    if (stepNumber >= 1 && stepNumber <= 5) {
      setCurrentStep(stepNumber);
    }
  };

  const resetRegistrationForm = () => {
    setCurrentStep(1);
    setOwnerInfo(initialOwnerState);
    setShopInfo(initialShopState);
    setAddressInfo(initialAddressState);
    setDocuments(initialDocumentsState);
    setSubmittedShopId(null);
    setIsSubmitting(false);
  };

  // Pre-fill demo data for quick review/testing
  const fillSampleData = () => {
    setOwnerInfo({
      fullName: 'Alexander Wright',
      email: 'alex.wright@citymart.demo',
      mobile: '+1 555-839-2041',
      password: 'Password123!',
      confirmPassword: 'Password123!',
    });
    setShopInfo({
      shopName: 'Urban Trendz Electronics',
      description: 'Authorized retailer of modern electronics, accessories, smart devices, and home tech.',
      category: 'Electronics & Gadgets',
      shopMobile: '+1 555-839-2041',
      shopEmail: 'support@urbantrendz.demo',
      businessRegistrationNumber: 'BN-8839210-NY',
    });
    setAddressInfo({
      country: 'United States',
      state: 'New York',
      city: 'Brooklyn',
      streetAddress: '458 Atlantic Avenue',
      postalCode: '11217',
      googleMapsLocation: 'https://maps.google.com/?q=40.6865,-73.9840',
    });
    setDocuments({
      logo: {
        uri: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300',
        name: 'shop_logo.png',
        type: 'image/png',
      },
      cover: {
        uri: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800',
        name: 'store_front_cover.jpg',
        type: 'image/jpeg',
      },
      businessDoc: {
        name: 'Certificate_of_Incorporation.pdf',
        size: '1.8 MB',
        status: 'Uploaded',
      },
      idDoc: {
        name: 'Government_Photo_ID.pdf',
        size: '2.4 MB',
        status: 'Uploaded',
      },
    });
  };

  return (
    <ShopRegistrationContext.Provider
      value={{
        currentStep,
        ownerInfo,
        shopInfo,
        addressInfo,
        documents,
        submittedShopId,
        isSubmitting,
        updateOwnerInfo,
        updateShopInfo,
        updateAddressInfo,
        updateDocument,
        nextStep,
        prevStep,
        goToStep,
        resetRegistrationForm,
        fillSampleData,
        setSubmittedShopId,
        setIsSubmitting,
      }}
    >
      {children}
    </ShopRegistrationContext.Provider>
  );
}

export function useShopRegistration() {
  const context = useContext(ShopRegistrationContext);
  if (!context) {
    throw new Error('useShopRegistration must be used within a ShopRegistrationProvider');
  }
  return context;
}
