'use client'

import { useState } from 'react';
import { ScanLine, AlertTriangle, CheckCircle, Github, Upload, Code, Shield, Star, GitFork, Calendar, FileText, XCircle, AlertCircle } from 'lucide-react';

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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const response = await fetch(`${apiUrl}api/v1/mcp-analysis/mcp-analysis/repository`, 
        {
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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch(`${apiUrl}api/v1/mcp-analysis/mcp-analysis/files`, {
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

  const getStatusColor = () => {
    if (scanResult?.safe) return 'text-emerald-600';
    if (scanResult?.llm_analysis?.위험도 === 'critical') return 'text-red-600';
    if (scanResult?.summary?.high_issues > 0) return 'text-red-600';
    if (scanResult?.summary?.medium_issues > 0) return 'text-yellow-600';
    return 'text-slate-600';
  };

  const getStatusIcon = () => {
    if (scanResult?.safe) return <CheckCircle className="h-6 w-6 text-emerald-500" />;
    if (scanResult?.llm_analysis?.위험도 === 'critical') return <XCircle className="h-6 w-6 text-red-500" />;
    if (scanResult?.summary?.high_issues > 0) return <AlertTriangle className="h-6 w-6 text-red-500" />;
    if (scanResult?.summary?.medium_issues > 0) return <AlertCircle className="h-6 w-6 text-yellow-500" />;
    return <Shield className="h-6 w-6 text-slate-500" />;
  };

  const getStatusText = () => {
    if (scanResult?.safe) return '안전';
    if (scanResult?.llm_analysis?.위험도 === 'critical') return '치명적 위험';
    if (scanResult?.summary?.high_issues > 0) return '높은 위험';
    if (scanResult?.summary?.medium_issues > 0) return '중간 위험';
    return '낮은 위험';
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

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return 'border-red-400 bg-gradient-to-r from-red-50 to-pink-50';
      case 'medium':
        return 'border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50';
      case 'low':
        return 'border-blue-400 bg-gradient-to-r from-blue-50 to-cyan-50';
      default:
        return 'border-slate-400 bg-gradient-to-r from-slate-50 to-gray-50';
    }
  };

  const getSeverityBadgeColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-700';
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
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
        {/* Overview */}
        <div className="card-glass rounded-3xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                scanResult.safe 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500' 
                  : 'bg-gradient-to-r from-red-500 to-pink-500'
              }`}>
                {scanResult.safe ? (
                  <CheckCircle className="h-8 w-8 text-white" />
                ) : (
                  <AlertTriangle className="h-8 w-8 text-white" />
                )}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-800">분석 결과</h3>
                <span className="text-lg font-semibold text-slate-600">
                  보안 점수: {scanResult.security_score}/100
                </span>
              </div>
            </div>
            <div className={`px-6 py-3 rounded-2xl text-sm font-bold ${
              scanResult.safe 
                ? 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border border-emerald-200' 
                : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border border-red-200'
            }`}>
              {scanResult.safe ? '안전' : '위험'}
            </div>
          </div>

          {/* Summary Stats */}
          {scanResult.summary && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="card-glass rounded-2xl p-4">
                <div className="text-sm text-slate-600 mb-1">치명적 문제</div>
                <div className="text-2xl font-bold text-red-600">{scanResult.summary.critical_issues}</div>
              </div>
              <div className="card-glass rounded-2xl p-4">
                <div className="text-sm text-slate-600 mb-1">높은 위험</div>
                <div className="text-2xl font-bold text-red-600">{scanResult.summary.high_issues}</div>
              </div>
              <div className="card-glass rounded-2xl p-4">
                <div className="text-sm text-slate-600 mb-1">중간 위험</div>
                <div className="text-2xl font-bold text-yellow-600">{scanResult.summary.medium_issues}</div>
              </div>
              <div className="card-glass rounded-2xl p-4">
                <div className="text-sm text-slate-600 mb-1">경고</div>
                <div className="text-2xl font-bold text-blue-600">{scanResult.summary.warnings}</div>
              </div>
            </div>
          )}
        </div>

        {/* Overall Assessment */}
        {scanResult.overall_assessment && (
          <div className="card-glass rounded-3xl p-8">
            <h4 className="text-xl font-bold text-slate-800 mb-6">전체 평가</h4>
            <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl p-6 border-l-4 border-blue-400">
              <pre className="whitespace-pre-wrap text-slate-700 leading-relaxed font-sans">
                {scanResult.overall_assessment}
              </pre>
            </div>
          </div>
        )}

        {/* Checklist Results */}
        {scanResult.checklist_results && (
          <div className="card-glass rounded-3xl p-8">
            <h4 className="text-xl font-bold text-slate-800 mb-6">상세 검사 결과</h4>
            <div className="space-y-6">
              {Object.entries(scanResult.checklist_results).map(([categoryKey, category]) => (
                <div key={categoryKey} className="card-glass rounded-2xl p-6">
                  <h5 className="font-bold text-slate-800 mb-4">{category.name}</h5>
                  <div className="space-y-3">
                    {category.items.map((item, index) => (
                      <div key={index} className={`p-4 rounded-xl border-l-4 ${
                        item.status === 'pass' ? 'border-green-400 bg-gradient-to-r from-green-50 to-emerald-50' :
                        item.status === 'warning' ? 'border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50' :
                        'border-red-400 bg-gradient-to-r from-red-50 to-pink-50'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-slate-800">{item.name}</span>
                          <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                            item.status === 'pass' ? 'bg-green-100 text-green-700' :
                            item.status === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                        {item.details && (
                          <div className="text-sm text-slate-600 mb-2">{item.details}</div>
                        )}
                        {item.evidence && item.evidence.length > 0 && (
                          <div className="text-xs text-slate-500">
                            증거: {item.evidence.join(', ')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pattern Analysis */}
        {scanResult.pattern_analysis && (
          <div className="card-glass rounded-3xl p-8">
            <h4 className="text-xl font-bold text-slate-800 mb-6">패턴 분석 결과</h4>
            
            {scanResult.pattern_analysis.detected_risks && (
              <div className="mb-6">
                <h5 className="font-bold text-slate-800 mb-4">탐지된 위험 요소</h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(scanResult.pattern_analysis.detected_risks).map(([risk, count]) => (
                    <div key={risk} className="card-glass rounded-2xl p-4 text-center">
                      <div className="text-sm text-slate-600 mb-1 capitalize">{risk.replace(/_/g, ' ')}</div>
                      <div className="text-2xl font-bold text-red-600">{count}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {scanResult.pattern_analysis.file_analysis && (
              <div>
                <h5 className="font-bold text-slate-800 mb-4">파일별 분석</h5>
                <div className="space-y-4">
                  {scanResult.pattern_analysis.file_analysis.map((fileAnalysis, index) => (
                    <div key={index} className="card-glass rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h6 className="font-bold text-slate-800">{fileAnalysis.file}</h6>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          fileAnalysis.risk_count === 0 ? 'bg-green-100 text-green-700' :
                          fileAnalysis.risk_count <= 2 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {fileAnalysis.risk_count}개 위험 요소
                        </span>
                      </div>
                      {fileAnalysis.risks && fileAnalysis.risks.length > 0 && (
                        <div className="space-y-3">
                          {fileAnalysis.risks.map((risk, riskIndex) => (
                            <div key={riskIndex} className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-4 border-l-4 border-red-400">
                              <div className="font-medium text-red-800 mb-2 capitalize">
                                {risk.type.replace(/_/g, ' ')}
                              </div>
                              <div className="text-sm text-red-600 mb-2">
                                패턴: <code className="bg-red-100 px-2 py-1 rounded">{risk.pattern}</code>
                              </div>
                              <div className="text-xs text-red-500">
                                라인: {risk.line_numbers?.join(', ')} | 
                                발견: {risk.matches?.join(', ')}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* LLM Analysis */}
        {scanResult.llm_analysis && (
          <div className="card-glass rounded-3xl p-8">
            <h4 className="text-xl font-bold text-slate-800 mb-6">AI 상세 분석</h4>
            
            {scanResult.llm_analysis.분석_요약 && (
              <div className="mb-6">
                <h5 className="font-bold text-slate-800 mb-3">분석 요약</h5>
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border-l-4 border-blue-400">
                  <span className="text-slate-700 leading-relaxed">{scanResult.llm_analysis.분석_요약}</span>
                </div>
              </div>
            )}

            {scanResult.llm_analysis.발견된_위험사항 && (
              <div className="mb-6">
                <h5 className="font-bold text-slate-800 mb-4">발견된 위험사항</h5>
                <div className="space-y-4">
                  {scanResult.llm_analysis.발견된_위험사항.map((risk, index) => (
                    <div key={index} className={`p-6 rounded-xl border-l-4 ${
                      risk.위험_수준 === 'critical' ? 'border-red-400 bg-gradient-to-r from-red-50 to-pink-50' :
                      risk.위험_수준 === 'high' ? 'border-red-400 bg-gradient-to-r from-red-50 to-pink-50' :
                      risk.위험_수준 === 'medium' ? 'border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50' :
                      'border-blue-400 bg-gradient-to-r from-blue-50 to-cyan-50'
                    }`}>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-bold text-slate-800">{risk.카테고리?.replace(/_/g, ' ')}</span>
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                          risk.위험_수준 === 'critical' ? 'bg-red-100 text-red-700' :
                          risk.위험_수준 === 'high' ? 'bg-red-100 text-red-700' :
                          risk.위험_수준 === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {risk.위험_수준}
                        </span>
                      </div>
                      <div className="text-sm text-slate-600 mb-2">{risk.설명}</div>
                      {risk.위치 && (
                        <div className="text-xs text-slate-500">위치: {risk.위치}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {scanResult.llm_analysis.권장사항 && (
              <div>
                <h5 className="font-bold text-slate-800 mb-4">AI 권장사항</h5>
                <ul className="space-y-4">
                  {scanResult.llm_analysis.권장사항.map((recommendation, index) => (
                    <li key={index} className="flex items-start gap-3 text-slate-700">
                      <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span className="leading-relaxed">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* General Recommendations */}
        {scanResult.recommendations && (
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
      </div>
    )}
  </div>
);
}