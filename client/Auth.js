import { Button, StyleSheet, TextInput, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import { useUserData } from "./context/UserContext";

const Auth = (props) => {
  const [username, setUsername] = useState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [registerUI, setRegisterUI] = useState(false);

  const { userID, dispatchUserEvent } = useUserData();

  //checks userID in real-time and navigates to screen accordingly
  useEffect(() => {
    if (userID !== "") {
      props.navigation.replace("Home");
    }
    return () => {};
  }, [userID]);

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
        <Button
          title="Submit"
          onPress={
            registerUI
              ? () => {
                  if (
                    confirmPass === password &&
                    username !== "" &&
                    email !== "" &&
                    password !== "" &&
                    confirmPass !== ""
                  ) {
                    dispatchUserEvent("REGISTER", {
                      username: username,
                      email: email,
                      password: password,
                    });
                  } else {
                    Alert.alert("Error", "Passwords do not match.", [
                      { text: "OK" },
                    ]);
                  }
                }
              : () => {
                  if (email !== "" && password !== "") {
                    dispatchUserEvent("LOGIN", {
                      email: email,
                      password: password,
                    });
                  } else {
                    Alert.alert("Error", "Please input your information.", [
                      { text: "OK" },
                    ]);
                  }
                }
          }
        />
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
