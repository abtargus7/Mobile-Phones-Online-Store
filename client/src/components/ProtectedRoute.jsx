import { Navigate, Outlet } from "react-router-dom"
import { useSelector } from "react-redux"
import { toast } from "sonner"

// if user admin allow it to access admin panel
const ProtectedRoute = ({ allowedRoles }) => {
    const {user}  = useSelector((state) => state.user)
    
    if (!user) {
        return <div>Loading...</div>;
    }

    console.log("user: ", user)

    // if user not admin navigate to login page
    if (!user || !allowedRoles.includes(user.role)) {
        toast("Please Login as an Admin");
        return <Navigate to="/login" />;
    }

    //render admin pages
    return <Outlet />;

}

export default ProtectedRoute