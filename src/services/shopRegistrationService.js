import { isFirebaseConfigured } from './firebaseConfig';

// Mock in-memory storage for immediate testing and verification
// This persists registration data during the session so the Status screen
// accurately displays the real submitted application.
let localShopsDatabase = [
  {
    shopId: 'shop_demo_01',
    ownerId: 'owner_demo_01',
    ownerFullName: 'Sara Jenkins',
    ownerEmail: 'sara@citymartdemo.com',
    ownerMobile: '+1 555-019-2834',
    shopName: 'Metro Urban Boutique',
    shopDescription: 'High quality clothing, footwear, and accessories sourced locally.',
    category: 'Fashion & Apparel',
    shopEmail: 'contact@metroboutique.com',
    shopMobile: '+1 555-019-2834',
    businessRegistrationNumber: 'REG-2024-99812',
    address: {
      country: 'United States',
      state: 'New York',
      city: 'New York City',
      streetAddress: '742 Broadway, Suite 300',
      postalCode: '10003',
      googleMapsLocation: 'https://maps.google.com/?q=40.7291,-73.9937',
    },
    logoUrl: 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=200',
    coverImageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
    documents: {
      businessRegistration: { name: 'business_license_2024.pdf', status: 'verified', size: '1.4 MB' },
      ownerId: { name: 'owner_passport_scan.jpg', status: 'verified', size: '2.1 MB' },
    },
    status: 'pending', // 'pending' | 'under_review' | 'approved' | 'rejected'
    rejectionReason: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/**
 * Registers a new shop owner and creates the shop profile
 * Enforces the "shop_owner" role and default "pending" status.
 */
export async function submitShopRegistration(formData) {
  // Validate basic required payload
  if (!formData.owner || !formData.shop || !formData.address) {
    throw new Error('Incomplete registration data provided.');
  }

  const newShopId = 'shop_' + Date.now();
  const newOwnerId = 'owner_' + Date.now();

  const newShopRecord = {
    shopId: newShopId,
    ownerId: newOwnerId,
    ownerFullName: formData.owner.fullName,
    ownerEmail: formData.owner.email,
    ownerMobile: formData.owner.mobile,
    role: 'shop_owner',
    
    // Shop Details
    shopName: formData.shop.shopName,
    description: formData.shop.description,
    category: formData.shop.category,
    shopEmail: formData.shop.shopEmail || formData.owner.email,
    shopMobile: formData.shop.shopMobile || formData.owner.mobile,
    businessRegistrationNumber: formData.shop.businessRegistrationNumber || 'N/A',
    
    // Address Details
    address: {
      country: formData.address.country,
      state: formData.address.state,
      city: formData.address.city,
      streetAddress: formData.address.streetAddress,
      postalCode: formData.address.postalCode,
      googleMapsLocation: formData.address.googleMapsLocation || '',
    },

    // Media & Documents
    logoUrl: formData.documents.logo?.uri || null,
    coverImageUrl: formData.documents.cover?.uri || null,
    documents: {
      businessRegistration: formData.documents.businessDoc || null,
      ownerId: formData.documents.idDoc || null,
    },

    // Strict CityMart registration status rules
    status: 'pending', // Always starts as Pending
    rejectionReason: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // If live Firebase is configured, integrate with Cloud Firestore and Auth
  if (isFirebaseConfigured()) {
    // Live Firebase calls will go here when keys are provided
    // const userCredential = await createUserWithEmailAndPassword(auth, formData.owner.email, formData.owner.password);
    // await setDoc(doc(firestore, 'users', userCredential.user.uid), { ... });
    // await setDoc(doc(firestore, 'shops', newShopId), newShopRecord);
  }

  // Save to persistent session memory for immediate inspection
  localShopsDatabase.unshift(newShopRecord);

  return {
    success: true,
    shopId: newShopId,
    ownerId: newOwnerId,
    status: 'pending',
    record: newShopRecord,
  };
}

/**
 * Retrieves the current registration application for a shop owner
 */
export async function getShopApplicationStatus(shopId = null, ownerEmail = null) {
  if (shopId) {
    const found = localShopsDatabase.find((s) => s.shopId === shopId);
    if (found) return found;
  }

  if (ownerEmail) {
    const found = localShopsDatabase.find((s) => s.ownerEmail.toLowerCase() === ownerEmail.toLowerCase());
    if (found) return found;
  }

  // Return the latest submitted shop or the default demo record
  return localShopsDatabase[0] || null;
}

/**
 * Updates application details if previously rejected (resubmission flow)
 */
export async function resubmitShopApplication(shopId, updatedData) {
  const shopIndex = localShopsDatabase.findIndex((s) => s.shopId === shopId);
  if (shopIndex === -1) {
    throw new Error('Shop application not found.');
  }

  localShopsDatabase[shopIndex] = {
    ...localShopsDatabase[shopIndex],
    ...updatedData,
    status: 'pending', // Resets back to pending for review
    rejectionReason: null,
    updatedAt: new Date().toISOString(),
  };

  return localShopsDatabase[shopIndex];
}

/**
 * Helper to simulate admin approval/rejection for testing the status screen
 */
export function setMockApplicationStatus(shopId, newStatus, reason = null) {
  const shopIndex = localShopsDatabase.findIndex((s) => s.shopId === shopId);
  if (shopIndex !== -1) {
    localShopsDatabase[shopIndex].status = newStatus;
    localShopsDatabase[shopIndex].rejectionReason = reason;
    localShopsDatabase[shopIndex].updatedAt = new Date().toISOString();
  }
}
