"""
工具函数
"""
from typing import Any, Dict, Optional
import re


def clean_string(text: Optional[str]) -> str:
    """清理字符串中的多余空白"""
    if not text:
        return ""
    return " ".join(text.split())


def validate_email(email: str) -> bool:
    """验证邮箱格式"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))


def validate_url(url: str) -> bool:
    """验证URL格式"""
    pattern = r'^https?://[^\s/$.?#].[^\s]*$'
    return bool(re.match(pattern, url))


def format_currency(amount: float, currency: str = "USD") -> str:
    """格式化货币显示"""
    if currency == "USD":
        return f"${amount:,.0f}"
    return f"{amount:,.0f} {currency}"


def parse_fee_range(fee_str: str) -> tuple[float, float]:
    """解析费用范围字符串"""
    if not fee_str:
        return (0.0, 0.0)
    
    # 支持格式: "5000-8000", "5000", "5000-8000美元"
    fee_str = fee_str.replace("美元", "").replace(",", "").strip()
    
    if "-" in fee_str:
        parts = fee_str.split("-")
        try:
            return (float(parts[0]), float(parts[1]))
        except ValueError:
            return (0.0, 0.0)
    else:
        try:
            amount = float(fee_str)
            return (amount, amount)
        except ValueError:
            return (0.0, 0.0)


def paginate(items: list, page: int = 1, page_size: int = 10) -> Dict[str, Any]:
    """分页处理"""
    total = len(items)
    start = (page - 1) * page_size
    end = start + page_size
    
    return {
        "items": items[start:end],
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": (total + page_size - 1) // page_size,
    }
