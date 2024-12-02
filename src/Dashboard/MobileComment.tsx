import React, { Dispatch, SetStateAction, useState } from 'react'
import TextEditor from './TextEditor'
import CommentSwitchButton from './CommentSwitchButton'
import { IComment } from '@/interfaces/IComment'
import { IAdmin, ICustomer } from '@/interfaces/IUser'
import { IOrganization } from '@/interfaces/IOrganization'
import { Dialog, Transition } from '@headlessui/react'
import { ContentModifier } from './ContentReplacer'
import Image from "next/legacy/image"
import DisplayMemberCheckmark from './AdminCheck'
import { XIcon } from '@heroicons/react/solid'

const MobileComment: React.FC<{
  activeComment: IComment | null
  setActiveComment: Dispatch<SetStateAction<IComment | null>>
  t: Function
  user: IAdmin | ICustomer | undefined
  org: IOrganization
  createReply: Function
}> = ({ activeComment, setActiveComment, org, t, user, createReply }) => {
  const [formData, setFormData] = useState({ content: '' })
  const [loading, setLoading] = useState(false)
  const [loadingPrivate, setLoadingPrivate] = useState(false)
  const [isPrivateComment, setIsPrivateComment] = useState(false)
  const [errors, setErrors] = useState('')

  const isOpen = activeComment ? true : false
  if (!activeComment) return null

  return (
    <Transition appear show={isOpen} as={'div'}>
      <Dialog
        as="div"
        // static
        className="fixed inset-0 z-[100] overflow-y-auto overflow-x-hidden "
        open={isOpen}
        onClose={() => setActiveComment(null)}
      >
        <div className={`flex items-center justify-center min-h-screen`}>
          <Dialog.Overlay
            onClick={() => setActiveComment(null)}
            as="div"
            className={`fixed inset-0 bg-opacity-40 dark:bg-opacity-40 bg-gray-900/20 dark:bg-gray-900 backdrop-filter backdrop-blur-sm `}
          />
          <div className={``}>
            <button
              className={`p-1.5 border absolute z-50 shadow-none  hover:bg-white/40 dark:hover:bg-secondary/70 top-3 right-3 md:right-4 bg-transparent md:top-4`}
              onClick={() => setActiveComment(null)}
              tabIndex={-1}
            >
              <XIcon className="w-6 h-6 text-gray-200 dark:text-background-accent" />
            </button>
          </div>
          <Transition.Child
            as="div"
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-300"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
            className={'w-full'}
          >
            <div className="z-50 block w-full p-3 my-0 border-0 border-t sm:hidden border-gray-100/60 dark:border-border dropdown-background">
              <div className="flex items-start w-full p-3 mb-4 space-x-3 border-l-2 dark:border-border">
                <div className="p-1.5 -m-1.5 relative">
                  <div className="relative z-10">
                    <DisplayMemberCheckmark org={org} authorId={activeComment.user?._id || ''} />
                    <div className="w-10 h-10 border border-gray-100 rounded-full dark:border-border/50">
                      <Image
                        unoptimized
                        width={40}
                        height={40}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 dark:bg-secondary/50"
                        src={
                          activeComment.user?.picture ||
                          'https://fb-usercontent.fra1.cdn.digitaloceanspaces.com/fallback-2f917ea5-3057-4127-82f4-b6462bfc70f4.png'
                        }
                        alt=""
                      />
                    </div>
                  </div>
                </div>
                <div className="relative flex-1 min-w-0">
                  <div>
                    <div className="flex flex-wrap items-center text-sm">
                      <p className="font-semibold text-gray-600 dark:text-gray-100">
                        {activeComment.user?.name}
                      </p>
                    </div>
                  </div>
                  <div className="mt-1.5 text-sm text-gray-400 content dark:text-foreground">
                    <ContentModifier content={activeComment.content} />
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-foreground">Reply to comment</p>
              {activeComment && (
                <div className="py-3">
                  <TextEditor
                    className="styled-editor"
                    formData={formData}
                    setFormData={(data) => setFormData({ ...formData, content: data })}
                    height={50}
                    insideContent={
                      <CommentSwitchButton
                        fixedPrivate={activeComment?.isPrivate}
                        isPrivateComment={isPrivateComment}
                        loading={loading}
                        org={org}
                        setIsPrivateComment={setIsPrivateComment}
                        elementId={activeComment?.id}
                        user={user}
                        buttonText={t('reply-to-comment')}
                        callback={(comId) =>
                          createReply(
                            comId,
                            formData,
                            setFormData,
                            () => setActiveComment(null),
                            setLoading,
                            loading,
                            setErrors,
                            isPrivateComment
                          )
                        }
                        isReply={true}
                      />
                    }
                  />
                </div>
              )}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}

export default MobileComment
