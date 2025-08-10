// app/your-route/page.js
'use client';

import { Code, Download, Wand2, Sparkles, AlertTriangle } from 'lucide-react';
import  {usePromptAnalysis}  from '@/hooks/usePromptAnalysis'; // 경로가 다르면 수정하세요
import  {AnalysisResult}  from '@/components/ui/AnalysisResult'; // 경로가 다르면 수정하세요

export default function CursorRulesPage() {
  const {
    prompt,
    setPrompt,
    analysisResult,
    isGenerating,
    isDownloading,
    error,
    copiedStates,
    generateRules,
    downloadFiles,
    downloadCursorRules,
    copyToClipboard,
  } = usePromptAnalysis();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
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
          AI 기반 프롬프트 분석으로 보안 가이드라인과 Cursor 규칙을 생성합니다
        </p>
      </div>

      {/* Input Section */}
      <div className="card-glass rounded-3xl p-8 mb-8">
        <label htmlFor="prompt-input" className="block text-lg font-bold text-slate-800 mb-4">
          프로젝트 또는 요구사항 설명
        </label>
        <textarea
          id="prompt-input"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="예: Tailwind CSS를 사용하는 React TypeScript 프로젝트, 접근성과 성능에 중점을 둠. 사용자 인증과 결제 시스템을 포함하며, 보안이 중요함..."
          className="w-full h-32 bg-white/70 border border-slate-200 rounded-2xl px-6 py-4 text-slate-800 placeholder-slate-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none transition-all"
        />
        
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <button
            onClick={generateRules}
            disabled={!prompt.trim() || isGenerating}
            className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed text-white font-semibold rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/25 hover:transform hover:scale-105 flex items-center justify-center gap-3"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                분석 중...
              </>
            ) : (
              <>
                <Wand2 className="h-5 w-5" />
                AI 분석 시작
              </>
            )}
          </button>
          
          {analysisResult && (
            <button
              onClick={downloadFiles}
              disabled={isDownloading}
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed text-white font-semibold rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/25 hover:transform hover:scale-105 flex items-center justify-center gap-3"
            >
              {isDownloading ? (
                 <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  생성 중...
                </>
              ) : (
                <>
                  <Download className="h-5 w-5" />
                  전체 파일 다운로드
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-8 p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl text-red-700">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Analysis Results */}
      {analysisResult && (
        <AnalysisResult
          result={analysisResult}
          onCopy={copyToClipboard}
          onDownloadCursorRules={downloadCursorRules}
          copiedStates={copiedStates}
        />
      )}

      {/* Instructions */}
       <div className="mt-12 card-glass rounded-3xl p-8">
        <h3 className="text-xl font-bold text-slate-800 mb-6">사용 방법</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            {[
              "프로젝트 유형, 기술 스택, 보안 요구사항을 자세히 설명하세요",
              "AI가 프롬프트를 분석하여 보안 가이드라인과 Cursor 규칙을 생성합니다",
              "생성된 `.cursorrules` 파일을 프로젝트 루트에 배치하세요"
            ].map((text, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">{index + 1}</span>
                </div>
                <span className="text-slate-700">{text}</span>
              </div>
            ))}
          </div>
          <div className="space-y-4">
             {[
              "보안 가이드라인을 참고하여 안전한 개발을 진행하세요",
              "전체 파일 다운로드로 `security_guidance.md`와 `.cursorrules`를 함께 받으세요"
            ].map((text, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">{index + 4}</span>
                </div>
                <span className="text-slate-700" dangerouslySetInnerHTML={{ __html: text.replace(/`([^`]+)`/g, '<code class="bg-slate-100 px-2 py-1 rounded text-slate-800">$1</code>') }}></span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl">
          <h4 className="font-bold text-slate-800 mb-3">🔍 주요 AI 분석 기능</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
            <div>
              <strong>• RAG 기반 취약점 검색:</strong> 최신 보안 데이터베이스 활용<br/>
              <strong>• LLM 심층 분석:</strong> 컨텍스트 기반 맞춤형 가이드라인<br/>
              <strong>• 패키지 자동 감지:</strong> 기술 스택별 특화 규칙
            </div>
            <div>
              <strong>• 보안 체크리스트:</strong> 단계별 검증 가이드<br/>
              <strong>• 실무 중심:</strong> 실제 개발 환경에 적용 가능<br/>
              <strong>• 지속 업데이트:</strong> 최신 보안 트렌드 반영
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}