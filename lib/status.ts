import { IOrganization, IOrganizationStatus } from '@/interfaces/IOrganization'
import { AxiosResponse } from 'axios'
import { addStatus } from 'network/lib/organization'
import { toast } from 'sonner'
import { KeyedMutator } from 'swr'

export const createStatusAndMutate = (
  status: {
    name: string
    color: string
    type: 'reviewing' | 'unstarted' | 'active' | 'completed' | 'canceled'
    isDefault: boolean
  },
  org: IOrganization,
  mutateCurrentOrg: KeyedMutator<any>
): Promise<string | AxiosResponse<any, any>> => {
  return new Promise((resolve, reject) => {
    // Add new category
    if (!org.postStatuses.some((stat) => stat.name === status.name) && org.postStatuses) {
      addStatus(status as IOrganizationStatus)
        .then((res) => {
          toast.success('Status created')
          mutateCurrentOrg()
          resolve(res)
        })
        .catch((err: any) => {
          const errorMsg = err.response?.data.error
          toast.error(errorMsg)
        })
    } else {
      const errorMsg = 'Status name already exists'
      toast.error(errorMsg)
    }
  })
}
