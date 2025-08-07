import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';

// 백엔드 서버 상태 확인
export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/mcp-analysis/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // 타임아웃 설정 (5초)
      signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: `HTTP ${response.status}` }));
      return NextResponse.json(
        { 
          status: "unhealthy", 
          service: "mcp-analysis-backend",
          error: errorData.detail || '백엔드 서버 응답 오류',
          backend_status: response.status
        },
        { status: response.status }
      );
    }

    const result = await response.json();
    
    // 백엔드 응답에 프론트엔드 정보 추가
    return NextResponse.json({
      ...result,
      frontend: {
        status: "healthy",
        service: "nextjs-frontend",
        backend_url: BACKEND_URL,
        connected_to_backend: true
      }
    });

  } catch (error) {
    console.error('Backend health check error:', error);
    
    let errorMessage = '백엔드 서버 상태 확인 실패';
    let statusCode = 503;

    if (error instanceof TypeError && error.message.includes('fetch')) {
      errorMessage = '백엔드 서버에 연결할 수 없습니다';
    } else if (error.name === 'TimeoutError') {
      errorMessage = '백엔드 서버 응답 시간 초과';
    }

    return NextResponse.json(
      { 
        status: "unhealthy", 
        service: "mcp-analysis-backend",
        error: errorMessage,
        backend_url: BACKEND_URL,
        connected_to_backend: false,
        frontend: {
          status: "healthy",
          service: "nextjs-frontend"
        }
      },
      { status: statusCode }
    );
  }
}
