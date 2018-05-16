<template>
    <div>
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
                        <FormItem label="班级名称" prop="title">
                            <Input v-model="formItem.title" placeholder=""></Input>
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
                        <FormItem label="项目类型" prop="type">
                            <Select v-model="formItem.type">
                              <Option value="">请选择</Option>
                              <Option value="1">公务员（国考）</Option>
                              <Option value="2">公务员（省考）</Option>
                              <Option value="4">事业单位</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="考试类型" prop="stage">
                            <Select v-model="formItem.stage" :select="formItem.stage">
                              <Option value="">请选择</Option>
                              <Option value="1">笔试</Option>
                              <Option value="2">面试</Option>
                              <Option value="3">笔试 + 面试</Option>
                            </Select>
                        </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                        <FormItem label="开课时间">
                            <DatePicker type="daterange" placeholder="" v-model="formItem.open"></DatePicker>
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
                <Table border ref="draftList" :columns="columns1" :data="data1" @on-selection-change="selectLessons"></Table>
                <div style="margin: 10px;overflow: hidden">
                    <Button @click="handleSelectAll(true,'draftList')">全选</Button>
                    <Button type="primary" @click="submitLessons">提交课程</Button>
                    <Button type="primary" @click="cancel">取消课程</Button>
                    <div style="float: right;">
                        <Page :total="total" :current="pageNumber" :page-size="pageSize" @on-change="changePage" show-total ></Page>
                    </div>
                </div>
            </Card>
            </Col>
        </Row>
        <Modal class="merge_modal"
               v-model="modal1"
               width="65%"
               title="选择要合并的课程"
               >
            <Table border ref="masterList" :columns="columns2" :data="masterClass"></Table>
            <Form :model="formItem2" :label-width="60" label-position="right" class="margin-top-10">
                <Row>
                    <Col span="7">
                    <FormItem label="班级名称" prop="title">
                        <Input v-model="formItem2.title" placeholder=""></Input>
                    </FormItem>
                    </Col>
                    <Col span="6">
                    <FormItem label="省份" prop="province">
                        <Select v-model="formItem2.province">
                            <Option value="">请选择</Option>
                            <Option v-for="item in provinces" :key="item.areaid" :value="item.areaid">{{item.name}}</Option>
                        </Select>
                    </FormItem>
                    </Col>
                    <Col span="6">
                    <FormItem label="开课时间">
                        <DatePicker type="daterange" placeholder="" v-model="formItem2.open"></DatePicker>
                    </FormItem>
                    </Col>
                    <Col span="3">
                    <FormItem>
                        <Button type="primary" @click="search2">查询</Button>
                    </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Table border ref="mergeList" :columns="columns3" :data="data2" @on-selection-change="selectOtherLessons"></Table>
                    <div style="margin: 10px;overflow: hidden">
                      <Button @click="handleSelectAll(true,'mergeList')">全选</Button>
                      <Button type="primary" @click="mergeLessons">合并班次</Button>
                      <div style="float: right;">
                        <Page :total="total2" :current="pageNumber2" :page-size="pageSize2" @on-change="changePage2" show-total ></Page>
                      </div>
                    </div>
                </Row>
            </Form>
        </Modal>
    </div>
</template>

<script>

  export default {
    data () {
      return {
        formItem: {
          title: '',
          province: '',
          type: '',
          stage: '',
          open: [],
        },
        currentInfo: {},
        // 地区数据
        provinces: [],
        // 表格头部及配置
        columns1: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '班级名称',
            align: 'center',
            width: '20%',
            key: 'className',
            sortable: true
          },
          {
            title: '地区',
            align: 'center',
            key: 'area',
            render: (h,params) => {
              return params.row.studyProvince+'/'+params.row.studyCity+'/'+params.row.studyCenter
            }
          },
          {
            title: '项目类型',
            align: 'center',
            key: 'projectName'
          },
          {
            title: '上课时间',
            align: 'center',
            key: 'days',
            render: (h,params) => {
              return this.timestampToTime(params.row.beginTime) + '-' + this.timestampToTime(params.row.endTime)
            }
          },
          {
            title: '上课天数',
            align: 'center',
            key: 'classHour',
          },
          {
            title: 'ERP人数',
            align: 'center',
            key: 'erp',
            render: (h,params) => {
              return params.row.erpNumCompose?params.row.erpNumCompose.allNum: 0
            }
          },
          {
            title: '操作',
            key: 'action',
            width: 200,
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
                      this.$router.push({name:'apply_detail',query:{id:params.row.id, edit:1}})
                    }
                  }
                }, '修改'),
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
                      this.submit(params.row.id)
                    }
                  }
                }, '提交'),
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
                      this.merge(params.row)
                    }
                  }
                }, '合并开班')
              ]);
            }
          }
        ],
        data1: [],
        selectArr: [],// 以选中的ids
        //分页
        total:0,  //总数
        pageNumber:1,  //当前页数
        pageSize:20,
        // 合并班级的弹窗
        modal1: false,
        masterClass: [],//主班次的数据
        formItem2: {
          title: '',
          province: '',
          open: [],
        },
        currentInfo2: {},
        //分页
        total2:0,  //总数
        pageNumber2:1,  //当前页数
        pageSize2:20,
        // 合并班次 的 数据
        columns2: [
          {
            title: '班级名称',
            align: 'center',
            width: '20%',
            key: 'className',
            sortable: true
          },
          {
            title: '省份',
            align: 'center',
            key: 'studyProvince'
          },
          {
            title: '项目类型',
            align: 'center',
            key: 'projectName'
          },
          {
            title: '上课时间',
            align: 'center',
            key: 'days',
            render: (h,params) => {
              return this.timestampToTime(params.row.beginTime) + '-' + this.timestampToTime(params.row.endTime)
            }
          },
          {
            title: '上课天数',
            align: 'center',
            key: 'classHour',
          },
          {
            title: 'ERP人数',
            align: 'center',
            key: 'erp',
            render: (h,params) => {
              return params.row.erpNumCompose?params.row.erpNumCompose.allNum: 0
            }
          },
        ],
        columns3: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '班级名称',
            align: 'center',
            width: '20%',
            key: 'className',
            sortable: true
          },
          {
            title: '省份',
            align: 'center',
            key: 'studyProvince'
          },
          {
            title: '项目类型',
            align: 'center',
            key: 'projectName'
          },
          {
            title: '上课时间',
            align: 'center',
            key: 'days',
            render: (h,params) => {
              return this.timestampToTime(params.row.beginTime) + '-' + this.timestampToTime(params.row.endTime)
            }
          },
          {
            title: '上课天数',
            align: 'center',
            key: 'classHour',
          },
          {
            title: 'ERP人数',
            align: 'center',
            key: 'erp',
            render: (h,params) => {
              return params.row.erpNumCompose?params.row.erpNumCompose.allNum: 0
            }
          },
        ],
        data2: [],
        selectOtherArr: []
      };
    },
    computed: {
      searchData () {
        let form = this.formItem
        return {
          pageNumber: this.pageNumber || 1,
          pageSize: this.pageSize || 20,
          className: form.title || null,
          studyCenterIdList: form.province ? [form.province] : null,
          projectId: form.type || null,
          examStyleId: form.stage || null,
          openClassTime: form.open[0]?[form.open[0].getTime(),form.open[1].getTime()]:[]
        }
      },
      searchDataPage () {
        let form = this.currentInfo
        return {
          pageNumber: this.pageNumber || 1,
          pageSize: this.pageSize || 20,
          className: form.title || null,
          studyCenterIdList: form.province ? [form.province] : null,
          projectId: form.type || null,
          examStyleId: form.stage || null,
          openClassTime: form.open[0]?[form.open[0].getTime(),form.open[1].getTime()]:[]
        }
      },
      //合并班次需要的筛选项及分页
      searchData2 () {
        let form = this.formItem2
        return {
          majorClassId: this.masterClass[0].id,
          pageNumber: this.pageNumber2 || 1,
          pageSize: this.pageSize2 || 20,
          className: form.title,
          studyCenterIdList: form.province ? [form.province] : [],
          openClassTime: form.open[0]?[form.open[0].getTime(),form.open[1].getTime()]:[]
        }
      },
      searchDataPage2 () {
        let form = this.currentInfo2
        return {
          majorClassId: this.masterClass[0].id,
          pageNumber: this.pageNumber2 || 1,
          pageSize: this.pageSize2 || 20,
          className: form.title,
          studyCenterIdList: form.province ? [form.province] : [],
          openClassTime: form.open[0]?[form.open[0].getTime(),form.open[1].getTime()]:[]
        }
      }
    },
    methods: {
      timestampToTime(timestamp) {
        var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        let Y = date.getFullYear() + '.';
        let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '.';
        let D = date.getDate()<10?'0' + date.getDate():date.getDate();
        //h = date.getHours() + ':';
        //m = date.getMinutes() + ':';
        //s = date.getSeconds();
        return Y+M+D;
      },
      handleSelectAll (status,ref) {
        this.$refs[ref].selectAll(status);
      },
      changePage (page) {
        this.pageNumber = page;
        this.searchPage();
      },
      changePage2 (page) {
        this.pageNumber2 = page;
        this.searchPage2();
      },
      search () {
        //console.log(this.searchData)
        this.pageNumber = 1;
        this.currentInfo = this.formItem
        this.$http({
          method:'post',
          url: this.$store.state.app.baseUrl + 'classInfo/uncertain/list',
          data: this.searchData,
          headers: {'Content-type': 'application/json'}
        })
          .then((res) => {
            console.log(res)
            if(res.data.code == 0 ){
              this.data1 = res.data.data.content;
              this.total = res.data.data.total;
            }else {
              this.$Message.error(res.data.message);
            }
          })
          .catch((error)=> {
            this.$Message.error(error.message)
          })
      },
      searchPage () {
        //console.log(this.searchData)
        this.$http({
          method:'post',
          url:this.$store.state.app.baseUrl + 'classInfo/uncertain/list',
          data: this.searchDataPage,
          headers: {'Content-type': 'application/json'}
        })
          .then((res)=> {
            console.log(res)
            if(res.data.code == 0 ){
              this.data1 = res.data.data.content;
              this.total = res.data.data.total;
            }else {
              this.$Message.error(res.data.message);
            }
          })
          .catch((error)=> {
            this.$Message.error(error.message)
          })
      },
      selectLessons (val) {
        let selectArr = []
        val.map((item, index) => {
          selectArr.push(item.id)
        })
        this.selectArr = selectArr
      },
      submit (id) {
        this.$Modal.confirm ({
            title: '提交课程',
            content: '是否确定提交课程？',
            onOk: () => {
              // 发请求删除该条数据
              this.$http({
                method:'post',
                url:this.$store.state.app.baseUrl + 'classInfo/uncertainToSubmit',
                data: [id],
                headers: {'Content-type': 'application/json'}
              })
                .then((res)=>{
                  if(res.data.code == 0 ){
                    this.$Message.success('提交成功!');
                    this.search();
                  }else{
                    this.$Message.error(res.data.message);
                  }
                })
                .catch((error)=>{
                  this.$Message.error(error.message)
                })
            }
          })
      },
      submitLessons () {
        if(this.selectArr.length > 0) {
          this.$Modal.confirm ({
            title: '提交课程',
            content: '是否确定提交选中的课程？',
            onOk: () => {
              // 发请求删除该条数据
              this.$http({
                method:'post',
                url:this.$store.state.app.baseUrl + 'classInfo/uncertainToSubmit',
                data: this.selectArr,
                headers: {'Content-type': 'application/json'}
              })
                .then((res)=>{
                  if(res.data.code == 0 ){
                    this.$Message.success('提交成功!');
                    this.search();
                  }else{
                    this.$Message.error(res.data.message);
                  }
                })
                .catch((error)=>{
                  this.$Message.error(error.message)
                })
            }
          })
        }else {
          this.$Message.error('请选择课程！')
        }

      },
      cancel () {
        if(this.selectArr.length > 0) {
          this.$Modal.confirm({
            title: '取消课程',
            content: '是否确定取消选中的课程？',
            onOk: () => {
              // 发请求删除该条数据
              this.$http({
                method: 'post',
                url: this.$store.state.app.baseUrl + 'classInfo/uncertainToDelete',
                data: this.selectArr,
                headers: {'Content-type': 'application/json'}
              })
                .then((res) => {
                  if (res.data.code == 0) {
                    this.$Message.success('取消成功!');
                  }else{
                    this.$Message.error(res.data.message);
                  }
                })
                .catch((error) => {
                  this.$Message.error(error.message)
                })
            }
          })
        }else {
          this.$Message.error('请选择课程！')
        }
      },
      merge (row) {
        this.masterClass = [row]
        this.modal1 = true
        this.search2()
      },
      search2 () {
        this.pageNumber2 = 1;
        this.currentInfo2 = this.formItem2
        this.$http({
          method:'post',
          url: this.$store.state.app.baseUrl + 'classInfo/uncertain/list',
          data: this.searchData2,
          headers: {'Content-type': 'application/json'}
        })
          .then((res) => {
            console.log(res)
            if(res.data.code == 0 ){
              this.data2 = res.data.data.content;
              this.total2 = res.data.data.total;
            }else{
              this.$Message.error(res.data.message);
            }
          })
          .catch((error)=> {
            this.$Message.error(error.message)
          })
      },
      searchPage2 () {
        //console.log(this.searchData)
        this.$http({
          method:'post',
          url:this.$store.state.app.baseUrl + 'classInfo/uncertain/list',
          data: this.searchDataPage2,
          headers: {'Content-type': 'application/json'}
        })
          .then((res)=> {
            console.log(res)
            if(res.data.code == 0 ){
              this.data2 = res.data.data.content;
              this.total2 = res.data.data.total;
            }else{
              this.$Message.error(res.data.message);
            }
          })
          .catch((error)=> {
            this.$Message.error(error.message)
          })
      },
      selectOtherLessons (val) {
        let selectArr = []
        val.map((item, index) => {
          selectArr.push(item.id)
        })
        console.log(selectArr)
        this.selectOtherArr = selectArr
      },
      mergeLessons () {
        this.$http({
          method:'put',
          url: this.$store.state.app.baseUrl + 'classInfo/'+ this.masterClass[0].id +'/compose',
          data: this.selectOtherArr,
          headers: {'Content-type': 'application/json'}
        })
          .then((res) => {
            console.log(res,'合并')
            if(res.data.code == 0 ){
              this.$Message.success('合并成功!');
              this.search2()
              this.search()
            }else{
              this.$Message.error(res.data.message);
            }
          })
          .catch((error)=> {
            this.$Message.error(error.message)
          })
      }
    },
    mounted () {
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
      this.search()
    }
  };
</script>

<style>
</style>
