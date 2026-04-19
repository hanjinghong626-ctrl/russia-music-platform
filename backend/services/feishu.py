"""
飞书服务 - 与飞书多维表格交互
"""
import logging
from typing import List, Optional, Dict, Any
from lark_oapi.api.drive.v1 import (
    CreateTableAppTokenAuthorization,
    ListTableRequest,
    ListTableResponse,
    QueryTableRequest,
    QueryTableResponse,
)
from lark_oapi.api.drive.v1.model.table_app_token_authorization_builder import (
    TableAppTokenAuthorizationBuilder,
)
from lark_oapi.adapter.requests import RequestsAdapter
from config import settings

logger = logging.getLogger(__name__)


class FeishuService:
    """飞书服务类"""

    def __init__(self):
        self.app_id = settings.FEISHU_APP_ID
        self.app_secret = settings.FEISHU_APP_SECRET
        self.app_token = settings.FEISHU_APP_TOKEN
        self.table_id = settings.FEISHU_TABLE_ID

    def _get_client(self):
        """获取飞书客户端"""
        if not self.app_id or not self.app_secret:
            raise ValueError(
                "飞书应用凭证未配置，请设置 FEISHU_APP_ID 和 FEISHU_APP_SECRET 环境变量"
            )
        
        from lark_oapi import Client
        return Client.builder(
            self.app_id,
            self.app_secret,
            token_type="tenant",
            logger_level=logging.INFO,
        ).build()

    def _get_authorization(self) -> CreateTableAppTokenAuthorization:
        """获取多维表格授权"""
        return TableAppTokenAuthorizationBuilder.builder().build()

    def get_schools(self, filters: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        """
        从飞书多维表格获取院校列表
        
        Args:
            filters: 筛选条件 (city, school_type, search)
            
        Returns:
            院校列表
        """
        # 如果没有配置飞书凭证，返回模拟数据
        if not self.app_id or not self.app_secret:
            return self._get_mock_schools(filters)

        try:
            client = self._get_client()
            
            # 构建查询请求
            request = (
                QueryTableRequest.builder()
                .table_app_token(self.app_token)
                .table_id(self.table_id)
                .build()
            )
            
            # 执行查询
            response: QueryTableResponse = client.drive.v1.table.query(request)
            
            if not response.success():
                logger.error(f"飞书 API 调用失败: {response.msg}")
                return self._get_mock_schools(filters)

            # 处理返回数据
            schools = []
            if response.data and response.data.items:
                for item in response.data.items:
                    school = self._parse_record(item)
                    if self._filter_school(school, filters):
                        schools.append(school)

            return schools

        except Exception as e:
            logger.error(f"获取院校数据失败: {e}")
            return self._get_mock_schools(filters)

    def get_school_by_id(self, school_id: str) -> Optional[Dict[str, Any]]:
        """
        获取单个院校详情
        
        Args:
            school_id: 院校ID
            
        Returns:
            院校详情
        """
        schools = self.get_schools()
        for school in schools:
            if school.get("id") == school_id:
                return school
        return None

    def _parse_record(self, record: Any) -> Dict[str, Any]:
        """解析飞书记录"""
        school = {}
        
        if hasattr(record, "fields") and record.fields:
            fields = record.fields
            
            # 映射字段
            field_mapping = {
                "院校名称": "name",
                "英文名称": "name_en",
                "城市": "city",
                "院校类型": "school_type",
                "排名": "ranking",
                "建校年份": "established_year",
                "简介": "description",
                "学费": "tuition_fee",
                "语言要求": "language_requirement",
                "专业": "majors",
                "入学要求": "admission_requirements",
                "联系方式": "contact_info",
                "官网": "website",
                "图片": "image_url",
                "亮点": "highlight",
                "推荐": "is_featured",
            }
            
            for feishu_field, model_field in field_mapping.items():
                if feishu_field in fields:
                    school[model_field] = fields[feishu_field]
        
        # 设置ID
        if hasattr(record, "record_id"):
            school["id"] = record.record_id
        
        return school

    def _filter_school(self, school: Dict[str, Any], filters: Optional[Dict[str, Any]]) -> bool:
        """筛选院校"""
        if not filters:
            return True

        # 城市筛选
        if filters.get("city") and school.get("city") != filters["city"]:
            return False

        # 类型筛选
        if filters.get("school_type") and school.get("school_type") != filters["school_type"]:
            return False

        # 关键词搜索
        if filters.get("search"):
            search = filters["search"].lower()
            name = school.get("name", "").lower()
            desc = school.get("description", "").lower()
            if search not in name and search not in desc:
                return False

        return True

    def _get_mock_schools(self, filters: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        """获取模拟数据"""
        mock_data = [
            {
                "id": "1",
                "name": "莫斯科柴可夫斯基音乐学院",
                "name_en": "Moscow Conservatory",
                "city": "莫斯科",
                "school_type": "国立音乐学院",
                "ranking": 1,
                "established_year": 1866,
                "description": "世界顶尖音乐学府，培养了众多国际著名音乐家",
                "tuition_fee": "5000-8000",
                "language_requirement": "俄语/英语",
                "majors": "钢琴、小提琴、大提琴、声乐、作曲、交响乐指挥",
                "admission_requirements": "高中毕业证、音乐专业背景、通过入学考试",
                "contact_info": "info@mosconsv.ru",
                "website": "https://www.mosconsv.ru",
                "highlight": "世界顶尖",
                "is_featured": True,
            },
            {
                "id": "2",
                "name": "圣彼得堡音乐学院",
                "name_en": "St. Petersburg Conservatory",
                "city": "圣彼得堡",
                "school_type": "国立音乐学院",
                "ranking": 2,
                "established_year": 1862,
                "description": "俄罗斯最古老的音乐学院之一，音乐教育质量卓越",
                "tuition_fee": "4500-7500",
                "language_requirement": "俄语",
                "majors": "钢琴、声乐、小提琴、作曲、音乐理论",
                "admission_requirements": "高中毕业证、专业面试、理论考试",
                "contact_info": "info@conservatory.ru",
                "website": "https://www.conservatory.ru",
                "highlight": "历史悠久",
                "is_featured": True,
            },
            {
                "id": "3",
                "name": "格涅辛音乐学院",
                "name_en": "Gnessin State Musical College",
                "city": "莫斯科",
                "school_type": "国立音乐学院",
                "ranking": 3,
                "established_year": 1895,
                "description": "俄罗斯著名的音乐教育机构，涵盖从附中到大学的完整培养体系",
                "tuition_fee": "4000-7000",
                "language_requirement": "俄语",
                "majors": "钢琴、弦乐、铜管乐、打击乐、合唱指挥",
                "admission_requirements": "专业能力测试、文化课考试",
                "contact_info": "priem@gnessin.ru",
                "website": "https://www.gnessin.ru",
                "highlight": "体系完整",
                "is_featured": False,
            },
            {
                "id": "4",
                "name": "喀山音乐学院",
                "name_en": "Kazan Conservatory",
                "city": "喀山",
                "school_type": "国立音乐学院",
                "ranking": 4,
                "established_year": 1945,
                "description": "伏尔加地区最重要的音乐教育中心",
                "tuition_fee": "3000-5000",
                "language_requirement": "俄语",
                "majors": "钢琴、声乐、民乐、作曲",
                "admission_requirements": "专业考试、俄语水平测试",
                "contact_info": "kazan_cons@mail.ru",
                "website": "https://kazancons.ru",
                "highlight": "区域名校",
                "is_featured": False,
            },
            {
                "id": "5",
                "name": "新西伯利亚音乐学院",
                "name_en": "Novosibirsk Conservatory",
                "city": "新西伯利亚",
                "school_type": "国立音乐学院",
                "ranking": 5,
                "established_year": 1956,
                "description": "西伯利亚地区顶尖的音乐学院",
                "tuition_fee": "3500-5500",
                "language_requirement": "俄语",
                "majors": "钢琴、弦乐、管乐、作曲、指挥",
                "admission_requirements": "专业面试、音乐理论测试",
                "contact_info": "info@ngcons.ru",
                "website": "https://www.ngcons.ru",
                "highlight": "西伯利亚第一",
                "is_featured": False,
            },
            {
                "id": "6",
                "name": "罗斯托夫音乐学院",
                "name_en": "Rostov Conservatory",
                "city": "罗斯托夫",
                "school_type": "国立音乐学院",
                "ranking": 6,
                "established_year": 1969,
                "description": "俄罗斯南部重要的音乐教育基地",
                "tuition_fee": "3000-5000",
                "language_requirement": "俄语",
                "majors": "钢琴、声乐、弦乐、作曲",
                "admission_requirements": "入学考试、俄语预科",
                "contact_info": "rostcons@mail.ru",
                "website": "https://rostcons.ru",
                "highlight": "南部重镇",
                "is_featured": False,
            },
        ]

        # 应用筛选
        if not filters:
            return mock_data

        result = []
        for school in mock_data:
            if self._filter_school(school, filters):
                result.append(school)
        return result


# 全局服务实例
feishu_service = FeishuService()
