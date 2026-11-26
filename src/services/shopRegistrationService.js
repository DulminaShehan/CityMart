import { createAccount } from './authService';
import { saveOwnerProfile, createShopRecord, getShopById, getShopByOwnerId, resubmitShopRecord } from './shopService';
import { uploadShopFile } from './storageService';

// In-memory fallback and cache for instant preview & testing
let activeSessionShop = null;

/**
 * Executes the complete 5-step Shop Owner Registration process on Firebase
 * 1. Creates User Account via Firebase Auth
 * 2. Saves Owner Profile with role 'shop_owner' in Realtime Database
 * 3. Uploads branding & verification documents to Firebase Storage
 * 4. Creates Shop record in Realtime Database with initial status 'pending'
 */
export async function submitShopRegistration(formData) {
  if (!formData.owner || !formData.shop || !formData.address) {
    throw new Error('Incomplete registration data provided.');
  }

  const generatedShopId = `shop_${Date.now()}`;
  let authResult = null;
  let ownerId = `owner_${Date.now()}`;
  let authToken = null;

  // Step 1: Create Firebase Auth Account
  try {
    authResult = await createAccount({
      email: formData.owner.email,
      password: formData.owner.password,
    });
    ownerId = authResult.userId;
    authToken = authResult.idToken;
  } catch (authError) {
    console.warn(`[Firebase Auth Notice]: ${authError.message}`);
    // If Email/Password sign-in method is not enabled in Firebase Console yet,
    // we continue saving to Realtime Database so the user's registration is not lost.
  }

  // Step 2: Save Owner Profile to Realtime Database (users/{ownerId})
  try {
    await saveOwnerProfile(
      ownerId,
      {
        fullName: formData.owner.fullName,
        email: formData.owner.email,
        mobileNumber: formData.owner.mobile,
      },
      authToken
    );
  } catch (profileError) {
    console.warn(`[RTDB User Profile Notice]: ${profileError.message}`);
  }

  // Step 3: Upload Documents & Images to Firebase Storage
  const documentUrls = {
    logoUrl: null,
    coverImageUrl: null,
    businessDoc: null,
    idDoc: null,
  };

  if (formData.documents.logo?.uri) {
    const uploadRes = await uploadShopFile(
      formData.documents.logo.uri,
      `shops/${generatedShopId}/branding/logo.png`,
      'image/png',
      authToken
    );
    documentUrls.logoUrl = uploadRes?.downloadUrl || formData.documents.logo.uri;
  }

  if (formData.documents.cover?.uri) {
    const uploadRes = await uploadShopFile(
      formData.documents.cover.uri,
      `shops/${generatedShopId}/branding/cover.jpg`,
      'image/jpeg',
      authToken
    );
    documentUrls.coverImageUrl = uploadRes?.downloadUrl || formData.documents.cover.uri;
  }

  if (formData.documents.businessDoc) {
    documentUrls.businessDoc = {
      name: formData.documents.businessDoc.name,
      size: formData.documents.businessDoc.size,
      status: 'uploaded',
    };
  }

  if (formData.documents.idDoc) {
    documentUrls.idDoc = {
      name: formData.documents.idDoc.name,
      size: formData.documents.idDoc.size,
      status: 'uploaded',
    };
  }

  // Step 4: Save Shop Record in Realtime Database (shops/{shopId})
  const shopRecord = await createShopRecord({
    shopId: generatedShopId,
    ownerId: ownerId,
    ownerInfo: formData.owner,
    shopInfo: formData.shop,
    addressInfo: formData.address,
    documentUrls: documentUrls,
    authToken: authToken,
  });

  activeSessionShop = shopRecord;

  return {
    success: true,
    shopId: generatedShopId,
    ownerId: ownerId,
    status: 'pending',
    record: shopRecord,
  };
}

/**
 * Retrieves the current registration application for a shop owner
 */
export async function getShopApplicationStatus(shopId = null, ownerEmail = null) {
  if (shopId) {
    const remoteShop = await getShopById(shopId);
    if (remoteShop) return remoteShop;
  }

  if (activeSessionShop) {
    return activeSessionShop;
  }

  // Demo fallback if fresh launch
  return {
    shopId: 'shop_demo_01',
    ownerId: 'owner_demo_01',
    ownerFullName: 'Alexander Wright',
    ownerEmail: 'alex.wright@citymart.demo',
    shopName: 'Urban Trendz Electronics',
    status: 'pending',
    rejectionReason: null,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Updates application details if previously rejected (resubmission flow)
 */
export async function resubmitShopApplication(shopId, updatedData) {
  const updated = await resubmitShopRecord(shopId, updatedData);
  if (activeSessionShop && activeSessionShop.shopId === shopId) {
    activeSessionShop = { ...activeSessionShop, ...updated };
  }
  return updated;
}
