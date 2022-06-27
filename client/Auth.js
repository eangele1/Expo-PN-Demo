import { Button, StyleSheet, TextInput, Text, View } from "react-native";
import React, { useState } from "react";
import { useUserData } from "./context/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Auth = (props) => {
  const [username, setUsername] = useState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [registerUI, setRegisterUI] = useState(false);

  const { setUser } = useUserData();

  const signUpUser = async () => {
    if (username == "" || email == "" || password == "" || confirmPass == "") {
      return;
    }

    if (confirmPass !== password) {
      return;
    }

    try {
      const res = await fetch(`http://192.168.1.222:5050/notify/user/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: username,
          email,
          password,
          pushToken: "",
        }),
      });
      const data = await res.json();
      const jsonValue = JSON.stringify({
        id: data._id,
        userName: data.userName,
        email: data.email,
      });
      AsyncStorage.setItem("user", jsonValue);
      setUser({
        id: data._id,
        userName: data.userName,
        email: data.email,
      });
      return props.navigation.replace("Home");
    } catch (err) {
      return console.log(err);
    }
  };

  const loginUser = async () => {
    if (email == "" || password == "") {
      return;
    }

    try {
      const res = await fetch(`http://192.168.1.222:5050/notify/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      const jsonValue = JSON.stringify({
        id: data._id,
        userName: data.userName,
        email: data.email,
      });
      AsyncStorage.setItem("user", jsonValue);
      setUser({
        id: data._id,
        userName: data.userName,
        email: data.email,
      });
      return props.navigation.replace("Home");
    } catch (err) {
      return console.log(err);
    }
  };

  return (
    <View>
      <View style={{ height: 50 }} />
      {registerUI ? (
        <TextInput
          style={styles.textInput}
          onChangeText={setUsername}
          value={username}
          placeholder="Username"
        />
      ) : (
        <></>
      )}
      <TextInput
        style={styles.textInput}
        onChangeText={setEmail}
        value={email}
        placeholder="Email"
      />
      <TextInput
        style={styles.textInput}
        onChangeText={setPassword}
        value={password}
        placeholder="Password"
        secureTextEntry={true}
      />
      {registerUI ? (
        <TextInput
          style={styles.textInput}
          onChangeText={setConfirmPass}
          value={confirmPass}
          placeholder="Confirm Password"
          secureTextEntry={true}
        />
      ) : (
        <></>
      )}
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        {registerUI ? (
          <Text style={{ color: "black" }}>
            Already have an account?{" "}
            <Text
              style={{ color: "blue" }}
              onPress={() => setRegisterUI(false)}
            >
              Login.
            </Text>
          </Text>
        ) : (
          <Text style={{ color: "black" }}>
            Don't have an account?{" "}
            <Text style={{ color: "blue" }} onPress={() => setRegisterUI(true)}>
              Sign up.
            </Text>
          </Text>
        )}
      </View>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Button title="Submit" onPress={registerUI ? signUpUser : loginUser} />
      </View>
    </View>
  );
};

export default Auth;

const styles = StyleSheet.create({
  textInput: {
    borderColor: "black",
    borderWidth: 1,
    height: 50,
    margin: 15,
    padding: 10,
  },
});
