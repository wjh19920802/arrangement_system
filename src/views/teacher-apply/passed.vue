<template>
    <div id="passed">
        <Row>
            <Col span="24">
            <Card>
                <p slot="title">
                    <Icon type="pinpoint"></Icon>
                    查询条件
                </p>
                <Form :model="formItem" :label-width="100">
                    <Row>
                        <Col span="6">
                        <FormItem label="班级名称" prop="classInfoName">
                            <Input v-model="formItem.classInfoName" placeholder=""></Input>
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="省份" prop="province">
                            <Select v-model="formItem.province">
                                <Option value="">请选择</Option>
                                <Option v-for="item in provinces" :key="item.areaid" :value="item.areaid">{{item.name}}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="审批状态" prop="checkState">
                            <Select v-model="formItem.checkState">
                                <Option value="">请选择</Option>
                                <Option value="1">省院待排</Option>
                                <Option value="2">总部待排</Option>
                                <Option value="3">省院审批通过</Option>
                                <Option value="4">总部审批通过</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="项目类型" prop="projectId">
                            <Select v-model="formItem.projectId" @on-change="findCategory">
                                <Option value="">请选择</Option>
                                <Option value="1">公务员（国考）</Option>
                                <Option value="2">公务员（省考）</Option>
                                <Option value="4">事业单位</Option>
                            </Select>
                        </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="6">
                        <FormItem label="考试类型" prop="examStyleId">
                            <Select v-model="formItem.examStyleId">
                                <Option value="">请选择</Option>
                                <Option value="1">笔试</Option>
                                <Option value="2">面试</Option>
                                <Option value="3">笔试 + 面试</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="科目" prop="categoryId">
                            <Select v-model="formItem.categoryId">
                                <Option value="">请选择</Option>
                                <Option v-for="item in categoryList" :key="item.id" :value="item.id">{{item.categoryName}}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="12">
                        <FormItem label="开课时间">
                            <DatePicker type="daterange" placeholder="" v-model="formItem.openClassTime"></DatePicker>
                        </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="6">
                        <FormItem>
                            <Button type="primary" @click="search">查询</Button>
                            <!--<Button type="ghost" style="margin-left: 8px">重置</Button>-->
                        </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Card>
            <Card class="margin-top-10">
                <p slot="title">
                    <Icon type="pinpoint"></Icon>
                    课程列表
                </p>
                <Table border ref="selection" :columns="columns" :data="data1"></Table>
                <div style="margin: 10px;overflow: hidden">
                    <div style="float: right;">
                      <Page :total="total1" :current="pageNumber1" :page-size="pageSize1" @on-change="changePage" show-total ></Page>
                    </div>
                </div>
            </Card>
            </Col>
        </Row>
        <Modal class="reject_modal"
               v-model="modal2"
               width="50%"
               title="申请调整"
               @on-ok="pushReject">
            <Form :rules="ruleValidate2" :label-width="80">
                <FormItem label="调整位置" prop="stage">
                    <Select v-model="modal2Item.stage">
                        <Option value="0">驳回省院</Option>
                        <Option value="1">驳回总部</Option>
                        <Option value="2">呃。。</Option>
                    </Select>
                </FormItem>
                <FormItem label="备注" prop="note">
                    <Input v-model="formItem.note" type="textarea" placeholder=""></Input>
                </FormItem>
            </Form>
        </Modal>
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
        <h3 class="operate" style="color: #2d8cf0;
                                   margin: 0 3px;
                                   cursor: pointer;
                                   margin-bottom: 10px;"  @click="addNewTag">添加新标记<Icon type="plus-circled" style="font-size: 21px;vertical-align: top;margin-left: 20px;"></Icon></h3>
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
    </div>
</template>

<script>
  import Util from '../../libs/util'
  export default {
    data () {
      return {
        formItem: {
          classInfoName: '',
          province: '',
          checkState: '',
          projectId:'',
          examStyleId:'',
          categoryId:'',
          openClassTime:[]
        },
        currentInfo: {},
        // 地区数据
        provinces: [],
        // 表格头部及配置
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '班级名称',
            align: 'center',
            width: '20%',
            key: 'classInfoName',
            sortable: true
          },
          {
            title: '申请科目',
            align: 'center',
            key: 'applyCategoryName',
            render:(h,params)=>{
              return params.row.categoryName;
            }
          },
          {
            title: '上课时间',
            align: 'center',
            key: 'studyTimeSet',
            render: (h, params) => {
              return h('div',{class:'studyTime'},(() => {
                let studyTimeSet = params.row.studyTimeSet;
                let ele = [];
                for (let i = 0; i < studyTimeSet.length; i++) {
                  ele.push(h('div',{class:'item',style:{height:100/params.row.studyTimeSet.length+'%'}}, this.formateDate(studyTimeSet[i])))
                }
                return ele
              })())
            },
          },
          {
            title: '已排时间',
            align: 'center',
            key: 'day',
            render:(h,params)=>{
              return h('div',{class:'day'},(() => {
                let categoryTeacherDos = params.row.categoryTeacherDos;
                let ele = [];
                for (let i = 0; i < categoryTeacherDos.length; i++) {
                  ele.push(h('div',{class:'item',style:{height:100/params.row.categoryTeacherDos.length+'%'}}, this.formateDate(categoryTeacherDos[i].day) + ' ' + this.numberToTime(categoryTeacherDos[i].beginTime) + '-' + this.numberToTime(categoryTeacherDos[i].endTime)))
                }
                return ele
              })())
            }
          },
          {
            title: '已排科目',
            align: 'center',
            key: 'categoryName',
            render:(h,params)=>{
              return h('div',{class:'category'},(() => {
                let categoryTeacherDos = params.row.categoryTeacherDos;
                let ele = [];
                for (let i = 0; i < categoryTeacherDos.length; i++) {
                  ele.push(h('div',{class:'item',style:{height:100/params.row.categoryTeacherDos.length+'%'}}, categoryTeacherDos[i].categoryName))
                }
                return ele
              })())
            }
          },
          {
            title: '已排师资',
            align: 'center',
            key: 'name',
            render:(h,params)=>{
              return h('div',{class:'teacher'},(() => {
                let categoryTeacherDos = params.row.categoryTeacherDos;
                let ele = [];
                for (let i = 0; i < categoryTeacherDos.length; i++) {
                  ele.push(h('div',{class:'item',style:{height:100/params.row.categoryTeacherDos.length+'%'}}, categoryTeacherDos[i].teacher.name))
                }
                return ele
              })())
            }
          },
          {
            title: '师资联系方式',
            align: 'center',
            key: 'mobile',
            render:(h,params)=>{
              return h('div',{class:'mobile'},(() => {
                let categoryTeacherDos = params.row.categoryTeacherDos;
                let ele = [];
                for (let i = 0; i < categoryTeacherDos.length; i++) {
                  ele.push(h('div',{class:'item',style:{height:100/params.row.categoryTeacherDos.length+'%'}}, categoryTeacherDos[i].teacher.mobile))
                }
                return ele
              })())
            }
          },
          {
            title: '审批状态',
            align: 'center',
            key: 'state',
            render:(h,params)=>{
              return h('div',{class:'state'},params.row.state)
            }
          },
          {
            title: 'ERP人数',
            align: 'center',
            key: 'erp',
            render:(h,params)=>{
              return h('div',{class:'erpNum'},params.row.erpNum.allNum)
            }
          },
          {
            title: '操作',
            key: 'action',
            width: '20%',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                    show:this.isShow
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.tag(params.row.classInfoCategoryLinkId)
                    }
                  }
                }, '添加标记'),
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                    show:this.isShow
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.$router.push({name:'apply_detail',query:{categoryId:params.row.categoryId,id:params.row.classInfoId,edit:1}})
                    }
                  }
                }, '修改信息'),
                // h('Button', {
                //   props: {
                //     type: 'primary',
                //     size: 'small',
                //     show:this.isShow
                //   },
                //   style: {
                //     marginRight: '5px'
                //   },
                //   on: {
                //     click: () => {
                //       this.reject(params.row.id)
                //     }
                //   }
                // }, '申请调整')
              ]);
            }
          }
        ],
        data1: [],
        //弹窗
        modal2: false,
        modal1Item: {
          tagInfo: '',
          note: ''
        },
        modal2Item: {
          stage: '',
          note: ''
        },
        ruleValidate1: {
          tagInfo: [
            { required: true, message: '请输入内容', trigger: 'blur' },
          ],
        },
        ruleValidate2: {
          place: [
            { required: true, message: '请输入内容', trigger: 'blur' },
          ],
        },
        tagModal:false,
        addTag:false,
        tagOption:'',
        signNote:'', //添加标记备注
        classCategorySigns:[] ,   //标记列表
        currentClassInfoCategoryLinkId:-1,
        categoryList:[],
        total1:0,
        pageSize1:20,
        pageNumber1:1
      };
    },
    computed:{
      searchData(){
        let form = this.formItem
        return {
          classInfoName:form.classInfoName,
          examStyleId:form.examStyleId,
          openClassTime:form.openClassTime[0]?[form.openClassTime[0].getTime(),form.openClassTime[1].getTime()]:[],
          pageNumber:this.pageNumber1,
          pageSize:this.pageSize1,
          projectId:form.projectId,
          categoryId:form.categoryId,
          studyCenterIdList:form.province==''?null:[form.province],
          checkState:form.checkState
        }
      },
      searchDataPage () {
        let form = this.currentInfo
        return {
          classInfoName:form.classInfoName,
          examStyleId:form.examStyleId,
          openClassTime:form.openClassTime[0]?[form.openClassTime[0].getTime(),form.openClassTime[1].getTime()]:[],
          pageNumber:this.pageNumber1,
          pageSize:this.pageSize1,
          projectId:form.projectId,
          categoryId:form.categoryId,
          studyCenterIdList:[form.province],
          checkState:form.checkState
        }
      }
    },
    methods: {
      handleSelectAll (status) {
        this.$refs.selection.selectAll(status);
      },
      changePage (page) {
        this.pageNumber1 = page;
        this.searchPage();
      },
      reject () {
        this.modal2 = true
      },
      pushReject () {
        // 确定驳回调整
      },
      search(){
        this.currentInfo = this.formItem;
        this.$http({
          method:'post',
          url:this.$store.state.app.baseUrl + 'classInfo/checkedList',
          data:this.searchData
        })
          .then((res)=>{
            if(res.data.code == 0) {
              this.data1 = res.data.data.content;
              this.total1 = res.data.data.total;
            }else {
              this.$Message.error(res.data.message)
            }
          })
          .catch((error)=>{
            this.$Message.error(error.message)
          })
      },
      searchPage() {
        this.$http({
          method:'post',
          url:this.$store.state.app.baseUrl + 'classInfo/checkedList',
          data:this.searchDataPage
        })
          .then((res)=>{
            if(res.data.code == 0) {
              this.data1 = res.data.data.content;
              this.total1 = res.data.data.total;
            }else {
              this.$Message.error(res.data.message)
            }
          })
          .catch((error)=>{
            this.$Message.error(error.message)
          })
      },
      //添加标记
      tag (classInfoCategoryLinkId) {
        this.currentClassInfoCategoryLinkId = classInfoCategoryLinkId;
        this.$http({
          methods:'get',
          url:this.$store.state.app.baseUrl + 'schedule/classInfo/category/sign/' + this.currentClassInfoCategoryLinkId,
        })
          .then((res)=>{
            if(res.data.code == 0) {
              this.classCategorySigns = res.data.data;
            }else {
              this.$Message.error(res.data.message);
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
      findCategory(){
        this.$http({
          method:'get',
          url:this.$store.state.app.baseUrl + 'category/findByProject',
          params:{
            projectId:this.formItem.projectId
          }
        })
          .then((res)=>{
            if(res.data.code == 0) {
              this.categoryList = rea.data.data;
              this.$Message.success('保存成功');
            }else {
              this.$Message.error(res.data.message);
            }
          })
          .catch((error)=>{
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
      this.search();
    }
  };
</script>

<style lang="less" rel="stylesheet/less">
  #passed {
    td:nth-of-type(5),td:nth-of-type(6),td:nth-of-type(7),td:nth-of-type(8),td:nth-of-type(9),td:nth-of-type(10) {
      .ivu-table-cell {
        padding: 0;
        height: 100%;
        .studyTime,.day,.category,.teacher,.mobile,.state {
          height: 100%;
          .item {
            border-bottom:1px solid #e9eaec;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
          }
          .item:last-of-type {
            border-bottom: none;
          }
        }
        .state,.erpNum {
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
        }
      }
    }
    .aaa{
      color:#10b321;
    }
    .bbb{
      color:#f3052b;
    }
    .state {
      color:red;
    }
    .operate{
      color: #2d8cf0;
      margin: 0 3px;
      cursor: pointer;
    }
  }
</style>
