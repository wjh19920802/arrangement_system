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
                        <FormItem label="项目类型" prop="projectId">
                          <Select v-model="formItem.projectId">
                            <Option value="">请选择</Option>
                            <Option value="1">公务员（国考）</Option>
                            <Option value="2">公务员（省考）</Option>
                            <Option value="4">事业单位</Option>
                          </Select>
                        </FormItem>
                        </Col>
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
                    </Row>
                    <Row>
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
                <Table border ref="serviceTable" :columns="columns" :data="data1"></Table>
                <div style="margin: 10px;overflow: hidden">
                    <div style="float: right;">
                      <Page :total="total" :current="pageNumber" :page-size="pageSize" @on-change="changePage" show-total></Page>
                    </div>
                </div>
            </Card>
            </Col>
        </Row>
    </div>
</template>

<script>

  export default {
    data () {
      return {
        formItem: {
          classInfoName: '',
          province: '',
          projectId:'',
          examStyleId:'',
          openClassTime:[]
        },
        currentInfo: {},
        // 地区数据
        provinces:[],
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
            key: 'classInfoName'
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
            key: 'studyTimeSet',
            render: (h, params) => {
              return h('div',{class:'studyTime'},(() => {
                let studyTimeSet = params.row.studyTimeSet;
                if(params.row.studyTimeSet.length == 0) {
                  return ''
                }else {
                  let ele = [];
                  for (let i = 0; i < studyTimeSet.length; i++) {
                    ele.push(h('div',{class:'item',style:{height:100/params.row.studyTimeSet.length+'%'}}, this.formateDate(studyTimeSet[i])))
                  }
                  return ele
                }
              })())
            },
          },
          {
            title: '上课天数',
            align: 'center',
            key: 'classHour',
          },
          {
            title: 'ERP人数',
            align: 'center',
            key: 'erpNum',
            render:(h,params)=>{
              // console.log(params.row);
              return params.row.erpNum.allNum
            }
          },
          {
            title: '驳回人&时间',
            align: 'center',
            key: 'reject',
            render: (h, params) => {
              return h('div', [
                h('div', params.row.regectRealName),
                h('div', this.formateDate(params.row.regectTime)),
              ])
            }
          },
          {
            title: '驳回理由',
            align: 'center',
            key: 'regectReason'
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
                  },
                  style: {
                    marginRight: '5px',
                    marginBottom: '5px'
                  },
                  on: {
                    click: () => {
                      this.reSubmit(params.row.classInfoCategoryLinkId)
                    }
                  }
                }, '重新提交'),
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
                      this.cancelClass(params.row.classInfoId)
                    }
                  }
                }, '取消开班'),
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
                      this.removeSubject(params.row.classInfoCategoryLinkId)
                    }
                  }
                }, '删除科目')
              ]);
            }
          }
        ],
        data1: [],
        //分页
        total:0,  //总数
        pageNumber:1,  //当前页数
        pageSize:20
      };
    },
    computed: {
      searchData () {
        let form = this.formItem
        return {
          pageNumber: this.pageNumber || 1,
          pageSize: this.pageSize || 20,
          classInfoName: form.classInfoName,
          studyCenterIdList: form.province ? [form.province] : [],
          projectId: form.projectId,
          examStyleId: form.examStyleId,
          openClassTime: form.openClassTime[0]?[form.openClassTime[0].getTime(), form.openClassTime[1].getTime()]:[]
        }
      },
      searchDataPage () {
        let form = this.currentInfo
        return {
          pageNumber: this.pageNumber || 1,
          pageSize: this.pageSize || 20,
          classInfoName: form.classInfoName,
          studyCenterIdList: form.province ? [form.province] : [],
          projectId: form.projectId,
          examStyleId: form.examStyleId,
          openClassTime: form.openClassTime[0]?[form.openClassTime[0].getTime(), form.openClassTime[1].getTime()]:[]
        }
      }
    },
    methods: {
      timestampToTime(timestamp) {
        var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        let Y = date.getFullYear() + '.';
        let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '.';
        let D = date.getDate() + ' ';
        //h = date.getHours() + ':';
        //m = date.getMinutes() + ':';
        //s = date.getSeconds();
        return Y+M+D;
      },
      handleSelectAll (status) {
        this.$refs.selection.selectAll(status);
      },
      changePage () {
        this.pageNumber = page;
        this.searchPage();
      },
      reSubmit (classInfoCategoryLinkId) {
        this.$Modal.confirm ({
          title: '重新提交',
          content: '是否确定提交该课程？',
          onOk: ()=> {
            this.$http({
              method:'post',
              url: this.$store.state.app.baseUrl + 'classInfo/rejectClassList/reSubmit/' + classInfoCategoryLinkId,
              data:{}
            })
              .then((res) => {
                if(res.data.code == 0) {
                  this.$Message.success('提交成功')
                }else {
                  this.$Message.error(res.data.message);
                }
              })
              .catch((error)=> {
                this.$Message.error('网络错误')
              })
          }
        })
      },
      cancelClass (classInfoId) {
        this.$Modal.confirm ({
          title: '取消开班',
          content: '是否确定取消开班？',
          onOk: ()=> {
            this.$http({
              method:'put',
              url: this.$store.state.app.baseUrl + 'classInfo/noApply/cancelOpenClass',
              data:[classInfoId]
            })
              .then((res) => {
                if(res.data.code == 0) {
                  this.$Message.success('取消开班成功')
                }else {
                  this.$Message.error(res.data.message);
                }
              })
              .catch((error)=> {
                this.$Message.error('网络错误')
              })
          }
        })
      },
      removeSubject (classInfoCategoryLinkId) {
        this.$Modal.confirm ({
          title: '删除科目',
          content: '是否确定删除科目？',
          onOk: ()=> {
            this.$http({
              method:'post',
              url: this.$store.state.app.baseUrl + 'classInfo/deleteTopCategory/' + classInfoCategoryLinkId,
              data:{}
            })
              .then((res) => {
                if(res.data.code == 0) {
                  this.$Message.success('删除成功')
                }else {
                  this.$Message.error(res.data.message);
                }
              })
              .catch((error)=> {
                this.$Message.error('网络错误')
              })
          }
        })
      },
      search () {
        //console.log(this.searchData)
        this.pageNumber = 1;
        this.currentInfo = this.formItem
        this.$http({
          method:'post',
          url: this.$store.state.app.baseUrl + 'classInfo/rejectClassList',
          data: this.searchData,
          headers: {'Content-type': 'application/json'}
        })
          .then((res) => {
            console.log(res)
            if(res.data.code == 0) {
              this.data1 = res.data.data.content;
              this.total = res.data.data.total;
            }else {
              this.$Message.error(res.data.message);
            }
          })
          .catch((error)=> {
            this.$Message.error('网络错误')
          })
      },
      searchPage () {
        //console.log(this.searchData)
        this.$http({
          method:'post',
          url:this.$store.state.app.baseUrl + 'classInfo/init/list',
          data: this.searchDataPage,
          headers: {'Content-type': 'application/json'}
        })
          .then((res)=> {
            console.log(res)
            if(res.data.code == 0) {
              this.data1 = res.data.data.content;
              this.total = res.data.data.total;
            }else {
              this.$Message.error(res.data.message);
            }
          })
          .catch((error)=> {
            this.$Message.error('网络错误')
          })
      },
      // findCategory(){
      //   this.$http({
      //     method:'get',
      //     url:this.$store.state.app.baseUrl + 'category/findByProject',
      //     params:{
      //       projectId:this.formItem.projectId
      //     }
      //   })
      //     .then((res)=>{
      //       if(res.data.code == 0) {
      //         this.categoryList = rea.data.data;
      //         this.$Message.success('保存成功');
      //       }else {
      //         this.$Message.error('网络异常');
      //       }
      //     })
      //     .catch((error)=>{
      //       console.log(error)
      //       this.$Message.error('网络异常');
      //     })
      // },
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
        this.$Message.error('网络错误');
      });
      this.search()
    }
  };
</script>

<style>
</style>
