import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from './ui/button'


const Navbar = () => {
    return (
        <div className='flex items-center justify-between py-5 font-medium'>
            <Link to="/">
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </Link>

            <div className='flex gap-6 items-center'>
                <NavLink to={"/login"}>
                    <Button>Login</Button>
                </NavLink>
                <NavLink to={"/signup"}>
                    <Button>Signup</Button>
                </NavLink>
            </div>
        </div>
    )
}

export default Navbar
