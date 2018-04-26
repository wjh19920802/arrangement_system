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
                                <Option value="">全国</Option>
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
                        <FormItem label="考试阶段" prop="stage">
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
                <Table border ref="serviceTable" :columns="columns" :data="data1" ></Table>
                <div style="margin: 10px;overflow: hidden">
                    <div style="float: right;">
                        <Page :total="total" :current="pageNumber" :page-size="pageSize" @on-change="changePage" show-total ></Page>
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
            align: 'center',
            key: 'action',
            width: 200,
            render:(h,params) => {
              return h('div', [
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small',
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.$router.push({name:'apply_detail',query:{id:params.row.id}})
                      }
                    }
                  }, '申请'),
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
                        this.cancel(params.row.id)
                      }
                    }
                }, '取消')
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
        let form = this.formItem;
        return {
          pageNumber: this.pageNumber || 1,
          pageSize: this.pageSize || 20,
          className: form.title || null,
          studyCenterIdList: form.province ? [form.province] : null,
          projectId: form.type || null,
          examStyleId: form.stage || null,
          //openClassBeginTime: form.open[0].valueOf(),
          //openClassEndTime: form.open[1].valueOf(),
          openClassTime: form.open[0]?[form.open[0].getTime(),form.open[1].getTime()]:[]
        }
      },
      searchDataPage () {
        let form = this.currentInfo;
        return {
          pageNumber: this.pageNumber || 1,
          pageSize: this.pageSize || 20,
          className: form.title || null,
          studyCenterIdList: form.province ? [form.province] : null,
          projectId: form.type || null,
          examStyleId: form.stage || null,
          // openClassBeginTime: form.open[0],
          // openClassEndTime: form.open[1],
          openClassTime: form.open[0]?[form.open[0].getTime(),form.open[1].getTime()]:[]
        }
      }
    },
    methods: {
      timestampToTime(timestamp) {
        var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        let Y = date.getFullYear() + '.';
        let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '.';
        let D = date.getDate() < 10 ? '0' + (date.getDate()):date.getDate();
        //h = date.getHours() + ':';
        //m = date.getMinutes() + ':';
        //s = date.getSeconds();
        return Y+M+D;
      },
      handleSelectAll (status) {
        this.$refs.selection.selectAll(status);
      },
      changePage (page) {
        this.pageNumber = page;
        this.searchPage();
      },
      cancel (i) {
        this.$Modal.confirm ({
          title: '取消课程',
          content: '是否确定取消该课程？',
          onOk: () => {
            console.log(i)
            // 发请求删除该条数据
            this.$http({
              method:'put',
              url:this.$store.state.app.baseUrl + 'classInfo/noApply/cancelOpenClass',
              data: [i],
              headers: {'Content-type': 'application/json'}
            })
              .then((res)=>{
                if(res.data.code == 0 ){
                  this.$Message.success('取消成功!');
                  this.search()
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
      search () {
        //console.log(this.searchData)
        this.pageNumber = 1;
        this.currentInfo = this.formItem;
        this.$http({
          method:'post',
          url: this.$store.state.app.baseUrl + 'classInfo/noApply/list',
          data: this.searchData,
          headers: {'Content-type': 'application/json'}
        })
          .then((res)=> {
            console.log(res)
            if(res.data.code == 0 ){
              this.data1 = res.data.data.content;
              this.total = res.data.data.total;
            }else{
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
          url:this.$store.state.app.baseUrl + 'classInfo/noApply/list',
          data: this.searchDataPage,
          headers: {'Content-type': 'application/json'}
        })
          .then((res)=> {
            if(res.data.code == 0 ){
              this.data1 = res.data.data.content;
              this.total = res.data.data.total;
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
