import { firebaseConfig, FIREBASE_RTDB_BASE } from './firebase.js';

/**
 * Saves owner profile to Firebase Realtime Database
 * Path: users/{userId}
 * Strict role enforcement: 'shop_owner' (admin cannot be assigned)
 */
export async function saveOwnerProfile(userId, { fullName, email, mobileNumber }, authToken = null) {
  const url = `${FIREBASE_RTDB_BASE}/users/${userId}.json${authToken ? `?auth=${authToken}` : ''}`;
  
  const payload = {
    fullName: fullName.trim(),
    email: email.trim(),
    mobileNumber: mobileNumber.trim(),
    role: 'shop_owner', // Server-enforced role
    createdAt: new Date().toISOString(),
  };

  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to save owner profile to database.');
  }

  return payload;
}

/**
 * Creates a new shop record in Firebase Realtime Database
 * Path: shops/{shopId}
 * Enforces initial status: 'pending'
 */
export async function createShopRecord({
  shopId,
  ownerId,
  ownerInfo,
  shopInfo,
  addressInfo,
  documentUrls = {},
  authToken = null,
}) {
  const generatedId = shopId || `shop_${Date.now()}`;
  const url = `${FIREBASE_RTDB_BASE}/shops/${generatedId}.json${authToken ? `?auth=${authToken}` : ''}`;

  const shopRecord = {
    shopId: generatedId,
    ownerId: ownerId,
    ownerFullName: ownerInfo.fullName,
    ownerEmail: ownerInfo.email,
    ownerMobile: ownerInfo.mobile,
    
    // Shop Information
    shopName: shopInfo.shopName.trim(),
    description: shopInfo.description.trim(),
    category: shopInfo.category,
    shopEmail: (shopInfo.shopEmail || ownerInfo.email).trim(),
    shopMobile: (shopInfo.shopMobile || ownerInfo.mobile).trim(),
    businessRegistrationNumber: shopInfo.businessRegistrationNumber?.trim() || 'N/A',

    // Address
    address: {
      country: addressInfo.country.trim(),
      state: addressInfo.state.trim(),
      city: addressInfo.city.trim(),
      streetAddress: addressInfo.streetAddress.trim(),
      postalCode: addressInfo.postalCode.trim(),
      googleMapsLocation: addressInfo.googleMapsLocation?.trim() || '',
    },

    // Media & Document URLs
    logoUrl: documentUrls.logoUrl || null,
    coverImageUrl: documentUrls.coverImageUrl || null,
    documents: {
      businessRegistration: documentUrls.businessDoc || null,
      ownerId: documentUrls.idDoc || null,
    },

    // Status: ALWAYS starts with 'pending'
    status: 'pending',
    rejectionReason: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(shopRecord),
  });

  if (!response.ok) {
    throw new Error('Failed to save shop record to database.');
  }

  return shopRecord;
}

/**
 * Retrieves shop application details by shopId
 */
export async function getShopById(shopId, authToken = null) {
  const url = `${FIREBASE_RTDB_BASE}/shops/${shopId}.json${authToken ? `?auth=${authToken}` : ''}`;
  const response = await fetch(url);
  
  if (!response.ok) return null;
  return await response.json();
}

/**
 * Queries shop by owner ID
 */
export async function getShopByOwnerId(ownerId, authToken = null) {
  const url = `${FIREBASE_RTDB_BASE}/shops.json${authToken ? `?auth=${authToken}` : ''}`;
  const response = await fetch(url);

  if (!response.ok) return null;
  const allShops = await response.json();

  if (!allShops) return null;
  return Object.values(allShops).find((s) => s.ownerId === ownerId) || null;
}

/**
 * Resubmits an updated shop application if previously rejected
 * Resets status to 'pending' for re-review
 */
export async function resubmitShopRecord(shopId, updatedFields, authToken = null) {
  const url = `${FIREBASE_RTDB_BASE}/shops/${shopId}.json${authToken ? `?auth=${authToken}` : ''}`;
  
  const payload = {
    ...updatedFields,
    status: 'pending', // Reverts to pending for admin re-evaluation
    rejectionReason: null,
    updatedAt: new Date().toISOString(),
  };

  const response = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to update shop application.');
  }

  return payload;
}
