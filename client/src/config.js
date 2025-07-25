// client/src/config.js

// Xác định URL cơ sở cho API dựa trên môi trường
const getConfig = () => {
  // Trong môi trường phát triển (local)
  if (process.env.NODE_ENV === 'development') {
    return {
      API_BASE_URL: 'http://localhost:5000' // URL local của backend
    };
  }

  // Trong môi trường production (trên Vercel)
  // Sử dụng biến môi trường REACT_APP_API_URL nếu có, nếu không fallback về URL Render thực tế
  return {
    API_BASE_URL: process.env.REACT_APP_API_URL || 'https://job-connect-backend-zfb2.onrender.com'
  };
};

const config = getConfig();

export default config;