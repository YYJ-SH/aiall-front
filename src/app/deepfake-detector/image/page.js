'use client'

import { useState, useRef } from 'react';
import { Image as ImageIcon, Upload, ZoomIn, AlertTriangle, CheckCircle, Eye, Camera } from 'lucide-react';

export default function ImageDeepfakeDetectorPage() {
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
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
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith('image/')) {
        handleImageFile(droppedFile);
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleImageFile(e.target.files[0]);
    }
  };

  const handleImageFile = (file) => {
    setFile(file);
    setAnalysisResult(null);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async () => {
    if (!file) return;
    
    setIsAnalyzing(true);
    
    // TODO: 실제 딥페이크 이미지 분석 API 호출
    setTimeout(() => {
      setAnalysisResult({
        isDeepfake: Math.random() > 0.6,
        confidence: Math.floor(Math.random() * 30) + 70,
        details: {
          faceConsistency: Math.floor(Math.random() * 30) + 70,
          eyeAnalysis: Math.floor(Math.random() * 40) + 60,
          skinTexture: Math.floor(Math.random() * 30) + 70,
          lightingConsistency: Math.floor(Math.random() * 35) + 65,
          compressionArtifacts: Math.floor(Math.random() * 25) + 75
        },
        suspiciousAreas: [
          { x: 45, y: 30, width: 20, height: 15, reason: '일관되지 않은 조명 패턴' },
          { x: 35, y: 45, width: 30, height: 10, reason: '부자연스러운 피부 질감' }
        ],
        technicalInfo: {
          resolution: '1920x1080',
          format: file.type,
          size: (file.size / 1024).toFixed(1) + ' KB',
          colorSpace: 'sRGB'
        }
      });
      setIsAnalyzing(false);
    }, 5000);
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
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center float">
              <ImageIcon className="h-8 w-8 text-white" />
            </div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 opacity-30 blur-2xl"></div>
            <Camera className="absolute -top-2 -right-2 h-6 w-6 text-yellow-400 animate-pulse" />
          </div>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
            이미지 딥페이크 탐지기
          </span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          이미지에서 AI 조작 및 딥페이크 생성의 흔적을 분석합니다
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Upload and Preview */}
        <div className="space-y-6">
          {/* Upload Section */}
          <div className="card-glass rounded-3xl p-8">
            <div
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                dragActive 
                  ? 'border-pink-400 bg-gradient-to-r from-pink-50 to-rose-50' 
                  : 'border-slate-300 hover:border-pink-300 hover:bg-gradient-to-r hover:from-pink-50/50 hover:to-rose-50/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {!imagePreview ? (
                <>
                  <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-pink-100 to-rose-100 flex items-center justify-center mx-auto">
                      <Upload className="h-10 w-10 text-pink-600" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-2xl blur-xl"></div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">
                    이미지 업로드
                  </h3>
                  <p className="text-slate-600 mb-6">
                    이미지를 여기로 드래그하거나 클릭하여 선택하세요
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/25 hover:transform hover:scale-105"
                  >
                    이미지 선택
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="mt-6 text-sm text-slate-500 space-y-1">
                    <p>지원 형식: JPG, PNG, WebP, GIF</p>
                    <p>최대 파일 크기: 10MB</p>
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="미리보기"
                      className="max-w-full max-h-96 mx-auto rounded-2xl shadow-lg"
                    />
                    {analysisResult && analysisResult.suspiciousAreas && (
                      <div className="absolute inset-0">
                        {analysisResult.suspiciousAreas.map((area, index) => (
                          <div
                            key={index}
                            className="absolute border-2 border-red-500 bg-red-500/20 rounded"
                            style={{
                              left: `${area.x}%`,
                              top: `${area.y}%`,
                              width: `${area.width}%`,
                              height: `${area.height}%`
                            }}
                            title={area.reason}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="text-center">
                    <div className="text-xl font-bold text-slate-800">{file.name}</div>
                    <div className="text-slate-600">{formatFileSize(file.size)}</div>
                  </div>

                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={analyzeImage}
                      disabled={isAnalyzing}
                      className="px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed text-white font-semibold rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/25 hover:transform hover:scale-105 flex items-center gap-3"
                    >
                      {isAnalyzing ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                          분석 중...
                        </>
                      ) : (
                        <>
                          <Eye className="h-5 w-5" />
                          이미지 분석
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setFile(null);
                        setImagePreview(null);
                        setAnalysisResult(null);
                      }}
                      className="px-8 py-4 card-glass text-slate-700 font-semibold rounded-2xl transition-all duration-300 hover:shadow-xl hover:transform hover:scale-105"
                    >
                      이미지 제거
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Analysis Results */}
        <div className="space-y-6">
          {analysisResult ? (
            <>
              {/* Result Summary */}
              <div className="card-glass rounded-3xl p-8">
                <div className="flex items-center justify-between mb-6">
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
                    </div>
                  </div>
                  <div className={`px-6 py-3 rounded-2xl text-sm font-bold ${
                    analysisResult.isDeepfake 
                      ? 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border border-red-200' 
                      : 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border border-emerald-200'
                  }`}>
                    {analysisResult.isDeepfake ? '딥페이크 의심' : '진짜 이미지'}
                  </div>
                </div>

                {/* Technical Info */}
                <div className="card-glass rounded-2xl p-6">
                  <h4 className="font-bold text-slate-800 mb-4">기술 정보</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {Object.entries(analysisResult.technicalInfo).map(([key, value]) => {
                      const labels = {
                        resolution: '해상도',
                        format: '형식',
                        size: '크기',
                        colorSpace: '색공간'
                      };
                      return (
                        <div key={key} className="flex justify-between">
                          <span className="text-slate-600 font-medium">{labels[key] || key}:</span>
                          <span className="text-slate-800 font-semibold">{value}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Analysis Details */}
              <div className="card-glass rounded-3xl p-8">
                <h4 className="text-xl font-bold text-slate-800 mb-6">분석 지표</h4>
                <div className="space-y-4">
                  {Object.entries(analysisResult.details).map(([key, value]) => {
                    const labels = {
                      faceConsistency: '얼굴 일관성',
                      eyeAnalysis: '눈 분석',
                      skinTexture: '피부 질감',
                      lightingConsistency: '조명 일관성',
                      compressionArtifacts: '압축 아티팩트'
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

              {/* Suspicious Areas */}
              {analysisResult.suspiciousAreas && analysisResult.suspiciousAreas.length > 0 && (
                <div className="card-glass rounded-3xl p-8">
                  <h4 className="text-xl font-bold text-slate-800 mb-6">의심 영역</h4>
                  <div className="space-y-4">
                    {analysisResult.suspiciousAreas.map((area, index) => (
                      <div key={index} className="p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="font-bold text-slate-800">영역 {index + 1}</span>
                        </div>
                        <p className="text-slate-700">{area.reason}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-xs text-slate-500 bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-xl border border-blue-200">
                    빨간 박스가 위 이미지에 표시됩니다
                  </div>
                </div>
              )}

              {/* Warning */}
              <div className={`p-6 rounded-2xl border-l-4 ${
                analysisResult.isDeepfake 
                  ? 'bg-gradient-to-r from-red-50 to-pink-50 border-red-400' 
                  : 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-400'
              }`}>
                <p className="text-slate-700 leading-relaxed">
                  {analysisResult.isDeepfake 
                    ? '이 이미지는 AI 조작의 흔적을 보입니다. 여러 소스와 전문가 분석을 통해 검증하는 것을 고려해보세요.'
                    : '이 이미지는 우리의 분석에 따르면 진짜인 것으로 보입니다. 하지만 딥페이크 기술은 계속해서 빠르게 발전하고 있습니다.'
                  }
                </p>
              </div>
            </>
          ) : (
            /* Placeholder when no analysis */
            <div className="card-glass rounded-3xl p-8 text-center">
              <Eye className="h-16 w-16 text-slate-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-slate-600 mb-4">
                분석 준비 완료
              </h3>
              <p className="text-slate-500 leading-relaxed">
                딥페이크 탐지 분석을 시작하려면 이미지를 업로드하세요
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-12 card-glass rounded-3xl p-8">
        <h3 className="text-xl font-bold text-slate-800 mb-6">탐지 기능</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                <Eye className="h-4 w-4 text-white" />
              </div>
              얼굴 분석
            </h4>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span>눈 움직임 일관성</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span>얼굴 비대칭 탐지</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span>표정 진위성</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span>피부 질감 분석</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <Camera className="h-4 w-4 text-white" />
              </div>
              기술적 분석
            </h4>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                <span>압축 아티팩트</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                <span>조명 일관성</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                <span>해상도 불일치</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                <span>색공간 분석</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                <ZoomIn className="h-4 w-4 text-white" />
              </div>
              AI 서명
            </h4>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                <span>GAN 특정 패턴</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                <span>훈련 데이터 아티팩트</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                <span>노이즈 분포</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                <span>시간적 불일치</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
