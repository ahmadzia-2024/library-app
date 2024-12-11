"use server";

import { redirect } from "next/navigation";
import { API_URL } from "./constants";
import { FormState, LoginFormSchema, SignupFormSchema } from "./type";
import { createSession } from "./session";

async function apiFetch(url: string, method: string, body?: any) {
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  };
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }
  return response.json();
}

export async function signUp(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  const validationFields = SignupFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validationFields.success) {
    return { error: validationFields.error.flatten().fieldErrors };
  }

  try {
    await apiFetch(`${API_URL}/auth/signup`, "POST", validationFields.data);
    redirect("/auth/signin");
  } catch (err) {
    console.error("Sign-up error:", err);
    return { message: "The user already exists or an error occurred." };
  }
}

export async function signIn(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  try {
    const result = await apiFetch(
      `${API_URL}/auth/signin`,
      "POST",
      validatedFields.data
    );
    await createSession({
      user: {
        id: result.id,
        name: result.name,
        role: result.role,
      },
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
    redirect("/");
  } catch (err) {
    console.error("Sign-in error:", err);
    return { message: "Invalid credentials or an error occurred." };
  }
}

export const refreshToken = async (oldRefreshToken: string) => {
  try {
    const { accessToken, refreshToken } = await apiFetch(
      `${API_URL}/auth/refresh`,
      "POST",
      { refresh: oldRefreshToken }
    );

    await apiFetch("/api/auth/update", "POST", {
      accessToken,
      refreshToken,
    });

    return accessToken;
  } catch (err) {
    console.error("Refresh token error:", err);
    return null;
  }
};
