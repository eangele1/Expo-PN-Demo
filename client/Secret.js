import { StyleSheet, Text, View } from "react-native";
import React from "react";

const Secret = (props) => {
  const { name } = props.route.params;

  return (
    <View>
      <Text>Hey {name}. You found me.</Text>
    </View>
  );
};

export default Secret;

const styles = StyleSheet.create({});
