import api from "./axios"

export interface LoginPayload {
  username: string
  password: string
}

export interface LoginResponse {
  access: string
  refresh: string
}

export const login = async (
  data: LoginPayload
): Promise<LoginResponse> => {
  
  
  const response = await api.post<LoginResponse>(
    "/auth/token/",
    data
  )
  console.log(response.data)

  return response.data
  
}

export interface RegisterPayload {
  username: string
  email: string
  password: string
}

export const registerCustomer = async (
  data: RegisterPayload
) => {
  const response = await api.post(
    "/auth/register/customer/",
    data
  )
  return response.data
}

export const getMe = async () => {
  const response = await api.get("/auth/me/")
  return response.data
}

export const refreshAccessToken = async (refresh: string) => {
  const response = await api.post("/auth/token/refresh/", { refresh })
  return response.data as { access: string }
}

