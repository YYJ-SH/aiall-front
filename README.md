# AI 보안 도구 통합 플랫폼

현대적인 글래스모피즘 디자인을 적용한 AI 기반 보안 분석 도구 모음입니다.

## 🚀 주요 기능

### 🔧 Cursor 규칙 생성기
- 프로젝트별 맞춤형 Cursor IDE 규칙 자동 생성
- TypeScript, React, Next.js 등 다양한 기술 스택 지원
- `.cursorrules` 파일 다운로드 기능

### 🛡️ MCP 보안 스캐너
- **GitHub 저장소 실시간 분석**: 공개 저장소의 보안 취약점 자동 탐지
- **파일 업로드 분석**: Python, JavaScript, TypeScript 파일 직접 업로드 분석
- **고급 패턴 분석**: 위험한 함수 호출, 시스템 명령 실행, SQL 인젝션 등 탐지
- **AI 기반 위험도 평가**: 머신러닝을 활용한 종합적인 보안 점수 산출
- **실행 가능한 권장사항**: 구체적이고 실용적인 보안 개선 가이드 제공

### 🎵 음성 딥페이크 탐지기
- AI 생성 음성 및 조작된 오디오 콘텐츠 식별
- 스펙트럼 분석, 시간적 일관성 검사
- MP3, WAV, M4A, FLAC 형식 지원

### 🖼️ 이미지 딥페이크 탐지기
- AI 조작 이미지 및 딥페이크 사진 탐지
- 얼굴 일관성, 조명 패턴, 압축 아티팩트 분석
- 의심 영역 시각적 표시 기능

### 📰 뉴스 진위 판별기
- 뉴스 기사의 신뢰성 검증
- 교차 참조 및 소스 신뢰도 분석
- 편향성 및 감정적 조작 탐지

### 🤖 AI 에이전트 컨설턴트
- 네트워크 트래픽 분석 (PCAP 파일)
- 구성 파일 보안 검토
- 종합적인 보안 컨설팅 리포트

## 🛠️ 기술 스택

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, 글래스모피즘 디자인
- **Icons**: Lucide React
- **API**: Next.js App Router API Routes
- **외부 API**: GitHub API, 자체 보안 분석 엔진

## 📦 설치 및 실행

```bash
# 저장소 클론
git clone <repository-url>
cd aiall-front

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env.local
# .env.local 파일에서 필요한 설정 수정

# 개발 서버 실행
npm run dev
```

## 🔑 환경 변수 설정

```env
# GitHub API 토큰 (선택사항 - 공개 저장소는 토큰 없이도 접근 가능)
GITHUB_TOKEN=your_github_token_here

# Next.js 환경 설정
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### GitHub 토큰 생성 방법
1. GitHub Settings > Developer settings > Personal access tokens
2. "Generate new token (classic)" 클릭
3. 필요한 권한 선택 (공개 저장소 읽기용)
4. 생성된 토큰을 `.env.local`에 추가

## 🔐 MCP 보안 스캐너 API

### 📡 API 엔드포인트

#### 1. GitHub 저장소 분석
```http
POST /api/mcp-analysis/repository
Content-Type: application/json

{
  "repository_url": "https://github.com/owner/repo",
  "branch": "main",
  "specific_files": ["optional", "file", "paths"]
}
```

#### 2. 파일 업로드 분석
```http
POST /api/mcp-analysis/files
Content-Type: multipart/form-data

files: [File objects]
```

#### 3. 보안 체크리스트 조회
```http
GET /api/mcp-analysis/checklist
```

#### 4. 서비스 상태 확인
```http
GET /api/mcp-analysis/health
```

### 📊 분석 결과 구조

```json
{
  "repository_info": {
    "name": "저장소명",
    "description": "저장소 설명",
    "language": "주요 언어",
    "stars": "스타 수",
    "files_analyzed": "분석된 파일 수"
  },
  "security_score": 85,
  "safe": true,
  "summary": {
    "total_issues": 5,
    "critical_issues": 0,
    "risk_level": "low"
  },
  "pattern_analysis": {
    "dangerous_imports": [],
    "network_calls": [],
    "file_operations": []
  },
  "recommendations": [
    "구체적인 보안 개선 권장사항들"
  ]
}
```

## 🎨 디자인 시스템

### 색상 팔레트
- **Cursor 규칙**: 블루-인디고 그라디언트
- **MCP 스캐너**: 시안-블루 그라디언트  
- **음성 딥페이크**: 퍼플-핑크 그라디언트
- **이미지 딥페이크**: 핑크-로즈 그라디언트
- **뉴스 검증**: 에메랄드-틸 그라디언트
- **AI 컨설턴트**: 오렌지-옐로우 그라디언트

### 글래스모피즘 효과
- 반투명 배경 (`backdrop-blur`)
- 부드러운 그림자와 테두리
- 라이트 모드 최적화된 색상 시스템

## 🔍 보안 분석 기능

### 패턴 탐지
- **위험 함수**: eval, exec, os.system, subprocess
- **네트워크 호출**: requests, fetch, socket 접근
- **파일 작업**: 무분별한 파일 읽기/쓰기
- **SQL 작업**: 인젝션 취약점 패턴
- **환경 변수**: 민감 정보 노출 위험

### AI 분석 지표
- **코드 품질**: excellent, good, fair, poor
- **보안 상태**: secure, needs_improvement, vulnerable
- **컴플라이언스**: compliant, non_compliant
- **위험 수준**: low, medium, high

## 📋 보안 체크리스트

### 주요 검사 항목
1. **인증 및 권한 관리**
2. **입력 검증 및 Sanitization**
3. **출력 인코딩**
4. **에러 처리**
5. **로깅 및 모니터링**
6. **암호화 사용**
7. **세션 관리**
8. **파일 업로드 보안**
9. **SQL 인젝션 방지**
10. **XSS 방지**

## 🚀 배포

```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 확인
npm start
```

## 📖 사용 가이드

### MCP 스캐너 사용법
1. **GitHub 분석**: 저장소 URL 입력 후 "저장소 분석" 클릭
2. **파일 업로드**: 로컬 파일 선택 후 "파일 분석" 클릭
3. **결과 해석**: 보안 점수, 위험 요소, 권장사항 확인
4. **개선 작업**: 제시된 권장사항에 따라 보안 강화

### 지원 파일 형식
- **코드 파일**: .py, .js, .ts, .json
- **설정 파일**: .env, .config, .ini
- **기타**: .txt (텍스트 기반 설정)

## 🤝 기여 방법

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 라이선스

MIT License

## 🆘 지원

문제가 발생하면 GitHub Issues를 통해 신고해주세요.

---

**개발자**: AI 보안 도구 팀  
**버전**: 1.0.0  
**마지막 업데이트**: 2024년 12월
