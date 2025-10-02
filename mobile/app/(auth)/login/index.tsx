import { useEffect, useReducer, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";

import { router } from "expo-router";

import { useLogin, useVerifyUser } from "@/hooks";
import { Error, Input, Line } from "@/components";
import { validateLoginDTO } from "@/utils";
import { LoginDTO } from "@/types";
import { btnStyles } from "@/styles";

import styles from "./styles";

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "field":
      return {
        ...state,
        [action.payload.field as string]: action.payload.value as string,
      };
    case "error":
      return { ...state, error: action.payload as string };
    default:
      return state;
  }
};
const initialState = {
  email: "",
  password: "",
  error: "",
};

export default function LoginPage() {
  const { isVerified } = useVerifyUser();

  const { login, isPending } = useLogin();

  const [state, dispatch] = useReducer(reducer, initialState);
  const { email, password, error } = state;

  async function handleLogin() {
    if (isPending) return;

    dispatch({ type: "error", payload: "" });

    const loginDTO: LoginDTO = {
      email,
      password,
    };

    const error = validateLoginDTO(loginDTO);
    if (error) {
      dispatch({ type: "error", payload: error });
      return;
    }

    try {
      await login(loginDTO);
      router.push("/");
    } catch {
      dispatch({ type: "error", payload: "Email ou senha incorretos" });
    }
  }

  useEffect(() => {
    if (isVerified) {
      router.replace("/");
    }
  }, [isVerified]);

  return (
    <View style={styles.loginContainer}>
      <Text style={styles.title}>Login</Text>
      <Line style={styles.line} />
      <Error
        error={error}
        onClose={() => dispatch({ type: "error", payload: "" })}
      />
      <Input
        label="Email"
        textContentType="emailAddress"
        placeholder="Email"
        value={email}
        onChangeText={(email) =>
          dispatch({ type: "field", payload: { field: "email", value: email } })
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
  );
}
