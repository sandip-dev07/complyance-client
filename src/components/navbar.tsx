import { useAuth } from "@/contexts/auth-context";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-sm ">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-xl font-bold text-gray-800">
              Dashboard
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-gray-600">
              {user?.username} ({user?.role})
            </span>
            <Button onClick={handleLogout} variant={"destructive"}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
