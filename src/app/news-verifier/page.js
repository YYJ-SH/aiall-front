'use client'

import { useState } from 'react';
import { Newspaper, Link2, FileText, Search, AlertTriangle, CheckCircle, Info, Globe } from 'lucide-react';

export default function NewsVerifierPage() {
  const [activeTab, setActiveTab] = useState('url');
  const [newsUrl, setNewsUrl] = useState('');
  const [newsText, setNewsText] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const verifyNews = async () => {
    setIsVerifying(true);
    
    // TODO: 실제 뉴스 검증 API 호출
    setTimeout(() => {
      const isReliable = Math.random() > 0.4;
      setVerificationResult({
        verdict: isReliable ? 'reliable' : 'questionable', // 'reliable', 'questionable', 'fake'
        confidence: Math.floor(Math.random() * 30) + 70,
        title: activeTab === 'url' ? '속보: 주요 테크 회사, 혁신적인 AI 기술 발표' : '뉴스 기사 분석',
        source: activeTab === 'url' ? 'tech-news-korea.com' : '사용자 제공 텍스트',
        publishDate: new Date().toLocaleDateString('ko-KR'),
        analysis: {
          sourceCredibility: Math.floor(Math.random() * 40) + 60,
          factualAccuracy: Math.floor(Math.random() * 35) + 65,
          biasDetection: Math.floor(Math.random() * 30) + 70,
          languageAnalysis: Math.floor(Math.random() * 25) + 75
        },
        crossReferences: [
          { source: '연합뉴스', status: 'confirmed', url: 'https://yonhapnews.co.kr/tech/example' },
          { source: 'KBS 뉴스', status: 'similar', url: 'https://news.kbs.co.kr/example' },
          { source: 'SBS 뉴스', status: 'not_found', url: null }
        ],
        redFlags: isReliable ? [] : [
          '선정적인 언어 사용 감지',
          '신뢰할 수 있는 출처 인용 부족',
          '감정적 조작 지표 발견'
        ],
        evidence: [
          '여러 신뢰할 수 있는 소스가 주요 사실을 확인했습니다',
          '공식 성명서에서 인용문이 확인되었습니다',
          '타임라인이 다른 검증된 보고서와 일치합니다'
        ],
        recommendations: isReliable 
          ? ['추가 소스와 교차 검증하기', '기사 업데이트 확인하기']
          : ['1차 소스를 통해 검증하기', '팩트체크 웹사이트 확인하기', '공식 성명서 찾아보기']
      });
      setIsVerifying(false);
    }, 4000);
  };

  const getVerdictColor = (verdict) => {
    switch (verdict) {
      case 'reliable': return 'text-emerald-600';
      case 'questionable': return 'text-yellow-600';
      case 'fake': return 'text-red-600';
      default: return 'text-slate-600';
    }
  };

  const getVerdictIcon = (verdict) => {
    switch (verdict) {
      case 'reliable': return <CheckCircle className="h-6 w-6 text-emerald-500" />;
      case 'questionable': return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      case 'fake': return <AlertTriangle className="h-6 w-6 text-red-500" />;
      default: return null;
    }
  };

  const getVerdictBadge = (verdict) => {
    const styles = {
      reliable: 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border border-emerald-200',
      questionable: 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 border border-yellow-200',
      fake: 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border border-red-200'
    };
    
    const labels = {
      reliable: '신뢰 가능',
      questionable: '의심스러움',
      fake: '가짜 뉴스'
    };

    return (
      <div className={`px-6 py-3 rounded-2xl text-sm font-bold ${styles[verdict]}`}>
        {labels[verdict]}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center float">
              <Newspaper className="h-8 w-8 text-white" />
            </div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 opacity-30 blur-2xl"></div>
            <Globe className="absolute -top-2 -right-2 h-6 w-6 text-yellow-400 animate-pulse" />
          </div>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            뉴스 진위 판별기
          </span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          뉴스 기사의 진위성을 상세한 분석과 근거를 통해 검증합니다
        </p>
      </div>

      {/* Tabs */}
      <div className="card-glass rounded-2xl p-1 mb-8">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab('url')}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'url' 
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg' 
                : 'text-slate-600 hover:text-slate-800 hover:bg-white/50'
            }`}
          >
            <Link2 className="h-5 w-5" />
            뉴스 URL
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'text' 
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg' 
                : 'text-slate-600 hover:text-slate-800 hover:bg-white/50'
            }`}
          >
            <FileText className="h-5 w-5" />
            텍스트 붙여넣기
          </button>
        </div>
      </div>

      {/* URL Tab */}
      {activeTab === 'url' && (
        <div className="card-glass rounded-3xl p-8 mb-8">
          <label className="block text-lg font-bold text-slate-800 mb-4">
            뉴스 기사 URL
          </label>
          <div className="flex gap-4">
            <input
              type="url"
              value={newsUrl}
              onChange={(e) => setNewsUrl(e.target.value)}
              placeholder="https://example.com/news-article"
              className="flex-1 bg-white/70 border border-slate-200 rounded-2xl px-6 py-4 text-slate-800 placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
            />
            <button
              onClick={verifyNews}
              disabled={!newsUrl.trim() || isVerifying}
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed text-white font-semibold rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/25 hover:transform hover:scale-105 flex items-center gap-3"
            >
              {isVerifying ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  검증 중...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  기사 검증
                </>
              )}
            </button>
          </div>
          
          <div className="mt-6 card-glass rounded-2xl p-4">
            <div className="text-sm text-slate-600 space-y-1">
              <p className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                대부분의 주요 뉴스 웹사이트를 지원합니다
              </p>
              <p className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                소스 신뢰도와 교차 검증 분석이 포함됩니다
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Text Tab */}
      {activeTab === 'text' && (
        <div className="card-glass rounded-3xl p-8 mb-8">
          <label className="block text-lg font-bold text-slate-800 mb-4">
            뉴스 기사 텍스트
          </label>
          <textarea
            value={newsText}
            onChange={(e) => setNewsText(e.target.value)}
            placeholder="분석할 뉴스 기사 전문을 여기에 붙여넣으세요..."
            className="w-full h-64 bg-white/70 border border-slate-200 rounded-2xl px-6 py-4 text-slate-800 placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 resize-none transition-all"
          />
          
          <button
            onClick={verifyNews}
            disabled={!newsText.trim() || isVerifying}
            className="mt-6 w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed text-white font-semibold rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/25 hover:transform hover:scale-105 flex items-center justify-center gap-3"
          >
            {isVerifying ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                분석 중...
              </>
            ) : (
              <>
                <Search className="h-5 w-5" />
                텍스트 분석
              </>
            )}
          </button>
        </div>
      )}

      {/* Verification Results */}
      {verificationResult && (
        <div className="space-y-8">
          {/* Result Header */}
          <div className="card-glass rounded-3xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                  verificationResult.verdict === 'reliable' ? 'bg-gradient-to-r from-emerald-500 to-teal-500' :
                  verificationResult.verdict === 'questionable' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                  'bg-gradient-to-r from-red-500 to-pink-500'
                }`}>
                  {getVerdictIcon(verificationResult.verdict)}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-800">검증 완료</h3>
                  <p className={`text-lg font-semibold ${getVerdictColor(verificationResult.verdict)}`}>
                    신뢰도: {verificationResult.confidence}%
                  </p>
                </div>
              </div>
              {getVerdictBadge(verificationResult.verdict)}
            </div>

            <div className="space-y-2">
              <h4 className="text-xl font-bold text-slate-800">{verificationResult.title}</h4>
              <div className="flex items-center gap-6 text-sm text-slate-600">
                <span className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  출처: {verificationResult.source}
                </span>
                <span>게시일: {verificationResult.publishDate}</span>
              </div>
            </div>
          </div>

          {/* Analysis Metrics */}
          <div className="card-glass rounded-3xl p-8">
            <h4 className="text-xl font-bold text-slate-800 mb-6">분석 세부사항</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(verificationResult.analysis).map(([key, value]) => {
                const labels = {
                  sourceCredibility: '소스 신뢰도',
                  factualAccuracy: '사실 정확성',
                  biasDetection: '편향 탐지',
                  languageAnalysis: '언어 분석'
                };
                return (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-700 font-medium">
                        {labels[key] || key}
                      </span>
                      <span className="text-sm font-bold text-slate-800">{value}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-1000 ${
                          value >= 80 ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 
                          value >= 60 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 
                          'bg-gradient-to-r from-red-500 to-pink-500'
                        }`}
                        style={{ width: `${value}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cross References */}
          <div className="card-glass rounded-3xl p-8">
            <h4 className="text-xl font-bold text-slate-800 mb-6">교차 검증 소스</h4>
            <div className="space-y-4">
              {verificationResult.crossReferences.map((ref, index) => (
                <div key={index} className="flex items-center justify-between p-4 card-glass rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${
                      ref.status === 'confirmed' ? 'bg-emerald-500' :
                      ref.status === 'similar' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <span className="font-bold text-slate-800">{ref.source}</span>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      ref.status === 'confirmed' ? 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700' :
                      ref.status === 'similar' ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700' :
                      'bg-gradient-to-r from-red-100 to-pink-100 text-red-700'
                    }`}>
                      {ref.status === 'confirmed' ? '확인됨' : 
                       ref.status === 'similar' ? '유사함' : '찾을 수 없음'}
                    </span>
                  </div>
                  {ref.url && (
                    <a 
                      href={ref.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                    >
                      소스 보기
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Red Flags & Evidence */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Red Flags */}
            {verificationResult.redFlags && verificationResult.redFlags.length > 0 && (
              <div className="card-glass rounded-3xl p-8">
                <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                  경고 신호
                </h4>
                <ul className="space-y-3">
                  {verificationResult.redFlags.map((flag, index) => (
                    <li key={index} className="flex items-start gap-3 text-slate-700">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      {flag}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Evidence */}
            <div className="card-glass rounded-3xl p-8">
              <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-emerald-500" />
                지원 근거
              </h4>
              <ul className="space-y-3">
                {verificationResult.evidence.map((evidence, index) => (
                  <li key={index} className="flex items-start gap-3 text-slate-700">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                    {evidence}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommendations */}
          <div className="card-glass rounded-3xl p-8">
            <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Info className="h-6 w-6 text-blue-500" />
              권장사항
            </h4>
            <ul className="space-y-3">
              {verificationResult.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start gap-3 text-slate-700">
                  <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  {recommendation}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="mt-12 card-glass rounded-3xl p-8">
        <h3 className="text-xl font-bold text-slate-800 mb-6">검증 프로세스</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                <Globe className="h-4 w-4 text-white" />
              </div>
              소스 분석
            </h4>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                도메인 신뢰도 검사
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                발행 이력
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                편집 기준
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                편향성 평가
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
              콘텐츠 검증
            </h4>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                교차 참조 확인
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                사실 검증
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                인용문 검증
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                타임라인 일관성
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <FileText className="h-4 w-4 text-white" />
              </div>
              언어 분석
            </h4>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                감정적 조작
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                선정적 언어
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                논리적 오류
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                클릭베이트 지표
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
