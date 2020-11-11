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
  },
  //通过id查询课程确认信息
  getPublishCourseInfo(id) {
    return request({
      url: '/eduservice/course/getPublishCourseInfo/'+id,
      method: 'get',
    })
  },
  //课程的最终发布
  pubulishCourse(id) {
    return request({
      url: '/eduservice/course/publishCourse/'+id,
      method: 'post',
    })
  },
  //课程列表
  getListCourse() {
    return request({
      url: '/eduservice/course',
      method: 'get',
    })
  },
  //1.课程列表（条件查询分页）
  //current分页的当前页 limit 每页记录数 teacherQuery 条件对象
  getCourseListPage(current,limit,courseQuery){
    return request({
      // url: '/table/list',
      url: `/eduservice/course/pageCourseCondition/${current}/${limit}`,
      method: 'post',
      //把对象转换成json传递到接口里面
      data:courseQuery
    })
  },


}

