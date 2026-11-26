import { firebaseConfig, FIREBASE_AUTH_BASE, FIREBASE_RTDB_BASE } from './firebase.js';

/**
 * Creates a new user account with Firebase Authentication
 * Role enforcement: 'customer' (admin cannot be assigned)
 */
export async function createAccount({ email, password }) {
  try {
    const response = await fetch(
      `${FIREBASE_AUTH_BASE}/accounts:signUp?key=${firebaseConfig.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
          returnSecureToken: true,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data.error?.message || 'Failed to create user account';
      if (errorMsg.includes('EMAIL_EXISTS')) {
        throw new Error('This email address is already registered. Please log in instead.');
      } else if (errorMsg.includes('CONFIGURATION_NOT_FOUND')) {
        throw new Error(
          'Email/Password sign-in method is not enabled in Firebase Console. Please go to Firebase Console -> Authentication -> Sign-in method and enable Email/Password.'
        );
      } else {
        throw new Error(errorMsg);
      }
    }

    return {
      userId: data.localId,
      email: data.email,
      idToken: data.idToken,
      refreshToken: data.refreshToken,
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Signs in existing user with Email and Password
 */
export async function signIn({ email, password }) {
  try {
    const response = await fetch(
      `${FIREBASE_AUTH_BASE}/accounts:signInWithPassword?key=${firebaseConfig.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
          returnSecureToken: true,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data.error?.message || 'Authentication failed';
      if (
        errorMsg.includes('EMAIL_NOT_FOUND') ||
        errorMsg.includes('INVALID_PASSWORD') ||
        errorMsg.includes('INVALID_LOGIN_CREDENTIALS')
      ) {
        throw new Error('Invalid email or password. Please verify your credentials.');
      } else if (errorMsg.includes('CONFIGURATION_NOT_FOUND')) {
        throw new Error(
          'Email/Password sign-in is not enabled in Firebase Console. Please enable Email/Password under Authentication -> Sign-in method in Firebase Console.'
        );
      } else {
        throw new Error(errorMsg);
      }
    }

    // Retrieve user profile to preserve existing role
    const profile = await getUserProfile(data.localId, data.idToken);

    return {
      userId: data.localId,
      email: data.email,
      idToken: data.idToken,
      profile: profile || {
        fullName: data.displayName || data.email.split('@')[0],
        email: data.email,
        role: 'customer',
      },
    };
  } catch (error) {
    throw error;
  }
}

/**
 * GoogleAuthProvider helper for Expo React Native
 * Adheres to Firebase Modular API: GoogleAuthProvider.credential(idToken, accessToken)
 */
export const GoogleAuthProvider = {
  PROVIDER_ID: 'google.com',
  credential: (idToken, accessToken = null) => {
    if (!idToken) {
      throw new Error('GoogleAuthProvider.credential requires a valid Google ID token.');
    }
    return {
      providerId: 'google.com',
      idToken: idToken,
      accessToken: accessToken,
    };
  },
};

/**
 * Signs in to Firebase Authentication with a social/OAuth credential
 * Adheres to Firebase Modular API: signInWithCredential(auth, credential)
 */
export async function signInWithCredential(authOrNull, credential) {
  if (!credential || !credential.providerId) {
    throw new Error('Invalid credential provided to signInWithCredential.');
  }

  return await signInWithSocialCredential({
    providerId: credential.providerId,
    idToken: credential.idToken,
    accessToken: credential.accessToken,
  });
}

/**
 * Signs in or creates a customer using Social Identity Provider credential (Google, Apple, Facebook)
 * Using Firebase Identity Toolkit signInWithIdp
 */
export async function signInWithSocialCredential({ providerId, idToken, accessToken }) {
  try {
    let postBody = `providerId=${encodeURIComponent(providerId)}`;
    if (idToken) {
      postBody += `&id_token=${encodeURIComponent(idToken)}`;
    }
    if (accessToken) {
      postBody += `&access_token=${encodeURIComponent(accessToken)}`;
    }

    const response = await fetch(
      `${FIREBASE_AUTH_BASE}/accounts:signInWithIdp?key=${firebaseConfig.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestUri: 'http://localhost',
          postBody: postBody,
          returnSecureToken: true,
          returnIdpCredential: true,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data.error?.message || 'Social authentication failed';
      if (errorMsg.includes('FEDERATED_USER_ID_ALREADY_LINKED')) {
        throw new Error('This social account is already linked to another user profile.');
      } else if (errorMsg.includes('CONFIGURATION_NOT_FOUND')) {
        throw new Error(
          `${providerId} sign-in is not enabled in Firebase Console. Please enable ${providerId} under Authentication -> Sign-in method in Firebase Console.`
        );
      } else {
        throw new Error(errorMsg);
      }
    }

    const userId = data.localId;
    const email = data.email || `${providerId}_user_${userId.slice(0, 6)}@citymart.com`;
    const fullName = data.displayName || data.firstName || email.split('@')[0];
    const photoUrl = data.photoUrl || null;

    // Check if user already exists in Realtime Database to NEVER overwrite existing roles
    let existingProfile = await getUserProfile(userId, data.idToken);

    if (!existingProfile) {
      // First-time social sign-in: Create new customer profile
      existingProfile = await saveCustomerProfile(
        userId,
        {
          fullName: fullName,
          email: email,
          profileImage: photoUrl,
          role: 'customer', // Always customer for public mobile sign-in
          authProvider: providerId,
        },
        data.idToken
      );
    } else {
      // Existing user: preserve role, update last login
      await updateUserLastLogin(userId, data.idToken);
    }

    return {
      userId: userId,
      email: email,
      idToken: data.idToken,
      profile: existingProfile,
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Fetches user profile from Realtime Database: users/{userId}
 */
export async function getUserProfile(userId, authToken = null) {
  try {
    const url = `${FIREBASE_RTDB_BASE}/users/${userId}.json${authToken ? `?auth=${authToken}` : ''}`;
    const response = await fetch(url);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

/**
 * Creates new customer record in Realtime Database
 * Only called if user does not already exist
 */
export async function saveCustomerProfile(userId, { fullName, email, profileImage, role = 'customer', authProvider = 'password' }, authToken = null) {
  const url = `${FIREBASE_RTDB_BASE}/users/${userId}.json${authToken ? `?auth=${authToken}` : ''}`;
  
  const payload = {
    fullName: fullName ? fullName.trim() : email.split('@')[0],
    email: email.trim(),
    profileImage: profileImage || null,
    role: role === 'admin' ? 'customer' : role, // Client cannot self-promote to admin
    authProvider: authProvider,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    console.warn('Realtime database write notice (profile will be loaded locally)');
  }

  return payload;
}

/**
 * Updates timestamp on subsequent logins
 */
async function updateUserLastLogin(userId, authToken = null) {
  try {
    const url = `${FIREBASE_RTDB_BASE}/users/${userId}.json${authToken ? `?auth=${authToken}` : ''}`;
    await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ updatedAt: new Date().toISOString() }),
    });
  } catch {}
}

/**
 * Sends password reset email
 */
export async function sendPasswordReset(email) {
  try {
    const response = await fetch(
      `${FIREBASE_AUTH_BASE}/accounts:sendOobCode?key=${firebaseConfig.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestType: 'PASSWORD_RESET',
          email: email.trim(),
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to send password reset email.');
    }

    return { success: true, email: data.email };
  } catch (error) {
    throw error;
  }
}
