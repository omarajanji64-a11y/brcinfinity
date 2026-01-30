
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
  "projectId": "studio-889379362-ea6f3",
  "appId": "1:107391487482:web:42eaf54eb73da9fa72e843",
  "storageBucket": "studio-889379362-ea6f3.appspot.com",
  "apiKey": "AIzaSyAEdVWfuroKFLKol24QVyZuMfN1qCTD7RY",
  "authDomain": "studio-889379362-ea6f3.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "107391487482"
};


const apps = getApps();

export const app = apps.length > 0 ? apps[0] : initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
