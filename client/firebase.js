import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth/react-native";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAoqv2muHUkH7-pG8pPpT0fnzEZGD1BpRU",
  authDomain: "notipush-cfb83.firebaseapp.com",
  projectId: "notipush-cfb83",
  storageBucket: "notipush-cfb83.appspot.com",
  messagingSenderId: "755830415454",
  appId: "1:755830415454:web:90779bb7505a1e65e054cf",
};

// initialize firebase app
const app = initializeApp(firebaseConfig);

// initialize auth
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth };
