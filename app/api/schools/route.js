import { NextResponse } from 'next/server'

// 飞书配置（直接硬编码）
const FEISHU_APP_ID = 'cli_a968b3c219b9dbd3'
const FEISHU_APP_SECRET = 'JkpPVLK9IySp24RawJ4ASgfgKX8GjLGU'
const FEISHU_APP_TOKEN = 'CqwBbnJ5xa9SbTsRfGnc3Ar7nLh'
const FEISHU_TABLE_ID = 'tblommDyseaVLP8Q'

// 获取飞书 access_token
async function getAccessToken() {
  const response = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      app_id: FEISHU_APP_ID,
      app_secret: FEISHU_APP_SECRET,
    }),
  })
  const data = await response.json()
  return data.tenant_access_token
}

// 获取院校列表
async function getSchools() {
  const token = await getAccessToken()
  const allRecords = []
  let pageToken = ''
  
  // 分页获取所有记录
  do {
    let url = `https://open.feishu.cn/open-apis/bitable/v1/apps/${FEISHU_APP_TOKEN}/tables/${FEISHU_TABLE_ID}/records?page_size=100`
    if (pageToken) {
      url += `&page_token=${pageToken}`
    }
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    
    const data = await response.json()
    
    if (data.code !== 0) {
      throw new Error(data.msg || '获取数据失败')
    }
    
    // 累积记录
    if (data.data?.items) {
      allRecords.push(...data.data.items)
    }
    
    // 检查是否有更多页
    pageToken = data.data?.page_token || ''
    
  } while (pageToken)
  
  // 转换飞书数据格式
  const schools = allRecords.map((item, index) => {
    const fields = item.fields || {}
    return {
      id: item.record_id || String(index + 1),
      name: fields['院校名称（中文名）'] || '',
      name_en: fields['院校名称（英文名）'] || '',
      city: fields['所在城市'] || '',
      type: fields['院校类型'] || '音乐学院',
      ranking: fields['QS排名'] || null,
      tuition: fields['专业学费（卢布/年）'] ? `约${fields['专业学费（卢布/年）']}卢布/年` : '',
      description: fields['院校简介'] || '',
      website: fields['官方网站']?.link || '',
    }
  })
  
  return schools
}

export async function GET() {
  try {
    const schools = await getSchools()
    return NextResponse.json({
      code: 0,
      message: 'success',
      data: schools,
    })
  } catch (error) {
    return NextResponse.json({
      code: -1,
      message: error.message || '获取数据失败',
      data: [],
    }, { status: 500 })
  }
}
