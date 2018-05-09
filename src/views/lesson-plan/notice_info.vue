<template>
    <div style="position: relative;">
        <Row>
            <Col span="24">
                <div class="title">
                    <p>公告信息</p>
                    <Tag color="red">加急</Tag>
                </div>
                <div class="content">
                    <div class="subTitle">
                        <p><Icon type="ios-list-outline"></Icon>基本信息</p>
                    </div>
                    <div class="written info">
                      <p style="display: flex;">
                        <span class="flex-width"><span class="t">项目类型：</span><span>{{announceData.project.projectName?announceData.project.projectName:'--'}}</span></span>
                        <span class="flex-width"><span class="t">公告时间：</span><span>{{announceData.announcePublishTime | formateDate}}</span></span>
                        <span class="flex-width"><span class="t">常规考试：</span><span>{{announceData.isRoutine == '1'?'是':announceData.isRoutine == '0'?'否':''}}</span></span>
                        <span class="flex-width"><span class="t">省份：</span><span>{{announceData.province?announceData.province.cityName:'--'}}</span></span>
                      </p>
                      <p style="display: flex;justify-content: space-between;">
                        <span class="flex-width"><span class="t">公告名称：</span><span>{{announceData.announcementName}}</span></span>
                        <span class="flex-width"><span class="t">是否出公告：</span><span>{{announceData.isPublish == '1'?'是':announceData.isPublish == '0'?'否':''}}</span></span>
                        <span class="flex-width"><span class="t">考试阶段：</span><span>{{announceData.examStage}}</span></span>
                        <span class="flex-width"><span class="t">报名方式：</span><span>{{announceData.enrollType == '1'?'网上':announceData.enrollType == '2'?'线下':''}}</span></span>
                      </p>
                      <p style="display: flex">
                        <span class="flex-width"><span class="t">招考人数：</span><span>{{announceData.entranceNumber}}</span></span>
                        <span class="flex-width"><span class="t">公告链接：</span><span>{{announceData.announcementLink}}</span></span>
                        <span class="flex-width"><span class="t">报名时间：</span><span>{{announceData.signUpTime[0] | formateDate}} ~ {{announceData.signUpTime[1] | formateDate}}</span></span>
                        <span class="flex-width"><span class="t">缴费时间：</span><span>{{announceData.payTime[0]  | formateDate}} ~ {{announceData.payTime[1]  | formateDate}}</span></span>
                      </p>
                      <p>
                        <span class="flex-width"><span class="t">打印准考证时间：</span><span>{{announceData.printEntranceCardTime[0]  | formateDate}} ~ {{announceData.printEntranceCardTime[1]  | formateDate}}</span></span>
                      </p>
                        <div>
                            <p><span class="t">职位表：</span></p>
                          <span v-for="item in announceData.postInfoList" style="margin-left: 4em;">
                                <span>{{item.filename}}</span> <a class="operate" :href="url + 'announce/download-attachment?url=' + item.ossUrl + '&filename=' + item.filename">下载附件</a>
                          </span>
                        </div>
                        <div>
                            <p><span class="t">其他附件：</span></p>
                            <span v-for="item in announceData.oldExamList" style="margin-left: 4em;">
                                <span>{{item.filename}}</span> <a class="operate" :href="url + 'announce/download-attachment?url=' + item.ossUrl + '&filename=' + item.filename">下载附件</a>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="content">
                  <div class="subTitle">
                    <p><Icon type="ios-people"></Icon>笔试信息</p>
                  </div>
                  <div class="written info">
                    <div v-for="item in announceData.writtenCategorys" style="margin-bottom: 10px;">
                      <p><span class="t">笔试科目：</span>{{item.category?item.category.categoryName:'--'}}</p>
                      <p><span class="t">笔试时间：</span>{{item.writtenTime[0]?item.writtenTime[0]:'' | formateTime}} -- {{item.writtenTime[1]?item.writtenTime[1]:'' | formateTime}}</p>
                      <p><span class="t">笔试内容详情：</span>{{item.writtenDetail?item.writtenDetail:'--'}}</p>
                    </div>
                  </div>
                </div>
                <!--<div class="content" v-if="announceData.examStyle == 2 || announceData.examStyle == 3">-->
                <div class="content">
                    <div class="subTitle">
                        <p><Icon type="ios-people"></Icon>面试信息</p>
                    </div>
                    <div class="audition info">
                        <p style="display: flex;justify-content: space-between;">
                            <span><span class="t" >笔试出成绩时间：</span><span>{{announceData.announceWrittenResultTime[0] | formateDate}} ~ {{announceData.announceWrittenResultTime[1] | formateDate}}</span></span>
                            <span><span class="t" >面试资审时间：</span><span>{{announceData.qualificationCheckTime[0] | formateDate}} ~ {{announceData.qualificationCheckTime[1] | formateDate}}</span></span>
                            <span><span class="t" >拟录用名单时间：</span><span>{{announceData.draftListTime[0] | formateDate}} ~ {{announceData.draftListTime[1] | formateDate}}</span></span>
                        </p>
                        <p style="display: flex;justify-content: space-between;">
                            <span><span class="t">面试时间：</span><span>{{announceData.interviewTime[0] | formateDate}} ~ {{announceData.interviewTime[1] | formateDate}}</span></span>
                            <span><span class="t">面试形式：</span><span>{{announceData.interviewForm?announceData.interviewForm:'--'}}</span></span>
                            <span><span class="t">进入面试比例：</span><span>{{announceData.interviewPercent?announceData.interviewPercent:'--'}}</span></span>
                            <span><span class="t">面试内容详情：</span><span>{{announceData.interviewDetail?announceData.interviewDetail:'--'}}</span></span>
                        </p>
                        <p>
                            <span class="t">备注：</span><span>{{announceData.remarks?announceData.remarks:'--'}}</span>
                        </p>
                    </div>
                </div>
            </Col>
        </Row>
    </div>
</template>

<script>
  import $ from 'jquery'
  import Cookies from 'js-cookie'
  import Popup from '../my-components/popup/popup.vue'
  import LessonAdd from './lesson_add'
  export default {
    name: "notice_info",
    props: ['id','changePublicAttachmentList'],
    data () {
      return {
        url:this.$store.state.app.baseUrl,
        announceData:{
              province:[],
              projectId:'',
              announcePublishTime:'',   //公告日期
              isRoutine:'',   //是否是常规考试
              announcementName:'',    //公告名称
              announcementLink:'',    //公告链接
              isPublish:'',  //是否已出公告
              examStage:'', // 考试阶段
              enrollType:'',  //报名方式
              signUpTime:['',''],      //报名日期
              signUpStartTime:'',
              signUpEndTime:'',
              payTime:['',''],         //缴费日期
              printEntranceCardTime:['',''],       //打印日期
              examTime:['',''],        //考试时间
              entranceNumber:0,      //招考人数
              areaCode:'',   //省
              area:'',
              positionNumber:0,   //职位数
              examProvisionCycle:0,     //备考周期
              writtenCategorys:[],
              announceWrittenResultTime:['',''],      //笔试出成绩时间
              interviewTime:['',''],        //面试时间
              draftListTime:['',''],     //拟录用名单时间
              interviewForm:'',        //面试形式
              interviewPercent:'',   //进入面试比例
              interviewDetail:'',   //面试内容详情
              qualificationCheckTime:['',''],     //面试资审时间
              remarks:'', //备注
              project:{
                  id: '',
                  parentId: '',
                  projectName: '',
                  projectCode: ''
              },
              postInfoList:[], //职位表信息
              oldExamList:[],//附件
          }   //公告信息
      }
    },
    methods: {
      back () {
        window.history.go(-1);
      }
    },
    beforeMount(){

    },
    mounted() {
          this.$nextTick(()=>{
              this.$http.get(this.$store.state.app.baseUrl + 'announcement/' + this.id)
                  .then((res)=>{
                      if(res.data.code == 0){
                          this.announceData = res.data.data;
                          if(this.changePublicAttachmentList) {
                              this.changePublicAttachmentList(res.data.data.publicAttachmentList,res.data.data.oldExam,res.data.data.branchCampusOption);
                          }
                      }
                  })
                  .catch((error)=>{
                      this.$Message.error(error.message)
                      console.log(error)
                  })
          })
    },
    filters:{
         formateDate:function(timeStamp){
             if(timeStamp == '' || timeStamp == undefined){
                 return '--'
             }else {
                 let date = new Date(timeStamp);
                 let Y = date.getFullYear() + '-';
                 let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
                 let D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate())

                 return Y+M+D;
             }
         },
         formateTime:function(timeStamp){
             if(timeStamp == ''){
                 return '--'
             }else {
                 var date = new Date(timeStamp);
                 let Y = date.getFullYear() + '-';
                 let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
                 let D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate()) + '-';
                 let h = date.getHours() + ':';
                 let m = date.getMinutes() + ':';
                 let s = date.getSeconds();
                 return Y+M+D+h+m+s;
             }
         }
     },
    components:{
        Popup,
        LessonAdd
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
    [v-cloak]{
        display: none;
    }
    .subTitle{
        margin-bottom: 15px;
        font-size: 16px;
    }
    .content{
        padding: 0 10px;
        margin-bottom: 20px;
        .info{
            p{
                line-height: 2;
                .t{
                    color: #aaa;
                    font-weight: bold;
                    margin-right: 10px;
                    //font-family:'黑体';
                }
                span{
                    font-family:'仿宋_GB2312';
                    /*font-size:17px;*/
                    margin-right: 30px;
                }
            }
        }
        .ivu-collapse{
            margin-top: 15px;
            .ivu-collapse-header{
                .ivu-icon-arrow-right-b{
                    display: none;
                }
                .addBtn{
                    float: right;
                    position: absolute;
                    right: 15px;
                    top: -25px;
                }
            }
        }
    }
    i.ivu-icon{
        margin-right: 10px;
    }
    .waitTable{
        .notShow{
            display: none;
            pointer-events:none;
        }
    }
    .operate{
        color: #2d8cf0;
        margin: 0 3px;
        cursor: pointer;
    }
    .titleContent{
        width: 80%;
        height: 100px;
        padding: 10px;
        outline: none;
    }
    .month,.day{
        width: 50px;
        text-align: center;
        margin-right: 25px;
        margin-left: 25px;
        outline: none;
    }
    .flex-width {
      flex-basis: 25%;
    }
</style>
