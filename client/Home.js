import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import React, { useState, useEffect, useRef } from "react";
import { View, Button, Platform, TextInput, StyleSheet } from "react-native";
import { useUserData } from "./context/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function sendPushNotification(id, title, body, userName) {
  const message = {
    userID: id,
    title: title,
    text: body,
    data: { navigateTo: "Secret", userName: userName },
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
}

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
  const expoPushToken = useRef("");
  const notificationListener = useRef();
  const responseListener = useRef();

  const [userID, setUserID] = useState();
  const [title, setTitle] = useState();
  const [body, setBody] = useState();

  const { user, setUser } = useUserData();

  const signOutUser = async () => {
    try {
      await fetch(
        `http://192.168.1.222:5050/notify/user/refresh-device-token`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Accept-Encoding": "gzip, deflate",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: user.email, deviceToken: "" }),
        }
      );
    } catch (err) {
      return console.log(err);
    }
    AsyncStorage.removeItem("user");
    setUser({});

    props.navigation.reset({
      index: 0,
      routes: [{ name: "Auth" }],
    });
  };

  const getUser = async () => {
    const user = await AsyncStorage.getItem("user");

    if (user === null) {
      props.navigation.reset({
        index: 0,
        routes: [{ name: "Auth" }],
      });
      return 0;
    } else {
      setUser(JSON.parse(user));
      return 1;
    }
  };

  useEffect(() => {
    (async () => {
      const response = await getUser();

      if (response === 0) {
        return;
      }

      // gets device token for use with Expo's service
      registerForPushNotificationsAsync()
        .then(async (token) => {
          await fetch(
            `http://192.168.1.222:5050/notify/user/refresh-device-token`,
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Accept-Encoding": "gzip, deflate",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: user.email,
                deviceToken: token,
              }),
            }
          );
          expoPushToken.current = token;
        })
        .then();

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
    })();

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
        <Button title={"Sign Out"} onPress={signOutUser} />
      </View>

      <TextInput
        style={styles.textInput}
        onChangeText={setUserID}
        value={userID}
        placeholder="User ID"
      />

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

      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Button
          title="Send Notification"
          onPress={async () => {
            if (title !== "" && body !== "") {
              await sendPushNotification(userID, title, body, user.userName);
            }
          }}
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
