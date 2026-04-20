import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

// 直接从本地JSON获取所有院校
export async function GET() {
  try {
    const filePath = join(process.cwd(), 'data', 'schools.json')
    const fileContent = readFileSync(filePath, 'utf8')
    const schoolsData = JSON.parse(fileContent)
    
    const items = schoolsData.data?.items || []
    
    const schools = items.map(item => {
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
    })
    
    return NextResponse.json(schools)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
