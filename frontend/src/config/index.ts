// API Configuration
// In development, use your local IP or ngrok URL
// In production, use your actual backend URL

export const CONFIG = {
  API_BASE_URL: __DEV__
    ? 'http://localhost:8080/api'  // Development - change to your IP for device testing
    : 'https://api.taptaza.kz/api', // Production

  // Timeouts
  API_TIMEOUT: 30000,

  // OTP Settings
  OTP_LENGTH: 4,
  OTP_RESEND_DELAY: 60,
};

// For testing on physical device, replace localhost with your machine's IP:
// export const API_BASE_URL = 'http://192.168.1.100:8080/api';
