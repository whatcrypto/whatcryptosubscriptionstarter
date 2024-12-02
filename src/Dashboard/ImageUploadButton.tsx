import React, { useRef, ChangeEvent } from 'react'
import { AxiosError } from 'axios'
import { toast } from 'sonner'
import { uploadImageCloudflare } from '../../network/lib/organization'
import Loader from './Loader'
import { XIcon } from '@heroicons/react/solid'
import { cn } from '@/lib/utils'

interface ImageUploadButtonProps {
  onUploadComplete: (imageUrl: string) => void
  imgBg: boolean
  customClassname?: string
}

const ImageUploadButton: React.FC<ImageUploadButtonProps> = ({
  onUploadComplete,
  imgBg,
  customClassname,
}) => {
  const inputFile = useRef<HTMLInputElement>(null)
  const [uploadingImage, setUploadingImage] = React.useState<boolean>(false)

  const uploadImage = async (file: File) => {
    setUploadingImage(true)
    const formData = new FormData()
    formData.append('image', file)

    return new Promise((resolve, reject) => {
      uploadImageCloudflare(formData)
        .then((res: any) => {
          setUploadingImage(false)
          resolve(res.data.src)
        })
        .catch((err: AxiosError) => {
          toast.error(err.response?.data.error)
          setUploadingImage(false)
          reject(err.response?.data.error)
        })
    })
  }

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    inputFile.current?.click()
  }

  const handleFileInput = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0]
    if (file) {
      try {
        const imageUrl = await uploadImage(file)
        onUploadComplete(imageUrl as string)
      } catch (error) {
        console.error('Image upload failed', error)
      }
    }
  }

  return (
    <>
      <input
        type="file"
        accept="image/*"
        ref={inputFile}
        style={{ display: 'none' }}
        onChange={handleFileInput}
      />
      {imgBg && (
        <button
          className={cn(
            'absolute bottom-4 left-4 dashboard-secondary opacity-0 group-hover:opacity-100 main-transition py-2 mr-2'
          )}
          onClick={() => onUploadComplete('')}
        >
          <XIcon className="w-5 h-5" />
        </button>
      )}
      <button
        className={
          customClassname
            ? customClassname
            : imgBg
            ? 'absolute bottom-4 right-4 dashboard-secondary opacity-0 group-hover:opacity-100 main-transition'
            : 'dashboard-secondary'
        }
        onClick={handleButtonClick}
      >
        {uploadingImage ? (
          <div className="secondary-svg mr-1.5">
            <Loader />
          </div>
        ) : (
          !customClassname && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 secondary-svg mr-1.5"
            >
              <path
                fillRule="evenodd"
                d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
                clipRule="evenodd"
              />
            </svg>
          )
        )}
        {customClassname
          ? imgBg
            ? 'Change'
            : 'Custom'
          : imgBg
          ? 'Change image'
          : 'Add featured image'}
      </button>
    </>
  )
}

export default ImageUploadButton
