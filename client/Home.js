import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import React, { useState, useEffect, useRef } from "react";
import { View, Button, Platform, TextInput, StyleSheet } from "react-native";
import { useUserData } from "./context/UserContext";
import { getDatabase, ref, update, get, child } from "firebase/database";
import RNPickerSelect from "react-native-picker-select";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert("Must use physical device for Push Notifications!");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

export default function Home(props) {
  //notification variables
  const notificationListener = useRef();
  const responseListener = useRef();
  const [selectedUser, setSelectedUser] = useState(null);

  //list of all the users in firebase
  const [users, setUsers] = useState([]);

  //input for notification
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  //firebase references for updating/retriving user device token
  const { auth, userID } = useUserData();
  const db = getDatabase();
  const dbRef = ref(db);
  const userRef = ref(db, "users/" + userID);

  async function sendPushNotification(id, title, body) {
    let token = "";

    get(child(dbRef, "users/" + id))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          token = data.deviceToken;
        }
      })
      .then(async () => {
        const message = {
          deviceToken: token,
          title: title,
          text: body,
        };

        await fetch("http://192.168.1.222:5050/notify/user/send-notification", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Accept-Encoding": "gzip, deflate",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(message),
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  //checks on userID and executes when it changes
  useEffect(() => {
    if (userID === "") {
      props.navigation.reset({
        index: 0,
        routes: [{ name: "Auth" }],
      });
    }
  }, [userID]);

  useEffect(() => {
    // gets device token for use with Expo's service
    registerForPushNotificationsAsync().then(async (token) => {
      //updates the token stored inside firebase for the current user.
      update(userRef, {
        deviceToken: token,
      });

      get(child(dbRef, "users/"))
        .then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();

            let arr = Object.keys(data).map((key) => data[key]);
            arr.map((item) => {
              delete Object.assign(item, { ["label"]: item["name"] })["name"];
              delete Object.assign(item, { ["value"]: item["id"] })["id"];
            });

            setUsers(arr);
          } else {
            setUsers([]);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    });

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        //setNotification(notification);
      });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    // This is where you would handle your notifications, and it varies depending on what you want the outcome to look like.
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const screenDest =
          response.notification.request.content.data.navigateTo;
        const name = response.notification.request.content.data.userName;

        if (screenDest) {
          props.navigation.navigate(screenDest, { name: name });
        }
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <View>
      <View style={{ height: 50 }} />
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Button
          title={"Sign Out"}
          onPress={() => {
            update(userRef, {
              deviceToken: "",
            });
            auth.signOut();
          }}
        />
      </View>

      <TextInput
        style={styles.textInput}
        onChangeText={setTitle}
        value={title}
        placeholder="Title"
      />

      <TextInput
        style={styles.textInput}
        onChangeText={setBody}
        value={body}
        placeholder="Message"
      />

      <RNPickerSelect
        onValueChange={(value) => setSelectedUser(value)}
        items={users}
      />

      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Button
          title="Send Notification"
          onPress={async () => {
            if (title !== "" && body !== "") {
              await sendPushNotification(selectedUser, title, body);
            }
          }}
          disabled={
            title == "" || body == "" || selectedUser == null ? true : false
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  textInput: {
    borderColor: "black",
    borderWidth: 1,
    height: 50,
    margin: 15,
    padding: 10,
  },
});
