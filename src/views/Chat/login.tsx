import React, { useState } from 'react'
import { Button, Form, Input, message } from 'antd'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { setChatUser, setChatToken } from '@/store/modules/chatUser'
import type { UserInfo } from '@/store/modules/chatUser'

const ChatLogin: React.FC = () => {
  const navigate = useNavigate()
  const disptch = useAppDispatch()

  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const [messageApi, contextHolder] = message.useMessage()

  const onFinish = (values: any) => {
    const { username, password } = values
    setLoading(true)

    axios
      .post('/api/chat/user/login', {
        username,
        password,
      })
      .then(res => {
        if (res.data.code === 0) {
          messageApi.open({
            type: 'success',
            content: '登录成功',
          })
          disptch(setChatUser(res.data.result?.user as UserInfo))
          disptch(setChatToken(res.data.result?.token as string))

          navigate('/chat')
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
    <>
      {contextHolder}
      <div className="flex justify-center items-center pt-[80px]">
        <div
          className="bg-[#fff] w-[500px] pt-[30px] pb-[80px] px-[50px] rounded-[4px]"
          style={{ boxShadow: '0 0px 4px 2px rgba(0, 0, 0, 0.1)' }}
        >
          <div className="text-[18px] font-bold text-center">Welcome Back</div>
          <div className="text-[12px] text-[#999] text-center mt-[5px]">
            Please enter your details to sign in
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
                登录
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </>
  )
}
export default ChatLogin
