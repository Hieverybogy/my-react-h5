import { Button, Form, Input, Toast, Card } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const Login = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const onFinish = async (values: any) => {
    const { username, password } = values
    setLoading(true)

    setTimeout(() => {
      if (username === 'admin' && password === '123456') {
        localStorage.setItem('token', 'mock-token')
        // Toast.show({ icon: 'success', content: '登录成功' })
        navigate('/')
      } else {
        Toast.show({ icon: 'fail', content: '账号或密码错误' })
      }
      setLoading(false)
    }, 500)
  }

  return (
    <div
      style={{
        padding: 24,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <div style={{ width: '100%', maxWidth: 340 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>用户登录</h2>
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input placeholder="用户名：admin" clearable />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input type="password" placeholder="密码：123456" clearable />
          </Form.Item>
          <Button block color="primary" type="submit" loading={loading}>
            登录
          </Button>
        </Form>
      </div>
    </div>
  )
}

export default Login
