import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "auth_token";
const EXPIRATION_KEY = "auth_expiration";

export const saveToken = async (token: string, expiresIn: number) => {
  const expirationTime = Date.now() + expiresIn * 1000;

  await SecureStore.setItemAsync(TOKEN_KEY, token);
  await SecureStore.setItemAsync(EXPIRATION_KEY, expirationTime.toString());
};

export const getToken = async () => {
  return await SecureStore.getItemAsync(TOKEN_KEY);
};

export const getExpiration = async () => {
  const exp = await SecureStore.getItemAsync(EXPIRATION_KEY);
  return exp ? parseInt(exp) : null;
};

export const clearToken = async () => {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(EXPIRATION_KEY);
};

export const isTokenExpired = async () => {
  const expiration = await getExpiration();
  if (!expiration) return true;

  return Date.now() > expiration;
};
