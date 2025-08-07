'use client'

import { useState, useRef } from 'react';
import { Bot, Upload, FileText, Network, Settings, BarChart3, Shield, Zap } from 'lucide-react';

export default function AIConsultantPage() {
  const [activeTab, setActiveTab] = useState('pcap');
  const [files, setFiles] = useState([]);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      const validFiles = droppedFiles.filter(file => {
        if (activeTab === 'pcap') {
          return file.name.endsWith('.pcap') || file.name.endsWith('.pcapng');
        } else {
          return file.name.endsWith('.env') || file.name.endsWith('.config');
        }
      });
      
      setFiles(prev => [...prev, ...validFiles]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const analyzeFiles = async () => {
    if (files.length === 0) return;
    
    setIsAnalyzing(true);
    
    // TODO: 실제 AI 컨설팅 분석 API 호출
    setTimeout(() => {
      const riskLevel = Math.random() > 0.5 ? 'high' : 'medium';
      setAnalysisResult({
        riskLevel,
        overallScore: Math.floor(Math.random() * 40) + 60,
        findings: {
          security: {
            vulnerabilities: Math.floor(Math.random() * 10) + 5,
            criticalIssues: Math.floor(Math.random() * 3) + 1,
            recommendations: Math.floor(Math.random() * 15) + 10
          },
          network: activeTab === 'pcap' ? {
            suspiciousConnections: Math.floor(Math.random() * 20) + 5,
            dataLeakage: Math.random() > 0.7,
            unusualTraffic: Math.floor(Math.random() * 8) + 2
          } : null,
          configuration: activeTab === 'env' ? {
            exposedSecrets: Math.floor(Math.random() * 5) + 1,
            misconfiguredServices: Math.floor(Math.random() * 8) + 3,
            complianceIssues: Math.floor(Math.random() * 6) + 2
          } : null
        },
        insights: [
          '다수의 노출된 API 엔드포인트가 감지되었습니다',
          '취약한 암호화 프로토콜이 사용 중입니다',
          '접근 제어가 불충분하게 구성되어 있습니다',
          '잠재적 데이터 유출 패턴이 발견되었습니다'
        ],
        recommendations: [
          {
            priority: 'high',
            category: '보안',
            description: '모든 서비스에 다단계 인증을 구현하세요',
            impact: '계정 침해 위험을 99.9% 감소시킵니다'
          },
          {
            priority: 'medium',
            category: '네트워크',
            description: '불필요한 아웃바운드 연결을 제한하도록 방화벽 규칙을 업데이트하세요',
            impact: '잠재적 데이터 유출을 방지합니다'
          },
          {
            priority: 'low',
            category: '구성',
            description: '정기적인 보안 감사 및 구성 검토를 실시하세요',
            impact: '시간이 지나도 보안 수준을 유지합니다'
          }
        ]
      });
      setIsAnalyzing(false);
    }, 6000);
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'low': return 'text-emerald-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-slate-600';
    }
  };

  const getRiskBadge = (level) => {
    const styles = {
      low: 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border border-emerald-200',
      medium: 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 border border-yellow-200',
      high: 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border border-red-200'
    };

    const labels = {
      low: '낮은 위험',
      medium: '중간 위험',
      high: '높은 위험'
    };

    return (
      <div className={`px-4 py-2 rounded-2xl text-sm font-bold ${styles[level]}`}>
        {labels[level]}
      </div>
    );
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-400 bg-gradient-to-r from-red-50 to-pink-50';
      case 'medium': return 'border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50';
      case 'low': return 'border-emerald-400 bg-gradient-to-r from-emerald-50 to-teal-50';
      default: return 'border-slate-400 bg-gradient-to-r from-slate-50 to-gray-50';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-orange-500 to-yellow-500 flex items-center justify-center float">
              <Bot className="h-8 w-8 text-white" />
            </div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500 to-yellow-500 opacity-30 blur-2xl"></div>
            <Zap className="absolute -top-2 -right-2 h-6 w-6 text-blue-400 animate-pulse" />
          </div>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
            AI 에이전트 컨설턴트
          </span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          고급 AI 기반 보안 분석 및 컨설팅을 제공합니다
        </p>
      </div>

      {/* Tabs */}
      <div className="card-glass rounded-2xl p-1 mb-8">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab('pcap')}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'pcap' 
                ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg' 
                : 'text-slate-600 hover:text-slate-800 hover:bg-white/50'
            }`}
          >
            <Network className="h-5 w-5" />
            네트워크 분석 (PCAP)
          </button>
          <button
            onClick={() => setActiveTab('env')}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'env' 
                ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg' 
                : 'text-slate-600 hover:text-slate-800 hover:bg-white/50'
            }`}
          >
            <Settings className="h-5 w-5" />
            구성 파일
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - File Upload */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upload Section */}
          <div className="card-glass rounded-3xl p-8">
            <div
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                dragActive 
                  ? 'border-orange-400 bg-gradient-to-r from-orange-50 to-yellow-50' 
                  : 'border-slate-300 hover:border-orange-300 hover:bg-gradient-to-r hover:from-orange-50/50 hover:to-yellow-50/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-orange-100 to-yellow-100 flex items-center justify-center mx-auto">
                  <Upload className="h-10 w-10 text-orange-600" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-2xl blur-xl"></div>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">
                {activeTab === 'pcap' ? '네트워크 캡처 파일 업로드' : '구성 파일 업로드'}
              </h3>
              <p className="text-slate-600 mb-6">
                {activeTab === 'pcap' 
                  ? '네트워크 분석을 위해 Wireshark PCAP 파일을 드롭하세요'
                  : '보안 검토를 위해 .env, config 파일을 드롭하세요'
                }
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/25 hover:transform hover:scale-105"
              >
                파일 선택
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={activeTab === 'pcap' ? '.pcap,.pcapng' : '.env,.config,.ini,.conf'}
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="mt-6 text-sm text-slate-500 space-y-1">
                {activeTab === 'pcap' 
                  ? (
                    <>
                      <p>지원 형식: .pcap, .pcapng</p>
                      <p>최대 파일 크기: 100MB</p>
                    </>
                  ) : (
                    <>
                      <p>지원 형식: .env, .config, .ini, .conf</p>
                      <p>최대 파일 크기: 10MB</p>
                    </>
                  )
                }
              </div>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="mt-8">
                <h4 className="text-xl font-bold text-slate-800 mb-4">업로드된 파일</h4>
                <div className="space-y-3">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-4 card-glass rounded-2xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">{file.name}</div>
                          <div className="text-sm text-slate-600">{formatFileSize(file.size)}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        제거
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={analyzeFiles}
                  disabled={isAnalyzing}
                  className="mt-6 w-full px-8 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed text-white font-semibold rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/25 hover:transform hover:scale-105 flex items-center justify-center gap-3"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      분석 중...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="h-5 w-5" />
                      분석 시작
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Analysis Results - Extended view */}
          {analysisResult && (
            <div className="space-y-6">
              {/* Key Insights */}
              <div className="card-glass rounded-3xl p-8">
                <h3 className="text-xl font-bold text-slate-800 mb-6">주요 인사이트</h3>
                <div className="space-y-4">
                  {analysisResult.insights.map((insight, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 card-glass rounded-2xl">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Shield className="h-4 w-4 text-white" />
                      </div>
                      <p className="text-slate-700 leading-relaxed">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="card-glass rounded-3xl p-8">
                <h3 className="text-xl font-bold text-slate-800 mb-6">실행 권장사항</h3>
                <div className="space-y-4">
                  {analysisResult.recommendations.map((rec, index) => (
                    <div key={index} className={`p-6 rounded-2xl border-l-4 ${getPriorityColor(rec.priority)}`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-slate-800">{rec.category}</span>
                          {getRiskBadge(rec.priority)}
                        </div>
                      </div>
                      <p className="text-slate-700 mb-2 leading-relaxed">{rec.description}</p>
                      <p className="text-sm text-slate-600">영향: {rec.impact}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Quick Stats */}
        <div className="space-y-6">
          {analysisResult ? (
            <>
              {/* Risk Overview */}
              <div className="card-glass rounded-3xl p-8">
                <h3 className="text-xl font-bold text-slate-800 mb-6">위험 평가</h3>
                <div className="text-center mb-6">
                  <div className={`text-4xl font-bold mb-3 ${getRiskColor(analysisResult.riskLevel)}`}>
                    {analysisResult.overallScore}/100
                  </div>
                  {getRiskBadge(analysisResult.riskLevel)}
                </div>
              </div>

              {/* Security Metrics */}
              <div className="card-glass rounded-3xl p-8">
                <h4 className="text-xl font-bold text-slate-800 mb-6">보안 발견사항</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl border border-red-200">
                    <span className="text-slate-700 font-medium">취약점</span>
                    <span className="text-red-600 font-bold text-lg">
                      {analysisResult.findings.security.vulnerabilities}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl border border-red-200">
                    <span className="text-slate-700 font-medium">심각한 문제</span>
                    <span className="text-red-600 font-bold text-lg">
                      {analysisResult.findings.security.criticalIssues}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-200">
                    <span className="text-slate-700 font-medium">권장사항</span>
                    <span className="text-blue-600 font-bold text-lg">
                      {analysisResult.findings.security.recommendations}
                    </span>
                  </div>
                </div>
              </div>

              {/* Network Stats (PCAP only) */}
              {analysisResult.findings.network && (
                <div className="card-glass rounded-3xl p-8">
                  <h4 className="text-xl font-bold text-slate-800 mb-6">네트워크 분석</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200">
                      <span className="text-slate-700 font-medium">의심스러운 연결</span>
                      <span className="text-yellow-600 font-bold text-lg">
                        {analysisResult.findings.network.suspiciousConnections}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl border border-slate-200">
                      <span className="text-slate-700 font-medium">데이터 유출</span>
                      <span className={`font-bold text-lg ${
                        analysisResult.findings.network.dataLeakage ? 'text-red-600' : 'text-emerald-600'
                      }`}>
                        {analysisResult.findings.network.dataLeakage ? '감지됨' : '없음'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl border border-orange-200">
                      <span className="text-slate-700 font-medium">비정상 트래픽</span>
                      <span className="text-orange-600 font-bold text-lg">
                        {analysisResult.findings.network.unusualTraffic} 패턴
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Configuration Stats (ENV only) */}
              {analysisResult.findings.configuration && (
                <div className="card-glass rounded-3xl p-8">
                  <h4 className="text-xl font-bold text-slate-800 mb-6">구성 검토</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl border border-red-200">
                      <span className="text-slate-700 font-medium">노출된 비밀</span>
                      <span className="text-red-600 font-bold text-lg">
                        {analysisResult.findings.configuration.exposedSecrets}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200">
                      <span className="text-slate-700 font-medium">잘못된 구성</span>
                      <span className="text-yellow-600 font-bold text-lg">
                        {analysisResult.findings.configuration.misconfiguredServices}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl border border-orange-200">
                      <span className="text-slate-700 font-medium">컴플라이언스 문제</span>
                      <span className="text-orange-600 font-bold text-lg">
                        {analysisResult.findings.configuration.complianceIssues}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Placeholder */
            <div className="card-glass rounded-3xl p-8 text-center">
              <Bot className="h-16 w-16 text-slate-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-slate-600 mb-4">
                분석 준비 완료
              </h3>
              <p className="text-slate-500 leading-relaxed">
                AI 기반 보안 컨설팅을 시작하려면 파일을 업로드하세요
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-12 card-glass rounded-3xl p-8">
        <h3 className="text-xl font-bold text-slate-800 mb-6">분석 기능</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                <Network className="h-4 w-4 text-white" />
              </div>
              네트워크 분석 (PCAP)
            </h4>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span>트래픽 패턴 분석</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span>악성 연결 탐지</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span>데이터 유출 패턴</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span>프로토콜 이상 탐지</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span>위협 인텔리전스 연관 분석</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                <Settings className="h-4 w-4 text-white" />
              </div>
              구성 검토
            </h4>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                <span>비밀 노출 탐지</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                <span>보안 구성 오류 감사</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                <span>컴플라이언스 검사</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                <span>모범 사례 검증</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                <span>위험도 우선순위 지정</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
