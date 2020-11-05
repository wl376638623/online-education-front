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
  },
  //删除讲师
  deleteTeacherID(id){
    return request({
      // url: '/table/list',
      url: `/eduservice/teacher/${id}`,
      method: 'delete',
    })
  },
  //添加讲师
  addTeacher(teacher){
    return request({
      // url: '/table/list',
      url: `/eduservice/teacher/addTeacher`,
      method: 'post',
      data:teacher
    })
  },
  //编辑讲师
  getTeacherInfo(id){
    return request({
      url: `/eduservice/teacher/getTeacher/${id}`,
      method: 'get',
    })
  },
  //根据id查询讲师
  updateTeacher(teacher){
    return request({
      url: `/eduservice/teacher/updateTeacher`,
      method: 'post',
      data:teacher
    })
  },
  //查询所有讲师
  getAllTeacher(){
    return request({
      url: `/eduservice/teacher/findAll`,
      method: 'get',
    })
  }
}

