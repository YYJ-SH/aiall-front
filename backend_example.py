# FastAPI 백엔드 - 새로운 API v1 구조에 맞춘 예제 코드

from fastapi import FastAPI, HTTPException, UploadFile, File, Depends, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import random

# FastAPI 앱 생성
app = FastAPI(title="MCP Analysis API", version="2.0.0")

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",    # Next.js 프론트엔드
        "http://127.0.0.1:3000",    # 대체 주소
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- API 응답 모델 정의 ---
class RepositoryInfo(BaseModel):
    source: str
    files_analyzed: List[str]
    total_files: int
    total_size: int

class Summary(BaseModel):
    critical_issues: int
    high_issues: int
    medium_issues: int
    warnings: int

class ChecklistItem(BaseModel):
    name: str
    status: str
    severity: str
    details: str
    evidence: List[Any]

class ChecklistCategory(BaseModel):
    name: str
    items: List[ChecklistItem]

class AnalysisReport(BaseModel):
    repository_info: RepositoryInfo
    security_score: float = Field(..., description="코드의 종합 보안 점수 (0-100)")
    safe: bool = Field(..., description="코드가 전반적으로 안전한지 여부")
    overall_assessment: str = Field(..., description="분석 결과에 대한 서술형 종합 평가")
    summary: Summary
    checklist_results: Dict[str, ChecklistCategory]
    recommendations: List[str]
    pattern_analysis: Dict[str, Any] = Field(..., description="패턴 기반 정적 분석의 상세 결과")
    llm_analysis: Dict[str, Any] = Field(..., description="LLM 기반 심층 분석의 상세 결과")

class RepositoryAnalysisRequest(BaseModel):
    repository_url: str = Field(..., example="https://github.com/user/repo")
    branch: str = "main"
    specific_files: Optional[List[str]] = None

# 모의 분석 서비스
class MockMCPAnalysisService:
    def __init__(self):
        self.checklist_categories = {
            "authentication": {
                "name": "인증 및 권한 관리",
                "items": ["다단계 인증", "토큰 관리", "세션 보안", "권한 검증"]
            },
            "input_validation": {
                "name": "입력 검증",
                "items": ["사용자 입력 검증", "파일 업로드 검증", "SQL 인젝션 방지", "XSS 방지"]
            },
            "crypto": {
                "name": "암호화",
                "items": ["데이터 암호화", "통신 암호화", "키 관리", "해싱"]
            },
            "error_handling": {
                "name": "오류 처리",
                "items": ["예외 처리", "에러 로깅", "민감 정보 노출 방지", "복구 메커니즘"]
            }
        }
    
    async def analyze_repository(self, repository_url: str, branch: str, specific_files: Optional[List[str]] = None):
        # GitHub URL에서 저장소 정보 추출
        parts = repository_url.replace("https://github.com/", "").split("/")
        owner, repo = parts[0], parts[1] if len(parts) > 1 else "unknown"
        
        # 모의 분석 결과 생성
        critical_issues = random.randint(0, 2)
        high_issues = random.randint(0, 3)
        medium_issues = random.randint(1, 5)
        warnings = random.randint(2, 8)
        
        total_issues = critical_issues + high_issues + medium_issues
        security_score = max(20, 100 - (critical_issues * 30) - (high_issues * 15) - (medium_issues * 8) - (warnings * 2))
        safe = critical_issues == 0 and high_issues <= 1 and security_score >= 70
        
        # 파일 목록 생성
        mock_files = [f"{repo}/main.py", f"{repo}/config.py", f"{repo}/utils.py", f"{repo}/server.py"]
        analyzed_files = specific_files if specific_files else mock_files[:random.randint(2, 4)]
        
        return {
            "repository_info": {
                "source": f"{owner}/{repo}",
                "files_analyzed": analyzed_files,
                "total_files": len(analyzed_files),
                "total_size": random.randint(50000, 500000)
            },
            "security_score": security_score,
            "safe": safe,
            "overall_assessment": self._generate_assessment(safe, critical_issues, high_issues, security_score),
            "summary": {
                "critical_issues": critical_issues,
                "high_issues": high_issues,
                "medium_issues": medium_issues,
                "warnings": warnings
            },
            "checklist_results": self._generate_checklist_results(),
            "recommendations": self._generate_recommendations(critical_issues, high_issues, medium_issues),
            "pattern_analysis": self._generate_pattern_analysis(),
            "llm_analysis": self._generate_llm_analysis()
        }
    
    async def analyze_files(self, files: List[UploadFile]):
        # 업로드된 파일들 처리
        file_contents = []
        total_size = 0
        
        for file in files:
            content = await file.read()
            file_contents.append({
                "name": file.filename,
                "size": len(content),
                "content": content.decode('utf-8', errors='ignore')
            })
            total_size += len(content)
        
        # 모의 분석 결과 생성
        critical_issues = random.randint(0, 1)
        high_issues = random.randint(0, 2)
        medium_issues = random.randint(1, 4)
        warnings = random.randint(1, 6)
        
        security_score = max(25, 100 - (critical_issues * 30) - (high_issues * 15) - (medium_issues * 8) - (warnings * 2))
        safe = critical_issues == 0 and high_issues == 0 and security_score >= 75
        
        return {
            "repository_info": {
                "source": "업로드된 파일",
                "files_analyzed": [f["name"] for f in file_contents],
                "total_files": len(file_contents),
                "total_size": total_size
            },
            "security_score": security_score,
            "safe": safe,
            "overall_assessment": self._generate_assessment(safe, critical_issues, high_issues, security_score),
            "summary": {
                "critical_issues": critical_issues,
                "high_issues": high_issues,
                "medium_issues": medium_issues,
                "warnings": warnings
            },
            "checklist_results": self._generate_checklist_results(),
            "recommendations": self._generate_recommendations(critical_issues, high_issues, medium_issues),
            "pattern_analysis": self._generate_pattern_analysis(),
            "llm_analysis": self._generate_llm_analysis()
        }
    
    def _generate_assessment(self, safe: bool, critical: int, high: int, score: float) -> str:
        if safe and score >= 85:
            return "분석된 코드는 전반적으로 우수한 보안 수준을 보입니다. 모범 사례를 잘 따르고 있으며, 발견된 문제들은 대부분 경미한 수준입니다. 지속적인 모니터링과 업데이트를 통해 현재 수준을 유지하는 것을 권장합니다."
        elif safe:
            return "분석된 코드는 양호한 보안 수준을 보입니다. 몇 가지 개선 사항이 있지만 심각한 보안 위험은 발견되지 않았습니다. 권장사항을 적용하면 더욱 안전한 코드가 될 것입니다."
        elif critical > 0:
            return f"⚠️ 심각한 보안 문제가 {critical}개 발견되었습니다. 즉시 수정이 필요한 취약점들이 있어 공격자가 악용할 수 있는 위험이 높습니다. 우선적으로 심각한 문제들을 해결한 후 다른 권장사항을 적용하세요."
        elif high > 2:
            return f"높은 위험도의 보안 문제가 {high}개 발견되었습니다. 비교적 빠른 시일 내에 수정이 필요하며, 보안 강화를 위한 전반적인 검토를 권장합니다."
        else:
            return "분석된 코드에서 몇 가지 보안 개선점이 발견되었습니다. 심각한 위험은 아니지만 보안 모범 사례를 적용하면 더욱 견고한 코드가 될 것입니다."
    
    def _generate_checklist_results(self) -> Dict[str, ChecklistCategory]:
        results = {}
        
        for category_id, category_info in self.checklist_categories.items():
            items = []
            for item_name in category_info["items"]:
                status = random.choice(["pass", "fail", "warning"])
                severity = random.choice(["low", "medium", "high", "critical"])
                
                # 상태에 따른 상세 설명 생성
                if status == "pass":
                    details = f"{item_name}이(가) 적절히 구현되어 있습니다."
                    evidence = ["코드에서 적절한 구현 확인", "모범 사례 준수"]
                elif status == "fail":
                    details = f"{item_name}이(가) 부적절하거나 누락되어 있습니다."
                    evidence = ["취약한 구현 발견", "보안 위험 존재"]
                else:
                    details = f"{item_name} 구현에 개선이 필요합니다."
                    evidence = ["부분적 구현", "추가 강화 필요"]
                
                items.append({
                    "name": item_name,
                    "status": status,
                    "severity": severity,
                    "details": details,
                    "evidence": evidence
                })
            
            results[category_id] = {
                "name": category_info["name"],
                "items": items
            }
        
        return results
    
    def _generate_recommendations(self, critical: int, high: int, medium: int) -> List[str]:
        recommendations = []
        
        if critical > 0:
            recommendations.extend([
                "🚨 즉시 심각한 보안 취약점을 수정하세요",
                "보안 전문가의 코드 리뷰를 받으세요",
                "침투 테스트를 실시하여 추가 취약점을 확인하세요"
            ])
        
        if high > 0:
            recommendations.extend([
                "높은 위험도의 보안 문제를 우선적으로 해결하세요",
                "보안 모니터링 시스템을 구축하세요"
            ])
        
        recommendations.extend([
            "정기적인 의존성 업데이트를 실시하세요",
            "자동화된 보안 스캐닝을 CI/CD 파이프라인에 통합하세요",
            "보안 교육을 정기적으로 진행하세요",
            "백업 및 재해 복구 계획을 수립하세요",
            "로깅 및 모니터링 시스템을 강화하세요"
        ])
        
        return recommendations[:random.randint(3, len(recommendations))]
    
    def _generate_pattern_analysis(self) -> Dict[str, Any]:
        return {
            "static_analysis": {
                "dangerous_functions": {
                    "eval_usage": random.randint(0, 3),
                    "exec_usage": random.randint(0, 2),
                    "subprocess_calls": random.randint(0, 5)
                },
                "security_patterns": {
                    "input_validation": random.choice([True, False]),
                    "output_encoding": random.choice([True, False]),
                    "crypto_usage": random.choice([True, False])
                },
                "code_quality": {
                    "complexity_score": random.randint(1, 10),
                    "maintainability": random.choice(["good", "fair", "poor"]),
                    "test_coverage": f"{random.randint(30, 90)}%"
                }
            },
            "file_analysis": {
                "config_files": random.randint(1, 5),
                "executable_files": random.randint(0, 3),
                "documentation": random.choice([True, False])
            }
        }
    
    def _generate_llm_analysis(self) -> Dict[str, Any]:
        return {
            "semantic_analysis": {
                "context_understanding": "코드의 전반적인 구조와 목적을 잘 이해했습니다",
                "business_logic_risks": [
                    "사용자 권한 검증 로직에서 우회 가능성",
                    "데이터 처리 과정에서 무결성 검증 부족"
                ],
                "architectural_concerns": [
                    "마이크로서비스 간 통신 보안",
                    "데이터베이스 연결 보안"
                ]
            },
            "risk_assessment": {
                "attack_surface": "중간",
                "exploitability": "낮음",
                "impact_severity": "중간",
                "overall_risk": "관리 가능"
            },
            "intelligent_insights": [
                "코드베이스가 현대적인 보안 원칙을 대부분 따르고 있습니다",
                "API 엔드포인트의 인증 체계가 잘 구현되어 있습니다",
                "민감한 데이터 처리 부분에 추가적인 보안 강화가 필요합니다",
                "로깅 시스템이 보안 이벤트 추적에 적합하게 구성되어 있습니다"
            ]
        }
    
    def get_security_checklist(self):
        return {
            "categories": self.checklist_categories,
            "total_items": sum(len(cat["items"]) for cat in self.checklist_categories.values()),
            "description": "MCP 보안 분석을 위한 종합적인 체크리스트"
        }

# 서비스 인스턴스 생성
analysis_service = MockMCPAnalysisService()

def get_analysis_service():
    return analysis_service

# --- API v1 라우터 설정 ---
v1_router = APIRouter(prefix="/api/v1")

# MCP Analysis 라우터
mcp_router = APIRouter(prefix="/mcp-analysis", tags=["MCP Analysis"])

@mcp_router.post("/repository", response_model=AnalysisReport, summary="GitHub 레포지토리 분석")
async def analyze_repository(
    request: RepositoryAnalysisRequest,
    service: MockMCPAnalysisService = Depends(get_analysis_service)
):
    """
    GitHub 레포지토리 URL을 입력받아 MCP 관련 코드의 보안을 분석하고, 종합 리포트를 반환합니다.
    """
    try:
        result = await service.analyze_repository(
            repository_url=request.repository_url,
            branch=request.branch,
            specific_files=request.specific_files
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"레포지토리 분석 중 오류 발생: {str(e)}")

@mcp_router.post("/files", response_model=AnalysisReport, summary="파일 업로드 분석")
async def analyze_files(
    files: List[UploadFile] = File(..., description="분석할 코드 파일을 업로드합니다."),
    service: MockMCPAnalysisService = Depends(get_analysis_service)
):
    """
    하나 이상의 코드 파일을 직접 업로드하여 MCP 관련 코드의 보안을 분석하고, 종합 리포트를 반환합니다.
    """
    if not files:
        raise HTTPException(status_code=400, detail="분석할 파일이 없습니다.")
    try:
        result = await service.analyze_files(files)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"파일 분석 중 오류 발생: {str(e)}")

@mcp_router.get("/checklist", summary="보안 분석 체크리스트 조회")
async def get_checklist(service: MockMCPAnalysisService = Depends(get_analysis_service)):
    """
    현재 분석 서비스에서 사용 중인 보안 체크리스트의 구조를 반환합니다.
    """
    return service.get_security_checklist()

@mcp_router.get("/health", summary="서비스 상태 확인")
async def health_check():
    """MCP 분석 서비스의 현재 상태를 확인합니다."""
    return {
        "status": "healthy", 
        "service": "mcp-analysis",
        "version": "2.0.0",
        "api_version": "v1",
        "features": {
            "repository_analysis": True,
            "file_upload_analysis": True,
            "llm_analysis": True,
            "pattern_analysis": True,
            "checklist_validation": True
        }
    }

# 라우터 등록
v1_router.include_router(mcp_router)
app.include_router(v1_router)

@app.get("/")
async def root():
    return {
        "message": "MCP Analysis API v2.0",
        "version": "2.0.0",
        "api_version": "v1",
        "docs": "/docs",
        "endpoints": {
            "repository": "POST /api/v1/mcp-analysis/repository",
            "files": "POST /api/v1/mcp-analysis/files",
            "checklist": "GET /api/v1/mcp-analysis/checklist", 
            "health": "GET /api/v1/mcp-analysis/health"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
