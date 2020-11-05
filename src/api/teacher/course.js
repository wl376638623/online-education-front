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

}

