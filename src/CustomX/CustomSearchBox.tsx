// .components/Search/CustomSearchBox.js

import { SearchIcon } from '@heroicons/react/solid'
import { useTranslation } from 'next-i18next'
import { connectSearchBox } from 'react-instantsearch-dom'

function CustomSearchBox({ refine }: any) {
  const { t } = useTranslation()
  return (
    <form action="" className="relative" role="search">
      <label htmlFor="algolia_search" className="absolute left-3.5 top-[18px]">
        <SearchIcon className="w-4 h-4 secondary-svg" />
      </label>
      <input
        id="algolia_search"
        type="search"
        placeholder={t('search-for-posts')}
        autoFocus
        className="p-3.5 pl-10 border-0  shadow-none dark:shadow-none focus:ring-0 dark:focus:ring-0 focus:outline-none dark:focus:outline-none rounded-none placeholder:text-base text-base"
        onChange={(e) => refine(e.currentTarget.value)}
      />
    </form>
  )
}

export default connectSearchBox(CustomSearchBox)
