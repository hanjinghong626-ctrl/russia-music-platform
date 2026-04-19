"""
Models 模块
"""
from .school import (
    School,
    SchoolBase,
    SchoolListResponse,
    SchoolDetailResponse,
    ErrorResponse,
    FilterParams,
)

__all__ = [
    "School",
    "SchoolBase",
    "SchoolListResponse",
    "SchoolDetailResponse",
    "ErrorResponse",
    "FilterParams",
]
