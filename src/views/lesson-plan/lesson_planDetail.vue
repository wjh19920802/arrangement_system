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
                        <!--<Checkbox-group v-model="tableChecked" @on-change="changeTableLists">-->
                            <!--&lt;!&ndash;筛选：&ndash;&gt;-->
                            <!--&lt;!&ndash;<Checkbox label="written">笔试</Checkbox>&ndash;&gt;-->
                            <!--&lt;!&ndash;<Checkbox label="audition">面试</Checkbox>&ndash;&gt;-->
                        <!--</Checkbox-group>-->
                        <Collapse v-model="collVal">
                            <Panel name="1">
                                <Icon type="ios-search-strong"></Icon>已规划课程
                                <Table slot="content" :data="plannedData" :columns="columns1" border class="plannedTable"></Table>
                              <Page slot="content" :total="total1" :current="pageNumber1" :page-size="pageSize1" @on-change="changePage1" show-total style="text-align: right;margin-top: 10px;"></Page>
                            </Panel>
                            <Panel name="2">
                                <Icon type="ios-star"></Icon>待规划课程
                                <Table slot="content" :data="waitPlanData" :columns="columns2" border class="waitPlanTable" @on-selection-change="getWaitPlanData"></Table>
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
                        <Col span="3" offset="8">
                        <Button type="success" long size="large" @click="pass">通过</Button>
                        </Col>
                        <Col span="3" offset="2">
                        <Button type="error" long size="large" @click="reject">驳回</Button>
                        </Col>
                    </Row>
                </Card>
                <Modal @on-ok="addHourPlan" v-model="hourPlanIsShow">
                    <!--<textarea type="text" class="hourPlanContent" ></textarea>-->
                    <div v-for="item,index in subject" class="hourPlanContent" :data-id="item.id">
                        {{item.categoryName}}&nbsp;&nbsp; <InputNumber :min="0" class="day"></InputNumber> &nbsp;&nbsp;&nbsp;天&nbsp;&nbsp;&nbsp; <InputNumber :min="0" class="night"></InputNumber>&nbsp;&nbsp;晚
                    </div>
                </Modal>
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
              <Option value="">请选择</Option>
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
              <Option value="">请选择</Option>
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
              <Option v-for="item in reasonList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            </Col>
          </Row>
        </div>
      </Modal>
      <Modal v-model="scheduleModal1"
             width="80%"
             title="课程表"
             @on-ok="submitSchedule(1)"
             @on-cancel="classOrientationOk">
            <Schedule ref="scheduleDom1"
                      class="margin-top-20"
                      :lessonData="lessonData"
                      :scheduleData="scheduleData"
                      :scheduleEdit=false>
            </Schedule>
        </Modal>
      <Modal v-model="scheduleModal2"
             width="80%"
             title="课程表"
             class="schedule"
      >
            <Schedule ref="scheduleDom2"
                      class="margin-top-20"
                      :lessonData="lessonData"
                      :scheduleData="scheduleData"
                      :scheduleEdit=true>
            </Schedule>
            <div slot="footer">
              <Upload
                ref="upload"
                :headers="{'accessToken':accessToken}"
                :show-upload-list="false"
                :on-success="handleSuccessExcel"
                :action="url + 'course/getCourseTableByExcel?scheduleDays=' + scheduleDays + '&categoryIds=' + categoryIds "
              >
                <Button type="primary" size="large" style="float: left;">导入课表Excel</Button>
              </Upload>
              <!--<div class="upload_excel">
                <input type="file" id="FileUpload" ref="upload_file" style="display: none;" @change="uploadExcel">
                <Button @click="uploadFile">
                  上传Excel
                </Button>
              </div>-->
              <Button type="text" size="large"   @click="classOrientationOk">取消</Button>
              <Button type="primary" size="large"   @click="submitSchedule(0)">确定</Button>
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
      <Modal
        v-model="teachingMaterialsIsShow"
        :title="isEdit?'编辑讲义名称':'查看讲义名称'"
        @on-ok="yes"
        @on-cancel="materialCancle"
      >
        <div v-if="!isEdit">
          <h3 v-for="item,index in currentTeachingMaterials">
            {{index+1}}、{{item.teachingMaterialName}}
          </h3>
        </div>
        <div v-else="isEdit">
          <div v-for="item,index in teachingMaterialList" style="margin-bottom: 15px;">
            <span v-show="item.flag1">
              <Input style="width: 300px;margin-right: 50px;" v-model="item.teachingMaterialName" ></Input>
              <span @click="comfirm(index,item)" class="confirm" v-show="item.flag3">确认</span>
            </span>
            <h5 v-show="!item.flag1" class="teachingMaterialContent">{{item.teachingMaterialName}} <span style="float: right;" class="operate" @click="edit(index)">编辑</span></h5>
            <span @click="addLine(index,item)" v-show="item.flag2">
              <Icon type="plus-circled" class="addIcon"></Icon>
            </span>
            <Button v-show="!item.flag2" @click="deleteMaterial(index)" type="error">删除</Button>
          </div>
        </div>
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
  import Schedule from '@/views/my-components/schedule/schedule2'
  import Util from '../../libs/util'
  export default {
    data () {
      return {
        id:this.$route.params.id,
        url:this.$store.state.app.baseUrl,
        accessToken:Cookies.get('accessToken'),
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
              return params.row.classType == 1? '组合班次':'非组合班次'
            }
          },
          {
            title: '班级系列',
            align: 'center',
            key: 'classSeries',
            render:(h,params)=>{
              return params.row.classSeries.classSeriesName
            }
          },
        /*  {
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
          },*/
          {
            title: '课时',
            align: 'center',
            key: 'classHour'
          },
          {
            title: '科目',
            align: 'center',
            key: 'category',
            render:(h,params)=>{
              return h('div', (() => {
                let categorys = params.row.categorys;
                let ele = [];
                for (let i = 0; i < categorys.length; i++) {
                  ele.push(h('div', categorys[i].categoryName))
                }
                return ele
              })())
            }
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
            title: '价格',
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
            title: '休息时间',
            align: 'center',
            key: 'dayOfRest'
          },
          {
            title: '分组人数（面试）',
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
            title:'查看讲义名称',
            align: 'center',
            key:'teachingMaterials',
            render:(h,params) =>{
              return h('div',{
                class:'operate chakan',
                on:{
                  click:()=> {
                    this.currentTeachingMaterials = params.row.teachingMaterials;
                    console.log(this.currentTeachingMaterials)
                    this.teachingMaterialsIsShow = true;
                    this.isEdit = false;
                  }
                }
              },'查看')
            }
          },
          {
            title: '课时规划',
            align: 'center',
            key: 'classHourPlan',
              render: (h, params) => {
                if(params.row.classHourPlans.length > 0) {
                  return h('div', (() => {
                      let hourPlans = params.row.classHourPlans;
                      let ele = [];
                      if(hourPlans.length == 0) {
                        return '--'
                      }else {
                        for (let i = 0; i < hourPlans.length; i++) {
                          ele.push(h('div', hourPlans[i].categoryName + ':' + hourPlans[i].day + '天' + hourPlans[i].night + '晚'))
                        }
                        return ele
                      }
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
                          this.lessonData = this.plannedData[this.curIndex];
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
                  key: 'courseName'
              },
              {
                  title: '班级类型',
                  align: 'center',
                  key: 'classType',
                  render:(h,params)=>{
                    return params.row.classType == 1? '组合班次':'非组合班次';
                  }
              },
              {
                  title: '班级系列',
                  align: 'center',
                  key: 'classSeries',
                  render:(h,params)=>{
                    return params.row.classSeries.classSeriesName
                }
              },
             /* {
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
              },*/
              {
                  title: '课时',
                  align: 'center',
                  key: 'classHour'
              },
              {
                  title: '科目',
                  align: 'center',
                key: 'category',
                render:(h,params)=>{
                  return h('div', (() => {
                    let categorys = params.row.categorys;
                    let ele = [];
                    for (let i = 0; i < categorys.length; i++) {
                      ele.push(h('div', categorys[i].categoryName))
                    }
                    return ele
                  })())
                }
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
                  title: '价格',
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
                  title: '休息时间',
                  align: 'center',
                  key: 'dayOfRest'
              },
              {
                  title: '分组人数（面试）',
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
                title:'编辑讲义名称',
                align: 'center',
                key:'teachingMaterials',
                render:(h,params) =>{
                  return h('div',{
                    class:'operate',
                    on:{
                      click:()=> {
                        this.currentId = params.row.id;
                        this.teachingMaterialsIsShow = true;
                        this.isEdit = true;
                        if(params.row.teachingMaterials.length > 0) {
                          this.teachingMaterialList = params.row.teachingMaterials;
                          this.teachingMaterialList.forEach((item,index)=>{
                            item.flag1 = false;
                            item.flag2 = false;
                            item.flag3 = true;
                            if(index == this.teachingMaterialList.length - 1) {
                              item.flag2 = true;
                            }
                          })
                        }

                      }
                    }
                  },'编辑')
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
                                // 发送请求
                                // 如果get 到 null
                                // 如果get 到 数据 就用数据传进组件内
                                this.$http(this.$store.state.app.baseUrl + 'course/findCourseTable?courseId=' + params.row.id)
                                  .then((res)=>{
                                    // 判断 如果没有课程表，就用新的
                                    // 如果有 就用已有的
                                    //console.log(res.data.data.courseTableLineItemVos)
                                    this.scheduleData = res.data.data ? res.data.data.courseTableLineItemVos : [] ;
                                    this.updateId = res.data.data? res.data.data.id : null ;
                                    console.log(res.data.data)
                                    //this.data1 = this.scheduleArr;

                                    /*if(res.data.code == 0 ){
                                     this.data1 = res.data.data.courseTableLineItemVos
                                     //this.$store.state.user.schedule = res.data.data;
                                     }else {
                                     this.$Message.error(res.data.message);
                                     }*/
                                  })
                                  .catch((error)=>{
                                    this.$Message.error(error.message);
                                  })
                                this.scheduleModal2 = true;
                                this.curIndex = params.index;
                                this.categoryIds = params.row.categoryIds;
                                this.scheduleDays = parseInt(this.waitPlanData[this.curIndex].classHour.split('天')[0]) + (this.waitPlanData[this.curIndex].openClassTime == '上午' ? 0 : 1)
                                this.lessonData = this.waitPlanData[this.curIndex];
                                //this.scheduleEdit = true
                              }else {
                                this.$Message.error('组合班次没有课程表！！')
                              }
                            }
                          }
                        }, '课程表'),
                        h('span', {
                          class: 'operate',
                          on: {
                            click: () => {
                              this.subject = params.row.categorys;
                              this.hourPlanId = params.row.id;
                              this.hourPlanIsShow = true;
                              setTimeout(()=>{
                                if(params.row.classHourPlans.length == 0 ) {
                                  for(let i = 0;i< document.getElementsByClassName('hourPlanContent').length;i++){
                                    document.getElementsByClassName('hourPlanContent')[i].querySelector('.day .ivu-input-number-input').value = 0;
                                    document.getElementsByClassName('hourPlanContent')[i].querySelector('.night .ivu-input-number-input').value = 0
                                  }
                                }else {
                                  params.row.classHourPlans.forEach((item,index)=>{
                                    document.getElementsByClassName('hourPlanContent')[index].querySelector('.day .ivu-input-number-input').value = item.day;
                                    document.getElementsByClassName('hourPlanContent')[index].querySelector('.night .ivu-input-number-input').value = item.night;
                                  })
                                }
                              },30)
                            }
                          }
                        }, '添加规划'),
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
              return params.row.classSeries.classSeriesName
            }
          },
         /* {
            title: '根目录',
            align: 'center',
            key: 'rootDirectoryName'
          },*/
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
            title:'查看讲义名称',
            align: 'center',
            key:'teachingMaterials',
            render:(h,params) =>{
              return h('div',{
                class:'operate chakan',
                on:{
                  click:()=> {
                    this.currentTeachingMaterials = params.row.teachingMaterials;
                    console.log(this.currentTeachingMaterials)
                    this.teachingMaterialsIsShow = true;
                    this.isEdit = false;
                    if(this.modal4 == true && this.modalFlag == true) {
                      this.modal4 = false;
                    }
                  }
                }
              },'查看')
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
        childrenData:[],
        plannedData: [],
        waitPlanData: [],
        waitStashData:[],       //待规划的选中的数据
        tableChecked: ['written', 'audition'],
        formNote: {
          zhenti: '',
          advice: ''
        },
        isShow:false,
        passOrReject:true,     //通过还是驳回
        collVal: ['1','2'],
        hourPlanIsShow:false,
        hourPlanId:-1,    //当前点击待规划的课程id
        subject:[],       //当前点击带规划的科目列表
        writeMan:'',      //笔试主办人
        faceMan:'',       //面试主办人
        reason:'',         //驳回原因
        faceManList: [],
        writeManList: [],
        reasonList:[
          {
            value:1,
            label:'课时设置不合理'
          },
          {
            value:2,
            label:'其他'
          }
        ],
        // 课程表
        scheduleModal1: false,
        scheduleModal2: false,
        curIndex: 0,
        scheduleData: [],
        // 课程表是否可以编辑  仅在待规划中可编辑
        scheduleEdit: true,
        modal1:false,
        modal3:false,
        modal4:false,
        classOrientation:'',
        branchCampusOption:'',
        publicAttachmentList:[],
        uploadList:[],
        total1:0,
        pageNumber1:1,
        pageSize1:20,
        total2:0,
        pageNumber2:1,
        pageSize2:20,
        teachingMaterialsIsShow:false,
        currentTeachingMaterials:[],
        updateId: null,
        isEdit:true , //编辑或查看
        teachingMaterialList:[
          {
            flag1:true,
            flag2:true,
            flag3:false,
            teachingMaterialName:''
          }
        ],
        currentId:'',
        modalFlag:false,   // 点击modal4的时候为true 否则为false
        lessonData:null,
        scheduleDays:0,
        categoryIds:[]
      }
    },
    computed:{
      categoryStr() {
        // this.categoryIds.forEach(())
      }
    },
    methods: {
      pass () {
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
              this.$Message.error(res.data.message);
            }
          })
          .catch((error)=>{
            this.$Message.error(error.message);
          });

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
              this.$Message.error(res.data.message);
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
      getWaitPlanData (selection) {
          this.waitStashData = selection ;
          // waitPlanData   代规划的数据  waitStashData   待规划的选中的数据

          this.waitPlanData.forEach((item)=>{     //已选中的数据 _checked 设为true
            this.waitStashData.forEach((item2)=>{
              if(item.id == item2.id) {
                item._checked = true;
              }
            })
          });
          let resetData = this.waitPlanData.minus(this.waitStashData);
          this.waitPlanData.forEach((item)=>{     //已选中之外的数据 _checked 设为false
            resetData.forEach((item2)=>{
              if(item.id == item2.id) {
                item._checked = false;
              }
            })
          });
      },
      addHourPlan () {
        //修改数据源中的值为输入框的值
          this.waitPlanData.forEach((item)=>{
            if(item.id == this.hourPlanId) {
                 item.classHourPlans = [];
                item.categorys.forEach((item2,index2)=>{
                    let obj ={
                      categoryId:item2.id,
                      categoryName:item2.categoryName,
                      day:document.getElementsByClassName('hourPlanContent')[index2].querySelector('.day .ivu-input-number-input').value,
                      night:document.getElementsByClassName('hourPlanContent')[index2].querySelector('.night .ivu-input-number-input').value
                    }
                    item.classHourPlans.push(obj);
                    item._checked = true;
                })
            }
        });
        this.waitStashData = this.waitPlanData.filter((item)=>{
          return item._checked;
        });
        console.log(this.waitPlanData)
        console.log(this.waitStashData)
      },
      edit(index) {
        this.teachingMaterialList[index].flag1 = true;
        this.teachingMaterialList[index].flag3 = true;
        this.$data.teachingMaterialList = Object.assign([], this.$data.teachingMaterialList);
      },
      comfirm(index,item) {
        if(item.teachingMaterialName == '') {
          this.$Message.error('请先添加讲义名称');
        }else {
          this.teachingMaterialList[index].flag1 = false;
          this.teachingMaterialList[index].flag3 = false;
          this.$data.teachingMaterialList = Object.assign([], this.$data.teachingMaterialList);
        }
      },
      yes(){
        if(this.teachingMaterialList[this.teachingMaterialList.length-1].teachingMaterialName == '') {
          this.teachingMaterialList.splice(this.teachingMaterialList.length-1,1);
        }
        this.waitPlanData.forEach((item)=>{
          if(item.id == this.currentId) {
            this.waitStashData.push(item);
            item._checked = true;
            item.teachingMaterials = this.teachingMaterialList;
          }
        });
        this.waitStashData = this.waitPlanData.filter((item)=>{
          return item._checked;
        });

        this.teachingMaterialList = [
          {
            flag1:true,
            flag2:true,
            teachingMaterialName:''
          }
        ];
        if(this.modalFlag == true) {
          this.modal4 = true;
          this.modalFlag = true;
        }
      },
      materialCancle() {
        this.teachingMaterialList = [
          {
            flag1:true,
            flag2:true,
            teachingMaterialName:''
          }
        ];
        if(this.modalFlag == true) {
          this.modal4 = true;
          this.modalFlag = true;
        }
      },
      ok () {
        let data = {};
        data.courses = Util.unique(this.waitStashData);    //去重
        data.isPass = this.passOrReject;
        data.coursePlaners = [];
        data.oldExamName = this.formNote.zhenti;
        data.branchCampusOption = this.formNote.advice;
        data.publicAttachmentList = this.uploadList.concat(this.publicAttachmentList);


        if(this.passOrReject) {       //通过
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
          }

          data.coursePlaners = [writeManObj,faceManObj]
        }else {                 // 拒绝
          data.rejectInfo = this.reason;
        }
        let flag = true;

        if(this.waitStashData.length > 0) {
          if(this.passOrReject) {
            for(let i=0;i<this.waitStashData.length;i++){
              if(this.waitStashData[i].classHourPlans.length <= 0 && this.waitStashData[i].classType == 2) {
                flag = false;
                this.$Message.error('请将课程规划后再提交');
                break;
              }else{
                flag = true;
              }
            }

            if(flag) {
              this.$http({
                method:'post',
                url:this.$store.state.app.baseUrl + 'course/course-plan',
                data:data
              })
                .then((res)=>{
                  if(res.data.code == 0) {
                    this.$Message.success('通过成功');
                    this.search1();
                    this.search2();
                    this.writeMan = '';
                    this.faceMan = '';
                    this.uploadList = data.publicAttachmentList;
                    this.publicAttachmentList.splice(0,this.publicAttachmentList.length);
                    this.waitStashData = [];
                  } else {
                    this.$Message.error(res.data.message);
                  }
                })
                .catch((error)=>{
                  console.log(error)
                  this.$Message.error(error.message);
                })
            }
          }else {
            if(!this.reason) {
              this.$Message.error('请选择驳回原因');
              return;
            }
            this.$http({
              method:'post',
              url:this.$store.state.app.baseUrl + 'course/course-plan',
              data:data
            })
              .then((res)=>{
                if(res.data.code == 0) {
                  this.$Message.success('通过成功');
                  this.search1();
                  this.search2();
                  this.reason = '';
                  this.waitStashData = [];
                } else {
                  this.$Message.error(res.data.message);
                }
              })
              .catch((error)=>{
                console.log(error)
                this.$Message.error(error.message);
              })
          }
        }else {
          this.$Message.error('请选择需要审核的课程');
        }
      } ,
      cancel () {
        this.writeMan = '';
        this.faceMan = '';
        this.reason = '';
      },
      submitSchedule (type) {
        this.scheduleModal2 = false ;
        if(this.modalFlag == true) {
          this.modal4 = true;
          this.modalFlag = true;
        }
        if(type){
          return false
        }
        let data = {
          courseCode: this.waitPlanData[this.curIndex].classCode,
          dayNum: parseInt(this.waitPlanData[this.curIndex].classHour.split('天')[0]) + (this.waitPlanData[this.curIndex].openClassTime == '上午' ? 0 : 1),
          id: this.updateId,
          courseTableLineItemVos: this.$refs.scheduleDom2.data1
        };
        console.log(data)
        // 提交课程表
        this.$http({
          method:'post',
          url:this.$store.state.app.baseUrl + 'course/createCourseTable',
          data: data,
          headers: {'Content-type': 'application/json'}
        })
          .then((res)=>{
            if(res.data.code == 0) {
              this.$Message.success('添加成功!');
            } else {
              this.$Message.error(res.data.message);
            }
          })
          .catch((error)=>{
            this.$Message.error(error.message);
          })
      },
      search1 () {
        //查询已选课程
        this.$http({
          method:'post',
          url:this.$store.state.app.baseUrl + 'course/query',
          data:{
            checkStates:[5,7],
            pageNumber:this.pageNumber1,
            pageSize:this.pageSize1,
            announcementId:this.$route.params.id
          }
        })
          .then((res)=>{
            if(res.data.code == 0) {
              this.plannedData = res.data.data.content;
              this.total1 = res.data.data.total;
            } else {
              this.$Message.error(res.data.message);
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
            checkStates:[3],
            pageNumber:this.pageNumber2,
            pageSize:this.pageSize2,
            announcementId:this.$route.params.id
          }
        })
          .then((res)=>{
            if(res.data.code == 0) {
              this.waitPlanData = res.data.data.content;
              this.waitPlanData.forEach((item,index)=>{
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
      changePage1(page){
        this.pageNumber1 = page;
        this.search1();
        this.waitStashData.splice(0,this.waitStashData.length);
      },
      changePage2(page){
        this.pageNumber2 = page;
        this.search2();
        this.waitStashData.splice(0,this.waitStashData.length);
      },
      addLine(index,item) {
        if(item.teachingMaterialName == '') {
          this.$Message.error('请先添加讲义名称');
        }else {
          this.teachingMaterialList.push(
            {
              flag1:true,
              flag2:true,
              flag3:false,
              teachingMaterialName:''
            }
          )
          this.teachingMaterialList[index].flag1 = false;
          this.teachingMaterialList[index].flag2 = false;
          this.$data.teachingMaterialList = Object.assign([], this.$data.teachingMaterialList);
        }
      },
      deleteMaterial(index) {
        this.teachingMaterialList.splice(index,1);
      },
      classOrientationOk() {
        this.scheduleModal2 = false ;
        if(this.modalFlag == true) {
          this.modal4 = true;
          this.modalFlag = true;
        }
      },
      childrenOk(){
        this.modalFlag = false;
      },
      handleSuccessExcel (res,file, fileList) {
        if(res.code == 0) {
          this.$Message.success('上传成功');
          this.scheduleData = res.data.courseTableLineItemVos ? res.data.courseTableLineItemVos : []
        }else if(res.code == 505) {
          let errorTips='';
          res.data.forEach((item)=>{
            errorTips += item + '\/n';
          })
          this.$Notice.error({
            title: '提示',
            desc: errorTips,
            render:h=>{
              let ele = [];
              return h('div',(()=>{
                res.data.forEach((item)=>{
                  ele.push(h('div',item))
                })
                return ele;
              })())
            },
            duration: 0
          });
        }else {
          this.$Message.error(res.message);
        }
      },
      uploadFile() {
        // debugger
        this.$refs.upload_file.click()
      },
     /* uploadExcel () {
        var fileObj = document.getElementById("FileUpload").files[0]; // js 获取文件对象
        if (typeof (fileObj) == "undefined" || fileObj.size <= 0) {
          alert("请选择Excel文件");
          return;
        }
        var formFile = new FormData();
        // formFile.append("action", "UploadVMKImagePath");
        formFile.append("file", fileObj); //加入文件对象

        //第一种  XMLHttpRequest 对象
        //var xhr = new XMLHttpRequest();
        //xhr.open("post", "/Admin/Ajax/VMKHandler.ashx", true);
        //xhr.onload = function () {
        //    alert("上传完成!");
        //};
        //xhr.send(formFile);

        //第二种 ajax 提交

        var data = formFile;
        this.$http({
          method:'post',
          url:this.$store.state.app.baseUrl + 'course/getCourseTableByExcel',
          data: data,
        })
          .then((res)=>{
            console.log(res)
          })
      }*/
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
    .hourPlanContent{
        text-align: center;
        padding: 10px 0 10px 0;
    }
    .ivu-table-cell {
        padding: 0!important;
        //margin-bottom: 20px;
    }
    .ivu-modal-close {
        right: 0;
        top: 0;
    }
    .pass_wrap .ivu-row {
      margin: 20px 0 20px 0;
    }
    .addIcon {
      font-size: 30px;
      vertical-align: middle;
      color: #2d8cf0;
    }
    .teachingMaterialContent {
      width: 300px;
      display: inline-block;
      height: 30px;
      line-height: 30px;
      margin-right: 50px;
    }
    .confirm {
      position: relative;
      left: -85px;
      color: #2d8cf0;
      margin: 0 3px;
      cursor: pointer;
    }
    .schedule {
      .ivu-upload {
        float: left;
        ul {
          float: left;
          width: 300px;
          text-align: left;
          margin-left: 50px;
        }
      }
      .uploadList {
        float: left;
      }
      .upload_excel {
        float: left;
      }
    }
</style>
