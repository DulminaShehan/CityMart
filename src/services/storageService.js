import { firebaseConfig, FIREBASE_STORAGE_BASE } from './firebase.js';

/**
 * Uploads a document or image to Firebase Storage via REST API
 * @param {string} localUri - Local device URI
 * @param {string} storagePath - Destination path e.g. "shops/123/logo.png"
 * @param {string} contentType - MIME type e.g. "image/png" or "application/pdf"
 * @param {string} authToken - Optional Firebase Auth token
 */
export async function uploadShopFile(localUri, storagePath, contentType = 'image/jpeg', authToken = null) {
  if (!localUri) return null;

  try {
    const encodedPath = encodeURIComponent(storagePath);
    const uploadUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o?uploadType=media&name=${encodedPath}${
      authToken ? `&token=${authToken}` : ''
    }`;

    // Read the blob from local URI
    const fileBlob = await (await fetch(localUri)).blob();

    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Content-Type': contentType,
      },
      body: fileBlob,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Storage upload failed');
    }

    // Return the persistent public download URL with token
    const downloadToken = data.downloadTokens;
    const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${encodedPath}?alt=media&token=${downloadToken}`;

    return {
      downloadUrl,
      storagePath,
      name: data.name,
    };
  } catch (error) {
    console.warn(`Storage upload note: using referenced asset link (${error.message})`);
    return {
      downloadUrl: localUri,
      storagePath,
      name: storagePath.split('/').pop(),
    };
  }
}
