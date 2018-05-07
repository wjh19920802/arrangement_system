<template>
    <div id="unarrange">
        <Row>
            <Col span="24">
            <Card>
                <p slot="title">
                    <Icon type="pinpoint"></Icon>
                    查询条件
                </p>
                <Form :model="formItem1" :label-width="100">
                    <Row>
                        <Col span="6">
                        <FormItem label="班级名称" prop="classInfoName">
                            <Input v-model="formItem1.classInfoName" placeholder=""></Input>
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="学习中心" prop="studyCenterIdList">
                            <Select v-model="formItem1.studyCenterIdList">
                                <Option value=''>请选择</Option>
                                <Option v-for="item in provinces" :key="item.areaid" :value="item.areaid">{{item.name}}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="项目类型" prop="projectId">
                            <Select v-model="formItem1.projectId" @on-change="findCategory">
                                <Option value="">请选择</Option>
                                <Option value="1">公务员（国考）</Option>
                                <Option value="2">公务员（省考）</Option>
                                <Option value="4">事业单位</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="班级系列" prop="classTypeId">
                            <Select v-model="formItem1.classTypeId">
                                <Option value="">请选择</Option>
                                <Option :value="item.id" v-for="item,index in classSeriesList" :key="index">{{item.classSeriesName}}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                    </Row>
                    <Row>
                      <Col span="12">
                      <FormItem label="开课时间">
                        <DatePicker type="daterange" placeholder="" v-model="formItem1.openClassTime"></DatePicker>
                      </FormItem>
                      </Col>
                      <Col span="12">
                      <FormItem label="结课时间">
                        <DatePicker type="daterange" placeholder="" v-model="formItem1.closeClassTime"></DatePicker>
                      </FormItem>
                      </Col>
                    </Row>
                    <Row>
                        <Col span="6">
                        <FormItem label="考试类型" prop="examStyleId">
                            <Select v-model="formItem1.examStyleId">
                                <Option value="">请选择</Option>
                                <Option value="1">笔试</Option>
                                <Option value="2">面试</Option>
                                <Option value="3">笔试 + 面试</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="科目" prop="categoryId">
                          <Select v-model="formItem1.categoryId">
                            <Option value="">请选择</Option>
                            <Option v-for="item in categoryList" :key="item.id" :value="item.id">{{item.categoryName}}</Option>
                          </Select>
                        </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="6">
                        <FormItem>
                            <Button type="primary" @click="search1">查询</Button>
                        </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Card>
            <Card class="margin-top-10" style="overflow: hidden;padding-bottom: 20px;">
                <p slot="title">
                    <Icon type="pinpoint"></Icon>
                    班次列表
                </p>
              <Table border ref="selection" :columns="columns1" :data="data1" @on-selection-change="selectMany" class="unarrangeTable"></Table>
              <Button class="sumbit_many" type="primary" @click="submitMany">批量提交</Button>
              <!--<div class="sumbit_many" @click="headArrangeMany">总部直排</div>-->
              <Page :total="total1" :current="pageNumber1" :page-size="pageSize1" @on-change="changePage1" show-total style="float: right;margin-top: 20px;" ></Page>
            </Card>
            </Col>
        </Row>
      <!--标记弹窗-->
      <Modal width="40%" v-model="addTag" title="添加标记" @on-ok="submitAdd">
        <p>标记对象</p>
        <Select v-model="tagOption" style="margin-bottom: 20px;">
          <Option value="师资">师资</Option>
          <Option value="班级">班级</Option>
        </Select>
        <div>
          <p>备注</p>
          <Input v-model="signNote" type="textarea" placeholder=""></Input>
        </div>
      </Modal>
      <Modal  width="40%"
              v-model="tagModal"
              title="添加标记"
              @on-ok="submitTag"
              ok-text="保存"
      >
        <h3 class="operate" @click="addNewTag">添加新标记<Icon type="plus-circled" style="font-size: 21px;vertical-align: top;margin-left: 20px;"></Icon></h3>
        <h4 v-for="item,index in classCategorySigns" style="position: relative;margin-bottom: 10px;background: #ccc;border-radius: 10px;padding: 10px;font-size: 14px;">
          <p>
            <span style="width: 90px;display: inline-block;">{{index + 1}}、标记对象:</span><span>{{item.signType}}</span>
          </p>
          <p>
            <span style="width: 90px;text-align: center;display: inline-block">备注 :</span><span>{{item.signNote}}</span>
          </p>
          <span @click="deleteTag(index)"><Icon type="ios-close-empty" style="position: absolute;right: 2px;top: -4px;color: red;font-size: 30px;width: 20px;height: 20px;"></Icon></span>
        </h4>
      </Modal>
      <!--驳回弹窗-->
      <Modal  width="40%"
              v-model="rejectModal"
              title="驳回"
              @on-ok="submitReject"
      >
        <Select v-model="checkState">
          <Option value="2" v-show="role != '省院'">驳回省院</Option>
          <Option value="1">驳回地方</Option>
        </Select>
        <div style="margin-top: 10px;">
          <p>备注:</p>
          <Input v-model="regectReason" type="textarea" placeholder=""></Input>
        </div>
      </Modal>
      <!--合并开班弹窗-->
      <Modal width="1000px"
             v-model="isMerge"
             title="合并开班"
             @on-ok="mergeClass"
      >
        <Card class="unarrangeTable">
          <p slot="title">
            <Icon type="pinpoint"></Icon>
            查询条件
          </p>
          <Form :model="formItem2" :label-width="100">
            <Row>
              <Col span="6">
              <FormItem label="班级名称" prop="classInfoName">
                <Input v-model="formItem2.classInfoName" placeholder=""></Input>
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem label="学习中心" prop="studyCenterIdList">
                <Select v-model="formItem2.studyCenterIdList">
                  <Option value=''>请选择</Option>
                  <Option v-for="item in provinces" :key="item.areaid" :value="item.areaid">{{item.name}}</Option>
                </Select>
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem label="项目类型" prop="projectId">
                <Select v-model="formItem2.projectId" @on-change="findCategory">
                  <Option value="">请选择</Option>
                  <Option value="1">公务员（国考）</Option>
                  <Option value="2">公务员（省考）</Option>
                  <Option value="4">事业单位</Option>
                </Select>
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem label="班级系列" prop="classTypeId">
                <Select v-model="formItem2.classTypeId">
                  <Option value="">请选择</Option>
                  <Option :value="item.id" v-for="item in classSeriesList" :key="item.id">{{item.classSeriesName}}</Option>
                </Select>
              </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="12">
              <FormItem label="开课时间">
                <DatePicker type="daterange" placeholder="" v-model="formItem2.openClassTime"></DatePicker>
              </FormItem>
              </Col>
              <Col span="12">
              <FormItem label="结课时间">
                <DatePicker type="daterange" placeholder="" v-model="formItem2.closeClassTime"></DatePicker>
              </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="6">
              <FormItem label="考试类型" prop="examStyleId">
                <Select v-model="formItem2.examStyleId">
                  <Option value="">请选择</Option>
                  <Option value="1">笔试</Option>
                  <Option value="2">面试</Option>
                  <Option value="3">笔试 + 面试</Option>
                </Select>
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem label="科目" prop="categoryId">
                <Select v-model="formItem2.categoryId">
                  <Option value="">请选择</Option>
                  <Option v-for="item in categoryList" :key="item.id" :value="item.id">{{item.categoryName}}</Option>
                </Select>
              </FormItem>
              </Col>
            </Row>
            <Row>
              <!--<Col span="6">
              <FormItem label="排序">
                  <Select v-model="formItem.orderByCategory">
                      <Option value="科目时间由近及远">科目时间由近及远</Option>
                  </Select>
              </FormItem>
              </Col>-->
              <Col span="6">
              <FormItem>
                <Button type="primary" @click="search2">查询</Button>
                <!--<Button type="ghost" style="margin-left: 8px">重置</Button>-->
              </FormItem>
              </Col>
            </Row>
          </Form>
          <Table border ref="selection" :columns="columns2" :data="data2" @on-selection-change="selectMany2"></Table>
          <Page :total="total2" :current="pageNumber2" :page-size="pageSize2" @on-change="changePage2" show-total style="margin-top: 20px;"></Page>
        </Card>
      </Modal>
    </div>
</template>

<script>
  import Util from '../../libs/util'
  export default {
    data () {
      return {
        role:localStorage.getItem('role'),
        formItem1: {
          classInfoName: '',
          studyCenterIdList: '',
          projectId: '',
          classTypeId: '',
          examStyleId: '',
          categoryId: '',
          openClassTime: [],
          closeClassTime: [],
          // orderByCategory: ''
        },
        formItem2: {
          classInfoName: '',
          studyCenterIdList: '',
          projectId: '',
          classTypeId: '',
          examStyleId: '',
          categoryId: '',
          openClassTime: [],
          closeClassTime: [],
          // orderByCategory: ''
        },
        currentInfo1:{},
        currentInfo2:{},
        columns1: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '班级名称',
            align: 'center',
            key: 'classInfoName',
            render:(h,params)=>{
              return h('div',{class:'item2'},params.row.classInfoName?params.row.classInfoName:'')
            }
          },
          {
            title: '班级系列',
            align: 'center',
            key: 'classSeriesName',
            render:(h,params)=>{
              return h('div',{class:'item2'},params.row.classSeriesName?params.row.classSeriesName:'')
            }
          },
          {
            title: '申请科目',
            align: 'center',
            key: 'applyCategoryName',
            render:(h,params)=>{
              return h('div',{class:'item2'},params.row.categoryName?params.row.categoryName:'');
            }
          },
          {
            title: '上课时间',
            align: 'center',
            key: 'studyTimeSet',
            render: (h, params) => {
              if(params.row.studyTimeSet ===null) {
                return '--'
              }else if(params.row.studyTimeSet.length > 0) {
                return h('div',{class:'studyTime'},(() => {
                  let studyTimeSet = params.row.studyTimeSet;
                  let ele = [];
                  for (let i = 0; i < studyTimeSet.length; i++) {
                    ele.push(h('div',{class:'item',style:{height:100/params.row.studyTimeSet.length+'%'}}, this.formateDate(studyTimeSet[i])))
                  }
                  return ele
                })())
              }else {
                return h('div',{class:'item2'},'--')
              }
            },
          },
          {
            title: '已排科目',
            align: 'center',
            key: 'categoryName',
            render:(h,params)=>{
              if(params.row.categoryTeacherDos.length > 0) {
                return h('div',{class:'category'},(() => {
                  let categoryTeacherDos = params.row.categoryTeacherDos;
                  let ele = [];
                  for (let i = 0; i < categoryTeacherDos.length; i++) {
                    ele.push(h('div',{class:'item',style:{height:100/params.row.categoryTeacherDos.length+'%'}}, categoryTeacherDos[i].categoryName?categoryTeacherDos[i].categoryName:''))
                  }
                  return ele
                })())
              }else {
               return h('div',{class:'item2'},'--')
              }
            }
          },
          {
            title: '已排时间',
            align: 'center',
            key: 'day',
            render:(h,params)=>{
              if(params.row.studyTimeSet ===null) {
                return '--'
              }else if(params.row.categoryTeacherDos.length > 0) {
              return h('div',{class:'day'},(() => {
                let categoryTeacherDos = params.row.categoryTeacherDos;
                let ele = [];
                for (let i = 0; i < categoryTeacherDos.length; i++) {
                  ele.push(h('div',{class:'item',style:{height:100/params.row.categoryTeacherDos.length+'%'}}, this.formateDate(categoryTeacherDos[i].day) + ' ' + this.numberToTime(categoryTeacherDos[i].beginTime) + '-' + this.numberToTime(categoryTeacherDos[i].endTime)))
                }
                return ele
              })())
              }else {
                return h('div',{class:'item2'},'--')
              }
            }
          },
          {
            title: '已排师资',
            align: 'center',
            key: 'name',
            render:(h,params)=>{
              if(params.row.categoryTeacherDos.length > 0) {
              return h('div',{class:'teacher'},(() => {
                let categoryTeacherDos = params.row.categoryTeacherDos;
                let ele = [];
                for (let i = 0; i < categoryTeacherDos.length; i++) {
                  ele.push(h('div',{class:'item',style:{height:100/params.row.categoryTeacherDos.length+'%'}}, categoryTeacherDos[i].teacher?categoryTeacherDos[i].teacher.name:''))
                }
                return ele
              })())
              }else {
                return h('div',{class:'item2'},'--')
              }
            }
          },
          {
            title: '级别',
            align: 'center',
            key: 'level',
            render:(h,params)=>{
              if(params.row.categoryTeacherDos.length > 0) {
              return h('div',{class:'level'},(() => {
                let categoryTeacherDos = params.row.categoryTeacherDos;
                let ele = [];
                for (let i = 0; i < categoryTeacherDos.length; i++) {
                  ele.push(h('div',{class:'item',style:{height:100/params.row.categoryTeacherDos.length+'%'}}, categoryTeacherDos[i].teacher?categoryTeacherDos[i].teacher.level:''))
                }
                return ele
              })())
              }else {
                return h('div',{class:'item2'},'--')
              }
            }
          },
          {
            title: '性别',
            align: 'center',
            key: 'gender',
            render:(h,params)=>{
              if(params.row.categoryTeacherDos.length > 0) {
              return h('div',{class:'gender'},(() => {
                let categoryTeacherDos = params.row.categoryTeacherDos;
                let ele = [];
                for (let i = 0; i < categoryTeacherDos.length; i++) {
                  ele.push(h('div',{class:'item',style:{height:100/params.row.categoryTeacherDos.length+'%'}}, categoryTeacherDos[i].teacher?categoryTeacherDos[i].teacher.gender:''))
                }
                return ele
              })())
              }else {
                return h('div',{class:'item2'},'--')
              }
            }
          },
          {
            title: '师资联系方式',
            align: 'center',
            key: 'mobile',
            render:(h,params)=>{
              if(params.row.categoryTeacherDos.length > 0) {
              return h('div',{class:'mobile'},(() => {
                let categoryTeacherDos = params.row.categoryTeacherDos;
                let ele = [];
                for (let i = 0; i < categoryTeacherDos.length; i++) {
                  ele.push(h('div',{class:'item',style:{height:100/params.row.categoryTeacherDos.length+'%'}}, categoryTeacherDos[i].teacher?categoryTeacherDos[i].teacher.mobile:''))
                }
                return ele
              })())
              }else {
                return h('div',{class:'item2'},'--')
              }
            }
          },
          {
            title: '课程是否通知',
            align: 'center',
            key: 'ifNotice',
            render:(h,params)=>{
              if(params.row.categoryTeacherDos.length > 0) {
              return h('div',{class:'ifNotice'},(() => {
                let categoryTeacherDos = params.row.categoryTeacherDos;
                let ele = [];
                for (let i = 0; i < categoryTeacherDos.length; i++) {
                  ele.push(
                    h('div',
                      {
                        class:categoryTeacherDos[i].ifNotice == '已通知'?'aaa item':'bbb item',
                        style:{height:100/params.row.categoryTeacherDos.length+'%'}
                      },
                      categoryTeacherDos[i].ifNotice == '已通知'?categoryTeacherDos[i].ifNotice:'未通知'))
                }
                return ele
              })())
              }else {
                return h('div',{class:'item2'},'--')
              }
            }
          },
          {
            title: '课程是否确认',
            align: 'center',
            key: 'ifNotice',
            render:(h,params)=>{
              if(params.row.categoryTeacherDos.length > 0) {
                return h('div',{class:'ifNotice'},(() => {
                  let categoryTeacherDos = params.row.categoryTeacherDos;
                  let ele = [];
                  for (let i = 0; i < categoryTeacherDos.length; i++) {
                    ele.push(
                      h('div',
                        {
                          class:categoryTeacherDos[i].state == '确认'?'aaa item':'bbb item',
                          style:{height:100/params.row.categoryTeacherDos.length+'%'}
                        },
                        categoryTeacherDos[i].state /* == '已确认'?categoryTeacherDos[i].state:'待确认'*/))
                  }
                  return ele
                })())
              }else {
                return h('div',{class:'item2'},'--')
              }
            }
          },
          {
            title: 'ERP人数',
            align: 'center',
            key: 'erp',
            render:(h,params)=>{
              return h('div',{class:'item2'},params.row.erpNum.allNum);
            }
          },
          {
            title:'上课酒店',
            align:'center',
            key:'teachPlace',
            render:(h,params)=>{
              return h('div',{class:'item2'},params.row.teachPlace?params.row.teachPlace:'--');
            }
          },
          {
            title:'预估师资人数',
            align:'center',
            key:'totalTeacher',
            render:(h,params)=>{
              return h('div',{class:'item2'},params.row.totalTeacher?params.row.totalTeacher:'--');
            }
          },
          {
            title:'备注',
            align:'center',
            key:'beiz',
            render:(h,params)=>{
              return h('div',{class:'item2'},params.row.beiz?params.row.beiz:'--');
            }
          },
          {
            title: '操作',
            key: 'action',
            width:'150',
            align: 'center',
            render: (h, params) => {
              return h('div', {class:'wrap'},[
                h('Button', {
                  props: {
                    type: 'success',
                    size: 'small',
                    show:this.isShow
                  },
                  style: {
                    marginRight: '5px',
                    marginBottom: '5px'
                  },
                  on: {
                    click: () => {
                      this.arrangement(params.row.categoryId,params.row.classInfoId,0)
                    }
                  }
                }, '排课'),
                h('Button', {
                  props: {
                    type: 'success',
                    size: 'small',
                    show:this.isShow
                  },
                  style: {
                    marginRight: '5px',
                    marginBottom: '5px'
                  },
                  on: {
                    click: () => {
                      this.headArrange(params.row.classInfoCategoryLinkId)
                    }
                  }
                }, '总部直排'),
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                    show:this.isShow
                  },
                  style: {
                    marginRight: '5px',
                    marginBottom: '5px'
                  },
                  on: {
                    click: () => {
                      this.submit(params.row.classInfoCategoryLinkId)
                    }
                  }
                }, '提交'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small',
                    show:this.isShow
                  },
                  style: {
                    marginRight: '5px',
                    marginBottom: '5px'
                  },
                  on: {
                    click: () => {
                      this.reject(params.row.categoryId,params.row.classInfoId)
                    }
                  }
                }, '驳回'),
                h('span',{
                  on:{
                    mouseover: () => {

                    }
                  }
                },[
                  h('Poptip', {
                    props:{
                      trigger:'hover',
                      content:'',
                      on:{
                        click:()=>{
                          alert(111)
                        }
                      }
                    },
                  }, [
                    h('Button',{
                      props: {
                        type: 'info',
                        size: 'small',
                        show:this.isShow
                      },
                      style: {
                        marginRight: '5px',
                        marginBottom: '5px'
                      },
                      on:{
                        click: () => {
                          this.tag(params.row.classInfoCategoryLinkId)
                        }
                      }
                    },'添加标记')
                  ])
                ])
                ,
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                    show:this.isShow
                  },
                  style: {
                    marginRight: '5px',
                    marginBottom: '5px'
                  },
                  on: {
                    click: () => {
                      this.merge(params.row.categoryId,params.row.classInfoId,params.row.classInfoCategoryLinkId)
                    }
                  }
                }, '合并开班')
              ]);
            }
          }
        ],
        columns2: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '班级名称',
            align: 'center',
            key: 'classInfoName',
            render:(h,params)=>{
              return h('div',{class:'item2'},params.row.classInfoName?params.row.classInfoName:'')
            }
          },
          {
            title: '班级系列',
            align: 'center',
            key: 'classSeriesName',
            render:(h,params)=>{
              return h('div',{class:'item2'},params.row.classSeriesName?params.row.classSeriesName:'')
            }
          },
          {
            title: '申请科目',
            align: 'center',
            key: 'applyCategoryName',
            render:(h,params)=>{
              return h('div',{class:'item2'},params.row.categoryName?params.row.categoryName:'');
            }
          },
          {
            title: '上课时间',
            align: 'center',
            key: 'studyTimeSet',
            render: (h, params) => {
              if(params.row.studyTimeSet ===null) {
                return '--'
              }else if(params.row.studyTimeSet.length > 0) {
                return h('div',{class:'studyTime'},(() => {
                  let studyTimeSet = params.row.studyTimeSet;
                  let ele = [];
                  for (let i = 0; i < studyTimeSet.length; i++) {
                    ele.push(h('div',{class:'item',style:{height:100/params.row.studyTimeSet.length+'%'}}, this.formateDate(studyTimeSet[i])))
                  }
                  return ele
                })())
              }else {
                return h('div',{class:'item2'},'--')
              }
            },
          },
          {
            title: '已排科目',
            align: 'center',
            key: 'categoryName',
            render:(h,params)=>{
              if(params.row.categoryTeacherDos.length > 0) {
                return h('div',{class:'category'},(() => {
                  let categoryTeacherDos = params.row.categoryTeacherDos;
                  let ele = [];
                  for (let i = 0; i < categoryTeacherDos.length; i++) {
                    ele.push(h('div',{class:'item',style:{height:100/params.row.categoryTeacherDos.length+'%'}}, categoryTeacherDos[i].categoryName))
                  }
                  return ele
                })())
              }else {
                return h('div',{class:'item2'},'--')
              }
            }
          },
          {
            title: '已排时间',
            align: 'center',
            key: 'day',
            render:(h,params)=>{
              if(params.row.studyTimeSet ===null) {
                return '--'
              }else if(params.row.categoryTeacherDos.length > 0) {
                return h('div',{class:'day'},(() => {
                  let categoryTeacherDos = params.row.categoryTeacherDos;
                  let ele = [];
                  for (let i = 0; i < categoryTeacherDos.length; i++) {
                    ele.push(h('div',{class:'item',style:{height:100/params.row.categoryTeacherDos.length+'%'}}, this.formateDate(categoryTeacherDos[i].day) + ' ' + this.numberToTime(categoryTeacherDos[i].beginTime) + '-' + this.numberToTime(categoryTeacherDos[i].endTime)))
                  }
                  return ele
                })())
              }else {
                return h('div',{class:'item2'},'--')
              }
            }
          },
          {
            title: '已排师资',
            align: 'center',
            key: 'name',
            render:(h,params)=>{
              if(params.row.categoryTeacherDos.length > 0) {
                return h('div',{class:'teacher'},(() => {
                  let categoryTeacherDos = params.row.categoryTeacherDos;
                  let ele = [];
                  for (let i = 0; i < categoryTeacherDos.length; i++) {
                    ele.push(h('div',{class:'item',style:{height:100/params.row.categoryTeacherDos.length+'%'}}, categoryTeacherDos[i].teacher.name))
                  }
                  return ele
                })())
              }else {
                return h('div',{class:'item2'},'--')
              }
            }
          },
          {
            title: '级别',
            align: 'center',
            key: 'level',
            render:(h,params)=>{
              if(params.row.categoryTeacherDos.length > 0) {
              return h('div',{class:'level'},(() => {
                let categoryTeacherDos = params.row.categoryTeacherDos;
                let ele = [];
                for (let i = 0; i < categoryTeacherDos.length; i++) {
                  ele.push(h('div',{class:'item',style:{height:100/params.row.categoryTeacherDos.length+'%'}}, categoryTeacherDos[i].teacher.level))
                }
                return ele
              })())
              }else {
                return h('div',{class:'item2'},'--')
              }
            }
          },
          {
            title: '性别',
            align: 'center',
            key: 'gender',
            render:(h,params)=>{
              if(params.row.categoryTeacherDos.length > 0) {
              return h('div',{class:'gender'},(() => {
                let categoryTeacherDos = params.row.categoryTeacherDos;
                let ele = [];
                for (let i = 0; i < categoryTeacherDos.length; i++) {
                  ele.push(h('div',{class:'item',style:{height:100/params.row.categoryTeacherDos.length+'%'}}, categoryTeacherDos[i].teacher.gender))
                }
                return ele
              })())
              }else {
                return h('div',{class:'item2'},'--')
              }
            }
          },
          {
            title: '师资联系方式',
            align: 'center',
            key: 'mobile',
            render:(h,params)=>{
              if(params.row.categoryTeacherDos.length > 0) {
              return h('div',{class:'mobile'},(() => {
                let categoryTeacherDos = params.row.categoryTeacherDos;
                let ele = [];
                for (let i = 0; i < categoryTeacherDos.length; i++) {
                  ele.push(h('div',{class:'item',style:{height:100/params.row.categoryTeacherDos.length+'%'}}, categoryTeacherDos[i].teacher.mobile))
                }
                return ele
              })())
              }else {
                return h('div',{class:'item2'},'--')
              }
            }
          },
          {
            title: '课程是否通知',
            align: 'center',
            key: 'ifNotice',
            render:(h,params)=>{
              if(params.row.categoryTeacherDos.length > 0) {
              return h('div',{class:'ifNotice'},(() => {
                let categoryTeacherDos = params.row.categoryTeacherDos;
                let ele = [];
                for (let i = 0; i < categoryTeacherDos.length; i++) {
                  ele.push(h('div',{class:categoryTeacherDos[i].ifNotice == '已通知'?'aaa item':'bbb item',style:{height:100/params.row.categoryTeacherDos.length+'%'}}, categoryTeacherDos[i].ifNotice == '已通知'?categoryTeacherDos[i].ifNotice:'未通知'))
                }
                return ele
              })())
              }else {
                return h('div',{class:'item2'},'--')
              }
            }
          },
          {
            title: 'ERP人数',
            align: 'center',
            key: 'erp',
            render:(h,params)=>{
              return h('div',{class:'item2'},params.row.erpNum.allNum);
            }
          },
          {
            title:'上课酒店',
            align:'center',
            key:'teachPlace',
            render:(h,params)=>{
              return h('div',{class:'item2'},params.row.teachPlace?params.row.teachPlace:'--');
            }
          },
          {
            title:'预估师资人数',
            align:'center',
            key:'totalTeacher',
            render:(h,params)=>{
              return h('div',{class:'item2'},params.row.totalTeacher?params.row.totalTeacher:'--');
            }
          },
          {
            title:'备注',
            align:'center',
            key:'beiz',
            render:(h,params)=>{
              return h('div',{class:'item2'},params.row.beiz?params.row.beiz:'--');
            }
          }
        ],
        data1:[],   //主班次
        data2:[],   //副班次
        // 地区数据
        provinces: [],
        // 班级系列数据
        classSeriesList: [],
        rejectModal:false,
        isMerge:false,
        currentCategoryId:-1,
        currentClassInfoId:-1,
        total1:0,
        pageNumber1:1,
        pageSize1:20,
        total2:0,
        pageNumber2:1,
        pageSize2:20,
        checkState:'',
        regectReason:'',
        mainId:-1,
        ids:[],   //子班次classInfoCategoryLinkId列表
        tagModal:false,
        addTag:false,
        tagOption:'',
        signNote:'', //添加标记备注
        classCategorySigns:[] ,   //标记列表
        currentClassInfoCategoryLinkId:-1,
        categoryList:[],
        classInfoCategoryLinkIdList:[],   //批量提交classInfoCategoryLinkIdList 列表
        majorClassId:''
      }
    },
    computed:{
      searchData1(){
        let form = this.formItem1;
        return {
          classInfoName: form.classInfoName==''?null:form.classInfoName,
          studyCenterIdList: form.studyCenterIdList==''?[null]:[form.studyCenterIdList],
          projectId: form.projectId==''?null:form.projectId,
          classSeriesId: form.classTypeId==''?null:form.classTypeId,
          examStyleId: form.examStyleId==''?null:form.examStyleId,
          categoryId: form.categoryId==''?null:form.categoryId,
          openClassTime: form.openClassTime[0]?[form.openClassTime[0].getTime(),form.openClassTime[1].getTime()]:[],
          closeClassTime: form.closeClassTime[0]?[form.closeClassTime[0].getTime(),form.closeClassTime[1].getTime()]:[],
          pageSize:this.pageSize1,
          pageNumber:this.pageNumber1
        }
      },
      searchData2(){
        let form = this.formItem2;
        return {
          classInfoName: form.classInfoName==''?null:form.classInfoName,
          studyCenterIdList: form.studyCenterIdList==''?[null]:[form.studyCenterIdList],
          projectId: form.projectId==''?null:form.projectId,
          classSeriesId: form.classTypeId==''?null:form.classTypeId,
          examStyleId: form.examStyleId==''?null:form.examStyleId,
          categoryId: form.categoryId==''?null:form.categoryId,
          openClassTime: form.openClassTime[0]?[form.openClassTime[0].getTime(),form.openClassTime[1].getTime()]:[],
          closeClassTime: form.closeClassTime[0]?[form.closeClassTime[0].getTime(),form.closeClassTime[1].getTime()]:[],
          pageSize:this.pageSize2,
          pageNumber:this.pageNumber2,
          majorClassId:this.majorClassId
        }
      },
    },
    methods: {
      arrangement (categoryId,classInfoId,edit) {
        this.$router.push({name:'arrange_lesson',query:{categoryId:categoryId,classInfoId:classInfoId,edit:edit}})
      },
      //驳回
      reject (categoryId,classInfoId) {
        this.currentCategoryId = categoryId;
        this.currentClassInfoId = classInfoId;
        this.rejectModal = true;
      },
      submitReject() {
        let rejectBean = {
          regectType:this.checkState,
          regectReason:this.regectReason
        };
        this.$http({
          method:'post',
          url:this.$store.state.app.baseUrl + 'schedule/classInfo/' +  this.currentClassInfoId + '/category/' + this.currentCategoryId + '/check',
          data:rejectBean
        })
          .then((res)=>{
            if(res.data.code == 0) {
              this.$Message.success('驳回成功');
              this.search1()
            }else {
              this.$Message.error(res.data.message);
            }
          })
          .catch((error)=>{
            this.$Message.error(error.message);
          })
      },
      search1() {
        this.$http({
          method:'post',
          url:this.$store.state.app.baseUrl + 'schedule/scheduledList',
          data:this.searchData1
        })
          .then((res)=>{
            if(res.data.code == 0) {
                this.data1 = res.data.data?res.data.data.content:[];
                this.total1 = res.data.data?res.data.data.total:0;


                if(!res.data.data) {
                  this.$Message.error('暂无数据');
                }
              }else {
              this.$Message.error(res.data.message);
            }
          })
          .catch((error)=>{
            console.log(error)
            this.$Message.error(error.message);
          })
      },
      search2(classInfoCategoryLinkId) {
        this.$http({
          method:'post',
          url:this.$store.state.app.baseUrl + 'schedule/scheduledList',
          data:this.searchData2
        })
          .then((res)=>{
            if(res.data.code == 0) {
              this.data2 = res.data.data?res.data.data.content:[];
              this.total2 = res.data.data?res.data.data.total:0;
              if(!res.data.data) {
                this.$Message.error('暂无数据');
              }
            }else {
              this.$Message.error(res.data.message);
            }
          })
          .catch((error)=>{
            console.log(error)
            this.$Message.error(error.message);
          })
      },
      changePage1(page) {
        this.pageNumber1 = page;
        this.search1();
      },
      changePage2(page) {
        this.pageNumber2 = page;
        this.search2();
      },
      selectMany(selection){
        this.classInfoCategoryLinkIdList = []
        if(selection.length>0) {
          selection.forEach((item)=>{
            this.classInfoCategoryLinkIdList.push(item.classInfoCategoryLinkId);
          })
        }else {
          this.$Message.error('请选择班次')
        }
      },
      //批量提交
      submitMany(){
        this.$Modal.confirm({
          title: '',
          content: '<p>确定提交吗？</p>',
          onOk: () => {
            this.$http({
              method:'post',
              url:this.$store.state.app.baseUrl + 'schedule/scheduledList/submit',
              data:this.classInfoCategoryLinkIdList
            })
              .then((res)=>{
                if(res.data.code == 0) {
                  this.$Message.success('提交成功');
                  this.search1();
                }else{
                  this.$Message.error(res.data.message);
                }
              })
              .catch((error)=>{
                this.$Message.error(error.message);
              })
          }
        });
      },
      //单个提交
      submit(classInfoCategoryLinkId) {
        this.$Modal.confirm({
          title: '',
          content: '<p>确定提交吗？</p>',
          onOk: () => {
            this.$http({
              method:'post',
              url:this.$store.state.app.baseUrl + 'schedule/scheduledList/submit',
              data:[classInfoCategoryLinkId]
            })
              .then((res)=>{
                if(res.data.code == 0) {
                  this.$Message.success('提交成功');
                  this.search1();
                }else {
                  this.$Message.error(res.data.message);
                }
              })
              .catch((error)=>{
                this.$Message.error(error.message);
              })
          }
        });
      },
      //添加标记
      tag (classInfoCategoryLinkId) {
        this.currentClassInfoCategoryLinkId = classInfoCategoryLinkId;
        this.$http({
          method:'get',
          url:this.$store.state.app.baseUrl + 'schedule/classInfo/category/sign/' + this.currentClassInfoCategoryLinkId,
        })
          .then((res)=>{
            if(res.data.code == 0) {
              this.classCategorySigns = res.data.data;
            }
          })
          .catch((error)=>{
            this.$Message.error(error.message)
          })
        this.tagModal = true;
      },
      addNewTag() {
        this.addTag = true;
        this.tagModal = false;
      },
      deleteTag(index){
        this.classCategorySigns.splice(index,1)
      },
      submitAdd() {
        this.tagModal = true;
        let data = {
          signType:this.tagOption,
          signNote:this.signNote
        };
        this.classCategorySigns.push(data);
      },
      submitTag() {
        this.$http({
          method:'post',
          url:this.$store.state.app.baseUrl + 'schedule/classInfo/category/sign/' + this.currentClassInfoCategoryLinkId,
          // url:'http://192.168.0.17:60000/v1/schedule/classInfo/category/sign/' + this.currentClassInfoCategoryLinkId,
          data:this.classCategorySigns
        })
          .then((res)=>{
            if(res.data.code == 0) {
              this.$Message.success('保存成功');
            }else {
              this.$Message.error(res.data.message);
            }
          })
          .catch((error)=>{
            console.log(error)
            this.$Message.error(error.message);
          })
      },
      // 合并开班
      merge (categoryId,classInfoId,classInfoCategoryLinkId) {
        this.search2();
        this.currentCategoryId = categoryId;
        this.currentClassInfoId = classInfoId;
        this.isMerge = true;
        this.majorClassId = classInfoCategoryLinkId;
      },
      mergeClass() {
        // 没选中课程的时候直接关闭
        if(this.ids.length == 0){
          return
        }
        this.$http({
          method:'post',
          url:this.$store.state.app.baseUrl + 'schedule/composeClassInfoAndCategory/' + this.majorClassId,
          data:this.ids
        })
          .then((res)=>{
            if(res.data.code == 0) {
              this.$Message.success('合并成功');
              this.ids.splice(0)
              this.search1()
            }else {
              this.$Message.error(res.data.message);
            }
          })
          .catch((error)=>{
            console.log(error)
            this.$Message.error(error.message);
          })
      },
      selectMany2(selection){
        if(selection.length>0) {
          selection.forEach((item)=>{
            this.ids.push(item.classInfoCategoryLinkId);
          })
        }else {
          this.$Message.error('请选择班次')
        }
      },
      //总部直排
      headArrange(classInfoCategoryLinkId) {
        this.$Modal.confirm({
          title: '',
          content: '<p>确定总部直排吗？</p>',
          onOk: () => {
            this.$http({
              method:'post',
              url:this.$store.state.app.baseUrl + 'schedule/scheduledList/submitToHead',
              data:[classInfoCategoryLinkId]
            })
              .then((res)=>{
                if(res.data.code == 0) {
                  this.$Message.success('提交成功');
                }else {
                  this.$Message.error(res.data.message);
                }
              })
              .catch((error)=>{
                this.$Message.error(error.message);
              })
          }
        });
      },
      //批量总部直排
      headArrangeMany() {
        this.$http({
          method:'post',
          url:this.$store.state.app.baseUrl + 'schedule/scheduledList/submitToHead',
          data:this.classInfoCategoryLinkIdList
        })
          .then((res)=>{
            if(res.data.code == 0) {
              this.$Message.success('提交成功');
            }else {
              this.$Message.error(res.data.message);
            }
          })
          .catch((error)=>{
            this.$Message.error(error.message);
          })
      },
      findCategory(){
        this.$http({
          method:'get',
          url:this.$store.state.app.baseUrl + 'category/findByProject',
          params:{
            projectId:this.formItem1.projectId
          }
        })
          .then((res)=>{
            if(res.data.code == 0) {
              this.categoryList = res.data.data;
            }else {
              this.$Message.error(res.data.message);
            }
          })
          .catch((error)=>{
            console.log(error)
            this.$Message.error(error.message);
          })
      },
      formateDate(timeStamp) {
        if (timeStamp == '' || timeStamp == undefined) {
          return '--'
        } else {
          let date = new Date(timeStamp);
          let Y = date.getFullYear() + '-';
          let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
          let D = (date.getDate()< 10 ? '0' + (date.getDate()) : date.getDate())

          return Y + M + D;
        }
      },
      numberToTime:function(number){
        if (number !== '' && number !== null) {
          let h = parseInt(number/100);
          let m = number%100;
          if(h == 0) {
            if (m < 10) {
              return '00' + ':0' + m;
            } else {
              return '00' + ':' + m;
            }
          }else if (h>0 && h < 10) {
            if (m < 10) {
              return '0' + h + ':0' + m;
            } else {
              return '0' + h + ':' + m;
            }
          } else {
            if (m < 10) {
              return h + ':0' + m;
            } else {
              return h + ':' + m;
            }
          }
        }
      },
      getAllClassSeries () {
        this.$http(this.$store.state.app.baseUrl + 'classSeries/findAllClassSeries')
          .then((res)=>{
          if(res.data.code == 0 ){
            this.classSeriesList = res.data.data;
          }else {
            this.$Message.error(res.data.message);
          }
          })
          .catch((error)=>{
            this.$Message.error(error.message);
          });
      }
    },
    mounted(){
      this.$http(this.$store.state.app.baseUrl + 'area/getUserVisualProvince')
        .then((res)=>{
          if(res.data.code == 0 ){
            this.provinces = res.data.data;
          }else {
            this.$Message.error(res.data.message);
          }
        }).catch((error)=>{
        this.$Message.error(error.message);
      });
      this.getAllClassSeries()
      this.search1();
    },
    filters: {
      formateDate: function (timeStamp) {
        if (timeStamp == '' || timeStamp == undefined) {
          return '--'
        } else {
          let date = new Date(timeStamp);
          let Y = date.getFullYear() + '-';
          let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
          let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate())

          return Y + M + D;
        }
      },
      numberToTime:function(number){
        if (number !== '' && number !== null) {
          let h = parseInt(number/100);
          let m = number%100;
          if(h == 0) {
            if (m < 10) {
              return '00' + ':0' + m;
            } else {
              return '00' + ':' + m;
            }
          }else if (h>0 && h < 10) {
            if (m < 10) {
              return '0' + h + ':0' + m;
            } else {
              return '0' + h + ':' + m;
            }
          } else {
            if (m < 10) {
              return h + ':0' + m;
            } else {
              return h + ':' + m;
            }
          }
        }
      },
    },
    watch:{
      data1(){

      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
    #unarrange {
        #unarrange_table,#merge_table {
            border: 1px solid #e9eaec;
            th{
                border: 1px solid #e9eaec;
                min-height: 55px;
                background-color: #f8f8f9;
                padding: 10px 5px;
            }
            td {
                border: 1px solid #e9eaec;
                max-width: 150px;
                min-height: 45px;
                font-size: 12px;
                word-break: break-all;
                overflow: hidden;
                .ivu-select-selection{
                    border: transparent!important;
                }
            }
        }
        .jiaban {
            height: 100%;
            overflow: hidden;
            border-bottom: 1px solid green;
            border-bottom: 1px solid rgb(233, 234, 236);
            display: flex;
            justify-content: space-around;
            .jiaban_content {
                align-self: center;
            }
        }
        .aaa{
            color:#10b321;
        }
        .bbb{
            color:#f3052b;
        }
        .operate{
            color: #2d8cf0;
            margin: 0 3px;
            cursor: pointer;
            margin-bottom: 10px;
        }
        .sumbit_many {
            float: left;
            font-size: 12px;
            margin-top: 23px;
            margin-right: 10px;

        }
        .day{
            margin-left: 0;
            margin-right: 0;
        }
        .ivu-poptip-popper {
          z-index: 9999;
        }
    }
    .unarrangeTable .ivu-table-cell {
      height: 100%;
      display: flex;
      justify-content: space-around;
      /*position:relative;*/
      .ivu-checkbox-wrapper {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-around;
      }
      .wrap {
        align-self: center;
      }
      .studyTime ,.category,.day,.teacher,.level,.gender,.mobile,.ifNotice{
        width: 100%;
        height: 100%;
        .item:last-of-type {
          border-bottom: none;
        }
      }
      .item {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-around;
        border-bottom: 1px solid #e9eaec;
      }
      .item2 {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-around;
      }
    }
</style>
