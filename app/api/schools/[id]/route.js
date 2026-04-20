import { NextResponse } from 'next/server'

// 飞书配置
const FEISHU_APP_ID = process.env.FEISHU_APP_ID || 'cli_a968b3c219b9dbd3'
const FEISHU_APP_SECRET = process.env.FEISHU_APP_SECRET || 'JkpPVLK9IySp24RawJ4ASgfgKX8GjLGU'
const FEISHU_APP_TOKEN = process.env.FEISHU_APP_TOKEN || 'CqwBbnJ5xa9SbTsRfGnc3Ar7nLh'
const FEISHU_TABLE_ID = process.env.FEISHU_TABLE_ID || 'tblommDyseaVLP8Q'

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

// 获取单个院校
async function getSchoolById(id) {
  const token = await getAccessToken()
  
  // 一次性获取所有记录（最多100条，我们只有20条）
  const response = await fetch(
    `https://open.feishu.cn/open-apis/bitable/v1/apps/${FEISHU_APP_TOKEN}/tables/${FEISHU_TABLE_ID}/records?page_size=100`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
  
  const data = await response.json()
  
  if (data.code !== 0) {
    console.error('Feishu API error:', data.msg)
    return null
  }
  
  const items = data.data?.items || []
  const item = items.find(i => i.record_id === id)
  
  if (!item) {
    console.error('School not found for id:', id)
    return null
  }
  
  const fields = item.fields || {}
  return {
    id: item.record_id,
    name: fields['院校名称（中文名）'] || '',
    name_ru: fields['院校名称（俄文名）'] || '',
    name_en: fields['院校名称（英文名）'] || '',
    city: fields['所在城市'] || '',
    established: fields['建校时间'] || null,
    ranking: fields['QS排名'] || null,
    type: fields['院校类型'] || '音乐学院',
    tuition_prep: fields['预科学费（卢布/年）'] || null,
    tuition: fields['专业学费（卢布/年）'] || null,
    living_cost: fields['生活费参考（人民币/月）'] || null,
    language_req: fields['俄语要求'] || 'B1',
    website: fields['官方网站']?.link || '',
    description: fields['院校简介'] || '',
    majors: Array.isArray(fields['优势专业']) ? fields['优势专业'] : [],
    alumni: fields['著名校友'] || '',
    status: fields['数据状态'] || '待完善',
  }
}

export async function GET(request, { params }) {
  try {
    const { id } = await params
    console.log('[API] Fetching school with id:', id)
    const school = await getSchoolById(id)
    console.log('[API] School found:', school ? school.name : 'null')
    if (!school) {
      console.log('[API] School not found for id:', id)
      return NextResponse.json({
        code: -1,
        message: '院校不存在',
        data: null,
      }, { status: 404 })
    }
    return NextResponse.json({
      code: 0,
      message: 'success',
      data: school,
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({
      code: -1,
      message: error.message || '获取数据失败',
      data: null,
    }, { status: 500 })
  }
}
