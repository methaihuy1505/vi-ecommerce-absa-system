import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { apiFetch } from "../utils/api";

const AdminInsight = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ positive: 0, negative: 0, aspects: {} });
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (user?.role !== "ADMIN") return (window.location.href = "/");

    // Load thông tin sản phẩm
    apiFetch(`/products/${id}`).then(setProduct);

    // Load review và tính toán
    apiFetch(`/reviews/product/${id}`)
      .then((data) => {
        setReviews(data);
        calculateStats(data);
      })
      .catch((err) => alert(err.message));
  }, [id, user]);

  const calculateStats = (data) => {
    let pos = 0,
      neg = 0,
      aspectCount = {},
      badAspects = [];

    data.forEach((r) => {
      if (r.aiResult && r.aiResult !== "{}") {
        const aiData = JSON.parse(r.aiResult);
        Object.keys(aiData).forEach((key) => {
          const [aspect, sentiment] = key.split("_");
          if (sentiment === "Positive") pos++;
          else {
            neg++;
            badAspects.push(aspect);
          }

          if (!aspectCount[aspect]) aspectCount[aspect] = { pos: 0, neg: 0 };
          sentiment === "Positive"
            ? aspectCount[aspect].pos++
            : aspectCount[aspect].neg++;
        });
      }
    });

    const counts = badAspects.reduce(
      (acc, curr) => ({ ...acc, [curr]: (acc[curr] || 0) + 1 }),
      {},
    );
    const sortedBad = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    setStats({ positive: pos, negative: neg, aspects: aspectCount });
    setSuggestions(sortedBad.map((item) => item[0]));
  };

  if (!product)
    return (
      <div className="text-center mt-20 font-bold">
        Đang phân tích dữ liệu...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto mt-10 p-8 mb-20">
      {/* Nút quay lại */}
      <Link
        to="/admin"
        className="text-blue-600 font-bold mb-6 inline-block hover:underline"
      >
        ← Quay lại danh sách
      </Link>

      <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <h2 className="text-3xl font-black text-gray-800 mb-2">
          📊 Insight: {product.name}
        </h2>
        <p className="text-gray-400 text-sm mb-10">
          Dựa trên {reviews.length} đánh giá thực tế từ người dùng
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="p-8 bg-green-500 rounded-3xl text-center text-white shadow-lg shadow-green-100">
            <h3 className="text-xs font-bold uppercase opacity-80">Lời khen</h3>
            <p className="text-6xl font-black mt-2">{stats.positive}</p>
          </div>
          <div className="p-8 bg-red-500 rounded-3xl text-center text-white shadow-lg shadow-red-100">
            <h3 className="text-xs font-bold uppercase opacity-80">Lời chê</h3>
            <p className="text-6xl font-black mt-2">{stats.negative}</p>
          </div>
          <div className="p-8 bg-gray-900 rounded-3xl text-white">
            <h3 className="text-orange-400 font-black text-xs uppercase mb-4 tracking-widest">
              💡 Chiến lược đề xuất
            </h3>
            {suggestions.length > 0 ? (
              <ul className="space-y-3">
                {suggestions.map((item) => (
                  <li key={item} className="text-sm flex items-center">
                    <span className="text-orange-500 mr-2">●</span> Cải thiện{" "}
                    <b className="ml-1 text-orange-200">{item}</b>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-xs italic">
                Chưa phát hiện điểm yếu.
              </p>
            )}
          </div>
        </div>

        {/* Phần biểu đồ và bảng lịch sử giữ nguyên logic cũ nhưng giao diện tối ưu hơn */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-10">
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <h3 className="text-lg font-black mb-6 text-gray-800">
              Phân tích đa khía cạnh (ABSA)
            </h3>
            <div className="space-y-6">
              {Object.entries(stats.aspects).map(([aspect, counts]) => (
                <div key={aspect}>
                  <div className="flex justify-between text-[10px] font-black text-gray-400 mb-2 uppercase">
                    <span>{aspect}</span>
                    <span>
                      {Math.round(
                        (counts.pos / (counts.pos + counts.neg)) * 100,
                      )}
                      % Positive
                    </span>
                  </div>
                  <div className="flex h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      style={{
                        width: `${(counts.pos / (counts.pos + counts.neg)) * 100}%`,
                      }}
                      className="bg-green-500 transition-all duration-1000"
                    ></div>
                    <div
                      style={{
                        width: `${(counts.neg / (counts.pos + counts.neg)) * 100}%`,
                      }}
                      className="bg-red-500 transition-all duration-1000"
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-gray-800 text-white text-[10px] uppercase">
                <tr>
                  <th className="p-4">Khách</th>
                  <th className="p-4">Bình luận</th>
                  <th className="p-4 text-right">AI Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs">
                {reviews.map((r) => (
                  <tr key={r.id} className="hover:bg-blue-50 transition-colors">
                    <td className="p-4 font-bold text-gray-800">
                      {r.fullName}
                    </td>
                    <td className="p-4 text-gray-600 italic">"{r.comment}"</td>
                    <td className="p-4 text-right font-mono text-blue-500 font-bold">
                      Processed
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminInsight;
