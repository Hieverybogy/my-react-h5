import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Form, Input, message } from 'antd'
import axios from 'axios'

const ChatRegister: React.FC = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const [messageApi, contextHolder] = message.useMessage()

  const onFinish = (values: any) => {
    const { username, password } = values
    setLoading(true)

    axios
      .post('/api/chat/user/register', {
        username,
        password,
      })
      .then(res => {
        console.log(11111, res)

        if (res.data.code === 0) {
          messageApi.open({
            type: 'success',
            content: '注册成功',
          })
          navigate('/chat/login')
        } else {
          messageApi.open({
            type: 'error',
            content: res.data.errorDesc,
          })
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <div className="flex justify-center items-center pt-[80px]">
      {contextHolder}
      <div
        className="bg-[#fff] w-[500px] pt-[30px] pb-[80px] px-[50px] rounded-[4px]"
        style={{ boxShadow: '0 0px 4px 2px rgba(0, 0, 0, 0.1)' }}
      >
        <div className="text-[18px] font-bold text-center">Create account</div>
        <div className="text-[12px] text-[#999] text-center mt-[5px]">
          Join our secure messaging community today
        </div>

        <div className="mt-[100px]">
          <Form form={form} onFinish={onFinish} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
            <Form.Item
              name="username"
              label="用户名"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input placeholder="请输入用户名" allowClear />
            </Form.Item>
            <Form.Item
              name="password"
              label="密码"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password placeholder="请输入密码" allowClear />
            </Form.Item>
            <Button
              className="mt-[30px]"
              block
              color="primary"
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              注册
            </Button>
          </Form>
        </div>
      </div>
    </div>
  )
}
export default ChatRegister
