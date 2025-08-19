'use client'

import React, { useState, useRef } from 'react';
import { Volume2, Upload, Play, Pause, AlertTriangle, CheckCircle, BarChart3, Music } from 'lucide-react';

export default function AudioDeepfakeDetectorPage() {
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const audioRef = useRef(null);
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
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    setUploadError('');
    
    // 파일 형식 검증
    const allowedTypes = ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/flac', 'audio/mp4', 'audio/m4a'];
    const fileExtension = selectedFile.name.toLowerCase();
    const isValidType = allowedTypes.some(type => selectedFile.type === type) || 
                       fileExtension.endsWith('.mp3') || fileExtension.endsWith('.wav') || 
                       fileExtension.endsWith('.flac') || fileExtension.endsWith('.m4a');

    if (!isValidType) {
      setUploadError('지원되지 않는 오디오 형식입니다. mp3, wav, flac, m4a만 지원됩니다.');
      return;
    }

    // 파일 크기 검증 (50MB)
    if (selectedFile.size > 50 * 1024 * 1024) {
      setUploadError('파일 크기가 너무 큽니다. 최대 50MB까지 지원됩니다.');
      return;
    }

    setFile(selectedFile);
    setAnalysisResult(null);
  };

  const analyzeAudio = async () => {
    if (!file) return;
    
    setIsAnalyzing(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('audio_file', file);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const response = await fetch(`${apiUrl}api/v1/audio-detection/predict/audio`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `서버 오류 (${response.status})`);
      }

      const result = await response.json();
      
      // API 응답을 UI 형식으로 변환
      const details = (result.analysis_details || {});
      setAnalysisResult({
        isDeepfake: result.is_fake ?? result.prediction === "fake",
        confidence: (result.confidence_score ?? result.confidence ?? 0) || 0,
        method: result.detection_method || '',
        details: details,
        indicators: details.indicators || [],
        recommendations: Array.isArray(result.recommendations) ? result.recommendations : []
      });

    } catch (error) {
      console.error('음성 분석 오류:', error);
      setUploadError(error.message || '음성 분석 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
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
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center float">
              <Volume2 className="h-8 w-8 text-white" />
            </div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 opacity-30 blur-2xl"></div>
            <Music className="absolute -top-2 -right-2 h-6 w-6 text-yellow-400 animate-pulse" />
          </div>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            음성 딥페이크 탐지기
          </span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          음성 파일을 분석하여 AI로 생성되거나 조작된 콘텐츠를 탐지합니다
        </p>
      </div>

      {/* Upload Section */}
      <div className="card-glass rounded-3xl p-8 mb-8">
        <div
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
            dragActive 
              ? 'border-purple-400 bg-gradient-to-r from-purple-50 to-pink-50' 
              : 'border-slate-300 hover:border-purple-300 hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-pink-50/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {!file ? (
            <>
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center mx-auto">
                  <Upload className="h-10 w-10 text-purple-600" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl"></div>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">
                음성 파일 업로드
              </h3>
              <p className="text-slate-600 mb-6">
                음성 파일을 여기로 드래그하거나 클릭하여 선택하세요
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/25 hover:transform hover:scale-105"
              >
                파일 선택
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*,.mp3,.wav,.flac,.m4a"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="mt-6 text-sm text-slate-500 space-y-1">
                <p>지원 형식: MP3, WAV, M4A, FLAC</p>
                <p>최대 파일 크기: 50MB</p>
              </div>
              
              {/* Error Message */}
              {uploadError && (
                <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl text-red-700 text-sm">
                  {uploadError}
                </div>
              )}
            </>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <Volume2 className="h-8 w-8 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-xl font-bold text-slate-800">{file.name}</div>
                  <div className="text-slate-600">{formatFileSize(file.size)}</div>
                </div>
              </div>
              
              {/* Audio Player */}
              <div className="card-glass rounded-2xl p-6">
                <div className="flex items-center justify-center gap-6">
                  
                  
                  <audio
                    ref={audioRef}
                    src={file ? URL.createObjectURL(file) : ''}
                    controls
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => setIsPlaying(false)}
                  />
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={analyzeAudio}
                  disabled={isAnalyzing}
                  className="group px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed text-white font-semibold rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/25 hover:transform hover:scale-105 flex items-center gap-3"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      분석 중...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="h-5 w-5" />
                      음성 분석 시작
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setFile(null);
                    setAnalysisResult(null);
                    setIsPlaying(false);
                    setUploadError('');
                  }}
                  className="px-8 py-4 card-glass text-slate-700 font-semibold rounded-2xl transition-all duration-300 hover:shadow-xl hover:transform hover:scale-105"
                >
                  파일 제거
                </button>
              </div>

              {/* Error Message */}
              {uploadError && (
                <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl text-red-700 text-sm">
                  {uploadError}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Analysis Results */}
      {analysisResult && (
        <div className="card-glass rounded-3xl p-8 mb-8">
          {/* Result Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                analysisResult.isDeepfake 
                  ? 'bg-gradient-to-r from-red-500 to-pink-500' 
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500'
              }`}>
                {analysisResult.isDeepfake ? (
                  <AlertTriangle className="h-7 w-7 text-white" />
                ) : (
                  <CheckCircle className="h-7 w-7 text-white" />
                )}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-800">분석 완료</h3>
                <p className={`text-lg font-semibold ${
                  analysisResult.isDeepfake ? 'text-red-600' : 'text-emerald-600'
                }`}>
                  신뢰도: {analysisResult.confidence}%
                </p>
                {analysisResult.method && (
                  <p className="text-sm text-slate-500">
                    탐지 방법: {analysisResult.method}
                  </p>
                )}
              </div>
            </div>
            <div className={`px-6 py-3 rounded-2xl text-sm font-bold ${
              analysisResult.isDeepfake 
                ? 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border border-red-200' 
                : 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border border-emerald-200'
            }`}>
              {analysisResult.isDeepfake ? '딥페이크 의심' : '진짜 음성'}
            </div>
          </div>

          {/* Analysis Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* <div className="card-glass rounded-2xl p-6">
              <h4 className="text-lg font-bold text-slate-800 mb-4">분석 지표</h4>
              <div className="space-y-4">
                {Object.entries(analysisResult.details).map(([key, value]) => {
                  const labels = {
                    voicePrint: '음성 지문',
                    spectralAnalysis: '스펙트럼 분석', 
                    temporalConsistency: '시간적 일관성',
                    artifactDetection: '인공물 탐지'
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
            </div> */}

           
          </div>

          {/* Recommendations */}
          {analysisResult.recommendations && analysisResult.recommendations.length > 0 && (
            <div className="card-glass rounded-2xl p-6 mb-6">
              <h4 className="text-lg font-bold text-slate-800 mb-4">권장사항</h4>
              <ul className="space-y-3">
                {analysisResult.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start gap-3 text-slate-700">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    {recommendation}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Warning/Info */}
          <div className={`p-6 rounded-2xl border-l-4 ${
            analysisResult.isDeepfake 
              ? 'bg-gradient-to-r from-red-50 to-pink-50 border-red-400' 
              : 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-400'
          }`}>
            <p className="text-slate-700 leading-relaxed">
              {analysisResult.isDeepfake 
                ? '이 음성은 AI로 생성되거나 조작된 콘텐츠의 특징을 보입니다. 추가 검증을 권장합니다.'
                : '이 음성은 우리의 분석에 따르면 진짜인 것으로 보입니다. 하지만 기술은 계속 발전하고 있습니다.'
              }
            </p>
          </div>
        </div>
      )}

      {/* API Status Indicator */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 card-glass rounded-2xl text-sm text-slate-600">
          <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full animate-pulse"></div>
          API 서버 연결됨
        </div>
      </div>

      {/* Help Section */}
      <div className="card-glass rounded-3xl p-8">
        <h3 className="text-xl font-bold text-slate-800 mb-6">한계</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div>
          
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                <span>탐지 정확도는 품질에 따라 달라집니다</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                <span>새로운 기술은 탐지를 회피할 수 있습니다</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                <span>짧은 클립은 분석이 더 어려울 수 있습니다</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                <span>항상 여러 소스를 통해 검증하세요</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
   
  );
}
