<template>
    <div id="apply-detail" style="position: relative;">
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
                        <!--<Checkbox label="1">笔试</Checkbox>-->
                        <!--<Checkbox label="2">面试</Checkbox>-->
                    </Checkbox-group>
                    <Collapse v-model="collVal">
                        <Panel name="1">
                            <Icon type="plus"></Icon>新建课程
                            <LessonAdd slot="content" :changeTableLists="changeTableLists" :tableChecked="tableChecked" ref="lessonAdd" :search2="search2"></LessonAdd>
                        </Panel>
                        <Panel name="2">
                            <Icon type="ios-search-strong"></Icon>待选课程
                            <Button type="primary" style="margin-left:50px;" @click.stop="addToSelectedLesson" v-show="collVal.indexOf('2')>=0">加入已选课程</Button>
                            <Table slot="content" :data="waitData" :columns="columns1" border class="waitTable" @on-selection-change="getWaitSelectedData"></Table>
                            <Page slot="content" :total="total1" :current="pageNumber1" :page-size="pageSize1" @on-change="changePage1" show-total style="text-align: right;margin-top: 10px;"></Page>
                        </Panel>
                        <Panel name="3">
                            <Icon type="ios-star"></Icon>已选课程
                            <Button type="error" style="margin-left:50px;" v-show="collVal.indexOf('3')>=0" @click.stop="removeLesson">移出已选课程</Button>
                            <Table slot="content" :data="selectedData" :columns="columns2" border class="selectedTable" @on-selection-change="getAlreadySelectedData"></Table>
                            <Page slot="content" :total="total2" :current="pageNumber2" :page-size="pageSize2" @on-change="changePage2"  show-total style="text-align: right;margin-top: 10px;"></Page>
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
                                <span>{{item.filename}}</span> <a class="operate" :href="url + 'announce/download-attachment?url=' + item.ossUrl + '&filename=' + item.filename">下载附件</a><span class="operate" @click="deleteAttachment(item,index)">删除附件</span>
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
                    <Col span="4" offset="8">
                    <Button type="primary" size="large" long @click="handleSubmit()">提交</Button>
                    </Col>
                    <Col span="4" style="margin-left: 20px">
                    <Button type="primary" size="large" long @click="back()">返回</Button>
                    </Col>
                </Row>
            </Card>
            </Col>
        </Row>
        <Modal @on-ok="ok" @on-cancel="cancel" v-model="addIsShow">
            <Form ref="priceForm" v-model="priceForm" :label-width="100">
                <Row>
                    <FormItem  label="是否协议">
                        <Select v-model="priceForm.agreement">
                            <Option value="0">是</Option>
                            <Option value="1">否</Option>
                        </Select>
                    </FormItem>
                </Row>
                <Row>
                    <FormItem  label="住宿地址">
                        <Select v-model="priceForm.stay">
                            <Option value="0">基地</Option>
                            <Option value="1">酒店</Option>
                        </Select>
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="价格">
                        <InputNumber :min="0" v-model="priceForm.price"></InputNumber>
                    </FormItem>
                </Row>
                <Row>
                  <FormItem label="笔试不过退费" v-show="priceForm.agreement == 0 && (examStyleId == 1 || examStyleId == 3)" >
                    <InputNumber :min="0" v-model="priceForm.writtenTf"></InputNumber>
                  </FormItem>
                </Row>
                <Row>
                  <FormItem label="面试不过退费" v-show="priceForm.agreement == 1 && (examStyleId == 2 || examStyleId == 3)" >
                    <InputNumber :min="0" v-model="priceForm.interviewTf"></InputNumber>
                  </FormItem>
                </Row>
                <Row>
                  <FormItem label="退费说明">
                    <Input type="textarea" v-model="priceForm.mark" :rows="1"></Input>
                  </FormItem>
                </Row>
            </Form>
        </Modal>
        <Modal @on-ok="changeName" v-model="changeNameIsShow">
            <textarea type="text" v-model="currentName" class="titleContent" ></textarea>
        </Modal>
        <Modal @on-ok="changePublish" v-model="changePublishIsShow">
            <!--<input type="number" min="0" max="12" class="month">月<input type="number" min="0" max="31" class="day">日-->
          <DatePicker v-model="currentPublish"  type="date" placeholder="Select date" style="width: 200px"></DatePicker>
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
  import Schedule from '@/views/my-components/schedule/schedule2.vue'
  import NoticeInfo from './notice_Info'
  import Util from '../../libs/util'
  export default {
    data () {
      return {
        id:this.$route.params.id,
        url:this.$store.state.app.baseUrl,
        total1:0,  //总数
        pageNumber1:1,  //当前页数
        pageSize1:20,
        total2:0,  //总数
        pageNumber2:1,  //当前页数
        pageSize2:20,
        columns1: [
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
            key: 'courseName',
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
              if(params.row.rootDirectoryName){
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
            render:(h,params)=>{
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
            }
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
                              if(res.data.code == 0) {
                                this.scheduleData = res.data.data ? res.data.data.courseTableLineItemVos : []
                              } else {
                                this.$Message.error(res.data.message)
                              }
                            })
                            .catch((error)=>{
                              this.$Message.error(error.message);
                            })
                          this.curIndex = params.index;
                          this.lessonData = this.waitData[this.curIndex];
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
                      this.$http(this.$store.state.app.baseUrl + 'courseModel/getSubCourses?courseModelId='+params.row.id)
                        .then((res)=>{
                          if(res.data.code == 0) {
                            this.childrenData = res.data.data;
                            this.childrenData.forEach((item=>{
                              item.schoolBeginsTime = Util.formateDate(item.schoolBeginsTime);
                            }))
                          } else {
                            this.$Message.error(res.data.message)
                          }
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
        columns2: [
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
                  key: 'courseName',
                  render:(h,params)=>{
                      return h('div',{class:'title'},[
                          (()=>{
                              let title = params.row.courseName;
                              return title
                          })(),h('span',{
                              class: ['operate','notShow'],
                              on: {
                                  click: () => {
                                      //获取当前点击的行的index
                                      this.changeNameId = params.row.id;
                                      this.changeNameIsShow = true;
                                      this.currentName = params.row.courseName;
                                  }
                              }
                          }, '修改')
                      ])
                  }
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
                  if(params.row.rootDirectoryName){
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
                      return h('div',{class:'openDate'},[
                          (()=>{
                              let publish = params.row.schoolBeginsTime;
                              return publish
                          })(),h('span',{
                              class: ['operate','notShow'],
                              on: {
                                  click: () => {
                                      //确定当前点击的行的index
                                      this.changeNameId = params.row.id;
                                      //显示弹窗
                                      this.changePublishIsShow = true;
                                      this.currentPublish = params.row.schoolBeginsTime;
                                  }
                              }
                          }, '修改')

                      ])
                  }
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
                      return h('div', [(() => {
                          let price=[];
                          params.row.priceInfoArray.forEach((item)=>{
                            let writtenTf = item.writtenTf?'-笔试不过退费:'+item.writtenTf:'';
                            let interviewTf = item.interviewTf?'-面试不过退费:'+item.interviewTf:'';
                            let str = item.agreement + '班-' + item.price  + (item.stay==null?'-':'-'+item.stay)  + writtenTf + interviewTf;
                              price.push(str)
                          });
                          if(price) {
                            let ele = [];
                            for (let i = 0; i < price.length; i++) {
                              ele.push(h('div', [price[i],h('span',{
                                class:['operate','notShow'],
                                on: {
                                  click: (ev) => {
                                    const parentDom = ev.target.parentNode;   //'删除'的父元素
                                    const parent2Dom = ev.target.parentNode.parentNode;   //'删除父元素的父元素'
                                    let index = params.index;
                                    if(parent2Dom.children.length>2){             // 只有两个子元素时 '添加'span  和'删除'div
                                      parent2Dom.removeChild(parentDom);
                                      // params.row.price.splice(i,1)
                                      console.log(this.selectedData);
                                      this.selectedData[index].priceInfoArray.splice(i,1)
                                    }else if(parent2Dom.children.length == 2){
                                      this.$Message.error('至少保留一个价格')
                                    }
                                  }
                                }
                              }, '删除')]))
                            }
                            return ele
                          }else {
                            return ''
                          }

                      })(),h('span',{
                          class: ['operate','notShow'],
                          on: {
                              click: () => {
                                  this.addIsShow = true;
                                  this.selectedId = params.row.id;
                                  this.examStyleId = params.row.examStyleId;
                              }
                          }
                      }, '添加')
                      ])
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
                  render:(h,params)=>{
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
                  }
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
                                    if(res.data.code == 0) {
                                      this.scheduleData = res.data.data ? res.data.data.courseTableLineItemVos : []
                                    } else {
                                      this.$Message.error(res.data.message)
                                    }
                                  })
                                  .catch((error)=>{
                                    this.$Message.error(error.message);
                                  })
                                this.curIndex = params.index;
                                this.lessonData = this.selectedData[this.curIndex];
                                this.scheduleIsShow = true;
                              }else {
                                this.$Message.error('组合班次没有课程表！！')
                              }
                            }
                          }
                        }, '课程表'),
                        h('span', {
                          class: 'operate notShow',
                          on: {
                            click: () => {
                              if(params.row.checkState == 0 || params.row.checkState == 2) {
                                this.$http({
                                  method:'get',
                                  url:this.$store.state.app.baseUrl + 'course/delTempCourse',
                                  params:{
                                    id:params.row.id
                                  }
                                })
                                  .then((res)=>{
                                    if(res.data.code == 0) {
                                      const indexWait = params.index;
                                      this.selectedData.splice(indexWait,1);
                                      this.total2 = this.total2 - 1;
                                    } else {
                                      this.$Message.error(res.data.message)
                                    }
                                  })
                                  .catch((error)=>{
                                    this.$Message.error(error.message);
                                  })
                              }else {
                                const indexWait = params.index;     //在已选课程中的id
                                const id = this.selectedData[indexWait].id ;                  //在待选课程中的id
                                this.waitData.forEach((item)=>{
                                  if(item.id == id) {
                                    item._disabled = false;
                                    this.$set(item);
                                    this.$forceUpdate()
                                  }
                                });
                                this.selectedData.splice(indexWait,1);
                                this.total2 = this.total2 - 1;
                              }
                            }
                          }
                        }, '删除')
                      ])
                    }else {
                      return h('div',[
                        h('span',{
                          class:'operate',
                          on:{
                            click:()=>{
                              this.modal4 = true;
                              this.modalFlag = true;
                              if(params.row.courseModelId) {
                                this.$http(this.$store.state.app.baseUrl + 'courseModel/getSubCourses?courseModelId='+params.row.courseModelId)
                                  .then((res)=>{
                                    if(res.data.code == 0) {
                                      this.childrenData = res.data.data;
                                      this.childrenData.forEach((item=>{
                                        item.schoolBeginsTime = Util.formateDate(item.schoolBeginsTime);
                                      }))
                                    }else{
                                      this.$Message.error(res.data.message)
                                    }
                                  })
                                  .catch((error)=>{
                                    this.$Message.error(error.message);
                                  })
                              }else {
                                this.$http(this.$store.state.app.baseUrl + 'course/getSubCourses?courseId='+params.row.id)
                                  .then((res)=>{
                                    if(res.data.code == 0) {
                                      this.childrenData = res.data.data;
                                      this.childrenData.forEach((item=>{
                                        item.schoolBeginsTime = Util.formateDate(item.schoolBeginsTime);
                                      }))
                                    }else{
                                      this.$Message.error(res.data.message)
                                    }
                                  })
                                  .catch((error)=>{
                                    this.$Message.error(error.message);
                                  })
                              }
                            }
                          }
                        },'查看子班次'),
                        h('span', {
                          class: 'operate notShow',
                          on: {
                            click: () => {
                              if(params.row.checkState == 0 || params.row.checkState == 2) {
                                this.$http({
                                  method:'get',
                                  url:this.$store.state.app.baseUrl + 'course/delTempCourse',
                                  params:{
                                    id:params.row.id
                                  }
                                })
                                  .then((res)=>{
                                    if(res.data.code == 0) {
                                      const indexWait = params.index;
                                      this.selectedData.splice(indexWait,1);
                                      this.total2 = this.total2 - 1;
                                    }else{
                                      this.$Message.error(res.data.message)
                                    }
                                  })
                                  .catch((error)=>{
                                    this.$Message.error(error.message);
                                  })
                              }else {
                                const indexWait = params.index;     //在已选课程中的id
                                const id = this.selectedData[indexWait].id ;                  //在待选课程中的id
                                this.waitData.forEach((item)=>{
                                  if(item.id == id) {
                                    item._disabled = false;
                                    this.$set(item);
                                    this.$forceUpdate()
                                  }
                                });
                                this.selectedData.splice(indexWait,1);
                                this.total2 = this.total2 - 1;
                              }
                            }
                          }
                        }, '删除')
                      ])
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
                              if(res.data.code == 0) {
                                this.scheduleData = res.data.data ? res.data.data.courseTableLineItemVos : []
                              } else {
                                this.$Message.error(res.data.message)
                              }
                            })
                            .catch((error)=>{
                              this.$Message.error(error.message);
                            })
                          this.curIndex = params.index;
                          this.scheduleIsShow = true;
                          this.lessonData = this.childrenData[this.curIndex];
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
        childrenData:[],  //子班次
        waitData: [],
        selectedData: [],       //已选课程数据
        alreadyStashData:[],       //已选课程中 选中的数据
        waitStashData:[],       //待选课程中的选中的数据
        hasToSelectedData:[],   //待选课程中已加入已选课程的数据
        selectedId:-1,    //当前点击的待选课程的index
        waitIndex:-1,         //当前点击的已选课程的index
        changeNameId:-1,   //修改名称的点击的index
        waitIndexList:[],     //选中过的母版的index列表
        tableChecked: ['1', '2'],
        formNote: {
          zhenti: '',
          advice: ''
        },
        collVal: ['2','3'],
        addIsShow:false,                //添加价格弹窗
        changeNameIsShow:false,         //修改名称
        currentName:'',     //当前名称
        changePublishIsShow:false,      //修改开班日期
        currentPublish:'',  //开班日期
        examStyleId:0,   //当前点击的课程班级类型
        priceForm:{
            agreement:'0',   //是否协议  0 协议 1 非协议
            stay:'0',        //住宿地址  0 基地 1 酒店
            price:0 ,      // 价格
            writtenTf:0,
            interviewTf:0,
            mark:''
        },
        sizeArray1:[5,10,15,20],
        sizeArray2:[5,10,15,20],
        current1:1,
        current2:2,
        publicAttachmentList:[],
        uploadList:[],
        modal1:false,
        modal3:false,
        modal4:false,
        classOrientation:'',
        branchCampusOption:'',
        curIndex:'',   //点击课程表 当前index
        lessonData:null,
        scheduleData:[],
        scheduleIsShow:false,           //课程表
        modalFlag:false      // 点击modal4的时候为true 否则为false
      }
    },
    methods: {
      changeTableLists () {
        this.search1();
      },
      handleSubmit () {
          //发送请求
          if(this.alreadyStashData.length > 0) {
              let data = {};
              data.courses = this.alreadyStashData;
              data.courses.forEach((item,index)=>{
                  item.schoolBeginsTime = new Date(item.schoolBeginsTime).getTime();
                  item.provinceId = this.$route.query.provinceId;
              });
              data.oldExamName = this.formNote.zhenti;
              data.branchCampusOption = this.formNote.advice;
              data.publicAttachmentList = this.uploadList.concat(this.publicAttachmentList);

              // announcementId
              this.$http({
                  method:'post',
                  url:this.$store.state.app.baseUrl + 'course/createWithModel',
                  data: data,
                  headers: {'Content-type': 'application/json'}
              })
                  .then((res)=>{
                      if(res.data.code == 0) {
                          this.$Message.success('提交成功');
                          this.alreadyStashData.splice(0,this.alreadyStashData.length);
                          this.search2();
                      }else {
                        this.$Message.error(res.data.message);
                      }
                  })
                  .catch((error)=>{
                      this.$Message.error(error.message);
                  })
          } else {
              this.$Message.error('请选择课程');
          }

      },
      pass () {
          this.isShow = true;
          this.passOrReject = true;
      },
      reject () {
          this.isShow = true;
          this.passOrReject = false;
      },
      closePopup () {
          this.isShow = false;
      },
      ok () {
          let obj={};
          let agreement = this.priceForm.agreement == '0'? '协议':'非协议';
          let stay = this.priceForm.stay == '0'? '基地':'酒店';
          let price = this.priceForm.price;
          let writtenTf = this.priceForm.writtenTf;
          let interviewTf = this.priceForm.interviewTf;

          obj={
            agreement:agreement,
            stay:stay,
            price:price,
            writtenTf:writtenTf,
            interviewTf:interviewTf
          };
          this.selectedData.forEach((item)=>{
            if(item.id == this.selectedId) {
              item.priceInfoArray.push(obj);
              item._checked = true;
            }
          });
          this.alreadyStashData = this.selectedData.filter((item)=>{
            return item._checked;
          })
        console.log(this.alreadyStashData)
        console.log(this.selectedData)

      },
      cancel () {

      },
      addToSelectedLesson () {
        if(this.waitStashData.length > 0) {
          this.waitStashData.forEach((item)=>{
            item.courseModelId = item.id;
          });
          this.selectedData = this.waitStashData.concat(this.selectedData);
          this.total2 = this.total2 + this.selectedData.length;
          this.hasToSelectedData = this.hasToSelectedData.concat(this.waitStashData);
          //添加到已选课程中的元素 不可选
          this.waitStashData.forEach((item1)=>{
            this.waitData.forEach((item)=>{
              if(item.id == item1.id) {
                item._disabled = true;
                this.$set(item);
                this.$forceUpdate()
              }
            })
          });
          this.waitStashData.splice(0,this.waitStashData.length);
        }
        console.log(this.selectedData)

      },
      removeLesson () {
        if(this.alreadyStashData.length > 0) {
            //已选课程中移除
          for(let i=0;i<this.alreadyStashData.length;i++){
              for(let j=0;j<this.selectedData.length;j++){
                if(this.selectedData[j].id == this.alreadyStashData[i].id){
                    this.selectedData.splice(j,1);
                    j--;
                }
              }
          }
            //从母版添加的课程列表中移除
          for(let i=0;i<this.alreadyStashData.length;i++){
              for(let j=0;j<this.hasToSelectedData.length;j++){
                  if(this.hasToSelectedData[j].id == this.alreadyStashData[i].id){
                      this.hasToSelectedData.splice(j,1);
                      j--;
                  }
              }
          }
          //已选课程中移除的元素 在待选中变为可选
          this.alreadyStashData.forEach((item,index)=>{
            this.waitData.forEach((item2)=>{
              if(item.id == item2.id) {
                item2._disabled = false;
                this.$set(item2);
                this.$forceUpdate()
              }
            })
          })
          this.total2 = this.total2 - this.alreadyStashData.length;

          this.alreadyStashData.splice(0,this.alreadyStashData.length);
        }
      },
      getWaitSelectedData (selection,row) {
          this.waitStashData = selection ;   //获取待选课程中选中的元素
      },
      getAlreadySelectedData (selection,row) {
          this.alreadyStashData = selection ;   //获取已选课程中选中的元素

          this.selectedData.forEach((item)=>{     //已选中的数据 _checked 设为true
            this.alreadyStashData.forEach((item2)=>{
              if(item.id == item2.id) {
                item._checked = true;
              }
            })
          });
          let resetData = this.selectedData.minus(this.selectedData);
          this.selectedData.forEach((item)=>{     //已选中之外的数据 _checked 设为false
              resetData.forEach((item2)=>{
              if(item.id == item2.id) {
                item._checked = false;
              }
            })
          });
          console.log(this.alreadyStashData);
          console.log(this.selectedData);
        },
      changeName () {
        //修改数据源中的值为输入框的值
          this.selectedData.forEach((item)=>{
             if(item.id == this.changeNameId) {
                item.courseName = this.currentName;
            }
          })
      },
      changePublish () {
            this.selectedData.forEach((item)=>{
                if(item.id == this.changeNameId) {
                    item.schoolBeginsTime = Util.formateDate(this.currentPublish.getTime());
                }
          })
        console.log(this.selectedData);
      },
      back () {
        window.history.go(-1);
      },
      changePage1 (page) {
          this.pageNumber1 = page;
          this.search1();
          this.alreadyStashData.splice(0,this.alreadyStashData.length);
      },
      changePage2 (page) {
          this.pageNumber2 = page;
          this.search2();
          this.alreadyStashData.splice(0,this.alreadyStashData.length);
      },
      search1 () {
          this.$http({
              method:'post',
              url:this.$store.state.app.baseUrl + 'courseModel/queryWithCreatable',
              data:{
                  // examStyleId:templateStyle,
                  pageNumber:this.pageNumber1,
                  pageSize:this.pageSize1,
                  checkState:7,
                  announcementId:this.$route.params.id,
                  provinceId:this.$route.query.provinceId
              }
          })
              .then((res)=>{
                if(res.data.code == 0) {
                    this.waitData = res.data.data.content;
                    if(res.data.data.content.length > 0) {
                        this.waitData.forEach((item,index)=>{
                            item.schoolBeginsTime = Util.formateDate(item.schoolBeginsTime);
                            if(item.creatable) {
                                this.$set(item,'_disabled',true);
                            }else{
                                this.$set(item,'_disabled',false);
                            }
                        });
                    }
                    this.total1 = res.data.data.total;
                } else {
                  this.$Message.error(res.data.message)
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
                  checkStates:[0,2],
                  pageNumber:this.pageNumber2,
                  pageSize:this.pageSize2,
                  announcementId:this.$route.params.id
              }
          })
              .then((res)=>{
                  if(res.data.code == 0) {
                      this.selectedData = this.hasToSelectedData.concat(res.data.data.content);
                      this.selectedData.forEach((item,index)=>{
                         item.schoolBeginsTime = Util.formateDate(item.schoolBeginsTime);
                          this.$set(item,'_checked',false);
                      });
                      this.total2 = res.data.data.total;
                  } else {
                    this.$Message.error(res.data.message);
                  }
              })
              .catch((error)=>{
                  this.$Message.error(error.message);
              })
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
      changePublicAttachmentList  (publicAttachmentList,oldExam,branchCampusOption){
          this.uploadList = publicAttachmentList;
          this.formNote.zhenti = oldExam;
          this.formNote.advice = branchCampusOption;
      },
      deleteAttachment (item,index) {
        this.uploadList.splice(index,1)
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
    beforeMount () {
      // window.scrollTo(0, 0)
    },
    mounted() {
        this.search1();
        this.search2();
        this.id = this.$route.params.id;
      // this.uploadList = this.$refs.upload.fileList;
    },
    components:{
        Popup,
        LessonAdd,
        Schedule,
        NoticeInfo
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  #apply-detail {
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
      padding:0 5px 0 ;
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
    .ivu-table-cell{
      padding: 0!important;
    }
    .ivu-collapse-content {
      overflow: initial;
    }
  }
</style>
