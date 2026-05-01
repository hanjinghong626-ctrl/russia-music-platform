import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const data = await request.json()
    const { name, phone, wechat, audio_level, target_school, description, email } = data
    
    // 验证必填字段
    if (!name || !phone || !wechat || !audio_level) {
      return NextResponse.json(
        { error: '请填写所有必填项' },
        { status: 400 }
      )
    }
    
    // 验证手机号格式
    const phoneRegex = /^1[3-9]\d{9}$/
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { error: '请输入有效的手机号' },
        { status: 400 }
      )
    }
    
    // 保存申请数据（这里可以扩展为保存到数据库或发送邮件）
    const application = {
      id: `APP_${Date.now()}`,
      name,
      phone,
      wechat,
      email: email || '',
      audio_level,
      target_school: target_school || '',
      description: description || '',
      status: 'pending',
      created_at: new Date().toISOString()
    }
    
    // 发送通知到管理员（可选扩展）
    // await sendAdminNotification(application)
    
    return NextResponse.json({
      success: true,
      message: '申请已提交，我们将在24小时内与您联系',
      application_id: application.id
    })
    
  } catch (error) {
    console.error('申请提交失败:', error)
    return NextResponse.json(
      { error: '提交失败，请重试' },
      { status: 500 }
    )
  }
}
