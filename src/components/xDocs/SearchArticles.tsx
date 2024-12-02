import React from 'react'
import PopupWrapper from '../PopupWrapper'
import DocsMeilisearch from './DocsMeilisearch'

const SearchArticles: React.FC<{
  isOpen: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  dashboardView?: boolean
  widget?: boolean
  setActiveView?: React.Dispatch<
    React.SetStateAction<{
      type: string
      id: string
    }>
  >
}> = ({ isOpen, setOpen, dashboardView, widget, setActiveView }) => {
  return (
    <PopupWrapper
      fixToTop={true}
      medium={true}
      hasPadding={false}
      hideBg={true}
      isOpen={isOpen}
      setIsOpen={setOpen}
    >
      <DocsMeilisearch
        widget={widget}
        setActiveView={setActiveView}
        dashboardView={dashboardView}
        setOpen={setOpen}
        popupVersion={true}
      />
    </PopupWrapper>
  )
}

export default SearchArticles
