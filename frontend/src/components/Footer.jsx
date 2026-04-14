const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-20">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <h3 className="text-2xl font-black mb-4">ViSentiment</h3>
          <p className="text-gray-400 max-w-sm">
            Hệ thống phân tích cảm xúc khách hàng ứng dụng trí tuệ nhân tạo.
            Giải pháp tối ưu cho doanh nghiệp thương mại điện tử 4.0.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-4 uppercase text-sm tracking-widest text-orange-500">
            Liên hệ
          </h4>
          <ul className="text-gray-400 space-y-2 text-sm">
            <li>Email: huy.methai@vti.com.vn</li>
            <li>Địa chỉ: Quận 7, TP. Hồ Chí Minh</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4 uppercase text-sm tracking-widest text-orange-500">
            Dự án
          </h4>
          <ul className="text-gray-400 space-y-2 text-sm">
            <li>React + Spring Boot</li>
            <li>FastAPI AI Service</li>
            <li>MySQL Railway</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-xs">
        © 2026 Mè Thái Huy - Backend Intern Project. All rights reserved.
      </div>
    </footer>
  );
};
export default Footer;
