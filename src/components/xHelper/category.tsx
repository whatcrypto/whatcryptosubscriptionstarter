import { IPostCategory } from '@/interfaces/ISubmission'
import { LockClosedIcon } from '@heroicons/react/solid'
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '../radix/Tooltip'

export const CategoryContentDisplayer: React.FC<{ category?: IPostCategory }> = ({ category }) => {
  return (
    <>
      {category?.private ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <LockClosedIcon
                className={`h-4 flex-shrink-0 w-4 mr-1 text-background-accent/60 dark:text-background-accent`}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs text-center">
                Only admins can see this board and posts made in it.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : null}
      {category?.category}
    </>
  )
}
