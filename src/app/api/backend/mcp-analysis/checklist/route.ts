import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';

// 체크리스트를 백엔드에서 가져오기
export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/mcp-analysis/checklist`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: `HTTP ${response.status}` }));
      return NextResponse.json(
        { error: errorData.detail || '백엔드 서버 오류가 발생했습니다' },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);

  } catch (error) {
    console.error('Backend checklist error:', error);
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      // 백엔드 서버 연결 실패 시 기본 체크리스트 반환
      return NextResponse.json({
        checklist: [
          "인증 및 권한 관리",
          "입력 검증",
          "출력 인코딩", 
          "에러 처리",
          "로깅 및 모니터링",
          "암호화 사용",
          "세션 관리",
          "파일 업로드 보안",
          "SQL 인젝션 방지",
          "XSS 방지"
        ]
      });
    }

    return NextResponse.json(
      { error: '체크리스트 조회 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
