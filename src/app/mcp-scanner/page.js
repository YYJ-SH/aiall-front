'use client'

import { useState } from 'react';
import { ScanLine, AlertTriangle, CheckCircle, Github, Upload, Code, Shield, Star, GitFork, Calendar, FileText } from 'lucide-react';

export default function MCPScannerPage() {
  const [activeTab, setActiveTab] = useState('github');
  const [githubUrl, setGithubUrl] = useState('');
  const [codeInput, setCodeInput] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');

  const scanGithubRepo = async () => {
    if (!githubUrl.trim()) return;
    
    setIsScanning(true);
    setError('');
    
    try {
      const response = await fetch('/api/mcp-analysis/repository', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          repository_url: githubUrl,
          branch: 'main'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setScanResult(result);
    } catch (error) {
      console.error('GitHub 분석 오류:', error);
      setError(error.message || 'GitHub 저장소 분석 중 오류가 발생했습니다.');
    } finally {
      setIsScanning(false);
    }
  };

  const scanUploadedFiles = async () => {
    if (selectedFiles.length === 0) return;
    
    setIsScanning(true);
    setError('');
    
    try {
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch('/api/mcp-analysis/files', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setScanResult(result);
    } catch (error) {
      console.error('파일 분석 오류:', error);
      setError(error.message || '파일 분석 중 오류가 발생했습니다.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    setError('');
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getStatusColor = (status) => {
    if (scanResult?.safe) return 'text-emerald-600';
    if (scanResult?.summary?.risk_level === 'high') return 'text-red-600';
    if (scanResult?.summary?.risk_level === 'medium') return 'text-yellow-600';
    return 'text-slate-600';
  };

  const getStatusIcon = (status) => {
    if (scanResult?.safe) return <CheckCircle className="h-6 w-6 text-emerald-500" />;
    if (scanResult?.summary?.risk_level === 'high') return <AlertTriangle className="h-6 w-6 text-red-500" />;
    if (scanResult?.summary?.risk_level === 'medium') return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
    return <Shield className="h-6 w-6 text-slate-500" />;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
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
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center float">
              <ScanLine className="h-8 w-8 text-white" />
            </div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 opacity-30 blur-2xl"></div>
            <Shield className="absolute -top-2 -right-2 h-6 w-6 text-yellow-400 animate-pulse" />
          </div>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            MCP 보안 스캐너
          </span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          GitHub 저장소와 파일을 분석하여 잠재적인 보안 취약점을 실시간으로 탐지합니다
        </p>
      </div>

      {/* Tabs */}
      <div className="card-glass rounded-2xl p-1 mb-8">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab('github')}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'github' 
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg' 
                : 'text-slate-600 hover:text-slate-800 hover:bg-white/50'
            }`}
          >
            <Github className="h-5 w-5" />
            GitHub 저장소
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'files' 
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg' 
                : 'text-slate-600 hover:text-slate-800 hover:bg-white/50'
            }`}
          >
            <Upload className="h-5 w-5" />
            파일 업로드
          </button>
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

      {/* GitHub Tab */}
      {activeTab === 'github' && (
        <div className="card-glass rounded-3xl p-8 mb-8">
          <label className="block text-lg font-bold text-slate-800 mb-4">
            GitHub 저장소 URL
          </label>
          <div className="flex gap-4">
            <input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/사용자명/저장소명"
              className="flex-1 bg-white/70 border border-slate-200 rounded-2xl px-6 py-4 text-slate-800 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition-all"
            />
            <button
              onClick={scanGithubRepo}
              disabled={!githubUrl.trim() || isScanning}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed text-white font-semibold rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/25 hover:transform hover:scale-105 flex items-center gap-3"
            >
              {isScanning ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  분석 중...
                </>
              ) : (
                <>
                  <ScanLine className="h-5 w-5" />
                  저장소 분석
                </>
              )}
            </button>
          </div>
          
          <div className="mt-6 card-glass rounded-2xl p-4">
            <div className="text-sm text-slate-600 space-y-1">
              <p className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                공개 저장소를 지원합니다
              </p>
              <p className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                Python, JavaScript, TypeScript 파일을 자동으로 분석합니다
              </p>
              <p className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                최대 10개 파일까지 분석합니다
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Files Tab */}
      {activeTab === 'files' && (
        <div className="card-glass rounded-3xl p-8 mb-8">
          <label className="block text-lg font-bold text-slate-800 mb-4">
            파일 업로드
          </label>
          <input
            type="file"
            multiple
            accept=".py,.js,.ts,.json,.txt"
            onChange={handleFileChange}
            className="mb-6 w-full bg-white/70 border border-slate-200 rounded-2xl px-6 py-4 text-slate-800 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-cyan-500 file:to-blue-500 file:text-white hover:file:shadow-lg transition-all"
          />
          
          {selectedFiles.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-bold text-slate-800 mb-4">선택된 파일</h4>
              <div className="space-y-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 card-glass rounded-xl">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-cyan-600" />
                      <span className="font-medium text-slate-800">{file.name}</span>
                      <span className="text-sm text-slate-500">({formatFileSize(file.size)})</span>
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
            </div>
          )}

          <button
            onClick={scanUploadedFiles}
            disabled={selectedFiles.length === 0 || isScanning}
            className="w-full px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed text-white font-semibold rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/25 hover:transform hover:scale-105 flex items-center justify-center gap-3"
          >
            {isScanning ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                분석 중...
              </>
            ) : (
              <>
                <ScanLine className="h-5 w-5" />
                파일 분석
              </>
            )}
          </button>
        </div>
      )}

      {/* Scan Results */}
      {scanResult && (
        <div className="space-y-8">
          {/* Repository Info */}
          {scanResult.repository_info && (
            <div className="card-glass rounded-3xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                    scanResult.safe 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500' 
                      : scanResult.summary?.risk_level === 'high'
                      ? 'bg-gradient-to-r from-red-500 to-pink-500'
                      : 'bg-gradient-to-r from-yellow-500 to-orange-500'
                  }`}>
                    {getStatusIcon()}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800">{scanResult.repository_info.name}</h3>
                    <p className={`text-lg font-semibold ${getStatusColor()}`}>
                      보안 점수: {scanResult.security_score}/100
                    </p>
                    {scanResult.repository_info.description && (
                      <p className="text-slate-600 mt-1">{scanResult.repository_info.description}</p>
                    )}
                  </div>
                </div>
                <div className={`px-6 py-3 rounded-2xl text-sm font-bold ${
                  scanResult.safe 
                    ? 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border border-emerald-200' 
                    : scanResult.summary?.risk_level === 'high'
                    ? 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border border-red-200'
                    : 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 border border-yellow-200'
                }`}>
                  {scanResult.safe ? '안전' : 
                   scanResult.summary?.risk_level === 'high' ? '높은 위험' :
                   scanResult.summary?.risk_level === 'medium' ? '중간 위험' : '낮은 위험'}
                </div>
              </div>

              {/* Repository Stats */}
              {scanResult.repository_info.full_name && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="card-glass rounded-2xl p-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm text-slate-600">스타</span>
                    </div>
                    <div className="text-xl font-bold text-slate-800">{scanResult.repository_info.stars || 0}</div>
                  </div>
                  <div className="card-glass rounded-2xl p-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <GitFork className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-slate-600">포크</span>
                    </div>
                    <div className="text-xl font-bold text-slate-800">{scanResult.repository_info.forks || 0}</div>
                  </div>
                  <div className="card-glass rounded-2xl p-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-slate-600">분석된 파일</span>
                    </div>
                    <div className="text-xl font-bold text-slate-800">{scanResult.repository_info.files_analyzed}</div>
                  </div>
                  <div className="card-glass rounded-2xl p-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Code className="h-4 w-4 text-purple-500" />
                      <span className="text-sm text-slate-600">언어</span>
                    </div>
                    <div className="text-sm font-bold text-slate-800">{scanResult.repository_info.language || 'Mixed'}</div>
                  </div>
                </div>
              )}

              {/* Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="card-glass rounded-2xl p-4">
                  <div className="text-sm text-slate-600 mb-1">총 문제</div>
                  <div className="text-2xl font-bold text-slate-800">{scanResult.summary?.total_issues || 0}</div>
                </div>
                <div className="card-glass rounded-2xl p-4">
                  <div className="text-sm text-slate-600 mb-1">심각한 문제</div>
                  <div className="text-2xl font-bold text-red-600">{scanResult.summary?.critical_issues || 0}</div>
                </div>
                <div className="card-glass rounded-2xl p-4">
                  <div className="text-sm text-slate-600 mb-1">스캔된 파일</div>
                  <div className="text-2xl font-bold text-slate-800">{scanResult.summary?.files_scanned || 0}</div>
                </div>
                <div className="card-glass rounded-2xl p-4">
                  <div className="text-sm text-slate-600 mb-1">위험 수준</div>
                  <div className={`text-lg font-bold ${getStatusColor()}`}>
                    {scanResult.summary?.risk_level || 'Unknown'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pattern Analysis */}
          {scanResult.pattern_analysis && Object.keys(scanResult.pattern_analysis).length > 0 && (
            <div className="card-glass rounded-3xl p-8">
              <h4 className="text-xl font-bold text-slate-800 mb-6">패턴 분석 결과</h4>
              <div className="space-y-6">
                {Object.entries(scanResult.pattern_analysis).map(([category, patterns]) => {
                  if (!patterns || patterns.length === 0) return null;
                  
                  return (
                    <div key={category} className="card-glass rounded-2xl p-6">
                      <h5 className="font-bold text-slate-800 mb-4 capitalize">
                        {category.replace(/_/g, ' ')} ({patterns.length}개)
                      </h5>
                      <div className="space-y-3">
                        {patterns.slice(0, 5).map((pattern, index) => (
                          <div key={index} className={`p-4 rounded-xl border-l-4 ${
                            pattern.severity === 'high' ? 'border-red-400 bg-gradient-to-r from-red-50 to-pink-50' :
                            pattern.severity === 'medium' ? 'border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50' :
                            'border-blue-400 bg-gradient-to-r from-blue-50 to-cyan-50'
                          }`}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-bold text-slate-800">{pattern.pattern}</span>
                              <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                                pattern.severity === 'high' ? 'bg-red-100 text-red-700' :
                                pattern.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-blue-100 text-blue-700'
                              }`}>
                                {pattern.severity}
                              </span>
                            </div>
                            <div className="text-sm text-slate-600">{pattern.file}</div>
                            {pattern.line_count && (
                              <div className="text-xs text-slate-500 mt-1">{pattern.line_count}회 발견</div>
                            )}
                          </div>
                        ))}
                        {patterns.length > 5 && (
                          <div className="text-center text-sm text-slate-500">
                            +{patterns.length - 5}개 더 발견됨
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {scanResult.recommendations && scanResult.recommendations.length > 0 && (
            <div className="card-glass rounded-3xl p-8">
              <h4 className="text-xl font-bold text-slate-800 mb-6">보안 권장사항</h4>
              <ul className="space-y-4">
                {scanResult.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start gap-3 text-slate-700">
                    <CheckCircle className="h-5 w-5 text-cyan-500 mt-0.5 flex-shrink-0" />
                    <span className="leading-relaxed">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* LLM Analysis */}
          {scanResult.llm_analysis && (
            <div className="card-glass rounded-3xl p-8">
              <h4 className="text-xl font-bold text-slate-800 mb-6">AI 분석 결과</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(scanResult.llm_analysis).map(([key, value]) => {
                  const labels = {
                    code_quality: '코드 품질',
                    security_posture: '보안 상태',
                    compliance_status: '컴플라이언스',
                    risk_level: '위험 수준',
                    maintainability: '유지보수성'
                  };
                  
                  return (
                    <div key={key} className="card-glass rounded-2xl p-4">
                      <div className="text-sm text-slate-600 mb-2">{labels[key] || key}</div>
                      <div className={`text-lg font-bold capitalize ${
                        value === 'excellent' || value === 'secure' || value === 'compliant' ? 'text-emerald-600' :
                        value === 'good' || value === 'simple' ? 'text-blue-600' :
                        value === 'fair' || value === 'moderate' || value === 'needs_improvement' ? 'text-yellow-600' :
                        value === 'poor' || value === 'vulnerable' || value === 'non_compliant' || value === 'high' ? 'text-red-600' :
                        'text-slate-600'
                      }`}>
                        {value}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Help Section */}
      <div className="mt-12 card-glass rounded-3xl p-8">
        <h3 className="text-xl font-bold text-slate-800 mb-6">검사 항목</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-white" />
              </div>
              보안 위험 요소
            </h4>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                위험한 함수 호출 (eval, exec)
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                시스템 명령 실행
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                안전하지 않은 네트워크 요청
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                파일 시스템 접근
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                SQL 인젝션 취약점
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
              보안 모범 사례
            </h4>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                입력 검증 및 Sanitization
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                적절한 오류 처리
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                암호화 및 해싱 사용
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                로깅 및 모니터링
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                인증 및 권한 관리
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}