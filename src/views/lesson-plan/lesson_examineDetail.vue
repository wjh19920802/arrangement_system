<template>
    <div style="position: relative;">
        <Row>
            <Col span="24">
                <Card>
                  <NoticeInfo :id="id" ref="noticeIndo" :changePublicAttachmentList="changePublicAttachmentList"></NoticeInfo>
                </Card>
                <Card class="margin-top-10">
                    <div class="title">
                        <p>课程信息</p>
                    </div>
                    <div class="content">
                        <Checkbox-group v-model="tableChecked" @on-change="changeTableLists">
                            <!--筛选：-->
                            <!--<Checkbox label="written">笔试</Checkbox>-->
                            <!--<Checkbox label="audition">面试</Checkbox>-->
                        </Checkbox-group>
                        <Collapse v-model="collVal">
                            <Panel name="1">
                                <Icon type="ios-search-strong"></Icon>已审课程
                                <Table slot="content" :data="checkedData" :columns="columns1" border class="checkedTable"></Table>
                              <Page slot="content" :total="total1" :current="pageNumber1" :page-size="pageSize1" @on-change="changePage1" show-total style="text-align: right;margin-top: 10px;"></Page>
                            </Panel>
                            <Panel name="2">
                                <Icon type="ios-star"></Icon>待审课程
                                <Table slot="content" :data="waitData" :columns="columns2" border class="waitCheckTable" @on-selection-change="waitDataSelect"></Table>
                              <Page slot="content" :total="total2" :current="pageNumber2" :page-size="pageSize2" @on-change="changePage2" show-total style="text-align: right;margin-top: 10px;"></Page>
                            </Panel>
                        </Collapse>
                    </div>
                </Card>
                <Card class="margin-top-10">
                    <div class="title">
                        <p>公共附件区</p>
                    </div>
                    <div class="content">
                      <div class="add info">
                      <Upload
                        ref="upload"
                        :show-upload-list="true"
                        :on-success="handleSuccess"
                        :on-remove="handleRemove"
                        multiple
                        :action="url + 'upload/uploadFile'"
                      >
                        <Button type="ghost" icon="ios-cloud-upload-outline" >上传附件</Button>
                      </Upload>
                    </div>
                      <div style="border-top: 1px dashed black;margin-top: 25px;padding-top: 25px;">
                      <p style="font-weight:bold;font-size: 16px;margin-bottom: 10px;">
                        已上传的附件
                      </p>
                      <div v-for="item,index in uploadList" style="margin-left: 4em;">
                        <span>{{item.filename}}</span> <a class="operate" :href="url + '/v1/announce/download-attachment?url=' + item.ossUrl + '&filename=' + item.filename">下载附件</a><span class="operate" @click="deleteAttachment(item,index)">删除附件</span>
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
                        <Col span="3" offset="8">
                        <Button type="primary" long size="large" @click="pass">通过</Button>
                        </Col>
                        <Col span="3" offset="2">
                        <Button type="error" long size="large" @click="reject">驳回</Button>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
        <Modal
                v-model="isShow"
                @on-ok="ok"
                @on-cancel="cancel">
            <div class="pass_wrap" v-show="passOrReject">
                <Row>
                    <Col span="6" offset="5">
                    <span class="height_30">主办人－笔试：</span>
                    </Col>
                    <Col span="8">
                    <Select v-model="writeMan" style="width:200px" placeholder="选择人员">
                        <Option v-for="item,index in writeManList" :value="item.planerId" :key="item.planerName">{{ item.planerName }}</Option>
                    </Select>
                    </Col>
                </Row>
                <Row>
                    <Col span="6" offset="5">
                    <span class="height_30">主办人－面试：</span>
                    </Col>
                    <Col span="8">
                    <Select v-model="faceMan" style="width:200px" placeholder="选择人员">
                        <Option v-for="item,index in faceManList" :value="item.planerId" :key="item.planerName">{{ item.planerName }}</Option>
                    </Select>
                    </Col>
                </Row>
            </div>
            <div class="reject_wrap" v-show="!passOrReject">
                <Row>
                    <Col span="21" offset="3">
                    <h1>请选择驳回原因</h1>
                    </Col>
                </Row>
                <Row class="reason">
                    <Col span="10" offset="7">
                    <Select v-model="reason" style="width:200px" placeholder="课程价格">
                        <Option v-for="item in reasonList" :value="item.label" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    </Col>
                </Row>
            </div>
        </Modal>
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
              v-model="scheduleModal1"
              @on-ok="classOrientationOk"
              @on-cancel="classOrientationOk"
              >
        <Schedule ref="scheduleDom1"
                  class="margin-top-20"
                  :lessonData="this.type == 1?checkedData[curIndex]:waitData[curIndex]"
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
    </div>
</template>

<script>
  import $ from 'jquery'
  import Cookies from 'js-cookie'
  import Popup from '../my-components/popup/popup.vue'
  import LessonAdd from './lesson_add'
  import NoticeInfo from './notice_Info'
  import Util from '../../libs/util'
  import Schedule from '@/views/my-components/schedule/schedule2'

  export default {
    data () {
      return {
        id:'',   //公告id
        url:this.$store.state.app.baseUrl,
        columns1: [             //已审课程表头
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
              return Util.formateDate(params.row.schoolBeginsTime);
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
            key: 'price',
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
            key: 'classHourPlan',
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
                          this.scheduleModal1 = true;
                          this.curIndex = params.index;
                          this.type = 1;
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
                      if(params.row.courseModelId) {
                        this.$http(this.$store.state.app.baseUrl + 'courseModel/getSubCourses?courseModelId='+params.row.courseModelId)
                          .then((res)=>{
                            this.childrenData = res.data.data;
                            this.childrenData.forEach((item=>{
                              item.schoolBeginsTime = Util.formateDate(item.schoolBeginsTime);
                            }))
                          })
                          .catch((error)=>{
                            this.$Message.error(error.message);
                          })
                      }else {
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
                  }
                },'查看子班次')
              }
            }
          },
        ],
        columns2: [         //代审课程表头
            {
                type: 'selection',
                width: 30,
                align: 'center'
            },
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
                  return params.row.classType == 1? '组合班次':'非组合班次'
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
                  return Util.formateDate(params.row.schoolBeginsTime);
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
                  key: 'classHourPlan',
                render: (h, params) => {
                  if(params.row.classHourPlans.length > 0) {
                    let hourDetail = params.row.classHourPlans;
                    let ele = [];
                    for (let i = 0; i < hourDetail.length; i++) {
                      ele.push(h('div', hourDetail[i].categoryName + ':' + hourDetail[i].day + '天' + hourDetail[i].night + '晚'))
                    }
                    return ele
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
                                this.$http(this.$store.state.app.baseUrl + 'course/findCourseTable?courseId='+params.row.id)
                                  .then((res)=>{
                                    this.scheduleData = res.data.data ? res.data.data.courseTableLineItemVos : []
                                  })
                                  .catch((error)=>{
                                    this.$Message.error(error.message);
                                  })
                                this.scheduleModal1 = true;
                                this.curIndex = params.index;
                                this.type = 2;
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
                            if(params.row.courseModelId) {
                              this.$http(this.$store.state.app.baseUrl + 'courseModel/getSubCourses?courseModelId='+params.row.courseModelId)
                                .then((res)=>{
                                  this.childrenData = res.data.data;
                                  this.childrenData.forEach((item=>{
                                    item.schoolBeginsTime = Util.formateDate(item.schoolBeginsTime);
                                  }))
                                })
                                .catch((error)=>{
                                  this.$Message.error(error.message);
                                })
                            }else {
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
                        this.scheduleModal1 = true;
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
        childrenData:[],
          //已审列表
        checkedData: [],
          //待审列表
        waitData: [],
        selectedStashData:[],       //待审列表选中的数据
        tableChecked: ['written', 'audition'],
        formNote: {
          zhenti: '',
          advice: ''
        },
        isShow:false,
        writeManList:[],
        faceManList:[],
        reasonList:[
          {
            value:1,
            label:'价格设置不合理'
          },
          {
            value:2,
            label:'与以往课程重复'
          },
          {
            value:3,
            label:'其他'
          }
        ],
        passOrReject:true,     //通过还是驳回
        collVal: ['1','2'],
          writeMan:'',      //笔试主办人
          faceMan:'',       //面试主办人
          reason:'', //驳回原因
        publicAttachmentList:[],
        uploadList:[] ,   //附件列表
        modal1:false,
        modal3:false,
        modal4:false,
        classOrientation:'',
        branchCampusOption:'',
        total1:0,
        pageNumber1:1,
        pageSize1:20,
        total2:0,
        pageNumber2:1,
        pageSize2:20,
        // 课程表
        scheduleModal1: false,
        curIndex: '',
        scheduleData: [],
        type:1,
        modalFlag:false      // 点击modal4的时候为true 否则为false
      }
    },
    methods: {
      changeTableLists () {
        this.checkedData = this.tableFilter();
      },
      tableFilter () {

      },
      submitRejectReason (reason) {                         //驳回 提交原因

      } ,
      pass () {
        //通过时
          this.isShow = true;
          this.passOrReject = true;
        //获取经办人列表
        this.$http({
          method:'get',
          url:this.$store.state.app.baseUrl + 'course/CoursePlaner',
          params:{
            examStyleId:1
          }
        })
          .then((res)=>{
            if(res.data.code == 0) {
              this.writeManList = res.data.data;
            } else {
              this.$Message.error(error.message);
            }
          })
          .catch((error)=>{
            this.$Message.error(error.message);
          })

        this.$http({
          method:'get',
          url:this.$store.state.app.baseUrl + 'course/CoursePlaner',
          params:{
            examStyleId:2
          }
        })
          .then((res)=>{
            if(res.data.code == 0) {
              this.faceManList = res.data.data;
            } else {
              this.$Message.error(error.message);
            }
          })
          .catch((error)=>{
            this.$Message.error(error.message);
          })
      },
      reject () {
          this.isShow = true;
          this.passOrReject = false;
      },
      ok () {
        let data={};
        data.courses = this.selectedStashData;
        data.isPass = this.passOrReject;
        data.coursePlaners = [];
        data.oldExamName = this.formNote.zhenti;
        data.branchCampusOption = this.formNote.advice;
        data.publicAttachmentList = this.uploadList.concat(this.publicAttachmentList);

        if(this.passOrReject) {
          //创建经办人
          let writeManName,faceManName;
          this.writeManList.forEach((item)=>{
            if(item.planerId == this.writeMan) {
              writeManName = item.planerName;
            }
          });
          this.faceManList.forEach((item)=>{
            if(item.planerId == this.faceMan) {
              faceManName = item.planerName;
            }
          });
          let writeManObj = {
            planerId:this.writeMan,
            planerName:writeManName,
            examStyleId:1
          };
          let faceManObj = {
            planerId:this.faceMan,
            planerName:faceManName,
            examStyleId:2
          };

          data.coursePlaners = [writeManObj,faceManObj]
        }else {
          data.rejectInfo = this.reason;
        }

        if(this.selectedStashData.length > 0 && ((this.writeMan != '' || this.faceMan !='' ) || this.reason != '')){
          this.$http({
            method:'post',
            url:this.$store.state.app.baseUrl + 'course/course-review',
            data:data
          })
            .then((res)=>{
              if(res.data.code == 0) {
                this.search1();
                this.search2();
                this.writeMan = '';
                this.faceMan = '';
                this.uploadList = data.publicAttachmentList;
                this.publicAttachmentList.splice(0,this.publicAttachmentList.length);
                this.$Message.success('通过成功');
              } else {
                this.$Message.error(error.message);
              }
            })
            .catch((error)=>{
              console.log(error)
              this.$Message.error(error.message);
            })
        }else {
          this.$Message.error('请选择需要审核的课程和主办人或驳回原因');
        }
      },
      cancel () {
      },
      waitDataSelect (selection) {
          this.selectedStashData = selection ;
      },
      handleSuccess (res,file, fileList) {
        res.data.type = 3;
        this.publicAttachmentList = []
        fileList.forEach((item)=>{
          this.publicAttachmentList.push(item.response.data)
        })
        if(res.code == 0) {
          this.$Message.success('上传成功');
        }else {
          this.$Message.success('上传失败');
        }
      },
      handleRemove (file, fileList) {
        this.publicAttachmentList = [];
        fileList.forEach((item)=>{
          this.publicAttachmentList.push(item.response.data)
        })
      },
      search1 () {
        //查询已选课程
        this.$http({
          method:'post',
          url:this.$store.state.app.baseUrl + 'course/query',
          data:{
            checkStates:[3,5,7],
            pageNumber:this.pageNumber2,
            pageSize:this.pageSize2,
            announcementId:this.$route.params.id
          }
        })
          .then((res)=>{
            if(res.data.code == 0) {
              this.checkedData = res.data.data.content;
              this.total1 = res.data.data.total;
            } else {
              this.$Message.error(error.message);
            }
          })
          .catch((error)=>{
            this.$Message.error(error.message);
          })
      },
      search2 () {
        //查询已选课程
        this.$http({
          method:'post',
          url:this.$store.state.app.baseUrl + 'course/query',
          data:{
            checkStates:[1,4,6],
            pageNumber:this.pageNumber2,
            pageSize:this.pageSize2,
            announcementId:this.$route.params.id
          }
        })
          .then((res)=>{
            if(res.data.code == 0) {
              this.waitData = res.data.data.content;
              this.total2 = res.data.data.total;
            } else {
              this.$Message.error(error.message);
            }
          })
          .catch((error)=>{
            this.$Message.error(error.message);
          })
      },
      changePublicAttachmentList  (publicAttachmentList,oldExam,branchCampusOption){
        this.uploadList = publicAttachmentList;
        this.formNote.zhenti = oldExam;
        this.formNote.advice = branchCampusOption;
      },
      deleteAttachment (item,index) {
        this.uploadList.splice(index,1)
      },
      changePage1(page) {
        this.pageNumber1 = page;
        this.search1();
        this.selectedStashData.splice(0,this.selectedStashData.length);
      },
      changePage2(page) {
        this.pageNumber2 = page;
        this.search2();
        this.selectedStashData.splice(0,this.selectedStashData.length);
      },
      classOrientationOk() {
        if(this.modalFlag == true) {
          this.modal4 = true;
          this.modalFlag = true;
        }
      },
      childrenOk(){
        this.modalFlag = false;
      }
    },
    mounted() {
        this.search1();
        this.search2();
    } ,
    beforeMount () {
      this.id = this.$route.params.id;
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
    .pass_wrap .ivu-row {
        margin: 20px 0 20px 0;
    }
    .ivu-table-cell {
      padding: 0!important;
    }
</style>
