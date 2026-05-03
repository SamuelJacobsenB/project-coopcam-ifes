import React, { useEffect, useReducer } from "react";
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
import { useLogin, useVerifyDriver } from "@/hooks";
import { btnStyles, colors } from "@/styles";
import type { LoginDTO } from "@/types";
import { validateLoginDTO } from "@/utils";

interface State {
  email: string;
  password: string;
  error: string;
}

type LoginAction =
  | { type: "field"; payload: { field: "email" | "password"; value: string } }
  | { type: "error"; payload: string };

const reducer = (state: State, action: LoginAction): State => {
  switch (action.type) {
    case "field":
      return {
        ...state,
        [action.payload.field]: action.payload.value,
      };
    case "error":
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

const initialState: State = {
  email: "",
  password: "",
  error: "",
};

export default function LoginPage() {
  const { isVerified } = useVerifyDriver();
  const { login, isPending } = useLogin();

  const [state, dispatch] = useReducer(reducer, initialState);
  const { email, password, error } = state;

  function setError(message: string) {
    dispatch({ type: "error", payload: message });
  }

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
          onChangeText={(email) =>
            dispatch({
              type: "field",
              payload: { field: "email", value: email },
            })
          }
        />
        <Input
          label="Senha"
          textContentType="password"
          placeholder="Senha"
          secureTextEntry
          value={password}
          onChangeText={(password) =>
            dispatch({
              type: "field",
              payload: { field: "password", value: password },
            })
          }
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
