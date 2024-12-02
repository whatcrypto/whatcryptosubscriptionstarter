import { IOrganization } from '@/interfaces/IOrganization'
import { IPostCategoryWithoutId } from '@/interfaces/ISubmission'
import { AxiosError } from 'axios'
import { addNewCategory } from 'network/lib/organization'
import { toast } from 'sonner'
import { KeyedMutator } from 'swr'

export const createCategoryCallback = (
  c: IPostCategoryWithoutId,
  org: IOrganization,
  mutateCurrentOrg: KeyedMutator<any>,
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    if (
      c?.category?.length >= 3 &&
      !org?.postCategories.find((cat) => cat.category === c.category)
    ) {
      setOpen && setOpen(false)
      // Add category here
      addNewCategory({
        category: c.category,
        prefill: c?.prefill ? c.prefill : '',
        private: c.private,
      })
        .then((resp) => {
          mutateCurrentOrg({ ...org, postCategories: [...org.postCategories, c] }, false)
          toast.success('Board created')
          resolve(resp?.data)
        })
        .catch((err: AxiosError) => {
          toast.error(err.response?.data?.message)
          //   reject(err)
        })
    } else {
      if (org.postCategories.find((cat) => cat.category === c.category)) {
        toast.error('Board with this name already exists')
      } else if (c.category.length <= 2) {
        toast.error('Name must be more than 2 characters')
      }
      //   reject(new Error('Invalid category or plan'))
    }
  })
}
