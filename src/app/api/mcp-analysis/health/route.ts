import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const healthStatus = {
      status: "healthy",
      service: "mcp-analysis",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
      features: {
        github_analysis: true,
        file_upload: true,
        security_scanning: true,
        pattern_detection: true,
        checklist_validation: true
      },
      api_endpoints: {
        "/api/mcp-analysis/repository": "GitHub 저장소 분석",
        "/api/mcp-analysis/files": "파일 업로드 분석",
        "/api/mcp-analysis/checklist": "보안 체크리스트",
        "/api/mcp-analysis/health": "서비스 상태 확인"
      },
      system_info: {
        node_version: process.version,
        platform: process.platform,
        arch: process.arch,
        memory_usage: process.memoryUsage()
      }
    };

    return NextResponse.json(healthStatus);
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      { 
        status: "unhealthy", 
        service: "mcp-analysis",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
