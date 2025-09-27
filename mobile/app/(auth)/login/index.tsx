import { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";

import { router } from "expo-router";

import { useLogin } from "@/hooks";
import { Error, Input, Line } from "@/components";
import { validateLoginDTO } from "@/utils";
import { LoginDTO } from "@/types";
import { btnStyles } from "@/styles";

import styles from "./styles";

export default function LoginPage() {
  const { login, isPending } = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin() {
    if (isPending) return;

    setError("");

    const loginDTO: LoginDTO = {
      email,
      password,
    };

    const error = validateLoginDTO(loginDTO);
    if (error) {
      setError(error);
      return;
    }

    try {
      await login(loginDTO);
      router.push("/");
    } catch {
      setError("Email ou senha incorretos");
    }
  }

  return (
    <View style={styles.loginContainer}>
      <Text style={styles.title}>Login</Text>
      <Line styles={styles.line} />
      <Error error={error} onClose={() => setError("")} />
      <Input
        label="Email"
        textContentType="emailAddress"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <Input
        label="Senha"
        textContentType="password"
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity onPress={handleLogin} style={styles.btn}>
        <Text style={{ ...btnStyles.btn, ...btnStyles.btnSecondary }}>
          {isPending ? <ActivityIndicator color={"white"} /> : "Login"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
