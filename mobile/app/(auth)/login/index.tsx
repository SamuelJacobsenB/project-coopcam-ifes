import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { router } from "expo-router";

import { Error, Input, Line } from "@/components";
import { useLogin, useVerifyUser } from "@/hooks";
import { btnStyles, colors } from "@/styles";
import type { LoginDTO } from "@/types";
import { validateLoginDTO } from "@/utils";

export default function LoginPage() {
  const { isVerified } = useVerifyUser();
  const { login, isPending } = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin() {
    if (isPending) return;

    setError("");

    const loginDTO: LoginDTO = { email, password };
    const valError = validateLoginDTO(loginDTO);

    if (valError) {
      setError(valError);
      return;
    }

    try {
      await login(loginDTO);
    } catch {
      setError("Email ou senha incorretos");
    }
  }

  useEffect(() => {
    if (isVerified) {
      router.replace("/");
    }
  }, [isVerified]);

  return (
    <View style={styles.container}>
      <Image source={require("@/assets/images/logo.png")} />
      <View style={styles.loginContainer}>
        <Text style={styles.title}>Login</Text>
        <Line style={styles.line} />
        <Error error={error} onClose={() => setError("")} />
        <Input
          label="Email"
          textContentType="emailAddress"
          placeholder="Email"
          value={email}
          onChangeText={(email) => setEmail(email)}
        />
        <Input
          label="Senha"
          textContentType="password"
          placeholder="Senha"
          secureTextEntry
          value={password}
          onChangeText={(password) => setPassword(password)}
        />
        <TouchableOpacity onPress={handleLogin} style={styles.btn}>
          <Text
            style={[
              btnStyles.btn,
              btnStyles.btnSecondary,
              isPending && btnStyles.btnDisabled,
            ]}
          >
            {isPending ? <ActivityIndicator color={"white"} /> : "Login"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 48,
    backgroundColor: colors.primary,
    padding: 16,
  },
  loginContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    gap: 16,
    backgroundColor: "white",
    width: "100%",
    maxWidth: 400,
    padding: 28,
    paddingVertical: 42,
    borderRadius: 8,
  },
  title: {
    fontSize: 48,
    fontFamily: "Poppins-Bold",
    width: "100%",
  },
  line: {
    marginBottom: 24,
  },
  btn: {
    width: "100%",
  },
});
