import React, { useMemo, useState } from 'react'
import UserPicture from './UserPicture'
import { getIdentifiedUser } from 'network/lib/user'
import { useMembers } from '@/data/organization'

const UserProfileFilterDisplayer: React.FC<{ id: string }> = ({ id }) => {
  const [author, setAuthor] = useState<{
    id: string
    name: string
    profilePicture: string
  } | null>(null)

  const { members } = useMembers(true)

  useMemo(() => {
    if (id === 'unassigned') {
      setAuthor({
        id: 'unassigned',
        name: 'Unassigned',
        profilePicture: '',
      })
      return
    }

    if (!author || author.id !== id) {
      const memberMatch = members?.find((member) => member.id === id)
      if (memberMatch) {
        setAuthor({
          id: memberMatch.id,
          name: memberMatch.name,
          profilePicture: memberMatch.profilePicture,
        })
      } else {
        const fetchAuthorName = async () => {
          try {
            const res = await getIdentifiedUser({ id })
            setAuthor({
              id: res.data.user?.id,
              name: res.data.user.name,
              profilePicture: res.data.user.profilePicture,
            })
          } catch (error) {
            console.error('Error fetching author name:', error)
            setAuthor(null)
          }
        }
        fetchAuthorName()
      }
    }
  }, [id, members])

  return (
    <>
      <UserPicture authorId={author?.id} xSmall={true} img={author?.profilePicture} />
      <p className="ml-2 select-none max-w-[350px] truncate font-medium dark:font-semibold">
        {id === 'unassigned' ? 'Unassigned' : author?.name ?? 'Loading...'}
      </p>
    </>
  )
}

export default UserProfileFilterDisplayer
