import { IOrganization } from '@/interfaces/IOrganization'
import { IOrganizationUpdate, updateOrganization } from 'network/lib/organization'
import { toast } from 'sonner'
import { KeyedMutator } from 'swr'

export const orgSettingsChanger = (
  updatableSettings: IOrganizationUpdate,
  newOptimisticData: IOrganization,
  mutateCurrentOrg: KeyedMutator<IOrganization>,
  showNotification: boolean = true,
  customNotification?: string,
  callback?: (success: boolean) => void
) => {
  mutateCurrentOrg(
    updateOrganization(updatableSettings).then((res) => {
      showNotification &&
        toast.success(
          customNotification ? customNotification : 'Successfully changed organization settings'
        )
      callback && callback(true)
      if (res?.data?.organization) return res?.data?.organization
    }),
    {
      optimisticData: newOptimisticData,
      rollbackOnError: true,
      populateCache: true,
      revalidate: false,
    }
  ).catch((err) => {
    console.error(err)
    showNotification && toast.error(err?.response?.data?.message || 'Something went wrong')
    callback && callback(false)
  })
}
