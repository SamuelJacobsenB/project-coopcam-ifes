import { isAxiosError } from "axios";

export const getErrorMessage = (error: unknown): string => {
  let message = "Ocorreu um erro inesperado.";

  if (isAxiosError(error)) {
    message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Erro de conexão com o servidor.";
  } else if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === "string") {
    message = error;
  }

  message = message.charAt(0).toUpperCase() + message.slice(1);
  return message;
};
