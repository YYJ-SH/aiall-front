'use client'

import { useState, useEffect } from 'react';
import { Shield, Code, ScanLine, Volume2, Image as ImageIcon, Terminal, ChevronRight, Play, Pause } from "lucide-react";
import Link from "next/link";

const tools = [
  {
    title: "Cursor 규칙 생성기",
    description: "개발 워크플로 최적화를 위한 맞춤형 Cursor 규칙을 자동 생성합니다",
    icon: Code,
    href: "/cursor-rules",
    status: "운영중",
    color: "blue"
  },
  {
    title: "MCP 보안 스캐너", 
    description: "코드베이스 전체를 스캔하여 보안 취약점을 실시간으로 탐지합니다",
    icon: ScanLine,
    href: "/mcp-scanner",
    status: "운영중",
    color: "cyan"
  },
  {
    title: "음성 딥페이크 탐지기",
    description: "음성 신호 분석을 통해 AI로 생성된 오디오 콘텐츠를 탐지합니다",
    icon: Volume2,
    href: "/deepfake-detector/audio",
    status: "운영중", 
    color: "purple"
  },
  {
    title: "이미지 딥페이크 탐지기",
    description: "컴퓨터 비전 기술로 이미지 조작 및 생성 여부를 검증합니다",
    icon: ImageIcon,
    href: "/deepfake-detector/image",
    status: "운영중",
    color: "pink"
  }
];


export default function Home() {
  const [currentTool, setCurrentTool] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentTool((prev) => (prev + 1) % tools.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const colorMap = {
    blue: "from-blue-500 to-indigo-500",
    cyan: "from-cyan-500 to-blue-500", 
    purple: "from-purple-500 to-pink-500",
    pink: "from-pink-500 to-rose-500"
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="relative min-h-[80vh] flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        </div>
        
        <div className="relative z-10 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 card-glass rounded-full text-sm font-medium text-slate-600 mb-8">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              모든 시스템 정상 운영중
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI-ALL-IN-ONE
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            AI 생성 콘텐츠 탐지와 개발 도구를 한 곳에서 제공하는 통합 플랫폼입니다.
            <br />
            <span className="text-slate-500">실시간 분석 • 다양한 도구 • 쉽고 빠른 사용</span>
          </p>
          
          {/* Landing Video */}
          <div className="mb-12">
            <div className="relative max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-auto"
                onLoadStart={() => console.log('랜딩 비디오 로딩 시작...')}
                onCanPlayThrough={() => console.log('랜딩 비디오 로딩 완료!')}
              >
                <source src="/landingvideo.mp4" type="video/mp4" />
                {/* 비디오 로딩 실패 시 폴백 */}
                <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <div className="text-center text-slate-400">
                    <div className="text-lg">랜딩 비디오 로딩중...</div>
                  </div>
                </div>
              </video>
              
              {/* 비디오 오버레이 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent pointer-events-none"></div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/mcp-scanner" 
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/25 hover:transform hover:scale-105 flex items-center gap-2 justify-center"
            >
              <Terminal className="h-5 w-5" />
              스캔 시작하기
              <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/deepfake-detector/audio" 
              className="group px-8 py-4 card-glass text-slate-700 font-semibold rounded-xl transition-all duration-300 hover:shadow-xl hover:transform hover:scale-105 flex items-center gap-2 justify-center"
            >
              탐지 데모 체험
            </Link>
          </div>
        </div>
      </div>

      {/* Interactive Tool Showcase */}
      <div className="mb-20 mt-32">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">도구 모음</h2>
          <p className="text-slate-600">다양한 AI 도구를 한 번에 사용해보세요</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Tool Preview */}
          <div className="relative">
            <div className="card-glass rounded-2xl p-8 relative overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${colorMap[tools[currentTool].color]} flex items-center justify-center`}>
                    {(() => {
                      const IconComponent = tools[currentTool].icon;
                      return <IconComponent className="h-6 w-6 text-white" />;
                    })()}
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">{tools[currentTool].title}</div>
                    <div className="text-sm text-green-600 font-medium">{tools[currentTool].status}</div>
                  </div>
                </div>
                <button 
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  {isAutoPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>
              </div>
              
              <p className="text-slate-600 mb-6 leading-relaxed">
                {tools[currentTool].description}
              </p>
              
              <Link 
                href={tools[currentTool].href}
                className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${colorMap[tools[currentTool].color]} text-white font-semibold rounded-xl hover:transform hover:scale-105 transition-all duration-300`}
              >
                도구 사용하기
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            
            {/* Progress Indicator */}
            <div className="flex justify-center mt-6 gap-2">
              {tools.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTool(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTool ? 'bg-blue-500 w-8' : 'bg-slate-300'
                  }`}
                />
              ))}
            </div>
          </div>
          
          {/* Tools Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tools.map((tool, index) => {
              const Icon = tool.icon;
              const isActive = index === currentTool;
              
              return (
                <div
                  key={index}
                  onClick={() => setCurrentTool(index)}
                  className={`cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300 ${
                    isActive 
                      ? 'border-blue-200 bg-blue-50/50 transform scale-105' 
                      : 'border-slate-200 bg-white/50 hover:border-slate-300'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${colorMap[tool.color]} flex items-center justify-center mb-4`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="font-semibold text-slate-800 mb-2">{tool.title}</div>
                  <div className="text-sm text-slate-600">{tool.description.split(' ').slice(0, 8).join(' ')}...</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

{/* Research Focus */}
      <div className="text-center">
        <div className="card-glass rounded-3xl p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-slate-800 mb-6">
              다양한 AI 도구 모음
            </h2>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              모두를 위한 유용한 도구들을 한 곳에 모았습니다. 
              다양한 기능을 직관적이고 빠르게 사용해보세요.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">4개</div>
                <div className="text-sm text-slate-600">AI 도구</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">실시간</div>
                <div className="text-sm text-slate-600">처리</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-pink-600">무료</div>
                <div className="text-sm text-slate-600">사용</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-cyan-600">쉽고</div>
                <div className="text-sm text-slate-600">빠른 사용</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
