/*
 * @Author: ShawnPhang
 * @Date: 2021-08-27 14:42:15
 * @Description: AI相关接口
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2023-10-13 00:07:19
 */
import axios from '@/utils/axios'

// 上传接口
export const upload = (file: File, cb: Function) => {
  const formData = new FormData()
  formData.append('file', file)
  const extra = {
    responseType: 'blob',
    onUploadProgress: (progress: any) => {
      cb(Math.floor((progress.loaded / progress.total) * 100), 0)
    },
    onDownloadProgress: (progress: any) => {
      cb(100, Math.floor((progress.loaded / progress.total) * 100))
    },
  }
  return axios('http://42.193.3.250:16050/api/remove', formData, 'post', {}, extra)
}

export const uploadByBase64 = (base64Image: any, cb: Function) => {
  // 将 base64 数据转换为 Blob 对象
  const blobData = fetch(base64Image).then((res) => res.blob())

  // 使用 fetch 发送 POST 请求
  return axios('http://42.193.3.250:16050/api/remove', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/octet-stream',
    },
    body: blobData,
  })
}

export const uploadByUrl = (url: string, cb: Function) => {
  return axios(
    'http://42.193.3.250:16050/api/remove',
    {
      url,
    },
    'get',
    {},
    {
      responseType: 'blob',
    },
  )
}
