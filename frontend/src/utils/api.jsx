const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const apiFetch = async (endpoint, options = {}) => {
  // Lấy thông tin user để setup Auth Header (chuẩn bị cho JWT sau này)
  const user = JSON.parse(localStorage.getItem('user'));
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Nếu sau này Backend dùng JWT Token, nó sẽ tự động chèn vào đây
  if (user && user.token) {
    headers['Authorization'] = `Bearer ${user.token}`;
  }

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    // Backend Spring Boot của chúng ta trả về lỗi dạng text (ResponseEntity.badRequest().body(...))
    const errorMsg = await response.text();
    throw new Error(errorMsg || 'Lỗi kết nối đến Server!');
  }

  // Parse JSON an toàn (phòng hờ API trả về rỗng)
  const text = await response.text();
  return text ? JSON.parse(text) : {};
};