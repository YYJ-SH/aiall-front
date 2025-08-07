'use client'

import { useState } from 'react';
import { Code, Copy, Download, Wand2, Sparkles } from 'lucide-react';

export default function CursorRulesPage() {
  const [prompt, setPrompt] = useState('');
  const [generatedRules, setGeneratedRules] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateRules = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    // TODO: API 호출로 cursor rules 생성
    // 임시로 샘플 규칙 생성
    setTimeout(() => {
      setGeneratedRules(`// ${prompt}을(를) 위해 생성된 Cursor 규칙

// 프로젝트 구조
- 모든 새 파일에 TypeScript 사용
- 기존의 커밋 메시지 규칙 준수
- 일관된 들여쓰기 유지 (스페이스 2개)

// 코딩 스타일  
- 최신 ES6+ 문법 사용
- 가능한 경우 let보다 const 사용
- 의미 있는 변수명 사용
- 함수에 JSDoc 주석 추가

// React/Next.js 관련
- 훅과 함께 함수형 컴포넌트 사용
- 적절한 에러 경계 구현
- Next.js 13+ app 디렉토리 구조 준수
- 가능한 경우 서버 컴포넌트 사용

// 사용자 프롬프트 기반 맞춤 규칙:
${prompt.split(' ').map(word => `- ${word.toLowerCase()} 모범 사례 준수`).join('\n')}

// 한국어 주석 및 문서화
- 복잡한 로직에는 한국어 주석 추가
- API 문서는 한국어로 작성
- 에러 메시지는 사용자 친화적인 한국어로 표시
`);
      setIsGenerating(false);
    }, 2000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedRules);
  };

  const downloadRules = () => {
    const blob = new Blob([generatedRules], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '.cursorrules';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center float">
              <Code className="h-8 w-8 text-white" />
            </div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 opacity-30 blur-2xl"></div>
            <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-400 animate-pulse" />
          </div>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Cursor 규칙 생성기
          </span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          프로젝트 요구사항에 맞는 맞춤형 Cursor 규칙을 생성합니다
        </p>
      </div>

      {/* Input Section */}
      <div className="card-glass rounded-3xl p-8 mb-8">
        <label className="block text-lg font-bold text-slate-800 mb-4">
          프로젝트 또는 요구사항 설명
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="예: Tailwind CSS를 사용하는 React TypeScript 프로젝트, 접근성과 성능에 중점을 둠..."
          className="w-full h-32 bg-white/70 border border-slate-200 rounded-2xl px-6 py-4 text-slate-800 placeholder-slate-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none transition-all"
        />
        
        <button
          onClick={generateRules}
          disabled={!prompt.trim() || isGenerating}
          className="mt-6 w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed text-white font-semibold rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/25 hover:transform hover:scale-105 flex items-center justify-center gap-3"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              생성 중...
            </>
          ) : (
            <>
              <Wand2 className="h-5 w-5" />
              규칙 생성하기
            </>
          )}
        </button>
      </div>

      {/* Output Section */}
      {generatedRules && (
        <div className="card-glass rounded-3xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-slate-800">생성된 규칙</h3>
            <div className="flex gap-3">
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 card-glass text-slate-700 hover:text-slate-900 font-medium rounded-xl transition-all duration-300 hover:shadow-lg hover:transform hover:scale-105 flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                복사
              </button>
              <button
                onClick={downloadRules}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25 hover:transform hover:scale-105 flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                다운로드
              </button>
            </div>
          </div>
          
          <div className="card-glass rounded-2xl p-6">
            <pre className="text-sm text-slate-700 overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {generatedRules}
            </pre>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="card-glass rounded-3xl p-8">
        <h3 className="text-xl font-bold text-slate-800 mb-6">사용 방법</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">1</span>
              </div>
              <span className="text-slate-700">프로젝트 유형, 기술 스택, 특별한 요구사항을 설명하세요</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">2</span>
              </div>
              <span className="text-slate-700">"규칙 생성하기" 버튼을 클릭하여 맞춤형 Cursor 규칙을 생성하세요</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">3</span>
              </div>
              <span className="text-slate-700">생성된 규칙을 복사하거나 <code className="bg-slate-100 px-2 py-1 rounded text-slate-800">.cursorrules</code> 파일로 다운로드하세요</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">4</span>
              </div>
              <span className="text-slate-700">파일을 프로젝트 루트 디렉토리에 배치하세요</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">5</span>
              </div>
              <span className="text-slate-700">Cursor가 자동으로 이 규칙들을 사용하여 더 나은 코드 지원을 제공합니다</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
