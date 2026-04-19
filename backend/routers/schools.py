"""
院校路由 - 处理院校相关的 API 请求
"""
from fastapi import APIRouter, Query, HTTPException
from typing import Optional, List
from models import (
    School,
    SchoolListResponse,
    SchoolDetailResponse,
    ErrorResponse,
)
from services import feishu_service

router = APIRouter()


@router.get("", response_model=SchoolListResponse)
async def get_schools(
    city: Optional[str] = Query(None, description="城市筛选"),
    school_type: Optional[str] = Query(None, description="院校类型筛选"),
    search: Optional[str] = Query(None, description="关键词搜索"),
) -> SchoolListResponse:
    """
    获取院校列表
    
    支持按城市、院校类型筛选和关键词搜索
    """
    try:
        # 构建筛选条件
        filters = {}
        if city:
            filters["city"] = city
        if school_type:
            filters["school_type"] = school_type
        if search:
            filters["search"] = search

        # 获取数据
        schools_data = feishu_service.get_schools(filters if filters else None)
        
        # 转换为 Pydantic 模型
        schools = [School(**school) for school in schools_data]

        return SchoolListResponse(
            code=200,
            message="success",
            data=schools,
            total=len(schools),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{school_id}", response_model=SchoolDetailResponse)
async def get_school_detail(school_id: str) -> SchoolDetailResponse:
    """
    获取院校详情
    
    根据院校ID获取详细信息
    """
    try:
        school_data = feishu_service.get_school_by_id(school_id)
        
        if not school_data:
            raise HTTPException(status_code=404, detail="院校不存在")

        school = School(**school_data)
        
        return SchoolDetailResponse(
            code=200,
            message="success",
            data=school,
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/cities/list")
async def get_cities():
    """获取所有城市列表"""
    try:
        schools_data = feishu_service.get_schools()
        cities = list(set(school.get("city") for school in schools_data if school.get("city")))
        return {" code": 200, "message": "success", "data": sorted(cities)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/types/list")
async def get_school_types():
    """获取所有院校类型列表"""
    try:
        schools_data = feishu_service.get_schools()
        types = list(set(school.get("school_type") for school in schools_data if school.get("school_type")))
        return {"code": 200, "message": "success", "data": sorted(types)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
