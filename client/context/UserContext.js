import React, { useState, useContext, useEffect } from "react";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { Alert } from "react-native";

const userContext = React.createContext();
const UserProvider = (props) => {
  const auth = getAuth();

  const [userID, setUserID] = useState("");

  useEffect(() => {
    // Listen for authentication state to change.
    return onAuthStateChanged(auth, (user) => {
      if (user != null) {
        setUserID(user.uid);
      } else {
        setUserID("");
      }
    });
  }, []);

  const dispatchUserEvent = (action, payload) => {
    switch (action) {
      case "REGISTER":
        createUserWithEmailAndPassword(auth, payload.email, payload.password)
          .then((data) => {
            const db = getDatabase();
            const reference = ref(db, "users/" + data.user.uid);
            set(reference, {
              name: payload.username,
              deviceToken: "",
              id: data.user.uid,
            });
          })
          .catch((err) => {
            Alert.alert(err.message);
          });
        break;
      case "LOGIN":
        signInWithEmailAndPassword(auth, payload.email, payload.password).catch(
          (err) => {
            Alert.alert(err.message);
          }
        );
        break;
      default:
        break;
    }
  };

  return (
    <userContext.Provider value={{ userID, auth, dispatchUserEvent }}>
      {props.children}
    </userContext.Provider>
  );
};

export const useUserData = () => useContext(userContext);
export default UserProvider;
