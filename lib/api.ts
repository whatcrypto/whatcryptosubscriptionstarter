import { uploadImageCloudflare } from 'network/lib/organization'

export class API {
  public static uploadImage = async (files: File[]) => {
    const formData = new FormData()
    formData.append('image', files[0])

    const res = await uploadImageCloudflare(formData)

    return res.data.src
  }
}

export default API
