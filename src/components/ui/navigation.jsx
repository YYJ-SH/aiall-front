'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { 
  Shield, 
  Code, 
  ScanLine, 
  Volume2, 
  Image as ImageIcon, 
  Newspaper, 
  Bot,
  Menu,
  X
} from 'lucide-react'

const navigationItems = [
  {
    name: '홈',
    href: '/',
    icon: Shield,
    description: 'AI 보안 대시보드',
    gradient: 'from-indigo-500 to-purple-500'
  },
  {
    name: 'Cursor 규칙',
    href: '/cursor-rules',
    icon: Code,
    description: 'Cursor 규칙 생성',
    gradient: 'from-blue-500 to-indigo-500'
  },
  {
    name: 'MCP 스캐너',
    href: '/mcp-scanner',
    icon: ScanLine,
    description: 'MCP 보안 검사',
    gradient: 'from-cyan-500 to-blue-500'
  },
  {
    name: '음성 딥페이크',
    href: '/deepfake-detector/audio',
    icon: Volume2,
    description: '음성 딥페이크 탐지',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    name: '이미지 딥페이크',
    href: '/deepfake-detector/image',
    icon: ImageIcon,
    description: '이미지 딥페이크 탐지',
    gradient: 'from-pink-500 to-rose-500'
  },
  {
    name: '뉴스 검증',
    href: '/news-verifier',
    icon: Newspaper,
    description: '뉴스 진위 판별',
    gradient: 'from-emerald-500 to-teal-500'
  },
  {
    name: 'AI 컨설턴트',
    href: '/ai-consultant',
    icon: Bot,
    description: 'AI 에이전트 컨설팅',
    gradient: 'from-orange-500 to-yellow-500'
  }
]

export function Navigation() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex fixed left-0 top-0 h-full w-64 z-40">
        <div className="glass w-full flex flex-col m-4 rounded-2xl overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20 blur-lg"></div>
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  AI 보안 도구
                </h1>
                <p className="text-xs text-slate-500">Security Suite</p>
              </div>
            </div>
          </div>
          
          <div className="flex-1 px-4 pb-4 overflow-y-auto">
            <ul className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-r ' + item.gradient + ' text-white shadow-lg transform scale-[1.02]'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 hover:shadow-md hover:transform hover:scale-[1.01]'
                      }`}
                    >
                      <div className={`relative p-2 rounded-lg ${
                        isActive 
                          ? 'bg-white/20' 
                          : 'bg-slate-100/50 group-hover:bg-white/80'
                      } transition-all duration-300`}>
                        <Icon className={`h-4 w-4 ${
                          isActive ? 'text-white' : 'text-slate-600 group-hover:text-slate-800'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium text-sm truncate ${
                          isActive ? 'text-white' : 'text-slate-700 group-hover:text-slate-900'
                        }`}>{item.name}</div>
                        <div className={`text-xs truncate ${
                          isActive ? 'text-white/80' : 'text-slate-500 group-hover:text-slate-600'
                        }`}>{item.description}</div>
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        {/* Mobile Header */}
        <header className="fixed top-0 left-0 right-0 z-50">
          <div className="glass m-2 rounded-xl px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  AI 보안 도구
                </span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg btn-glass transition-all duration-200"
              >
                {isMobileMenuOpen ? 
                  <X className="h-5 w-5 text-slate-600" /> : 
                  <Menu className="h-5 w-5 text-slate-600" />
                }
              </button>
            </div>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
            <nav className="fixed left-2 right-2 top-20 bottom-2 glass rounded-2xl p-4 overflow-y-auto">
              <ul className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 ${
                          isActive
                            ? 'bg-gradient-to-r ' + item.gradient + ' text-white shadow-lg'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 hover:shadow-md'
                        }`}
                      >
                        <div className={`relative p-2 rounded-lg ${
                          isActive 
                            ? 'bg-white/20' 
                            : 'bg-slate-100/50 group-hover:bg-white/80'
                        } transition-all duration-300`}>
                          <Icon className={`h-4 w-4 ${
                            isActive ? 'text-white' : 'text-slate-600 group-hover:text-slate-800'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className={`font-medium ${
                            isActive ? 'text-white' : 'text-slate-700 group-hover:text-slate-900'
                          }`}>{item.name}</div>
                          <div className={`text-xs ${
                            isActive ? 'text-white/80' : 'text-slate-500 group-hover:text-slate-600'
                          }`}>{item.description}</div>
                        </div>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </div>
        )}
      </div>
    </>
  )
}
