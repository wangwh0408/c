import { ElMessage } from 'element-plus';

const mockUploadedFiles = [
  {
    uid: 'existing-1',
    name: '图像识别模型_v1.0.pt',
    size: 256 * 1024 * 1024,
    status: 'success',
    isExisting: true,
    createdAt: '2024-01-15 10:30:00'
  },
  {
    uid: 'existing-2',
    name: '文本分类模型_v2.0.onnx',
    size: 128 * 1024 * 1024,
    status: 'success',
    isExisting: true,
    createdAt: '2024-01-10 15:20:00'
  }
];

const uploadService = {
  async getUploadedFiles() {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockUploadedFiles];
  },

  async uploadFile(file, onProgress) {
    return new Promise((resolve, reject) => {
      const totalSize = file.size;
      let uploaded = 0;
      const chunkSize = totalSize / 20;

      const uploadInterval = setInterval(() => {
        uploaded += chunkSize + Math.random() * chunkSize;
        if (uploaded > totalSize) {
          uploaded = totalSize;
        }

        const progress = Math.round((uploaded / totalSize) * 100);
        
        if (onProgress) {
          onProgress({
            percent: progress,
            loaded: uploaded,
            total: totalSize
          });
        }

        if (uploaded >= totalSize) {
          clearInterval(uploadInterval);
          
          if (Math.random() < 0.05) {
            reject(new Error('上传失败，请重试'));
            return;
          }

          const response = {
            code: 0,
            message: '上传成功',
            data: {
              fileId: `upload-${Date.now()}`,
              fileName: file.name,
              fileSize: file.size,
              uploadTime: new Date().toISOString(),
              url: `/files/${file.name}`
            }
          };
          resolve(response);
        }
      }, 150);
    });
  },

  async deleteFile(file) {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const index = mockUploadedFiles.findIndex(f => f.uid === file.uid);
    if (index > -1) {
      mockUploadedFiles.splice(index, 1);
    }
    
    return {
      code: 0,
      message: '删除成功'
    };
  },

  async callBusinessApi(uploadResult) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('调用自定义业务接口，上传结果:', uploadResult);
    
    return {
      code: 0,
      message: '业务接口调用成功',
      data: {
        taskId: `task-${Date.now()}`,
        status: 'processing'
      }
    };
  }
};

export default uploadService;
