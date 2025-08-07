import { Shield, Code, ScanLine, Volume2, Image as ImageIcon, Newspaper, Bot, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

const features = [
  {
    title: "Cursor 규칙 생성기",
    description: "프롬프트를 기반으로 개발 워크플로를 위한 맞춤형 Cursor 규칙을 생성합니다",
    icon: Code,
    href: "/cursor-rules",
    gradient: "from-blue-500 to-indigo-500",
    shadowColor: "shadow-blue-500/20"
  },
  {
    title: "MCP 보안 스캐너",
    description: "GitHub 저장소와 코드를 분석하여 잠재적인 보안 취약점을 탐지합니다",
    icon: ScanLine,
    href: "/mcp-scanner",
    gradient: "from-cyan-500 to-blue-500",
    shadowColor: "shadow-cyan-500/20"
  },
  {
    title: "음성 딥페이크 탐지기",
    description: "음성 파일을 업로드하여 AI로 생성되거나 조작된 음성 콘텐츠를 탐지합니다",
    icon: Volume2,
    href: "/deepfake-detector/audio",
    gradient: "from-purple-500 to-pink-500",
    shadowColor: "shadow-purple-500/20"
  },
  {
    title: "이미지 딥페이크 탐지기",
    description: "이미지에서 AI 조작 및 딥페이크 생성의 흔적을 분석합니다",
    icon: ImageIcon,
    href: "/deepfake-detector/image",
    gradient: "from-pink-500 to-rose-500",
    shadowColor: "shadow-pink-500/20"
  },
  {
    title: "뉴스 진위 판별기",
    description: "뉴스 기사의 진위성을 상세한 분석과 근거를 통해 검증합니다",
    icon: Newspaper,
    href: "/news-verifier",
    gradient: "from-emerald-500 to-teal-500",
    shadowColor: "shadow-emerald-500/20"
  },
  {
    title: "AI 에이전트 컨설턴트",
    description: "고급 분석 도구를 통해 전문적인 AI 컨설팅을 제공합니다",
    icon: Bot,
    href: "/ai-consultant",
    gradient: "from-orange-500 to-yellow-500",
    shadowColor: "shadow-orange-500/20"
  }
];

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-20 relative">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8">
          <div className="w-32 h-32 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="flex justify-center mb-8 relative">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center transform rotate-3 float">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 opacity-30 blur-2xl transform rotate-3"></div>
            <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-400 animate-pulse" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-7xl font-bold mb-6 relative">
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent leading-tight">
            AI 보안 도구 모음
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto mb-10 leading-relaxed">
          AI 시대를 위한 포괄적인 보안 및 검증 도구입니다. <br />
          <span className="font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            딥페이크 탐지, 콘텐츠 진위성 검증, 코드 보안 검사
          </span>를 통해 안전을 보장하세요.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/cursor-rules" 
            className="group px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/25 hover:transform hover:scale-105 flex items-center gap-2 justify-center"
          >
            시작하기 
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            href="/mcp-scanner" 
            className="group px-8 py-4 card-glass text-slate-700 font-semibold rounded-2xl transition-all duration-300 hover:shadow-xl hover:transform hover:scale-105 flex items-center gap-2 justify-center"
          >
            스캐너 체험하기
            <ScanLine className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          
          return (
            <Link
              key={index}
              href={feature.href}
              className={`group card-glass p-8 rounded-3xl transition-all duration-500 hover:transform hover:scale-105 hover:-translate-y-2 relative overflow-hidden ${feature.shadowColor} hover:shadow-2xl`}
            >
              {/* Background Decoration */}
              <div className={`absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br ${feature.gradient} opacity-10 rounded-full blur-xl group-hover:opacity-20 transition-opacity duration-500`}></div>
              
              <div className="relative z-10">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <Icon className="h-7 w-7 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-slate-600 leading-relaxed mb-4 group-hover:text-slate-700 transition-colors">
                  {feature.description}
                </p>
                
                <div className="flex items-center text-sm font-medium text-slate-500 group-hover:text-indigo-600 transition-colors">
                  도구 실행 
                  <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Stats Section with Glassmorphism */}
      <div className="card-glass rounded-3xl p-8 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl blur-xl"></div>
            <div className="relative z-10 p-6">
              <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">6개</div>
              <div className="text-slate-600 font-medium">보안 도구</div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl blur-xl"></div>
            <div className="relative z-10 p-6">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">24/7</div>
              <div className="text-slate-600 font-medium">상시 이용 가능</div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl blur-xl"></div>
            <div className="relative z-10 p-6">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">100%</div>
              <div className="text-slate-600 font-medium">프라이버시 우선</div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center relative">
        <div className="card-glass rounded-3xl p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-blue-500/5"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
              지금 바로 시작하세요
            </h2>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              AI 시대의 보안 위험으로부터 보호받으세요. 
              모든 도구를 무료로 체험해보실 수 있습니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/cursor-rules"
                className="group px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/25 hover:transform hover:scale-105 flex items-center gap-2 justify-center"
              >
                무료 체험하기
                <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform" />
              </Link>
              <Link 
                href="/deepfake-detector/audio"
                className="px-8 py-4 card-glass text-slate-700 font-semibold rounded-2xl transition-all duration-300 hover:shadow-xl hover:transform hover:scale-105"
              >
                딥페이크 탐지 시작
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
