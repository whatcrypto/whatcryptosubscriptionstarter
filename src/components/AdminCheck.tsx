import { BadgeCheckIcon } from '@heroicons/react/solid'
import { IOrganization } from '../interfaces/IOrganization'
import { isMember } from '@/lib/acl'

const DisplayMemberCheckmark: React.FC<{
  authorId: string
  org: IOrganization
  smaller?: boolean
  customDark?: string
}> = ({ authorId, org, smaller = false, customDark }) => {
  return isMember(authorId, org) ? (
    <div
      className={`${
        smaller ? 'h-3.5 w-3.5 -m-1' : ' h-4 w-4 -m-1 z-10'
      } right-0 absolute border  dark:border-card rounded-full bg-white border-white dark:bg-card`}
    >
      <BadgeCheckIcon className="text-indigo-400 dark:text-indigo-500" />
    </div>
  ) : null
}
export default DisplayMemberCheckmark
