import { NextRequest, NextResponse } from 'next/server';

// 백엔드 API 서버 URL (환경 변수로 설정)
const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    // FormData에서 오디오 파일 추출
    const formData = await request.formData();
    const audioFile = formData.get('audio_file') as File;

    if (!audioFile) {
      return NextResponse.json(
        { detail: '오디오 파일이 제공되지 않았습니다.' },
        { status: 400 }
      );
    }

    // 파일 형식 검증
    const allowedTypes = ['.mp3', '.wav', '.flac', '.m4a'];
    const fileExtension = audioFile.name.toLowerCase();
    const isValidType = allowedTypes.some(type => fileExtension.endsWith(type));

    if (!isValidType) {
      return NextResponse.json(
        { detail: '지원되지 않는 오디오 형식입니다. mp3, wav, flac, m4a만 지원됩니다.' },
        { status: 400 }
      );
    }

    // 파일 크기 검증 (50MB)
    if (audioFile.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { detail: '파일 크기가 너무 큽니다. 최대 50MB까지 지원됩니다.' },
        { status: 400 }
      );
    }

    // 백엔드 서버로 파일 전송을 위한 FormData 생성
    const backendFormData = new FormData();
    backendFormData.append('audio_file', audioFile);

    // 백엔드 API 호출
    const response = await fetch(`${BACKEND_API_URL}/api/audio-deepfake/detect`, {
      method: 'POST',
      body: backendFormData,
      headers: {
        // Content-Type은 FormData 사용 시 자동으로 설정됩니다
      },
    });

    if (!response.ok) {
      let errorMessage = `백엔드 서버 오류 (${response.status})`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorMessage;
      } catch {
        // JSON 파싱 실패 시 기본 메시지 사용
      }

      return NextResponse.json(
        { detail: errorMessage },
        { status: response.status }
      );
    }

    // 백엔드에서 받은 응답을 그대로 클라이언트에 전달
    const result = await response.json();
    
    return NextResponse.json(result);

  } catch (error) {
    console.error('오디오 딥페이크 탐지 API 오류:', error);
    
    // 네트워크 오류 또는 서버 연결 실패 처리
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json(
        { detail: '백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { detail: '서버 내부 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// OPTIONS 메서드 지원 (CORS 프리플라이트 요청)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
