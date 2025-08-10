
'use client'

import { useState } from 'react';
import JSZip from 'jszip';
import  saveAs  from 'file-saver';

export function usePromptAnalysis() {
  const [prompt, setPrompt] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState('');
  const [copiedStates, setCopiedStates] = useState({});

  /**
   * 클립보드에 텍스트를 복사하고 2초간 UI에 피드백을 표시합니다.
   * @param {string} content - 복사할 텍스트
   * @param {string} id - 피드백 상태를 식별하기 위한 고유 ID
   */
  const copyToClipboard = (content, id) => {
    navigator.clipboard.writeText(content);
    setCopiedStates(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setCopiedStates(prev => ({ ...prev, [id]: false }));
    }, 2000);
  };

  /**
   * 입력된 프롬프트를 API 서버로 보내 분석을 요청합니다.
   */
  const generateRules = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setError('');
    setAnalysisResult(null);
    
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetch(`${apiBaseUrl}/api/v1/prompt-analysis/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP 오류! 상태 코드: ${response.status}`);
      }

      const result = await response.json();
      setAnalysisResult(result);
    } catch (err) {
      console.error('Analysis failed:', err);
      setError(err.message || '분석 중 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * 분석 결과를 바탕으로 .cursorrules와 마크다운 파일을 ZIP으로 압축하여 다운로드합니다.
   */
  const downloadFiles = async () => {
    if (!analysisResult) return;

    setIsDownloading(true);
    setError('');
    try {
      const zip = new JSZip();
      
      const cursorRulesContent = JSON.stringify(analysisResult.cursor_rules, null, 2);
      zip.file('.cursorrules', cursorRulesContent);
      zip.file('security_guidance.md', analysisResult.guidance_text);

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, 'security_analysis_files.zip');

    } catch (err) {
      console.error('Download failed:', err);
      setError(err.message || '파일 다운로드 중 오류가 발생했습니다.');
    } finally {
      setIsDownloading(false);
    }
  };

  /**
   * .cursorrules 파일만 별도로 다운로드합니다.
   */
  const downloadCursorRules = () => {
    if (!analysisResult?.cursor_rules) return;
    
    const content = JSON.stringify(analysisResult.cursor_rules, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    saveAs(blob, '.cursorrules');
  };

  return {
    prompt,
    setPrompt,
    analysisResult,
    isGenerating,
    isDownloading,
    error,
    copiedStates,
    generateRules,
    downloadFiles,
    downloadCursorRules,
    copyToClipboard,
  };
}