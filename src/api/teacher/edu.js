import request from '@/utils/request'

export default {
  //1.讲师列表（条件查询分页）
  //current分页的当前页 limit 每页记录数 teacherQuery 条件对象
  getTeacherListPage(current,limit,teacherQuery){
    return request({
      // url: '/table/list',
      url: `/eduservice/teacher/pageTeacherCondition/${current}/${limit}`,
      method: 'post',
      //把对象转换成json传递到接口里面
      data:teacherQuery
    })
  }
}

