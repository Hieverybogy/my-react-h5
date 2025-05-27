import type { PageParams } from './common'
export namespace addminAccount {
  export interface CreateParams {
    user_name: string
    password?: string
    status: number
  }

  export interface EditParams extends CreateParams {
    user_id: string
  }

  export interface item extends EditParams {
    agent_id: string
    create_time?: number
    update_time?: number
  }

  export interface filter extends PageParams {
    user_name?: string
    status?: number
  }
}
