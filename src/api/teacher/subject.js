import request from '@/utils/request'

export default {
  //1.课程分类
  getSubjectList(){
    return request({
      // url: '/table/list',
      url: `/eduservice/subject/getAllSubject`,
      method: 'get',
    })
  },

}
