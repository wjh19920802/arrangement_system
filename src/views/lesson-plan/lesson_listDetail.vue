<template>
    <div style="position: relative;">
        <Row>
            <Col span="24">
            <Card>
                <NoticeInfo :id="id" :changePublicAttachmentList="changePublicAttachmentList"></NoticeInfo>
            </Card>
            <Card class="margin-top-10">
                <div class="title">
                    <p>课程信息</p>
                </div>
                <div class="content">
                    <Table slot="content" :data="data" :columns="columns1" border class="waitTable"></Table>
                </div>
            </Card>
            <Card class="margin-top-10">
                <div class="title">
                    <p>公共附件区</p>
                </div>
                <div class="content">
                    <div class="add info">
                      <div>
                        <div v-for="item in publicAttachmentList" style="margin-left: 4em;">
                                <span>{{item.filename}}</span> <a class="operate" :href="url + 'announce/download-attachment?url=' + item.ossUrl + '&filename=' + item.filename">下载附件</a>
                        </div>
                      </div>
                    </div>
                </div>
            </Card>
            <Card class="margin-top-10">
                <div class="title">
                    <p>课程备注区</p>
                </div>
                <div class="content">
                    <Row>
                        <Col span="12">
                        <Form :model="formNote" label-position="left" :label-width="100">
                            <FormItem label="参考真题">
                                <Input v-model="formNote.zhenti"></Input>
                            </FormItem>
                            <FormItem label="分校意见">
                                <Input v-model="formNote.advice"></Input>
                            </FormItem>
                        </Form>
                        </Col>
                    </Row>
                </div>
            </Card>
            <Card class="margin-top-10">
                <Row>
                    <Col span="4" offset="10">
                    <Button type="primary" size="large" long @click="back()">返回</Button>
                    </Col>
                </Row>
            </Card>
            </Col>
          <Modal
            v-model="modal1"
            title="课程定位"
            @on-ok="classOrientationOk"
            @on-cancel="classOrientationOk"
          >
            <p v-html="classOrientation"></p>
          </Modal>
          <Modal
            v-model="modal3"
            title="分校意见"
            @on-ok="classOrientationOk"
            @on-cancel="classOrientationOk"
          >
            <p v-html="branchCampusOption"></p>
          </Modal>

          <Modal  width="50%"
                  v-model="scheduleIsShow"
                  @on-ok="classOrientationOk"
                  @on-cancel="classOrientationOk"
          >
            <Schedule ref="scheduleDom2"
                      class="margin-top-20"
                      :lessonData="lessonData"
                      :scheduleData="scheduleData"
                      :scheduleEdit=false>
            </Schedule>
          </Modal>
          <Modal
            v-model="modal4"
            title="子班次"
            width="100%"
            @on-ok="childrenOk"
            @on-cancel="childrenOk"
          >
            <Table :data="childrenData" :columns="columns3" border></Table>
          </Modal>
        </Row>
    </div>
</template>

<script>
  import $ from 'jquery'
  import Cookies from 'js-cookie'
  import Popup from '../my-components/popup/popup.vue'
  import LessonAdd from './lesson_add'
  import NoticeInfo from './notice_Info'
  import Schedule from '@/views/my-components/schedule/schedule2'
  import Util from '../../libs/util'

  export default {
    data () {
      return {
        id:'',
        url:this.$store.state.app.baseUrl,
        columns1: [
          {
            title: '班级编码',
            align: 'center',
            key: 'classCode'
          },
          {
            title: '班级名称',
            align: 'center',
            key: 'courseName'
          },
          {
            title: '班级类型',
            align: 'center',
            key: 'classType',
            render:(h,params)=>{
              if(params.row.classType == 1) {
                return '组合班次'
              }else if(params.row.classType == 2){
                return '非组合班次'
              }
            }
          },
          {
            title: '班级系列',
            align: 'center',
            key: 'classSeries',
            render:(h,params)=>{
              if(params.row.classSeries) {
                return params.row.classSeries.classSeriesName
              }else {
                return '--'
              }
            }
          },
          {
            title: '根目录',
            align: 'center',
            key: 'rootDirectoryName',
            render:(h,params)=>{
              if(params.row.rootDirectoryName) {
                return params.row.rootDirectoryName
              }else {
                return '--'
              }
            }
          },
          {
            title: '课时',
            align: 'center',
            key: 'classHour'
          },
          {
            title: '科目',
            align: 'center',
            key: 'categoryName'
          },
          {
            title: '预计开课日期',
            align: 'center',
            key: 'schoolBeginsTime',
            render:(h,params)=>{
              if(params.row.schoolBeginsTime == '' || params.row.schoolBeginsTime == undefined){
                return '--'
              }else {
                let date = new Date(params.row.schoolBeginsTime);
                let Y = date.getFullYear() + '-';
                let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
                let D = (date.getDate()+1 < 10 ? '0'+(date.getDate()+1) : date.getDate()+1);

                return Y+M+D;
              }
            }
          },
          {
            title: '开班日期',
            align: 'center',
            key: 'openClassTime'
          },
          {
            title: '项目',
            align: 'center',
            key: 'projectTag'
          },
          {
            title: '价格/元',
            align: 'center',
            key: 'coursePrice',
            render: (h, params) => {
              return h('div', (() => {
                let price=[];
                params.row.priceInfoArray.forEach((item)=>{
                  let writtenTf = item.writtenTf?'-笔试不过退费:'+item.writtenTf:'';
                  let interviewTf = item.interviewTf?'-面试不过退费:'+item.interviewTf:'';
                  let str = item.agreement + '班-' + item.price  + (item.stay==null?'-':'-'+item.stay)  + writtenTf + interviewTf;
                  price.push(str)
                });
                let ele = [];
                for (let i = 0; i < price.length; i++) {
                  ele.push(h('div', price[i]))
                }
                return ele
              })())
            },
          },
          {
            title: '休息时间/天',
            align: 'center',
            key: 'dayOfRest'
          },
          {
            title: '分组人数（面试）/人',
            align: 'center',
            key: 'interviewGroupNumber',
            render:(h,params)=>{
              if(params.row.interviewGroupNumber == 0 || params.row.interviewGroupNumber == null) {
                return '--'
              }else {
                return params.row.interviewGroupNumber
              }
            }
          },
          {
            title: '课时规划',
            align: 'center',
            key: 'classHourDetail',
            render: (h, params) => {
              if(params.row.classHourPlans.length > 0) {
                return h('div', (() => {
                  let hourDetail = params.row.classHourPlans;
                  let ele = [];
                  for (let i = 0; i < hourDetail.length; i++) {
                    ele.push(h('div', hourDetail[i].categoryName + ':' + hourDetail[i].day + '天' + hourDetail[i].night + '晚'))
                  }
                  return ele
                })())
              }else {
                return '--'
              }
            },
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            render: (h, params) => {
              if(params.row.classType == 2) {
                return h('div', {class:'handle'},[
                  h('span', {
                    class: 'operate',
                    on: {
                      click: () => {
                        this.modal1 = true;
                        this.classOrientation = params.row.classOrientation;
                      }
                    }
                  }, '课程定位'),
                  h('span', {
                    class: 'operate',
                    on: {
                      click: () => {
                        this.modal3 = true;
                        this.branchCampusOption = params.row.branchCampusOption;
                      }
                    }
                  }, '分校意见'),
                  h('span', {
                    class: 'operate',
                    on: {
                      click: () => {
                        if(params.row.classType == 2) {
                          this.$http(this.$store.state.app.baseUrl + 'course/findCourseTableByCode?classCode='+params.row.classCode)
                            .then((res)=>{
                              this.scheduleData = res.data.data ? res.data.data.courseTableLineItemVos : []
                            })
                            .catch((error)=>{
                              this.$Message.error(error.message);
                            })
                          this.curIndex = params.index;
                          this.lessonData = this.data[this.curIndex];
                          this.scheduleIsShow = true;
                        }else {
                          this.$Message.error('组合班次没有课程表！！')
                        }
                      }
                    }
                  }, '课程表')
                ])
              }else {
                return h('span',{
                  class:'operate',
                  on:{
                    click:()=>{
                      this.modal4 = true;
                      this.modalFlag = true;
                      this.$http(this.$store.state.app.baseUrl + 'course/getSubCourses?courseId='+params.row.id)
                        .then((res)=>{
                          this.childrenData = res.data.data;
                          this.childrenData.forEach((item=>{
                            item.schoolBeginsTime = Util.formateDate(item.schoolBeginsTime);
                          }))
                        })
                        .catch((error)=>{
                          this.$Message.error(error.message);
                        })
                    }
                  }
                },'查看子班次')
              }
            }
          },
        ],
        columns3: [
          {
            title: '班级编码',
            align: 'center',
            key: 'classCode'
          },
          {
            title: '班级名称',
            align: 'center',
            key: 'courseName'
          },
          {
            title: '班级类型',
            align: 'center',
            key: 'classType',
            render:(h,params)=>{
              return params.row.classType==1?'组合班次':'非组合班次'
            }
          },
          {
            title: '班级系列',
            align: 'center',
            key: 'classSeries',
            render:(h,params)=>{
              if(params.row.classType == 2){
                return params.row.classSeries.classSeriesName
              }else {
                return ''
              }
            }
          },
          {
            title: '根目录',
            align: 'center',
            key: 'rootDirectoryName'
          },
          {
            title: '课时',
            align: 'center',
            key: 'classHour'
          },
          {
            title: '科目',
            align: 'center',
            key: 'categoryName'
          },
          {
            title: '预计开课日期',
            align: 'center',
            key: 'schoolBeginsTime'
          },
          {
            title: '开班日期',
            align: 'center',
            key: 'openClassTime',
          },
          {
            title: '项目',
            align: 'center',
            key: 'projectTag'
          },
          {
            title: '价格/元',
            align: 'center',
            key: 'coursePrice',
            render: (h, params) => {
              return h('div', (() => {
                let price=[];
                params.row.priceInfoArray.forEach((item)=>{
                  let writtenTf = item.writtenTf?'笔试不过退费:'+item.writtenTf:'';
                  let interviewTf = item.interviewTf?'-面试不过退费:'+item.interviewTf:'';
                  let str = item.agreement + '班-' + item.price + '-' + item.stay + '-' + writtenTf + interviewTf;
                  price.push(str)
                });
                let ele = [];
                for (let i = 0; i < price.length; i++) {
                  ele.push(h('div', price[i]))
                }
                return ele
              })())
            },
          },
          {
            title: '休息时间/天',
            align: 'center',
            key: 'dayOfRest'
          },
          {
            title: '分组人数(面试)/人',
            align: 'center',
            key: 'interviewGroupNumber',
            render:(h,params)=>{
              if(params.row.interviewGroupNumber == 0 || params.row.interviewGroupNumber == null) {
                return '--'
              }else {
                return params.row.interviewGroupNumber
              }
            }
          },
          {
            title: '课时规划',
            align: 'center',
            key: 'classHourPlans',
            render: (h, params) => {
              if(params.row.classHourPlans.length > 0) {
                return h('div', (() => {
                  let hourDetail = params.row.classHourPlans;
                  let ele = [];
                  for (let i = 0; i < hourDetail.length; i++) {
                    ele.push(h('div', hourDetail[i].categoryName + ':' + hourDetail[i].day + '天' + hourDetail[i].night + '晚'))
                  }
                  return ele
                })())
              }else {
                return '--'
              }
            },
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            render: (h, params) => {
              return h('div', {class:'handle'},[
                h('span', {
                  class: 'operate',
                  on: {
                    click: () => {
                      this.modal1 = true;
                      if(this.modal4 == true && this.modalFlag == true) {
                        this.modal4 = false;
                      }
                      this.classOrientation = params.row.classOrientation;
                    }
                  }
                }, '课程定位'),
                h('span', {
                  class: 'operate',
                  on: {
                    click: () => {
                      this.modal3 = true;
                      if(this.modal4 == true && this.modalFlag == true) {
                        this.modal4 = false;
                      }
                      this.branchCampusOption = params.row.branchCampusOption;
                    }
                  }
                }, '分校意见'),
                h('span', {
                  class: 'operate',
                  on: {
                    click: () => {
                      if(params.row.classType == 2) {
                        this.$http(this.$store.state.app.baseUrl + 'course/findCourseTableByCode?classCode='+params.row.classCode)
                          .then((res)=>{
                            this.scheduleData = res.data.data ? res.data.data.courseTableLineItemVos : []
                          })
                          .catch((error)=>{
                            this.$Message.error(error.message);
                          })
                        this.curIndex = params.index;
                        this.scheduleIsShow = true;
                        this.lessonData = this.data[this.curIndex];
                        if(this.modal4 == true && this.modalFlag == true) {
                          this.modal4 = false;
                        }
                      }else {
                        this.$Message.error('组合班次没有课程表！！')
                      }
                    }
                  }
                }, '课程表')
              ])
            }
          },
        ],
        data:[],
        formNote: {
          zhenti: '',
          advice: ''
        },
        publicAttachmentList:[] , //附件列表
        modal1:false,
        classOrientation:'',
        modal3:false,
        modal4:false,
        branchCampusOption:'',
        scheduleModal1: false,
        curIndex: '',
        scheduleData: [],
        // 课程表是否可以编辑  仅在待规划中可编辑
        scheduleEdit: true,
        lessonData:null,
        scheduleData:[],
        scheduleIsShow:false,           //课程表
        modalFlag:false,
        childrenData:[]
      }
    },
    methods: {
      back () {
          window.history.go(-1);
      },
      changePublicAttachmentList  (publicAttachmentList){
        this.publicAttachmentList = publicAttachmentList;
        this.defaultList = publicAttachmentList;
        console.log(this.publicAttachmentList);
      },
      search(){
        this.$http({
          method:'get',
          url:this.$store.state.app.baseUrl + 'course/findById',
          params:{
            courseId:this.$route.params.id
          },
          headers: {'Content-type': 'application/json'}
        })
          .then((res)=>{
            this.data = [res.data.data];
            this.formNote.zhenti = res.data.data.announcement.oldExam;
            this.formNote.advice = res.data.data.announcement.branchCampusOption;
            this.classOrientation = res.data.data.classOrientation;
            this.branchCampusOption = res.data.data.branchCampusOption;
          })
          .catch(()=>{
            this.$Message.error(error.message);
          })
      },
      formateDate (timeStamp){
        if(timeStamp == '' || timeStamp == undefined){
          return '--'
        }else {
          let date = new Date(timeStamp);
          let Y = date.getFullYear() + '-';
          let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
          let D = (date.getDate()< 10 ? '0'+(date.getDate()) : date.getDate());

          return Y+M+D;
        }
      },
      classOrientationOk() {
        if(this.modalFlag == true) {
          this.modal4 = true;
          this.modalFlag = true;
        }
      },
      childrenOk(){
        this.modalFlag = false;
      },
      ok1(){

      },
      cancel1(){

      },
      ok3(){

      },
      cancel3(){

      },
      init () {
        let vm = this;
        window.onkeydown = function (e) {
          if(e.keyCode == 13) {
            vm.search();
          }
        }
      }
    },
    beforeMount() {
        this.id = this.$route.query.announcementId;
    },
    mounted(){
      this.init();
      this.search();
    },
    components:{
        Popup,
        LessonAdd,
        NoticeInfo,
        Schedule
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
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
                span{
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
</style>
