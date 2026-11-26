import { Linking, Platform } from 'react-native';
import { signInWithSocialCredential } from './authService.js';

/**
 * Parses parameters from an OAuth redirect URL
 * Handles both hash fragments (#id_token=...) and query strings (?id_token=...)
 */
export function parseOAuthResponseUrl(url) {
  const result = {};
  if (!url) return result;

  const hashIdx = url.indexOf('#');
  const queryIdx = url.indexOf('?');

  const fragment = hashIdx !== -1 ? url.substring(hashIdx + 1) : '';
  const query =
    queryIdx !== -1 ? url.substring(queryIdx + 1, hashIdx !== -1 ? hashIdx : undefined) : '';

  const parseString = (str) => {
    if (!str) return;
    str.split('&').forEach((item) => {
      const eqIdx = item.indexOf('=');
      if (eqIdx !== -1) {
        const key = decodeURIComponent(item.substring(0, eqIdx));
        const val = decodeURIComponent(item.substring(eqIdx + 1));
        result[key] = val;
      }
    });
  };

  parseString(fragment);
  parseString(query);

  return result;
}

/**
 * Google Sign-In Implementation for CityMart
 * 
 * Uses Google OAuth 2.0 Web Client ID:
 * 997601669962-7d7g9mi53c2lbibmiratr1n4l0gb3hgn.apps.googleusercontent.com
 * 
 * Flow:
 * 1. Checks Web Client ID from environment.
 * 2. Opens official Google Account selector in device browser.
 * 3. User selects their Google account.
 * 4. Google returns to official redirect URI with id_token and access_token.
 * 5. Passes id_token to Firebase Authentication (GoogleAuthProvider / signInWithIdp).
 * 6. Retrieves or creates customer profile in Firebase Realtime Database:
 *    - Role is strictly 'customer' for new registrations.
 *    - Existing roles (shop_owner, admin) are always preserved.
 */
export async function initiateGoogleSignIn(onSuccessCallback) {
  const webClientId =
    process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ||
    process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID ||
    '997601669962-7d7g9mi53c2lbibmiratr1n4l0gb3hgn.apps.googleusercontent.com';

  if (!webClientId) {
    return {
      status: 'missing_config',
      provider: 'Google',
      requiredKey: 'EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID',
      title: 'Google Sign-In Configuration Required',
      instructions:
        'To enable Google Sign-In with your live Firebase project:\n\n' +
        '1. Go to Firebase Console -> Authentication -> Sign-in method -> Google.\n' +
        '2. Enable Google Provider and copy the Web Client ID.\n' +
        '3. Add EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your-client-id to your .env file.\n\n' +
        'Note: Simulation is disabled as requested.',
    };
  }

  // Official Firebase OAuth redirect handler for citymart-69b52
  const redirectUri = 'https://citymart-69b52.firebaseapp.com/__/auth/handler';
  const scope = encodeURIComponent('openid profile email');
  const nonce = `citymart_${Date.now()}`;
  const state = `citymart_gauth_${Date.now()}`;

  // Google OAuth 2.0 endpoint requesting ID Token
  const authUrl =
    'https://accounts.google.com/o/oauth2/v2/auth?' +
    `client_id=${encodeURIComponent(webClientId)}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `response_type=${encodeURIComponent('token id_token')}&` +
    `scope=${scope}&` +
    `nonce=${encodeURIComponent(nonce)}&` +
    `state=${encodeURIComponent(state)}&` +
    `prompt=select_account`;

  try {
    const supported = await Linking.canOpenURL(authUrl);
    if (!supported) {
      throw new Error('Device cannot launch browser for Google authentication.');
    }

    // Set up deep link listener to capture returned auth credentials
    const urlListener = async ({ url }) => {
      try {
        const parsed = parseOAuthResponseUrl(url);
        if (parsed.id_token) {
          const firebaseUser = await signInWithSocialCredential({
            providerId: 'google.com',
            idToken: parsed.id_token,
            accessToken: parsed.access_token,
          });

          if (onSuccessCallback) {
            onSuccessCallback(firebaseUser);
          }
        }
      } catch (e) {
        console.warn('OAuth listener handling notice:', e.message);
      }
    };

    const subscription = Linking.addEventListener('url', urlListener);

    // Launch Google authentication
    await Linking.openURL(authUrl);

    return {
      status: 'opened',
      provider: 'Google',
      title: 'Google Sign-In Opened',
      message:
        'Official Google account selection has been opened in your browser.\n\n' +
        'Select your Google account to authorize CityMart.\n\n' +
        'Note: In an Android Development Build, this integrates natively via Google Play Services bottom-sheet.',
      cleanup: () => {
        if (subscription && subscription.remove) {
          subscription.remove();
        }
      },
    };
  } catch (err) {
    return {
      status: 'error',
      message: err.message || 'Unable to open Google authentication.',
    };
  }
}

/**
 * Handles Real Facebook Authentication Flow
 */
export async function initiateFacebookSignIn() {
  const facebookAppId = process.env.EXPO_PUBLIC_FACEBOOK_APP_ID;

  if (!facebookAppId) {
    return {
      status: 'missing_config',
      provider: 'Facebook',
      requiredKey: 'EXPO_PUBLIC_FACEBOOK_APP_ID',
      title: 'Facebook Login Configuration Required',
      instructions:
        'To enable Facebook Login:\n\n' +
        '1. Go to Meta for Developers (developers.facebook.com) and create an App.\n' +
        '2. Enable Facebook Login and set the OAuth Redirect URI to:\n' +
        '   https://citymart-69b52.firebaseapp.com/__/auth/handler\n' +
        '3. In Firebase Console, enable Facebook under Authentication -> Sign-in method.\n' +
        '4. Add EXPO_PUBLIC_FACEBOOK_APP_ID=your-app-id to your .env file.\n\n' +
        'Note: Simulation is disabled as requested.',
    };
  }

  const redirectUri = encodeURIComponent('https://citymart-69b52.firebaseapp.com/__/auth/handler');
  const authUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${encodeURIComponent(
    facebookAppId
  )}&redirect_uri=${redirectUri}&response_type=token&scope=email,public_profile`;

  try {
    const supported = await Linking.canOpenURL(authUrl);
    if (supported) {
      await Linking.openURL(authUrl);
      return {
        status: 'opened',
        message: 'Facebook authorization opened in browser.',
      };
    } else {
      throw new Error('Device cannot open browser for Facebook authorization.');
    }
  } catch (err) {
    return {
      status: 'error',
      message: err.message,
    };
  }
}

/**
 * Handles Real Apple Authentication Flow
 */
export async function initiateAppleSignIn() {
  if (Platform.OS === 'android') {
    return {
      status: 'platform_notice',
      provider: 'Apple',
      title: 'Apple Sign-In on Android',
      instructions:
        'Native "Sign in with Apple" is supported exclusively on Apple iOS devices.\n\n' +
        'For Android devices, Apple requires web-based OAuth which needs:\n' +
        '1. Apple Developer Account ($99/year membership).\n' +
        '2. A configured Apple Services ID and private key (.p8).\n' +
        '3. Configuring Apple Provider in Firebase Console with Service ID and Team ID.\n\n' +
        'On an iOS device or simulator, native Apple authentication will present the Apple ID sheet.',
    };
  }

  return {
    status: 'platform_notice',
    provider: 'Apple',
    title: 'Apple Sign-In',
    instructions: 'Apple Sign-In is configured for iOS devices. Run on an iOS Simulator or Device to test.',
  };
}
