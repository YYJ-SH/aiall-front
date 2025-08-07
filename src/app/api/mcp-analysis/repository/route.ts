import { NextRequest, NextResponse } from 'next/server';

// GitHub API를 통한 저장소 분석
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { repository_url, branch = 'main', specific_files } = body;

    // GitHub URL에서 소유자와 저장소명 추출
    const urlParts = repository_url.replace('https://github.com/', '').split('/');
    if (urlParts.length < 2) {
      return NextResponse.json(
        { error: '올바른 GitHub URL을 제공해주세요' },
        { status: 400 }
      );
    }

    const [owner, repo] = urlParts;

    // GitHub API를 통해 저장소 정보 가져오기
    const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        'Authorization': process.env.GITHUB_TOKEN ? `token ${process.env.GITHUB_TOKEN}` : '',
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!repoResponse.ok) {
      return NextResponse.json(
        { error: '저장소를 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    const repoData = await repoResponse.json();

    // 저장소 트리 구조 가져오기
    const treeResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
      {
        headers: {
          'Authorization': process.env.GITHUB_TOKEN ? `token ${process.env.GITHUB_TOKEN}` : '',
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    if (!treeResponse.ok) {
      return NextResponse.json(
        { error: '저장소 트리를 가져올 수 없습니다' },
        { status: 404 }
      );
    }

    const treeData = await treeResponse.json();

    // MCP 관련 파일 필터링
    const mcpFiles = treeData.tree.filter((file: any) => {
      return file.type === 'blob' && (
        file.path.endsWith('.py') ||
        file.path.endsWith('.js') ||
        file.path.endsWith('.ts') ||
        file.path.endsWith('.json') ||
        file.path.includes('mcp') ||
        file.path.includes('server') ||
        file.path.includes('client')
      );
    });

    // 특정 파일이 지정된 경우 필터링
    const filesToAnalyze = specific_files 
      ? mcpFiles.filter((file: any) => specific_files.includes(file.path))
      : mcpFiles.slice(0, 10); // 최대 10개 파일로 제한

    // 각 파일의 내용 가져오기
    const fileContents = await Promise.all(
      filesToAnalyze.map(async (file: any) => {
        try {
          const fileResponse = await fetch(file.url, {
            headers: {
              'Authorization': process.env.GITHUB_TOKEN ? `token ${process.env.GITHUB_TOKEN}` : '',
              'Accept': 'application/vnd.github.v3+json',
            },
          });
          
          if (fileResponse.ok) {
            const fileData = await fileResponse.json();
            return {
              path: file.path,
              content: Buffer.from(fileData.content, 'base64').toString('utf-8'),
              size: file.size
            };
          }
          return null;
        } catch (error) {
          console.error(`Error fetching file ${file.path}:`, error);
          return null;
        }
      })
    );

    const validFiles = fileContents.filter(file => file !== null);

    // 보안 분석 수행
    const analysisResult = await performSecurityAnalysis(validFiles, repoData);

    return NextResponse.json({
      repository_info: {
        name: repoData.name,
        full_name: repoData.full_name,
        description: repoData.description,
        language: repoData.language,
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        created_at: repoData.created_at,
        updated_at: repoData.updated_at,
        files_analyzed: validFiles.length,
        total_files: mcpFiles.length
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
    console.error('Repository analysis error:', error);
    return NextResponse.json(
      { error: '저장소 분석 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

// 보안 분석 로직
async function performSecurityAnalysis(files: any[], repoData: any) {
  // 보안 패턴 분석
  const securityPatterns = {
    dangerous_imports: ['subprocess', 'os.system', 'eval', 'exec', '__import__'],
    network_calls: ['requests', 'urllib', 'socket', 'http'],
    file_operations: ['open', 'file', 'read', 'write', 'os.path'],
    crypto_usage: ['hashlib', 'cryptography', 'ssl', 'jwt'],
    environment_vars: ['os.environ', 'getenv', 'env'],
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
            severity: getDangerLevel(pattern)
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
      authentication: !content.includes('auth') && !content.includes('login'),
      input_validation: !content.includes('validate') && !content.includes('sanitize'),
      error_handling: content.includes('try') && content.includes('except'),
      logging: content.includes('log') || content.includes('print'),
      encryption: content.includes('encrypt') || content.includes('hash'),
      sql_injection: !content.includes('sql') || content.includes('parameterized'),
    };
  }

  // 보안 점수 계산
  const security_score = Math.max(0, 100 - (totalIssues * 5) - (criticalIssues * 10));
  const safe = security_score >= 70 && criticalIssues === 0;

  // LLM 스타일 분석 시뮬레이션
  const llm_analysis = {
    code_quality: security_score > 80 ? 'good' : security_score > 60 ? 'fair' : 'poor',
    security_posture: safe ? 'secure' : 'needs_improvement',
    compliance_status: criticalIssues === 0 ? 'compliant' : 'non_compliant',
    risk_level: criticalIssues > 3 ? 'high' : totalIssues > 10 ? 'medium' : 'low'
  };

  // 권장사항 생성
  const recommendations = generateRecommendations(found_patterns, criticalIssues, totalIssues);

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
      risk_level: llm_analysis.risk_level
    }
  };
}

function getDangerLevel(pattern: string): string {
  const highRisk = ['eval', 'exec', 'os.system', 'subprocess'];
  const mediumRisk = ['open', 'file', 'socket'];
  
  if (highRisk.includes(pattern)) return 'high';
  if (mediumRisk.includes(pattern)) return 'medium';
  return 'low';
}

function generateRecommendations(patterns: string[], criticalIssues: number, totalIssues: number): string[] {
  const recommendations = [];

  if (patterns.includes('eval') || patterns.includes('exec')) {
    recommendations.push('eval() 및 exec() 함수 사용을 피하고 더 안전한 대안을 사용하세요');
  }

  if (patterns.includes('subprocess') || patterns.includes('os.system')) {
    recommendations.push('시스템 명령 실행 시 입력 검증 및 제한을 구현하세요');
  }

  if (patterns.includes('requests') || patterns.includes('urllib')) {
    recommendations.push('네트워크 요청에 대한 SSL 검증 및 타임아웃을 설정하세요');
  }

  if (criticalIssues > 0) {
    recommendations.push('심각한 보안 문제를 우선적으로 해결하세요');
  }

  if (totalIssues > 10) {
    recommendations.push('종합적인 보안 검토를 수행하고 코드 감사를 실시하세요');
  }

  if (recommendations.length === 0) {
    recommendations.push('현재 분석된 코드는 양호한 보안 수준을 보입니다');
    recommendations.push('정기적인 보안 업데이트와 모니터링을 유지하세요');
  }

  return recommendations;
}
