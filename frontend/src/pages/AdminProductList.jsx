import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { apiFetch } from "../utils/api";

const AdminProductList = () => {
  const [products, setProducts] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role !== "ADMIN") return (window.location.href = "/");
    apiFetch("/products").then(setProducts);
  }, [user]);

  return (
    <div className="max-w-6xl mx-auto mt-10 p-8 bg-white rounded-3xl shadow-xl border border-gray-100">
      <h2 className="text-3xl font-black text-gray-800 mb-8">
        📦 Quản lý Sản phẩm & Sentiment
      </h2>

      <div className="overflow-hidden rounded-2xl border border-gray-200">
        <table className="w-full text-left bg-white">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="p-4 text-xs font-bold uppercase">Sản phẩm</th>
              <th className="p-4 text-xs font-bold uppercase text-center">
                Giá niêm yết
              </th>
              <th className="p-4 text-xs font-bold uppercase text-right">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-blue-50 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-gray-800">{p.name}</div>
                  <div className="text-xs text-gray-400 truncate max-w-xs">
                    {p.description}
                  </div>
                </td>
                <td className="p-4 text-center font-mono text-sm text-red-500 font-bold">
                  {p.price.toLocaleString()}đ
                </td>
                <td className="p-4 text-right">
                  <Link
                    to={`/admin/insight/${p.id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 shadow-md transition-all"
                  >
                    Xem phân tích AI →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProductList;
