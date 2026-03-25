import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';

// Note: The user provided a Realtime Database URL and a Secret Key.
// For a modern web app, we usually use a full Firebase Config.
// We'll use the provided URL and a placeholder API key if needed.
const firebaseConfig = {
  databaseURL: "https://english-learning-platfor-d50c1-default-rtdb.asia-southeast1.firebasedatabase.app/",
  // Standard Firebase SDK requires an apiKey for most operations.
  // We'll use a placeholder if one isn't provided, but RTDB often works with just the URL if rules are open.
  apiKey: "AIzaSyA-placeholder-key", 
  projectId: "english-learning-platfor-d50c1",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);

// Helper functions for data persistence with improved error handling
export const savePortfolioData = async (data: any) => {
  if (!data) return;
  try {
    const portfolioRef = ref(db, 'portfolio');
    await set(portfolioRef, data);
  } catch (error) {
    console.error("Firebase Sync Error:", error);
    // Fallback to local storage if Firebase fails
    localStorage.setItem('chandeepa_portfolio_data_v2', JSON.stringify(data));
  }
};

export const subscribeToPortfolioData = (callback: (data: any) => void) => {
  try {
    const portfolioRef = ref(db, 'portfolio');
    return onValue(portfolioRef, (snapshot) => {
      const data = snapshot.val();
      callback(data);
    }, (error) => {
      console.error("Firebase Subscription Error:", error);
    });
  } catch (error) {
    console.error("Firebase Setup Error:", error);
    return () => {};
  }
};
