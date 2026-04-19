"""
配置文件 - 管理环境变量和应用配置
"""
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """应用配置"""
    
    # 飞书应用配置
    FEISHU_APP_ID: str = "cli_a968b3c219b9dbd3"
    FEISHU_APP_SECRET: str = "JkpPVLK9IySp24RawJ4ASgfgKX8GjLGU"
    
    # 飞书多维表格配置
    FEISHU_APP_TOKEN: str = "CqwBbnJ5xa9SbTsRfGnc3Ar7nLh"
    FEISHU_TABLE_ID: str = "tblommDyseaVLP8Q"
    
    # API 配置
    API_PREFIX: str = "/api"
    API_TITLE: str = "俄罗斯音乐留学平台 API"
    API_VERSION: str = "1.0.0"
    
    # CORS 配置
    CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://your-frontend.vercel.app",
    ]
    
    # 调试模式
    DEBUG: bool = True

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "allow"


@lru_cache()
def get_settings() -> Settings:
    """获取配置单例"""
    return Settings()


settings = get_settings()
