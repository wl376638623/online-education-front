import request from '@/utils/request'

export default {
  //1.生成统计数据
  createStaData(day){
    return request({
      url: '/staservice/sta/registerCount/'+day,
      method: 'post',
    })
  },
}

