import React from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import API_BASE_URL from '../utils/api'
import { logout } from '../features/userSlice'
import { toast } from 'sonner'


const Navbar = () => {

    //get user state to check user logged in and admin or customer
    const { user } = useSelector((state) => state.user)

    //hook to update redux states
    const dispatch = useDispatch()

    //hook for navigate to other pages
    const navigate = useNavigate()

    //method to log out user
    const handleLogout = async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}/user/logout`, {}, {
               withCredentials: true
            })

            //if error in response throw error
            if (response.status !== 200) throw new Error("Logout Failed")

            //reset user state
            dispatch(logout())

            toast(response.data.message)
            navigate("/login")
        } catch (error) {
            toast(error.response?.data?.message || error.message || "Logout Failed")
        }
    }

    return (
        <div className='flex items-center justify-between py-5 font-medium'>
            {/* avatar / logo */}
            <Link to="/">
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </Link>

            {/* home page */}
            <NavLink to={"/"}>
                <Label>Home</Label>
            </NavLink>

            {/* if user not logged in show login and sign up buttons, otherwise show logout button */}
            <div className='flex gap-6 items-center'>
                {!user ? (
                    <>
                        <NavLink to={"/login"}>
                            <Button>Login</Button>
                        </NavLink>
                        <NavLink to={"/signup"}>
                            <Button>Signup</Button>
                        </NavLink>
                    </>
                ) : (
                    
                    <>
                        <Button onClick={handleLogout}>Logout</Button>
                    </>
                )}

                {/* if user is admin show admin panel button */}
                {user && user.role === "admin" && (
                    <NavLink to={"/admin/products"}>
                        <Button>Admin Panel</Button>
                    </NavLink>
                )}
            </div>
        </div>
    )
}

export default Navbar
