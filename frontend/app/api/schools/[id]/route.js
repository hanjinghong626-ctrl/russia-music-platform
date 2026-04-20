import { NextResponse } from 'next/server'
import { schoolsData } from '../../../../data/schools'

// 根据ID返回单个院校
export async function GET(request, { params }) {
  try {
    const { id } = await params
    const school = schoolsData.find(s => s.id === id)
    
    if (!school) {
      return NextResponse.json({ code: 404, message: '院校不存在' })
    }
    
    return NextResponse.json({ code: 0, data: school })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ code: 500, message: '服务器错误' })
  }
}
