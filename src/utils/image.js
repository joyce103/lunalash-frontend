import api from './api'
import imageCompression from 'browser-image-compression'

export default {
  // 傳入 File 物件的陣列，回傳 Cloudinary 的網址陣列
  async uploadMultipleImages(files) {
    if (!files || files.length === 0) return []

    // 圖片壓縮設定
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    }

    const uploadData = new FormData()

    try {
      // 逐一壓縮圖片並加入 FormData
      for (let file of files) {
        const compressedFile = await imageCompression(file, options)
        uploadData.append('files', compressedFile, compressedFile.name)
      }

      // 呼叫後端 API
      const response = await api.post('/api/images/upload-multiple', uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      // 根據你的 ApiResponse 格式取得網址陣列
      return response.resultData.imageUrls || []
      
    } catch (error) {
      console.error('圖片壓縮或上傳失敗：', error)
      throw new Error('圖片上傳失敗')
    }
  }
}