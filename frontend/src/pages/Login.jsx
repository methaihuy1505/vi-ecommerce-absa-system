import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiFetch } from "../utils/api";
import { useAuth } from "../context/useAuth"; 

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      login(data);
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Đăng nhập
      </h2>
      <form onSubmit={handleLogin} className="space-y-5">
        <input
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          type="text"
          placeholder="Tên đăng nhập"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 font-bold disabled:bg-blue-400 cursor-pointer transition-colors border-none"
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>
      <p className="mt-6 text-center text-gray-600">
        Chưa có tài khoản?{" "}
        <Link
          to="/register"
          className="text-blue-600 font-bold hover:underline"
        >
          Đăng ký ngay
        </Link>
      </p>
    </div>
  );
};
export default Login;
