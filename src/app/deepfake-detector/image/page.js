'use client'

import { useState, useRef } from 'react';
import { Image as ImageIcon, Upload, ZoomIn, AlertTriangle, CheckCircle, Eye, Camera } from 'lucide-react';
import { analyzeImage } from '@/lib/api/instance'; 

export default function ImageDeepfakeDetectorPage() {
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
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
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleImageFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    setError('');
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('지원되지 않는 이미지 형식입니다. JPG, PNG, GIF, WebP만 지원됩니다.');
      return false;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('파일 크기가 너무 큽니다. 최대 10MB까지 지원됩니다.');
      return false;
    }
    return true;
  };

  const handleImageFile = (file) => {
    if (!validateAndSetFile(file)) return;
    setFile(file);
    setAnalysisResult(null);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleAnalyzeImage = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    setError('');
    setAnalysisResult(null);

    try {
      const result = await analyzeImage(file);
      
      // [수정] 백엔드 응답으로 핵심 상태만 설정합니다.
      setAnalysisResult({
        isDeepfake: result.prediction.toLowerCase() === 'fake',
        confidence: result.confidence,
      });

    } catch (error) {
      console.error('Image analysis error:', error);
      setError(error.message);
    } finally {
      setIsAnalyzing(false);
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
        <div className="card-glass rounded-3xl p-8">
          <div
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
              dragActive 
                ? 'border-pink-400 bg-gradient-to-r from-pink-50 to-rose-50' 
                : 'border-slate-300 hover:border-pink-300 hover:bg-gradient-to-r hover:from-pink-50/50 hover:to-rose-50/50'
            }`}
            onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
          >
            {!imagePreview ? (
              <>
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-pink-100 to-rose-100 flex items-center justify-center mx-auto">
                    <Upload className="h-10 w-10 text-pink-600" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-2xl blur-xl"></div>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">이미지 업로드</h3>
                <p className="text-slate-600 mb-6">이미지를 여기로 드래그하거나 클릭하여 선택하세요</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/25 hover:transform hover:scale-105"
                >
                  이미지 선택
                </button>
                <input
                  ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleFileChange} className="hidden"
                />
                <div className="mt-6 text-sm text-slate-500 space-y-1">
                  <p>지원 형식: JPG, PNG, GIF, WebP</p>
                  <p>최대 파일 크기: 10MB</p>
                </div>
                {error && (
                  <div className="mt-6 p-4 bg-red-100/50 border border-red-200 rounded-xl text-red-700 text-sm">
                    {error}
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-6">
                <div className="relative">
                  <img src={imagePreview} alt="미리보기" className="max-w-full max-h-[40vh] mx-auto rounded-2xl shadow-lg" />
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-slate-800 break-all">{file.name}</div>
                  <div className="text-slate-600">{formatFileSize(file.size)}</div>
                </div>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={handleAnalyzeImage}
                    disabled={isAnalyzing}
                    className="px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed text-white font-semibold rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/25 hover:transform hover:scale-105 flex items-center gap-3"
                  >
                    {isAnalyzing ? (
                      <><div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>분석 중...</>
                    ) : (
                      <><Eye className="h-5 w-5" />이미지 분석</>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setFile(null); setImagePreview(null); setAnalysisResult(null); setError('');
                    }}
                    className="px-8 py-4 card-glass text-slate-700 font-semibold rounded-2xl transition-all duration-300 hover:shadow-xl hover:transform hover:scale-105"
                  >
                    이미지 제거
                  </button>
                </div>
                 {error && (
                  <div className="mt-6 p-4 bg-red-100/50 border border-red-200 rounded-xl text-red-700 text-sm">
                    {error}
                  </div>
                )}
              </div>
            )}
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
                      analysisResult.isDeepfake ? 'bg-gradient-to-r from-red-500 to-pink-500' : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                    }`}>
                      {analysisResult.isDeepfake ? <AlertTriangle className="h-7 w-7 text-white" /> : <CheckCircle className="h-7 w-7 text-white" />}
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
              </div>
              
              {/* [제거] Technical Info, Analysis Details, Suspicious Areas 카드들이 있던 자리 */}

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
            <div className="card-glass rounded-3xl p-8 text-center h-full flex flex-col justify-center">
              <Eye className="h-16 w-16 text-slate-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-slate-600 mb-4">
                분석 준비 완료
              </h3>
              <p className="text-slate-500 leading-relaxed max-w-xs mx-auto">
                딥페이크 탐지 분석을 시작하려면 좌측에서 이미지를 업로드하세요.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}