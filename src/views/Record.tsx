import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { List, Card, Toast, DatePicker, PullToRefresh, NavBar } from 'antd-mobile'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { useLocation } from 'react-router-dom'

type PunchRecord = {
  id: number
  time: string // ISO 格式
  address: string
}

const Record = () => {
  const [records, setRecords] = useState<PunchRecord[]>([])
  const [month, setMonth] = useState(() => dayjs())
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  function useHashQuery() {
    const { hash } = useLocation()
    const queryString = hash.includes('?') ? hash.split('?')[1] : ''
    const params = new URLSearchParams(queryString)
    return Object.fromEntries(params.entries())
  }

  const query = useHashQuery()

  const fetchData = async (selectedMonth = month) => {
    setLoading(true)
    try {
      const yearMonth = selectedMonth.format('YYYY-MM')
      const res = await axios.get('/api/overtime/monthly', {
        params: { yearMonth, userId: query.userId || '1111111' },
      })
      setRecords(res.data.result.data || [])
    } catch (err) {
      Toast.show({ icon: 'fail', content: '获取打卡记录失败' })
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: 12 }}>
        <span
          style={{ fontSize: 14, color: '#1677ff', paddingRight: 12 }}
          onClick={() => setVisible(true)}
        >
          {month.format('YYYY年MM月')}
          {` >`}
        </span>
      </div>

      <DatePicker
        title="选择月份"
        visible={visible}
        precision="month"
        onClose={() => setVisible(false)}
        value={month.toDate()}
        onConfirm={val => {
          const selected = dayjs(val)
          setMonth(selected)
          fetchData(selected)
        }}
      />

      <PullToRefresh onRefresh={() => fetchData()}>
        <div style={{ padding: 16 }}>
          <Card
            title={`${month.format('YYYY年MM月')}（共${records.length}天）`}
            style={{ marginBottom: 16 }}
          >
            <List>
              {records.map((record, idx) => (
                <List.Item key={record.id || idx}>
                  {dayjs(record.punchTime).format('YYYY-MM-DD')} -{' '}
                  {dayjs(record.punchTime).format('HH:mm:ss')}
                </List.Item>
              ))}
            </List>
          </Card>
          {!records.length && !loading && (
            <div style={{ textAlign: 'center', marginTop: 32, color: '#999' }}>暂无数据</div>
          )}
        </div>
      </PullToRefresh>
    </div>
  )
}

export default Record
