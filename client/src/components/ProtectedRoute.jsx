import { Navigate, Outlet } from "react-router-dom"
import { useSelector } from "react-redux"
import { toast } from "sonner"

const ProtectedRoute = ({ allowedRoles }) => {
    const {user}  = useSelector((state) => state.user)
    
    if (!user) {
        return <div>Loading...</div>;
    }

    console.log("user: ", user)

    if (!user || !allowedRoles.includes(user.role)) {
        toast("Please Login as an Admin");
        return <Navigate to="/login" />;
    }

    


    return <Outlet />;

}

export default ProtectedRoute