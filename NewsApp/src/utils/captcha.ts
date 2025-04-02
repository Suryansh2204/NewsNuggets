import { Platform } from 'react-native';
import RNRecaptcha from 'react-native-recaptcha-v3';

// Replace with your actual reCAPTCHA site key
const RECAPTCHA_SITE_KEY = 'YOUR_RECAPTCHA_SITE_KEY';

// Domain for your reCAPTCHA verification
const RECAPTCHA_DOMAIN = 'your-app-domain.com';

/**
 * Mock function to verify captcha
 * In a real app, this would integrate with a captcha service like reCAPTCHA
 *
 * @param action The action to verify (e.g., 'login', 'signup')
 * @returns A promise that resolves to a mock token
 */
export const verifyCaptcha = async (action: string): Promise<string> => {
  // In a real app, this would trigger the reCAPTCHA widget
  // For the mock version, we'll just return a dummy token
  console.log(`Mock CAPTCHA verification for action: ${action}`);

  // Simulate a delay to mimic network request
  await new Promise(resolve => setTimeout(resolve, 300));

  // Return a mock token
  return `mock_captcha_token_${Date.now()}`;
};

/**
 * Mock function to validate a captcha token
 * In a real app, this would verify the token with the captcha service
 *
 * @param token The captcha token to validate
 * @returns A promise that resolves to true (always valid in mock)
 */
export const validateCaptchaToken = async (token: string): Promise<boolean> => {
  // Log the token for debugging purposes
  console.log(`Mock validating CAPTCHA token: ${token}`);

  // Simulate a delay to mimic network request
  await new Promise(resolve => setTimeout(resolve, 300));

  // Always return true for the mock version
  return true;
};
