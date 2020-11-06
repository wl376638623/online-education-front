import request from '@/utils/request'

export default {
  //1.添加课程
  addCourseInfo(courseInfo){
    return request({
      // url: '/table/list',
      url: `/eduservice/course/addCourseInfo`,
      method: 'post',
      data:courseInfo
    })
  },
  //根据课程ID查询课程的基本信息
  getCourseInfo(courseId){
    return request({
      // url: '/table/list',
      url: '/eduservice/course/getCourseInfo/'+courseId,
      method: 'get',
    })
  },
  //修改课程信息
  updateCourseInfo(courseInfo) {
    return request({
      url: '/eduservice/course/updateCourseInfo',
      method: 'post',
      data:courseInfo
    })
  }


}

