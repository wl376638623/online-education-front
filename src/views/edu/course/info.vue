<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="最终发布"/>
    </el-steps>
    <el-form label-width="120px">

      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
      </el-form-item>

      <!-- 所属分类 TODO -->
      <el-form-item label="课程分类">
        <el-select
          v-model="courseInfo.subjectParentId"
          placeholder="一级分类" @change="subjectLevelOneChanged">
          <el-option
            v-for="subject in subjectOneList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>
        <!-- 二级分类 -->
        <el-select v-model="courseInfo.subjectId"
                   placeholder="二级分类">
          <el-option
            v-for="subject in subjectTwoList"
            :key="subject.value"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>
      </el-form-item>

      <!-- 课程讲师 TODO -->
      <!-- 课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select
          v-model="courseInfo.teacherId"
          placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"/>
        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
      </el-form-item>

      <!-- 课程简介-->
      <el-form-item label="课程简介" class="tinymce-container">
        <tinymce :height="300" v-model="courseInfo.description"/>
      </el-form-item>

      <!-- 课程封面 TODO -->
      <!-- 课程封面-->
      <el-form-item label="课程封面">

        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API+'/eduoss/fileoss'"
          class="avatar-uploader">
          <img :src="courseInfo.cover">
        </el-upload>

      </el-form-item>

      <el-form-item label="课程价格">
        <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/> 元
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存并下一步</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>
<script>
  import subject from "../../../api/teacher/subject";
  import edu from "../../../api/teacher/edu";
  import course from "../../../api/teacher/course";

  import Tinymce from "@/components/Tinymce"
  export default {
    components:{Tinymce},
    data() {
      return {
        saveBtnDisabled: false ,// 保存按钮是否禁用
        courseInfo:{
          title: '',
          subjectId: '',//二级分类Id
          subjectParentId:'',//一级分类id
          teacherId: '',
          lessonNum: 0,
          description: '',
          cover: '/static/02.jpg',
          price: 0
        },
        courseId: '',
        BASE_API: process.env.BASE_API, // 接口API地址
        teacherList:[],//封装所有讲师数据
        subjectOneList:[],
        subjectTwoList:[]
      }
    },

    created() {
      //获取路由ID
      if (this.$route.params && this.$route.params.id) {
        this.courseId = this.$route.params.id;
        //根据id查询课程方法
        this.getInfo();
      } else {
        //初始化所有讲师
        this.getListTeacher();
        //初始化一级分类
        this.getOneSubjectList()
      }

    },

    methods: {
      //根据课程ID查询课程信息
      getInfo() {
        course.getCourseInfo(this.courseId)
          .then(response=>{
            this.courseInfo = response.data.courseInfoVo
            //查询出所有分类
            subject.getSubjectList()
            .then(response =>{
              //获取所有的一级分了
              this.subjectOneList = response.data.list
              //讲所有一级ID进行遍历比较当前courseInfo理念的一级ID和所有分类的一级ID是否一样
              for (let subjectOne of this.subjectOneList) {
                if (this.courseInfo.subjectParentId == subjectOne.id) {
                  //获取一级分类的所有有二级分类
                  this.subjectTwoList = subjectOne.children

                }

              }
            })
            //初始化所有讲师
            this.getListTeacher()
          })
      },
      //上传封面成功调用的方法
      handleAvatarSuccess(res,file) {
        //上传文件地址
        this.courseInfo.cover = res.data.url;

      },
      //上传之前调用的方法
      beforeAvatarUpload(file) {
        //规定文件格式和文件大小
        const isJPG = file.type === 'image/jpeg'
        const isLt2M = file.size / 1024 / 1024 < 2

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M
      },
      //查询一级分类的对应二级分类
      subjectLevelOneChanged(value) {
        //遍历所有的分类包含一级和二级
        for (let item of this.subjectOneList) {
          if (value === item.id) {
            //从一级分类中获取所有二级分了
            this.subjectTwoList = item.children;
            //把二级分类id值清空
            this.courseInfo.subjectId = '';
          }
        }
      },
      //查询所有一级分了
      getOneSubjectList() {
        subject.getSubjectList()
        .then(response =>{
          this.subjectOneList = response.data.list;
        })
      },

      //查询所有的讲师
      getListTeacher() {
        edu.getAllTeacher()
          .then(response=>{
            this.teacherList = response.data.items
          })
      },

      saveOrUpdate() {
        course.addCourseInfo(this.courseInfo)
          .then(response=>{

            //1提示信息
            this.$message({
              type: 'success',
              message:'添加课程信息成功'
            })
            //2跳转
            this.$router.push({ path: '/course/chapter/'+response.data.courseId })
          })
      }
    }
  }
</script>

<style scoped>
  .tinymce-container {
    line-height: 29px;
  }
</style>
