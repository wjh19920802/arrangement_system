<template>
  <div id="arrange_examine">
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
            <FormItem label="学习中心" prop="provinceId">
              <Select v-model="formItem.provinceId">
                <Option value="">请选择</Option>
                <Option v-for="item in provinces" :key="item.id" :value="item.id">{{item.cityName}}</Option>
              </Select>
            </FormItem>
            </Col>
            <Col span="6">
            <FormItem label="项目类型" prop="projectId">
              <Select v-model="formItem.projectId" @on-change="findCategory">
                <Option value="">请选择</Option>
                <Option value="1">公务员（国考）</Option>
                <Option value="2">公务员（省考）</Option>
                <Option value="3">事业单位</Option>
              </Select>
            </FormItem>
            </Col>
            <Col span="6">
            <FormItem label="班级类型" prop="classTypeId">
              <Select v-model="formItem.classTypeId">
                <Option value="">请选择</Option>
                <Option value="1">组合班次</Option>
                <Option value="2">非组合班次</Option>
              </Select>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="开课时间">
              <DatePicker type="daterange" placeholder="" v-model="formItem.openClassTime"></DatePicker>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="结课时间">
              <DatePicker type="daterange" placeholder="" v-model="formItem.closeClassTime"></DatePicker>
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
              <Button type="primary" @click="search1">查询</Button>
              <!--<Button type="ghost" style="margin-left: 8px">重置</Button>-->
            </FormItem>
            </Col>
          </Row>
        </Form>
      </Card>
      <Card class="margin-top-10">
        <p slot="title">
          <Icon type="pinpoint"></Icon>
          班次列表
        </p>
        <Table border ref="selection" :columns="columns" :data="data1"></Table>
      </Card>
      </Col>
    </Row>
    <Modal  width="40%"
            v-model="rejectModal"
            title="驳回"
            @on-ok="submitReject"
    >
      <Select>
        <Option value="1">驳回省院</Option>
        <Option value="2">驳回地方</Option>
      </Select>
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
  </div>
</template>

<script>
  import Util from '../../libs/util'
  export default {
    data () {
      return {
        formItem: {
          classInfoName: '',
          provinceId: null,
          projectId: '',
          classTypeId: '',
          examStyleId: '',
          categoryId: '',
          openClassTime: [],
          closeClassTime: [],
        },
        currentInfo:{},
        // 地区数据
        provinces: [],
        rejectModal:false,
        currentId:-1,
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '班级名称',
            align: 'center',
            key: 'classInfoName'
          },
          {
            title: '班级类型',
            align: 'center',
            key: 'classType',
            render:(h,params)=>{
              return params.row.classType == 1?'组合班次':'非组合班次'
            }
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
            title: '级别',
            align: 'center',
            key: 'level',
            render:(h,params)=>{
              return h('div',{class:'level'},(() => {
                let categoryTeacherDos = params.row.categoryTeacherDos;
                let ele = [];
                for (let i = 0; i < categoryTeacherDos.length; i++) {
                  ele.push(h('div',{class:'item',style:{height:100/params.row.categoryTeacherDos.length+'%'}}, categoryTeacherDos[i].teacher.level))
                }
                return ele
              })())
            }
          },
          {
            title: '性别',
            align: 'center',
            key: 'gender',
            render:(h,params)=>{
              return h('div',{class:'gender'},(() => {
                let categoryTeacherDos = params.row.categoryTeacherDos;
                let ele = [];
                for (let i = 0; i < categoryTeacherDos.length; i++) {
                  ele.push(h('div',{class:'item',style:{height:100/params.row.categoryTeacherDos.length+'%'}}, categoryTeacherDos[i].teacher.gender))
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
            title: 'ERP人数',
            align: 'center',
            key: 'erp',
            render:(h,params)=>{
              return params.row.erpNum.allNum
            }
          },
          {
            title: '驳回状态',
            align: 'center',
            key: 'applyCategoryName',
            render:(h,params)=>{
              return params.row.regectType==1?'驳回到地市':'驳回到省院';
            }
          },
          {
            title: '审核状态',
            align: 'center',
            key: 'applyCategoryName',
            render:(h,params)=>{
              return params.row.state;
            }
          },
        ],
        data1: [],
        total1:0,
        tagModal:false,
        addTag:false,
        tagOption:'',
        signNote:'', //添加标记备注
        classCategorySigns:[] ,   //标记列表
        currentClassInfoCategoryLinkId:-1,
        categoryList:[]
      }
    },
    computed:{
      searchData(){
        let form = this.formItem;
        return {
          classInfoName: form.classInfoName==''?null:form.classInfoName,
          provinceId: form.provinceId==''?[null]:[form.provinceId],
          projectId: form.projectId==''?null:form.projectId,
          classTypeId: form.classTypeId==''?null:form.classTypeId,
          examStyleId: form.examStyleId==''?null:form.examStyleId,
          categoryId: form.categoryId==''?null:form.categoryId,
          openClassTime: form.openClassTime[0]?[form.openClassTime[0].getTime(),form.openClassTime[1].getTime()]:[],
          closeClassTime: form.closeClassTime[0]?[form.closeClassTime[0].getTime(),form.closeClassTime[1].getTime()]:[],
          pageSize:this.pageSize1,
          pageNumber:this.pageNumber1
        }
      },
      searchPageData(){
        let form = this.currentInfo;
        return {
          classInfoName: form.classInfoName==''?null:form.classInfoName,
          provinceId: form.provinceId==''?[null]:[form.provinceId],
          projectId: form.projectId==''?null:form.projectId,
          classTypeId: form.classTypeId==''?null:form.classTypeId,
          examStyleId: form.examStyleId==''?null:form.examStyleId,
          categoryId: form.categoryId==''?null:form.categoryId,
          openClassTime: form.openClassTime[0]?[form.openClassTime[0].getTime(),form.openClassTime[1].getTime()]:[],
          closeClassTime: form.closeClassTime[0]?[form.closeClassTime[0].getTime(),form.closeClassTime[1].getTime()]:[],
          pageSize:this.pageSize1,
          pageNumber:this.pageNumber1
        }
      }
    },
    methods: {
      submitReject(){

      },
      search1() {
        this.currentInfo = this.formItem;
        this.$http({
          method:'post',
          url:this.$store.state.app.baseUrl + 'schedule/scheduledQuery',
          data:this.searchData
        })
          .then((res)=>{
            if(res.data.code == 0) {
              this.data1 = res.data.data.content;
              this.total1 = res.data.data.total;
            }else {
              this.$Message.error(res.data.message);
            }
          })
          .catch((error)=>{
            console.log(error)
            this.$Message.error('网络异常');
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
            this.$Message.error('网络错误')
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
            this.$Message.error('网络异常');
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
              this.categoryList = res.data.data;
            }else {
              this.$Message.error(res.data.message);
            }
          })
          .catch((error)=>{
            console.log(error)
            this.$Message.error('网络异常');
          })
      },
      formateDate(timeStamp) {
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
      }
    },
    mounted(){
      this.$http(this.$store.state.app.baseUrl + 'area')
        .then((res)=>{
          if(res.data.code == 0 ){
            this.provinces = res.data.data;
          }else {
            this.$Message.error(res.data.message);
          }
        }).catch((error)=>{
        this.$Message.error('网络错误');
      });
      this.search1();
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  #arrange_examine {
    /*border: 1px solid #e9eaec;*/
    /*th{*/
      /*border: 1px solid #e9eaec;*/
      /*min-height: 55px;*/
      /*background-color: #f8f8f9;*/
      /*padding: 10px 5px;*/
    /*}*/
    /*td {*/
      /*border: 1px solid #e9eaec;*/
      /*max-width: 150px;*/
      /*min-height: 45px;*/
      /*font-size: 12px;*/
      /*.ivu-select-selection{*/
        /*border: transparent!important;*/
      /*}*/
    /*}*/
    .ivu-table-cell {
      padding: 0;
    }
    td:nth-of-type(5),td:nth-of-type(6),td:nth-of-type(7),td:nth-of-type(8),td:nth-of-type(9),td:nth-of-type(10),td:nth-of-type(11){
      .ivu-table-cell {
        padding: 0;
        height: 100%;
        .studyTime,.day,.category,.teacher,.mobile,.level,.gender,.ifNotice {
          height: 100%;
          .item {
            border-bottom:1px solid #e9eaec;
          }
          .item:last-of-type {
            border-bottom: none;
          }
        }
      }
    }
    .aaa{
      color:#10b321;
    }
    .bbb {
      color: #f3052b;
    }
  }
  .operate{
    color: #2d8cf0;
    margin: 0 3px;
    cursor: pointer;
    margin-bottom: 10px;
  }
  /*.thead{
      text-align: center;
      .tr{
          background-color: #f8f8f9;
          width: 100%;
          display: flex;
          border-top:1px solid #e9eaec;
          border-left:1px solid #e9eaec;
          border-bottom:1px solid #e9eaec;
          justify-content: flex-start;
          .th{
              flex:1;
              border-right:1px solid #e9eaec;
              display: inline-block;
              min-width: 30px;
              min-height: 50px;
              padding: 14px 5px;
          }
          .operate{
              min-width: 250px;
          }
      }
  }
  .tbody{
      text-align: center;
      background-color: #fff;
      border-left:1px solid #e9eaec;
      border-bottom:1px solid #e9eaec;
      font-size: 12px;
      .tr{
          display: flex;
          justify-content: flex-start;
          .td{
              flex:1;
              border-right:1px solid #e9eaec;
              border-bottom:1px solid #e9eaec;
              min-width: 30px;
              min-height: 50px;
              line-height: 2;
              padding: 15px 5px;
          }
          .operate{
              min-width: 250px;
          }
      }
  }*/
</style>
