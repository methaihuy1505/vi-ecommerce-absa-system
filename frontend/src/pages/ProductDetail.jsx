import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/useAuth"; // Đồng bộ dùng Auth mới
import { apiFetch } from "../utils/api";
import { productImages } from "../utils/constants";

const ProductDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");
  const [analyzedResult, setAnalyzedResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load thông tin sản phẩm và danh sách review cũ
  useEffect(() => {
    // 1. Lấy chi tiết sản phẩm
    apiFetch(`/products/${id}`)
      .then((data) => setProduct(data))
      .catch((err) => console.error(err));

    // 2. Lấy danh sách review của sản phẩm này
    apiFetch(`/reviews/product/${id}`)
      .then((data) => setReviews(data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleSubmit = async () => {
    if (!user) return alert("Vui lòng đăng nhập để bình luận!");
    if (!comment.trim()) return;

    setLoading(true);
    try {
      const data = await apiFetch("/reviews", {
        method: "POST",
        body: JSON.stringify({ userId: user.id, productId: id, comment }),
      });

      setAnalyzedResult(
        data.aiResult !== "{}" ? JSON.parse(data.aiResult) : null,
      );
      setComment("");

      // Cập nhật lại danh sách review mới ngay lập tức
      setReviews([data, ...reviews]);
    } catch (error) {
      alert(error.message);
    }
    setLoading(false);
  };

  if (!product)
    return <div className="text-center mt-10">Đang tải sản phẩm...</div>;

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4 grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* CỘT TRÁI: THÔNG TIN SẢN PHẨM */}
      <div className="md:col-span-1">
        <div className="sticky top-20 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="w-full h-64 rounded-xl mb-6 overflow-hidden shadow-inner">
            <img
              src={
                productImages[product.id] ||
                "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&q=80"
              }
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-2xl font-black text-gray-800 mb-2">
            {product.name}
          </h2>
          <p className="text-red-500 text-3xl font-black mb-4">
            {product.price.toLocaleString()} đ
          </p>
          <div className="text-gray-600 text-sm leading-relaxed mb-6">
            <h4 className="font-bold text-gray-800 uppercase text-xs mb-2">
              Mô tả chi tiết:
            </h4>
            {product.description}
          </div>
          <button className="w-full py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 shadow-lg">
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>

      {/* CỘT PHẢI: BÌNH LUẬN & AI */}
      <div className="md:col-span-2">
        {/* Ô nhập bình luận */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">💬</span> Chia sẻ cảm nhận của bạn
          </h3>
          <textarea
            rows="3"
            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all"
            placeholder="Ví dụ: Laptop chạy rất nhanh, nhưng màn hình hơi tối..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-4 px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:bg-gray-400 transition-all cursor-pointer shadow-md"
          >
            {loading ? "AI đang phân tích..." : "Gửi đánh giá"}
          </button>

          {analyzedResult && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl animate-pulse">
              <p className="text-sm font-bold text-blue-800 mb-2">
                🚀 Kết quả phân tích AI:
              </p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(analyzedResult).map(([key, val]) => (
                  <span
                    key={key}
                    className={`text-xs px-2 py-1 rounded-md font-bold ${key.includes("Positive") ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
                  >
                    {key.split("_")[0]}: {key.split("_")[1]} ({val}%)
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Danh sách bình luận cũ */}
        <h3 className="text-xl font-bold mb-4 text-gray-800">
          Đánh giá từ khách hàng ({reviews.length})
        </h3>
        <div className="space-y-4">
          {reviews.length === 0 && (
            <p className="text-gray-400 italic">
              Chưa có bình luận nào cho sản phẩm này.
            </p>
          )}
          {reviews.map((r) => (
            <div
              key={r.id}
              className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-blue-600">{r.fullName}</span>
                <span className="text-xs text-gray-400">
                  {new Date(r.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700 mb-3">{r.comment}</p>
              {/* Hiển thị tag AI nhỏ bên dưới mỗi comment */}
              <div className="flex flex-wrap gap-1">
                {r.aiResult &&
                  r.aiResult !== "{}" &&
                  Object.keys(JSON.parse(r.aiResult)).map((tag) => (
                    <span
                      key={tag}
                      className={`text-[10px] uppercase px-1.5 py-0.5 rounded font-black ${tag.includes("Positive") ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"}`}
                    >
                      #{tag}
                    </span>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default ProductDetail;
