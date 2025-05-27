export interface ResultData<T = any> {
  list?: T[]
  start: number
  page_size: number
  total: number | 0
}

export type ResultReqData = {
  entity: any
}

export interface PageParams {
  start: number
  count: number
  sort_order?: string
  sort_field?: string
}
