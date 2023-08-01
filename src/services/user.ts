import axios from 'axios'

const baseUrl = 'https://localhost:3000/api/v1/users'

export interface UserSignup {
  email: string
  username: string
  password: string
}

export interface UserSignin {
  email: string
  password: string
}

export const signup = async (credentials: UserSignup) => {
  const { data } = await axios.post(`${baseUrl}/signup`, credentials)

  return data
}

export const signin = async (credentials: UserSignin) => {
  const { data } = await axios.post(`${baseUrl}/signin`, credentials)

  return data
}