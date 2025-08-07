import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';

// GitHub 저장소 분석을 백엔드로 프록시
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(`${BACKEND_URL}/api/v1/mcp-analysis/repository`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
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
    console.error('Backend repository analysis error:', error);
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json(
        { error: '백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: '분석 요청 처리 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
