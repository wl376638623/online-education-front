<template>
  <div class="app-container">
    讲师列表
  </div>
</template>

<script>
   import edu from "../../../api/teacher/edu";
    export default {
     data(){
       return {
         list:null,//查询之后接口返回的集合
         page:1,//当前页
         limit:10,//每页记录书
         total:0,//总记录数
         teacherQuery:{},//条件封装对象
       }
     },
      created() {//页面渲染执行
        this.getList()
      },
      methods: {//创建具体的方法调用teacher.js定义的方法
        getList() {
          edu.getTeacherListPage(this.page, this.limit, this.teacherQuery)
            .then(res => {//请求成功
              console.log(res)
            })
            .catch(error=>{//请求失败
              console.log(error)
            })

        }
      }

    }
</script>

<style scoped>

</style>
