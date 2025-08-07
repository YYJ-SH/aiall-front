import { NextRequest, NextResponse } from 'next/server';

// 파일 업로드를 통한 코드 분석
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: '분석할 파일을 업로드해주세요' },
        { status: 400 }
      );
    }

    // 파일 내용 읽기
    const fileContents = await Promise.all(
      files.map(async (file) => {
        try {
          const content = await file.text();
          return {
            path: file.name,
            content: content,
            size: file.size,
            type: file.type
          };
        } catch (error) {
          console.error(`Error reading file ${file.name}:`, error);
          return null;
        }
      })
    );

    const validFiles = fileContents.filter(file => file !== null);

    if (validFiles.length === 0) {
      return NextResponse.json(
        { error: '유효한 파일을 찾을 수 없습니다' },
        { status: 400 }
      );
    }

    // 보안 분석 수행
    const analysisResult = await performSecurityAnalysis(validFiles);

    return NextResponse.json({
      repository_info: {
        name: 'Upload Analysis',
        full_name: 'Uploaded Files Analysis',
        description: '업로드된 파일들에 대한 보안 분석',
        language: detectPrimaryLanguage(validFiles),
        files_analyzed: validFiles.length,
        total_files: validFiles.length,
        upload_time: new Date().toISOString()
      },
      security_score: analysisResult.security_score,
      checklist_results: analysisResult.checklist_results,
      pattern_analysis: analysisResult.pattern_analysis,
      llm_analysis: analysisResult.llm_analysis,
      recommendations: analysisResult.recommendations,
      safe: analysisResult.safe,
      summary: analysisResult.summary
    });

  } catch (error) {
    console.error('File analysis error:', error);
    return NextResponse.json(
      { error: '파일 분석 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

// Base64로 인코딩된 파일들 분석 (기존 FastAPI 호환)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { files } = body;

    if (!files || !Array.isArray(files)) {
      return NextResponse.json(
        { error: '파일 데이터가 필요합니다' },
        { status: 400 }
      );
    }

    // Base64 디코딩 및 파일 처리
    const fileContents = files.map((encodedFile: string, index: number) => {
      try {
        const content = Buffer.from(encodedFile, 'base64').toString('utf-8');
        return {
          path: `file_${index + 1}`,
          content: content,
          size: content.length,
          type: 'text/plain'
        };
      } catch (error) {
        console.error(`Error decoding file ${index}:`, error);
        return null;
      }
    }).filter(file => file !== null);

    if (fileContents.length === 0) {
      return NextResponse.json(
        { error: '유효한 파일을 찾을 수 없습니다' },
        { status: 400 }
      );
    }

    // 보안 분석 수행
    const analysisResult = await performSecurityAnalysis(fileContents);

    return NextResponse.json({
      repository_info: {
        name: 'Base64 Analysis',
        full_name: 'Base64 Encoded Files Analysis',
        description: 'Base64로 인코딩된 파일들에 대한 보안 분석',
        language: detectPrimaryLanguage(fileContents),
        files_analyzed: fileContents.length,
        total_files: fileContents.length,
        upload_time: new Date().toISOString()
      },
      security_score: analysisResult.security_score,
      checklist_results: analysisResult.checklist_results,
      pattern_analysis: analysisResult.pattern_analysis,
      llm_analysis: analysisResult.llm_analysis,
      recommendations: analysisResult.recommendations,
      safe: analysisResult.safe,
      summary: analysisResult.summary
    });

  } catch (error) {
    console.error('Base64 file analysis error:', error);
    return NextResponse.json(
      { error: '파일 분석 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

// 보안 분석 로직
async function performSecurityAnalysis(files: any[]) {
  const securityPatterns = {
    dangerous_imports: ['subprocess', 'os.system', 'eval', 'exec', '__import__', 'shell_exec', 'system'],
    network_calls: ['requests', 'urllib', 'socket', 'http', 'fetch', 'axios'],
    file_operations: ['open', 'file', 'read', 'write', 'os.path', 'fs.', 'readFile', 'writeFile'],
    crypto_usage: ['hashlib', 'cryptography', 'ssl', 'jwt', 'crypto', 'bcrypt'],
    environment_vars: ['os.environ', 'getenv', 'env', 'process.env'],
    sql_operations: ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'DROP', 'CREATE'],
    shell_commands: ['bash', 'sh', 'cmd', 'powershell', 'terminal'],
  };

  let totalIssues = 0;
  let criticalIssues = 0;
  const checklist_results: any = {};
  const pattern_analysis: any = {};
  const found_patterns: string[] = [];

  for (const file of files) {
    if (!file?.content) continue;

    const content = file.content.toLowerCase();
    
    // 위험한 패턴 검사
    for (const [category, patterns] of Object.entries(securityPatterns)) {
      pattern_analysis[category] = pattern_analysis[category] || [];
      
      for (const pattern of patterns) {
        if (content.includes(pattern.toLowerCase())) {
          pattern_analysis[category].push({
            file: file.path,
            pattern: pattern,
            severity: getDangerLevel(pattern),
            line_count: (content.match(new RegExp(pattern.toLowerCase(), 'g')) || []).length
          });
          found_patterns.push(pattern);
          totalIssues++;
          
          if (getDangerLevel(pattern) === 'high') {
            criticalIssues++;
          }
        }
      }
    }

    // 체크리스트 검사
    checklist_results[file.path] = {
      authentication: hasSecurityFeature(content, ['auth', 'login', 'token', 'credential']),
      input_validation: hasSecurityFeature(content, ['validate', 'sanitize', 'escape', 'filter']),
      error_handling: hasSecurityFeature(content, ['try', 'except', 'catch', 'error']),
      logging: hasSecurityFeature(content, ['log', 'console', 'print', 'debug']),
      encryption: hasSecurityFeature(content, ['encrypt', 'hash', 'crypto', 'ssl']),
      sql_injection_protection: !hasVulnerability(content, ['sql']) || hasSecurityFeature(content, ['parameterized', 'prepared']),
      xss_protection: hasSecurityFeature(content, ['escape', 'sanitize', 'htmlentities']),
      csrf_protection: hasSecurityFeature(content, ['csrf', 'token', 'nonce']),
      secure_headers: hasSecurityFeature(content, ['cors', 'csp', 'hsts', 'x-frame']),
      rate_limiting: hasSecurityFeature(content, ['rate', 'limit', 'throttle', 'quota'])
    };
  }

  // 보안 점수 계산
  const security_score = Math.max(0, 100 - (totalIssues * 3) - (criticalIssues * 15));
  const safe = security_score >= 70 && criticalIssues === 0;

  // LLM 스타일 분석
  const llm_analysis = {
    code_quality: security_score > 85 ? 'excellent' : security_score > 70 ? 'good' : security_score > 50 ? 'fair' : 'poor',
    security_posture: safe ? 'secure' : criticalIssues > 5 ? 'vulnerable' : 'needs_improvement',
    compliance_status: criticalIssues === 0 ? 'compliant' : 'non_compliant',
    risk_level: criticalIssues > 5 ? 'high' : criticalIssues > 2 ? 'medium' : totalIssues > 15 ? 'medium' : 'low',
    maintainability: files.length > 20 ? 'complex' : files.length > 10 ? 'moderate' : 'simple'
  };

  // 권장사항 생성
  const recommendations = generateRecommendations(found_patterns, criticalIssues, totalIssues, files.length);

  return {
    security_score,
    checklist_results,
    pattern_analysis,
    llm_analysis,
    recommendations,
    safe,
    summary: {
      total_issues: totalIssues,
      critical_issues: criticalIssues,
      files_scanned: files.length,
      risk_level: llm_analysis.risk_level,
      patterns_found: found_patterns.length
    }
  };
}

// 보안 기능 존재 여부 확인
function hasSecurityFeature(content: string, keywords: string[]): boolean {
  return keywords.some(keyword => content.includes(keyword.toLowerCase()));
}

// 취약점 존재 여부 확인
function hasVulnerability(content: string, keywords: string[]): boolean {
  return keywords.some(keyword => content.includes(keyword.toLowerCase()));
}

// 위험도 판별
function getDangerLevel(pattern: string): string {
  const highRisk = ['eval', 'exec', 'os.system', 'subprocess', 'shell_exec', 'system'];
  const mediumRisk = ['open', 'file', 'socket', 'sql', 'DELETE', 'DROP'];
  
  if (highRisk.some(risk => pattern.toLowerCase().includes(risk.toLowerCase()))) return 'high';
  if (mediumRisk.some(risk => pattern.toLowerCase().includes(risk.toLowerCase()))) return 'medium';
  return 'low';
}

// 주요 언어 감지
function detectPrimaryLanguage(files: any[]): string {
  const extensions = files.map(file => {
    const parts = file.path.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : 'unknown';
  });

  const counts: { [key: string]: number } = {};
  extensions.forEach(ext => {
    counts[ext] = (counts[ext] || 0) + 1;
  });

  const mostCommon = Object.entries(counts).sort(([,a], [,b]) => b - a)[0];
  
  const languageMap: { [key: string]: string } = {
    'py': 'Python',
    'js': 'JavaScript',
    'ts': 'TypeScript',
    'java': 'Java',
    'cpp': 'C++',
    'c': 'C',
    'php': 'PHP',
    'rb': 'Ruby',
    'go': 'Go',
    'rs': 'Rust',
    'json': 'JSON'
  };

  return languageMap[mostCommon?.[0]] || 'Mixed';
}

// 권장사항 생성
function generateRecommendations(patterns: string[], criticalIssues: number, totalIssues: number, fileCount: number): string[] {
  const recommendations = [];

  if (patterns.includes('eval') || patterns.includes('exec')) {
    recommendations.push('🚨 eval() 및 exec() 함수 사용을 즉시 중단하고 더 안전한 대안을 사용하세요');
  }

  if (patterns.includes('subprocess') || patterns.includes('os.system')) {
    recommendations.push('⚠️ 시스템 명령 실행 시 철저한 입력 검증 및 제한을 구현하세요');
  }

  if (patterns.includes('sql') || patterns.includes('SELECT')) {
    recommendations.push('🛡️ SQL 쿼리에 매개변수화된 쿼리 또는 ORM을 사용하여 인젝션을 방지하세요');
  }

  if (patterns.includes('requests') || patterns.includes('fetch')) {
    recommendations.push('🔒 네트워크 요청에 SSL 검증, 타임아웃 및 재시도 로직을 설정하세요');
  }

  if (criticalIssues > 5) {
    recommendations.push('🔥 심각한 보안 위험이 다수 발견되었습니다. 즉시 보안 전문가의 검토를 받으세요');
  } else if (criticalIssues > 0) {
    recommendations.push('⚡ 심각한 보안 문제를 우선적으로 해결하세요');
  }

  if (totalIssues > 20) {
    recommendations.push('📋 종합적인 보안 검토를 수행하고 정기적인 코드 감사를 실시하세요');
  }

  if (fileCount > 15) {
    recommendations.push('📚 대규모 코드베이스입니다. 자동화된 보안 스캐닝 도구 도입을 고려하세요');
  }

  // 일반적인 보안 권장사항
  recommendations.push('🔐 모든 사용자 입력에 대해 철저한 검증과 sanitization을 구현하세요');
  recommendations.push('📝 상세한 보안 로깅 및 모니터링 시스템을 구축하세요');
  recommendations.push('🔄 정기적인 의존성 업데이트 및 보안 패치를 적용하세요');

  if (recommendations.length === 0) {
    recommendations.push('✅ 현재 분석된 코드는 양호한 보안 수준을 보입니다');
    recommendations.push('🔄 정기적인 보안 업데이트와 모니터링을 유지하세요');
    recommendations.push('📊 지속적인 보안 모니터링 및 자동화된 스캐닝을 고려하세요');
  }

  return recommendations;
}
