import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../utils/api";
import { Search, Filter, TrendingUp, Clock } from "lucide-react";
import { productImages } from '../utils/constants';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");

  useEffect(() => {
    apiFetch("/products")
      .then((data) => setProducts(data))
      .catch((err) => console.error("Lỗi:", err));
  }, []);

  // Xử lý lọc dữ liệu ngay tại Client để demo nhanh
  const filteredProducts = products.filter((p) => {
    const matchName = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (priceFilter === "low") return matchName && p.price < 5000000;
    if (priceFilter === "mid")
      return matchName && p.price >= 5000000 && p.price <= 20000000;
    if (priceFilter === "high") return matchName && p.price > 20000000;
    return matchName;
  });

  const featuredProducts = [...filteredProducts]
    .sort((a, b) => b.price - a.price)
    .slice(0, 3);
  const latestProducts = [...filteredProducts].reverse().slice(0, 6);

  return (
    <div className="pb-20">
      {/* 1. HERO SECTION */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-20 px-4 text-center">
        <h1 className="text-5xl font-black mb-4 animate-fade-in">
          Mua Sắm & Trải Nghiệm AI
        </h1>
        <p className="text-xl text-blue-100 max-w-2xl mx-auto opacity-80">
          Hệ thống tích hợp ABSA giúp bạn thấu hiểu đánh giá của cộng đồng về
          sản phẩm.
        </p>
      </div>

      <div className="container mx-auto px-4 -mt-10">
        {/* 2. SEARCH & FILTER BAR */}
        <div className="bg-white p-4 rounded-2xl shadow-xl flex flex-col md:flex-row gap-4 items-center mb-12">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm công nghệ..."
              className="w-full pl-10 pr-4 py-2 border border-gray-100 bg-gray-50 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="text-gray-400" size={20} />
            <select
              className="bg-gray-50 border-none p-2 rounded-xl font-bold text-gray-600 outline-none cursor-pointer"
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
            >
              <option value="all">Tất cả mức giá</option>
              <option value="low">Dưới 5 triệu</option>
              <option value="mid">5 - 20 triệu</option>
              <option value="high">Trên 20 triệu</option>
            </select>
          </div>
        </div>

        {/* 3. FEATURED SECTION */}
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-8">
            <TrendingUp className="text-orange-500" />
            <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">
              Sản phẩm cao cấp
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} p={p} featured={true} />
            ))}
          </div>
        </section>

        {/* 4. LATEST SECTION */}
        <section>
          <div className="flex items-center gap-2 mb-8">
            <Clock className="text-blue-500" />
            <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">
              Mới cập bến
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestProducts.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

// Component con cho gọn code
// Cấu hình ảnh Demo khớp với 10 ID sản phẩm trong DB


const ProductCard = ({ p, featured = false }) => {
  // Nếu thêm sản phẩm mới mà chưa có ảnh, nó sẽ lấy ảnh mặc định này
  const imgUrl = productImages[p.id] || "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&q=80";

  return (
    <div className={`group bg-white rounded-3xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-2xl flex flex-col ${featured ? 'ring-2 ring-orange-100' : 'shadow-sm'}`}>
      <div className="h-48 overflow-hidden bg-gray-50">
        <img 
          src={imgUrl} 
          alt={p.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">{p.name}</h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{p.description}</p>
        <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-50">
          <span className="text-xl font-black text-red-500">{p.price.toLocaleString()}đ</span>
          <Link 
            to={`/product/${p.id}`} 
            className="bg-gray-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-600 transition-all shadow-md"
          >
            Chi tiết
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
