import axios from 'axios';

// ====================================================================
// 1. Axios 인스턴스 생성 및 기본 설정
// ====================================================================
const instance = axios.create({
  // .env.local 파일의 NEXT_PUBLIC_API_URL을 기본 URL로 사용
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  // 요청 타임아웃 설정
  timeout: 30000, 
});

// 모든 API 응답을 받기 전 공통 로직 처리 (에러 핸들링 등)
instance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.detail || error.message || '알 수 없는 오류가 발생했습니다.';
    return Promise.reject(new Error(message));
  }
);


// ====================================================================
// 2. API 함수 정의
// ====================================================================

// --------------------------------------------------------------------
// [ Audio / Image Detection ]
// --------------------------------------------------------------------

/**
 * 오디오 딥페이크 분석을 요청합니다.
 * @param {File} audioFile - 분석할 오디오 파일
 * @param {object} options - { threshold, top_db } 같은 쿼리 파라미터
 * @returns {Promise<object>} 분석 결과 데이터
 */
export const analyzeAudio = async (audioFile, options = {}) => {
  const formData = new FormData();
  formData.append('file', audioFile);

  return instance.post('/api/v1/audio-detection/predict', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    params: options,
  });
};

/**
 * 이미지 딥페이크 분석을 요청합니다.
 * @param {File} imageFile - 분석할 이미지 파일
 * @returns {Promise<object>} 분석 결과 데이터
 */
export const analyzeImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('file', imageFile);

  return instance.post('/api/v1/image-detection/predict', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};


// --------------------------------------------------------------------
// [ Prompt Analysis ]
// --------------------------------------------------------------------

/**
 * 프롬프트 보안을 분석합니다.
 * @param {string} prompt - 분석할 프롬프트 문자열
 * @returns {Promise<object>} 분석 결과
 */
export const analyzePrompt = async (prompt) => {
  return instance.post('/api/v1/prompt-analysis/analyze', { prompt });
};


// --------------------------------------------------------------------
// [ MCP Analysis ]
// --------------------------------------------------------------------

/**
 * GitHub 레포지토리를 분석합니다.
 * @param {string} repoUrl - 분석할 GitHub 레포지토리 URL
 * @returns {Promise<object>} 분석 결과
 */
export const analyzeMcpRepository = async (repoUrl) => {
  return instance.post('/api/v1/mcp-analysis/mcp-analysis/repository', { url: repoUrl });
};


// --------------------------------------------------------------------
// [ News Verification ]
// --------------------------------------------------------------------

/**
 * 뉴스 기사 텍스트의 사실 여부를 검증합니다.
 * @param {string} newsText - 검증할 뉴스 기사 본문
 * @returns {Promise<object>} 검증 결과
 */
export const verifyNewsText = async (newsText) => {
  return instance.post('/api/v1/news-verification/verify', { text: newsText });
};

/**
 * 뉴스 기사 URL의 사실 여부를 검증합니다.
 * @param {string} newsUrl - 검증할 뉴스 기사 URL
 * @returns {Promise<object>} 검증 결과
 */
export const verifyNewsUrl = async (newsUrl) => {
  return instance.post('/api/v1/news-verification/verify-url', { url: newsUrl });
};