import { Text, View } from "react-native";
import React from "react";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { Button, ScreenWrapper, TextField } from "@/components";
import { ms } from "@/utils";
import { fonts } from "@/theme";
import { useDispatch } from "react-redux";
import { login } from "@/redux/slices/userSlicer";

const Login = () => {
  const { styles, theme } = useStyles(stylesheet);

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const dispatch = useDispatch();

  const onPressLogin = () => {
    const params = {
      email,
      password,
    };
    dispatch(login(params));
  };

  return (
    <ScreenWrapper style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <View style={{ marginVertical: ms(20) }}>
        <TextField
          placeholder="Enter your email"
          containerStyle={styles.textFieldContainer}
          value={email}
          onChangeText={setEmail}
        />
        <TextField
          placeholder="Enter your password"
          secureTextEntry
          containerStyle={styles.textFieldContainer}
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <Button
        type="primary"
        title="Sign in"
        style={styles.btnStyle}
        onPress={onPressLogin}
      />
    </ScreenWrapper>
  );
};

export default Login;

const stylesheet = createStyleSheet((theme) => ({
  container: {
    padding: ms(20),
    justifyContent: "center",
    alignItems: "center",
  },
  title: { fontFamily: fonts.openSan.bold, fontSize: ms(30) },
  textFieldContainer: { width: "100%" },
  btnStyle: { marginTop: ms(20) },
}));
