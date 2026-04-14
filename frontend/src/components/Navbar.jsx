import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth"; // 👈 Import từ file Hook riêng

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-blue-600 p-4 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="text-xl font-bold font-mono tracking-wider text-white no-underline"
        >
          ViSentiment
        </Link>
        <div className="space-x-4 flex items-center">
          <Link
            to="/"
            className="hover:text-blue-200 font-medium text-white no-underline"
          >
            Trang chủ
          </Link>

          {user ? (
            <>
              {user.role === "ADMIN" && (
                <Link
                  to="/admin"
                  className="bg-orange-500 px-3 py-1 rounded hover:bg-orange-600 font-bold text-sm shadow text-white no-underline"
                >
                  Admin Dashboard
                </Link>
              )}
              <span className="text-sm border-l pl-4 font-medium border-blue-400">
                Chào, {user.fullName}
              </span>
              <button
                onClick={logout}
                className="text-sm bg-red-500 px-3 py-1 rounded hover:bg-red-600 shadow cursor-pointer border-none text-white"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-blue-200 font-medium text-white no-underline"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="bg-green-500 px-3 py-1 rounded hover:bg-green-600 font-medium shadow text-white no-underline"
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
