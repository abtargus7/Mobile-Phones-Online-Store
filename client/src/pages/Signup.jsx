
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useState } from "react"
import axios from 'axios'
import API_BASE_URL from "../utils/api"
import { useDispatch } from "react-redux"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

const Signup = () => {
    const [user, setUser] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        role: "user"
    })

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const onHandleChange = (e) => {
        setUser(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleOnSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await axios.post(`${API_BASE_URL}/user/signup`, user)

            if (!response) throw new Error("User registeration failed")

            console.log(response)
            toast("User regisered successfully. Please Login")
            navigate("/login")
            // dispatch(login(response))
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className={"flex flex-col gap-6"}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Create a new account</CardTitle>
                            <CardDescription>
                                Enter your email below to create a new account
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleOnSubmit}>
                                <div className="flex flex-col gap-6">
                                    <div className="grid gap-3">
                                        <Label htmlFor="email">Email</Label>
                                        <Input onChange={onHandleChange} name="email" id="email" type="email" placeholder="m@example.com" required />
                                    </div>
                                    <div className="grid gap-3">
                                        <div className="flex items-center">
                                            <Label htmlFor="password">Password</Label>
                                        </div>
                                        <Input onChange={onHandleChange} name="password" id="password" type="password" required />
                                    </div>
                                    <div className="grid gap-3">
                                        <div className="flex items-center">
                                            <Label htmlFor="password">Confirm Password</Label>
                                        </div>
                                        <Input onChange={onHandleChange} name="confirmPassword" id="confirmPassword" type="password" required />
                                    </div>
                                    <RadioGroup value={user.role} onValueChange={(value) =>
                                        onHandleChange({ target: { name: "role", value } })
                                    }>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="user" id="option-one" />
                                            <Label htmlFor="option-one">Customer</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="admin" id="option-two" />
                                            <Label htmlFor="option-two">Admin</Label>
                                        </div>
                                    </RadioGroup>
                                    <div className="flex flex-col gap-3">
                                        <Button type="submit" className="w-full">
                                            Sign up
                                        </Button>
                                    </div>
                                </div>
                                <div className="mt-4 text-center text-sm">
                                    Already have an account?{" "}
                                    <a href="/login" className="underline underline-offset-4">
                                        Login
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

export default Signup
