// Firebase bootstrap + auth. The config comes from the server (/firebase-config.js, built from .env),
// so no keys live in the client source. Failure here must never break the reader.
const SDK = 'https://www.gstatic.com/firebasejs/12.0.0';

let ready;

/** Initialises Firebase once. Resolves to { app, analytics, auth, authApi } or null when unavailable. */
export function initFirebase() {
  ready ??= (async () => {
    try {
      const { default: firebaseConfig } = await import('/firebase-config.js');
      if (!firebaseConfig.apiKey) return null;
      const { initializeApp } = await import(`${SDK}/firebase-app.js`);
      const app = initializeApp(firebaseConfig);
      const authApi = await import(`${SDK}/firebase-auth.js`);
      const auth = authApi.getAuth(app);
      let analytics = null;
      if (firebaseConfig.measurementId) {
        const { getAnalytics, isSupported } = await import(`${SDK}/firebase-analytics.js`);
        if (await isSupported()) analytics = getAnalytics(app);
      }
      return { app, analytics, auth, authApi };
    } catch (err) {
      console.warn('Firebase unavailable:', err);
      return null;
    }
  })();
  return ready;
}

const toUser = (u) => (u ? { name: u.displayName || u.email || 'Reader', email: u.email || '', uid: u.uid } : null);

/** Calls onUser({name,email,uid} | null) now and on every sign-in/out. */
export async function watchAuth(onUser) {
  const fb = await initFirebase();
  if (!fb) return;
  fb.authApi.onAuthStateChanged(fb.auth, (u) => onUser(toUser(u)));
}

/** Google popup: creates the account on first use (sign up) and signs in afterwards. */
export async function signInWithGoogle() {
  const fb = await initFirebase();
  if (!fb) throw new Error('Firebase is not configured');
  const { signInWithPopup, GoogleAuthProvider } = fb.authApi;
  const result = await signInWithPopup(fb.auth, new GoogleAuthProvider());
  return toUser(result.user);
}

export async function signOutUser() {
  const fb = await initFirebase();
  if (fb) await fb.authApi.signOut(fb.auth);
}
