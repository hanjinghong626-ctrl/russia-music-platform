import { NextResponse } from 'next/server'
import { schoolsData } from '../../../data/schools'

// 直接返回静态数据
export async function GET() {
  return NextResponse.json(schoolsData)
}
