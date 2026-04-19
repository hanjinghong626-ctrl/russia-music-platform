"""
Pydantic 模型 - 数据验证和序列化
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class SchoolBase(BaseModel):
    """院校基础模型"""
    name: str = Field(..., description="院校名称")
    name_en: Optional[str] = Field(None, description="英文名称")
    city: str = Field(..., description="所在城市")
    school_type: str = Field(..., description="院校类型")
    ranking: Optional[int] = Field(None, description="排名")
    established_year: Optional[int] = Field(None, description="建校年份")
    description: Optional[str] = Field(None, description="院校简介")
    tuition_fee: Optional[str] = Field(None, description="学费范围")
    language_requirement: Optional[str] = Field(None, description="语言要求")
    majors: Optional[str] = Field(None, description="开设专业")
    admission_requirements: Optional[str] = Field(None, description="入学要求")
    contact_info: Optional[str] = Field(None, description="联系方式")
    website: Optional[str] = Field(None, description="官网")
    image_url: Optional[str] = Field(None, description="图片URL")
    highlight: Optional[str] = Field(None, description="院校亮点")
    is_featured: bool = Field(False, description="是否推荐")


class School(SchoolBase):
    """完整院校模型"""
    id: str = Field(..., description="院校ID")
    created_at: Optional[datetime] = Field(None, description="创建时间")
    updated_at: Optional[datetime] = Field(None, description="更新时间")

    class Config:
        from_attributes = True


class SchoolListResponse(BaseModel):
    """院校列表响应"""
    code: int = Field(200, description="状态码")
    message: str = Field("success", description="状态信息")
    data: List[School] = Field(default_factory=list, description="院校列表")
    total: Optional[int] = Field(None, description="总数")


class SchoolDetailResponse(BaseModel):
    """院校详情响应"""
    code: int = Field(200, description="状态码")
    message: str = Field("success", description="状态信息")
    data: Optional[School] = Field(None, description="院校详情")


class ErrorResponse(BaseModel):
    """错误响应"""
    code: int = Field(..., description="错误码")
    message: str = Field(..., description="错误信息")
    data: Optional[dict] = Field(None, description="附加数据")


class FilterParams(BaseModel):
    """筛选参数"""
    city: Optional[str] = Field(None, description="城市筛选")
    school_type: Optional[str] = Field(None, description="院校类型筛选")
    search: Optional[str] = Field(None, description="关键词搜索")
