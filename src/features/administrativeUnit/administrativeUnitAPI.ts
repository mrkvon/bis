import { AdministrativeUnit } from './types'
import axios from '../../config/axios'

export const readAdministrativeUnits = async (): Promise<
  AdministrativeUnit[]
> => {
  const response = await axios.request<AdministrativeUnit[]>({
    method: 'get',
    url: 'bronto/administrative_unit/',
  })

  return response.data
}
