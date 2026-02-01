import axios from 'axios';
import Cookies from 'js-cookie';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('accessToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const errorCode = error.response?.data?.code;

    if (status === 401 || errorCode === 'UNAUTHORIZED') {
      console.warn('인증 토큰이 유효하지 않습니다. 로그아웃 처리합니다.');

      Cookies.remove('accessToken');
      Cookies.remove('memberId');

      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
