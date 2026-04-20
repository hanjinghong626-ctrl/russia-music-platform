import { NextResponse } from 'next/server'
import { schoolsData } from '../../../../data/schools'

// 根据ID返回单个院校
export async function GET(request, { params }) {
  try {
    const { id } = await params
    const school = schoolsData.find(s => s.id === id)
    
    if (!school) {
      return NextResponse.json({ error: '院校不存在' }, { status: 404 })
    }
    
    return NextResponse.json(school)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}
