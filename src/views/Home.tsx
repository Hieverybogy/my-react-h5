import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Button, Card, Divider, DotLoading, Toast } from 'antd-mobile'
import { useNavigate, useLocation } from 'react-router-dom'

const AMAP_KEY = '8063855bc72c51c365d84c88c7bb6714' // ← 替换成你自己的 key

const Home = () => {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [address, setAddress] = useState<string>('')

  function useHashQuery() {
    const { hash } = useLocation()
    const queryString = hash.includes('?') ? hash.split('?')[1] : ''
    const params = new URLSearchParams(queryString)
    return Object.fromEntries(params.entries())
  }

  const query = useHashQuery()

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async position => {
        const { latitude, longitude } = position.coords
        setLocation({ latitude, longitude })

        try {
          const amapRes = await axios.get(
            `https://restapi.amap.com/v3/geocode/regeo?output=json&location=${longitude},${latitude}&key=${AMAP_KEY}`
          )
          const result = amapRes.data.regeocode
          const fullAddress = result?.formatted_address || ''
          setAddress(fullAddress)
        } catch (e) {
          Toast.show({
            icon: 'fail',
            content: '解析地址失败',
          })
        }
      },
      err => {
        Toast.show({
          icon: 'fail',
          content: '获取定位失败，请检查权限',
        })
      }
    )
  }, [])

  const handlePunch = async () => {
    if (!location || !address) {
      Toast.show({
        icon: 'fail',
        content: '定位未完成，请稍后重试',
      })
      return
    }

    setLoading(true)
    try {
      const res = await axios.post('/api/overtime/punch', {
        latitude: location.latitude,
        longitude: location.longitude,
        address,
        userId: query.userId || '1111111',
      })

      Toast.show({
        icon: 'success',
        content: res.data.message || '打卡成功',
      })
    } catch (err) {
      Toast.show({
        icon: 'fail',
        content: '打卡失败，请重试',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRecord = () => {
    navigate('/record')
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '40px 16px',
      }}
    >
      <Card
        style={{ width: '100%', maxWidth: 400 }}
        title="加班打卡"
        headerStyle={{ fontWeight: 'bold', fontSize: 18 }}
      >
        <a className="text-primary" onClick={handleRecord}>
          查看打卡记录
        </a>
        <Divider />
        <div style={{ marginBottom: 12, fontSize: 14 }}>当前地址：{address || '正在定位...'}</div>
        <Button
          color="primary"
          fill="solid"
          block
          size="large"
          onClick={handlePunch}
          loading={loading}
          loadingText={
            <>
              <DotLoading /> 正在打卡
            </>
          }
        >
          {!loading && '立即打卡'}
        </Button>
      </Card>
    </div>
  )
}

export default Home
