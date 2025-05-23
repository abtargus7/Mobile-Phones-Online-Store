import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useDispatch } from "react-redux"
import { login } from "../features/userSlice"
import { useState } from "react"
import axios from 'axios'
import API_BASE_URL from "../utils/api"
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [user, setUser] = useState({
    email: "",
    password: ""
  })

  const handleOnChange = (e) => {
    setUser(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleOnSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post(`${API_BASE_URL}/user/login`, user, { withCredentials: true })
      if (!response) throw new Error("Login Failed")
      dispatch(login(response.data.data))
      toast(response.data.message)

      navigate("/")
    } catch (error) {
      toast(error.response?.data?.message || error.message || "Login Failed")
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className={"flex flex-col gap-6"}>
          <Card>
            <CardHeader>
              <CardTitle>Login to your account</CardTitle>
              <CardDescription>
                Enter your email below to login to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleOnSubmit}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input onChange={handleOnChange} name="email" id="email" type="email" placeholder="m@example.com" required />
                  </div>
                  <div className="grid gap-3">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <a
                        href="#"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                        Forgot your password?
                      </a>
                    </div>
                    <Input onChange={handleOnChange} name="password" id="password" type="password" required />
                  </div>
                  <div className="flex flex-col gap-3">
                    <Button type="submit" className="w-full">
                      Login
                    </Button>
                  </div>
                </div>
                <div className="mt-4 text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <a href="/signup" className="underline underline-offset-4">
                    Sign up
                  </a>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Login
