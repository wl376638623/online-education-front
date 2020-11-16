import request from '@/utils/request'
export default {
  //1 根据课程id获取章节和小节数据列表
  getAllChapterVideo(courseId) {
    return request({
      url: '/eduservice/chapter/getChapterVideo/' + courseId,
      method: 'get'
    })
  },
  //1 添加小节
  addVideo(video) {
    return request({
      url: '/eduservice/video/addVideo/',
      method: 'post',
      data:video
    })
  },
  //根据ID查询小节
  getVideo(VideoId) {
    return request({
      url: '/eduservice/video/getVideoInfo/'+VideoId,
      method: 'get',
    })
  },
  //1 修改小节
  updateVideo(video) {
    return request({
      url: '/eduservice/video/updateVideo/',
      method: 'post',
      data:video
    })
  },
  //1 删除小节
  deleteVideo(videoId) {
    return request({
      url: '/eduservice/video/'+videoId,
      method: 'delete',
    })
  },
  deleteAliyunVod(id) {
    return request({
      url: '/eduvod/video/removeAlyVideo/'+id,
      method: 'delete',
    })
  },
}
