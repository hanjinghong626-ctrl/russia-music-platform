import { NextResponse } from 'next/server'

// 飞书配置 - 新多维表格（直接硬编码）
const FEISHU_APP_ID = 'cli_a968b3c219b9dbd3'
const FEISHU_APP_SECRET = 'JkpPVLK9IySp24RawJ4ASgfgKX8GjLGU'
const FEISHU_APP_TOKEN = 'KvuBbNZCQaHGIPso7fkcJpWtnqc'

// 数据表ID
const TABLES = {
  basic: 'tblmtviIKG1xUxeB',      // 院校基本信息
  departments: 'tblceQtj5HHuZxDH', // 院系设置
  majors: 'tblwfHt3v6ecizdy',     // 招生专业
  contacts: 'tblLqa3wdldLuy2G',   // 联系方式
}

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

// 从文本字段中提取文本内容
function extractText(value) {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (Array.isArray(value) && value[0]?.text) {
    return value.map(v => v.text).join('')
  }
  return String(value)
}

// 从URL字段中提取链接
function extractUrl(value) {
  if (!value) return { text: '', link: '' }
  if (typeof value === 'object' && value.link) {
    return { text: value.text || value.link, link: value.link }
  }
  return { text: String(value), link: String(value) }
}

// 获取院校基本信息
async function getBasicInfo(token) {
  const response = await fetch(
    `https://open.feishu.cn/open-apis/bitable/v1/apps/${FEISHU_APP_TOKEN}/tables/${TABLES.basic}/records`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
  const data = await response.json()
  if (data.code !== 0 || !data.data?.items?.length) return null

  const fields = data.data.items[0].fields
  return {
    name: extractText(fields['中文名称']),
    name_ru: extractText(fields['俄语名称']),
    name_en: extractText(fields['英语名称']),
    established: extractText(fields['创建时间']),
    firstDean: extractText(fields['首任院长']),
    type: extractText(fields['办学性质']),
    department: extractText(fields['主管部门']),
    duration: extractText(fields['学制']),
    address: extractText(fields['办学地址']),
    description: extractText(fields['院校简介']),
    website: extractUrl(fields['官网地址']),
  }
}

// 获取院系设置
async function getDepartments(token) {
  const response = await fetch(
    `https://open.feishu.cn/open-apis/bitable/v1/apps/${FEISHU_APP_TOKEN}/tables/${TABLES.departments}/records`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
  const data = await response.json()
  if (data.code !== 0) return []

  return (data.data?.items || []).map(item => ({
    id: item.record_id,
    name: extractText(item.fields['院系名称']),
    name_ru: extractText(item.fields['俄语名称']),
    departments: extractText(item.fields['教研室/专业']),
    note: extractText(item.fields['备注']),
  }))
}

// 获取招生专业
async function getMajors(token) {
  const response = await fetch(
    `https://open.feishu.cn/open-apis/bitable/v1/apps/${FEISHU_APP_TOKEN}/tables/${TABLES.majors}/records`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
  const data = await response.json()
  if (data.code !== 0) return []

  return (data.data?.items || []).map(item => ({
    id: item.record_id,
    faculty: extractText(item.fields['所属院系']),
    code: extractText(item.fields['招生代码']),
    name: extractText(item.fields['专业名称']),
    name_ru: extractText(item.fields['俄语名称']),
  }))
}

// 获取联系方式
async function getContacts(token) {
  const response = await fetch(
    `https://open.feishu.cn/open-apis/bitable/v1/apps/${FEISHU_APP_TOKEN}/tables/${TABLES.contacts}/records`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
  const data = await response.json()
  if (data.code !== 0) return []

  return (data.data?.items || []).map(item => ({
    id: item.record_id,
    name: extractText(item.fields['部门名称']),
    description: extractText(item.fields['职能描述']),
    address: extractText(item.fields['地址']),
    phone: extractText(item.fields['电话']),
    email: extractText(item.fields['邮箱']),
    note: extractText(item.fields['备注']),
  }))
}

export async function GET(request, { params }) {
  try {
    // 目前只支持莫斯科柴院 (ID: chaikovsky)
    // 未来可扩展支持其他院校
    if (params.id !== 'chaikovsky' && params.id !== 'recvha8fClkXA8') {
      return NextResponse.json({
        code: -1,
        message: '暂不支持该院校的详细信息',
        data: null,
      }, { status: 404 })
    }

    const token = await getAccessToken()

    // 并行获取所有数据
    const [basicInfo, departments, majors, contacts] = await Promise.all([
      getBasicInfo(token),
      getDepartments(token),
      getMajors(token),
      getContacts(token),
    ])

    // 按院系分组专业
    const majorsByFaculty = majors.reduce((acc, major) => {
      const faculty = major.faculty || '其他'
      if (!acc[faculty]) {
        acc[faculty] = []
      }
      acc[faculty].push(major)
      return acc
    }, {})

    return NextResponse.json({
      code: 0,
      message: 'success',
      data: {
        basicInfo,
        departments,
        majors,
        majorsByFaculty,
        contacts,
      },
    })
  } catch (error) {
    console.error('获取院校详情失败:', error)
    return NextResponse.json({
      code: -1,
      message: error.message || '获取数据失败',
      data: null,
    }, { status: 500 })
  }
}
