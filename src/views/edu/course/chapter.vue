<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="最终发布"/>
    </el-steps>
    <el-button type="text" @click="openChapterDialog()">添加章节</el-button>
    <!-- 章节 -->
    <ul class="chapterList">
      <li
        v-for="chapter in chapterVideoList"
        :key="chapter.id">
        <p>
          {{ chapter.title }}

          <span class="acts">
                <el-button type="text" @click="openVideo(chapter.id)">添加课时</el-button>
                <el-button style="" type="text" @click="openEditChapter(chapter.id)">编辑</el-button>
                <el-button type="text" @click="removeChapter(chapter.id)">删除</el-button>
            </span>
        </p>

        <!-- 视频 -->
        <ul class="chapterList videoList">
          <li
            v-for="video in chapter.children"
            :key="video.id">
            <p>{{ video.title }}
              <span class="acts">
                        <el-button type="text" @click="editViode(video.id)">编辑</el-button>
                        <el-button type="text" @click="removeVideo(video.id)">删除</el-button>
                    </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>
    <div>
      <el-button @click="previous">上一步</el-button>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
    </div>
    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
      <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapter.title"/>
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加和修改课时表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title"/>
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.free">
            <el-radio :label="true">免费</el-radio>
            <el-radio :label="false">默认</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传视频">
          <el-upload
            :on-success="handleVodUploadSuccess"
            :on-remove="handleVodRemove"
            :before-remove="beforeVodRemove"
            :on-exceed="handleUploadExceed"
            :file-list="fileList"
            :action="BASE_API+'/eduvod/video/uploadAlyiVideo'"
            :limit="1"
            class="upload-demo">
            <el-button size="small" type="primary">上传视频</el-button>
            <el-tooltip placement="right-end">
              <div slot="content">最大支持1G，<br>
                支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
                GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
                MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
                SWF、TS、VOB、WMV、WEBM 等视频格式上传</div>
              <i class="el-icon-question"/>
            </el-tooltip>
          </el-upload>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdateVideo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import chapter from "../../../api/teacher/chapter";
import edu from "../../../api/teacher/edu";
import video from "../../../api/teacher/video";

export default {
  data() {
    return {
      saveBtnDisabled:false,
      courseId:'',//课程id
      chapterVideoList:[],
      chapter:{ //封装章节数据
        title: '',
        sort: 0
      },
      video: {
        title: '',
        sort: 0,
        free: 0,
        videoSourceId: '',
        videoOriginalName:''//视频名称
      },
      dialogChapterFormVisible:false,//章节弹框
      dialogVideoFormVisible:false, //小节弹框


      fileList: [],//上传文件列表
      BASE_API: process.env.BASE_API // 接口API地址
    }
  },

  created() {
    //获取路由里面的ID值
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id;
      //有ID值调用方法
      this.getChapterVideo()

    }

  },

  methods: {
    //点击确定调用的方法
    handleVodRemove() {
      video.deleteAliyunVod(this.video.videoSourceId)
      .then(response=>{
        //提示信息
        this.$message({
          type:'success',
          message:'删除视频成功'
        })
        this.fileList = []
        this.video.videoSourceId= ''
        this.video.videoOriginalName=''
      })
    },
    //点击x调用的方法
    beforeVodRemove(file,fileList) {
      return this.$confirm('确认移除 ${file.name}?')
    },
    //上传视频之前的方法
    handleUploadExceed() {
      this.$message.warning('想要重新上传视频,请先删除已上传的视频')
    },
    //上传视频成功调用的方法
    handleVodUploadSuccess(response,file,fileList) {
      //上传之后的视频id赋值
     this.video.videoSourceId = response.data.videoId
      this.video.videoOriginalName=file.name

    },
    //点击窗口进行回显
    editViode(videoId) {
      //弹框
      this.dialogVideoFormVisible = true
      //调用接口
      video.getVideo(videoId)
        .then(response =>{
          this.video = response.data.video
        })

    },
    //更新小节方法
    updateVideo() {
      this.video.videoId = this.videoId
      video.updateVideo(this.video)
        .then(response =>{
          //关闭弹框
          this.dialogVideoFormVisible = false;
          //提示页面
          this.$message({
            type: 'success',
            message: '修改小节成功！'
          })
          //刷新页面
          this.getChapterVideo();
        })
    },

    //删除小节方法
    removeVideo(videoId) {
        this.$confirm('此操作将永久删除小节信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          video.deleteVideo(videoId)
        }).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getChapterVideo();
        })
    },
    //添加小节弹框的方法
    openVideo(chapterId) {
      this.dialogVideoFormVisible = true
      //设置章节ID
      this.video.chapterId = chapterId
      //情况弹框里面的值
      this.video.title = ''
      this.video.sort = 0
      this.video.free= 0
      this.video.videoSourceId = ''
    },
    //添加小节方法
    saveVideo() {
      //设置课程id
      this.video.courseId = this.courseId
      video.addVideo(this.video)
      .then(response =>{
        //关闭弹框
        this.dialogVideoFormVisible = false
        //提示
        this.$message({
          type: 'success',
          message: '添加小节成功!'
        })
        //刷新页面
        this.getChapterVideo();
      })
    },
    //保存或者修改方法
    saveOrUpdateVideo() {
      if (!this.video.id) {
        this.saveVideo();
        console.log(this.video);
      } else {
        this.updateVideo();
      }
    },
    //删除章节
    removeChapter(chapterId) {
      this.$confirm('此操作将永久删除章节信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        chapter.deleteChapter(chapterId)
      }).then(response => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getChapterVideo();
      })

    },
    //修改章节弹框做数据回显
    openEditChapter(chapterId) {
      //弹框
      this.dialogChapterFormVisible = true
      //调用接口
      chapter.getChapter(chapterId)
      .then(response =>{
        this.chapter = response.data.chapter
      })

    },
    //弹出添加章节的页面
    openChapterDialog() {
      //让弹框弹出来
      this.dialogChapterFormVisible = true
      this.chapter.title = '';
      this.chapter.sort = 0
    },
    //添加章节
    addChapter() {
      this.chapter.courseId = this.courseId
      chapter.addChapter(this.chapter)
        .then(response =>{
          //关闭弹框
          this.dialogChapterFormVisible = false;
          //提示页面
          this.$message({
            type: 'success',
            message: '添加章节成功！'
          })
          //刷新页面
          this.getChapterVideo();
        })
    },
    //修改章节的方法
    updateChapter() {
      this.chapter.courseId = this.courseId
      chapter.updateChapter(this.chapter)
        .then(response =>{
          //关闭弹框
          this.dialogChapterFormVisible = false;
          //提示页面
          this.$message({
            type: 'success',
            message: '修改章节成功！'
          })
          //刷新页面
          this.getChapterVideo();
        })
    },
    saveOrUpdate() {
      //判断章节中是否有id
      if (!this.chapter.id) {
        this.addChapter();
      } else {
        this.updateChapter()
      }
    },
    //根据课程ID查询章节和小节的数据列表
    getChapterVideo() {
      chapter.getAllChapterVideo(this.courseId)
        .then(response => {
          this.chapterVideoList = response.data.allChapterVideo
        })
    },
    previous() {
      console.log('previous')
      this.$router.push({path: '/course/info/' + this.courseId})
    },

    next() {
      console.log('next')
      this.$router.push({path: '/course/publish/' + this.courseId})
    }
  }
};
</script>
<style scoped>
  .chapterList{
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .chapterList li{
    position: relative;
  }
  .chapterList p{
    float: left;
    font-size: 20px;
    margin: 10px 0;
    padding: 10px;
    height: 70px;
    line-height: 50px;
    width: 100%;
    border: 1px solid #DDD;
  }
  .chapterList .acts {
    float: right;
    font-size: 14px;
  }

  .videoList{
    padding-left: 50px;
  }
  .videoList p{
    float: left;
    font-size: 14px;
    margin: 10px 0;
    padding: 10px;
    height: 50px;
    line-height: 30px;
    width: 100%;
    border: 1px dotted #DDD;
  }

</style>
