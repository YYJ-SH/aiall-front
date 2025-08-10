// components/AnalysisResult.js
'use client';

import { Copy, Download, CheckCircle, Check } from 'lucide-react';

export function AnalysisResult({ result, onCopy, onDownloadCursorRules, copiedStates }) {
  return (
    <div className="space-y-8">
      {/* Security Guidance */}
      {result.guidance_text && (
        <div className="card-glass rounded-3xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-slate-800">보안 가이드라인</h3>
            <button
              onClick={() => onCopy(result.guidance_text, 'guidance')}
              disabled={copiedStates['guidance']}
              className="w-28 px-4 py-2 card-glass text-slate-700 hover:text-slate-900 font-medium rounded-xl transition-all duration-300 hover:shadow-lg hover:transform hover:scale-105 flex items-center justify-center gap-2"
            >
              {copiedStates['guidance'] ? (
                <> <Check className="h-4 w-4 text-emerald-500" /> 복사 완료! </>
              ) : (
                <> <Copy className="h-4 w-4" /> 복사 </>
              )}
            </button>
          </div>
          <div className="card-glass rounded-2xl p-6 max-h-96 overflow-y-auto">
            <pre className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
              {result.guidance_text}
            </pre>
          </div>
        </div>
      )}

      {/* Cursor Rules */}
      {result.cursor_rules && (
        <div className="card-glass rounded-3xl p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h3 className="text-2xl font-bold text-slate-800">Cursor 규칙</h3>
            <div className="flex gap-3">
              <button
                onClick={() => onCopy(JSON.stringify(result.cursor_rules, null, 2), 'rules')}
                disabled={copiedStates['rules']}
                className="w-28 px-4 py-2 card-glass text-slate-700 hover:text-slate-900 font-medium rounded-xl transition-all duration-300 hover:shadow-lg hover:transform hover:scale-105 flex items-center justify-center gap-2"
              >
                 {copiedStates['rules'] ? (
                  <> <Check className="h-4 w-4 text-emerald-500" /> 복사 완료! </>
                ) : (
                  <> <Copy className="h-4 w-4" /> 복사 </>
                )}
              </button>
              <button
                onClick={onDownloadCursorRules}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25 hover:transform hover:scale-105 flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                .cursorrules 다운로드
              </button>
            </div>
          </div>
          <div className="card-glass rounded-2xl p-6 max-h-96 overflow-y-auto">
            <pre className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
              {JSON.stringify(result.cursor_rules, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Security Recommendations */}
      {result.guidance?.security_recommendations && (
        <div className="card-glass rounded-3xl p-8">
          <h3 className="text-2xl font-bold text-slate-800 mb-6">보안 권장사항</h3>
          <div className="space-y-4">
            {result.guidance.security_recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3 p-4 card-glass rounded-xl">
                <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span className="text-slate-700 leading-relaxed">{recommendation}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detected Packages */}
      {result.packages?.length > 0 && (
        <div className="card-glass rounded-3xl p-8">
          <h3 className="text-2xl font-bold text-slate-800 mb-6">감지된 패키지/기술</h3>
          <div className="flex flex-wrap gap-2">
            {result.packages.map((pkg, index) => (
              <span key={index} className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full text-sm font-medium">
                {pkg}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}