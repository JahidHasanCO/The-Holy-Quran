// Firebase bootstrap. The config comes from the server (/firebase-config.js, built from .env),
// so no keys live in the client source. Failure here must never break the reader.
const SDK = 'https://www.gstatic.com/firebasejs/12.0.0';

export async function initFirebase() {
  try {
    const { default: firebaseConfig } = await import('/firebase-config.js');
    if (!firebaseConfig.apiKey) return null;
    const { initializeApp } = await import(`${SDK}/firebase-app.js`);
    const app = initializeApp(firebaseConfig);
    let analytics = null;
    if (firebaseConfig.measurementId) {
      const { getAnalytics, isSupported } = await import(`${SDK}/firebase-analytics.js`);
      if (await isSupported()) analytics = getAnalytics(app);
    }
    return { app, analytics };
  } catch (err) {
    console.warn('Firebase unavailable:', err);
    return null;
  }
}
