import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, push } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCtgwumRbEWN6MlXENhJpEKk77Zr3Sqzn4",
  authDomain: "english-learning-platfor-d50c1.firebaseapp.com",
  databaseURL: "https://english-learning-platfor-d50c1-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "english-learning-platfor-d50c1",
  storageBucket: "english-learning-platfor-d50c1.firebasestorage.app",
  messagingSenderId: "639969840143",
  appId: "1:639969840143:web:53541e9ae315a51fdea77a",
  measurementId: "G-R57RJ79KS5"
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

export const logGeneratedCV = async (cvName: string, email: string, source: string, template: number) => {
  try {
    const cvsRef = ref(db, 'generated_cvs');
    await push(cvsRef, {
      name: cvName || 'Unknown',
      email: email || 'No email',
      source,
      template,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Firebase log CV error:", error);
  }
};

export const subscribeToGeneratedCVs = (callback: (data: any[]) => void) => {
  try {
    const cvsRef = ref(db, 'generated_cvs');
    return onValue(cvsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const arr = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        callback(arr.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
      } else {
        callback([]);
      }
    });
  } catch (error) {
    console.error("Firebase CV fetching error:", error);
    return () => {};
  }
};
