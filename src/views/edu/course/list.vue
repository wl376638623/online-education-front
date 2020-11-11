<template>
  <div class="app-container">
    课程列表
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="courseQuery.title" placeholder="课程名称"/>
      </el-form-item>

      <el-form-item>
        <el-select v-model="courseQuery.status" clearable placeholder="课程状态">
          <el-option :value="'Normal'" label="已发布"/>
          <el-option :value="'Draft'" label="未发布"/>
        </el-select>
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>
    <!-- 表格 -->
    <el-table

      :data="list"
      element-loading-text="数据加载中"
      border
      fit
      highlight-current-row>

      <el-table-column
        label="序号"
        width="70"
        align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="title" label="课程名称" width="80" />

      <el-table-column label="课程状态" width="80">
        <template slot-scope="scope">
          {{ scope.row.status==='Draft'?'未发布':'已发布' }}
        </template>
      </el-table-column>

      <el-table-column prop="lessonNum" label="课时数" />

      <el-table-column prop="gmtCreate" label="添加时间" width="160"/>

      <el-table-column prop="viewCount" label="浏览数量" width="60" />

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/teacher/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑课程基本信息</el-button>
          </router-link>
          <router-link :to="'/teacher/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑课程大纲</el-button>
          </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="getList"
    />
  </div>
</template>

<script>
  import course from "../../../api/teacher/course";
  import edu from "../../../api/teacher/edu";
  export default {
    data(){
      return {
        list:null,//查询之后接口返回的集合
        page:1,//当前页
        limit:7,//每页记录书
        total:0,//总记录数
        courseQuery:{},//条件封装对象
      }
    },
    created() {//页面渲染执行
      this.getList()
    },

    methods: {//创建具体的方法调用teacher.js定义的方法
      //删除功能
      //删除讲师的方法
      removeDataById(id){
        // edu.deleteTeacherID(id)
        // .then(response=>{
        //   //提示信息
        //
        //   //回到列表页面
        //   this.getList();
        // })
        // .catch(error=>{
        //
        // })
        this.$confirm('此操作将永久删除讲师记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          course.deleteCourse(id)
        }).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getList();
        })
      },
      //获取全部数据方法
      getList(page =1) {
        this.page=page
        course.getCourseListPage(this.page, this.limit, this.courseQuery)
          .then(response => {//请求成功
            this.list=response.data.rows;
            this.total = response.data.total;
          })
          .catch(error=>{//请求失败
          })

      },
      //清空表单方法
      resetData(){
        //清空表单
        this.courseQuery = {}
        //查询数据
        this.getList();
      },

    }

  }
</script>

<style scoped>

</style>

