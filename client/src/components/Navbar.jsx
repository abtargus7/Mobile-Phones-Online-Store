import React from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from './ui/button'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import API_BASE_URL from '../utils/api'
import { logout } from '../features/userSlice'
import { toast } from 'sonner'


const Navbar = () => {

    const { user } = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {accessToken} = useSelector(state => state.user)


    console.log(accessToken)

    const handleLogout = async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}/user/logout`, {}, {
               withCredentials: true
            })
            if (response.status !== 200) throw new Error("Logout Failed")

            dispatch(logout())
            toast(response.data.message)
            navigate("/login")
        } catch (error) {
            console.log(error)
            toast(error.response?.data?.message || error.message || "Logout Failed")
        }
    }

    return (
        <div className='flex items-center justify-between py-5 font-medium'>
            <Link to="/">
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </Link>

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
