import type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
} from "../types/auth";
import { request } from "./client";

export function login(loginData: LoginRequest) {
  return request<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: loginData,
  });
}

export function signup(signupData: SignupRequest) {
  return request<SignupResponse>("/api/auth/signup", {
    method: "POST",
    body: signupData,
  });
}
