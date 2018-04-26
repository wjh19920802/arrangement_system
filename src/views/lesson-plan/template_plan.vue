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
                  <Col span="12">
                  <FormItem label="公告名称" prop="announcementName">
                    <Input v-model="formItem.announcementName" placeholder=""></Input>
                  </FormItem>
                  </Col>
                  <Col span="12">
                  <FormItem label="省份" prop="provinceId">
                    <Select v-model="formItem.provinceId">
                      <Option value="">请选择</Option>
                      <Option v-for="(item,index) in provinces" :key="item.id" :value="item.id">{{item.cityName}}</Option>
                    </Select>
                  </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span="12">
                  <FormItem label="项目类型" prop="projectId">
                    <Select v-model="formItem.projectId">
                      <Option value="">请选择</Option>
                      <Option value="1">公务员（国考）</Option>
                      <Option value="2">公务员（省考）</Option>
                      <Option value="4">事业单位</Option>
                    </Select>
                  </FormItem>
                  </Col>
                  <Col span="12">
                  <FormItem label="公告发布时间">
                    <DatePicker type="date" placement="bottom-end" placeholder="" v-model="formItem.announcePublishTime"></DatePicker>
                  </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span="12">
                  <FormItem label="考试阶段" prop="examStage">
                    <Select v-model="formItem.examStage">
                      <Option value="">请选择</Option>
                      <Option value="1">笔试</Option>
                      <Option value="2">面试</Option>
                    </Select>
                  </FormItem>
                  </Col>
                  <Col span="12">
                  <FormItem label="出成绩时间">
                    <DatePicker type="daterange" placeholder="" v-model="formItem.announceWrittenResultTime"></DatePicker>
                  </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span="12">
                  <FormItem label="笔试时间">
                    <DatePicker type="daterange" placeholder="" v-model="formItem.writtenTime"></DatePicker>
                  </FormItem>
                  </Col>
                  <Col span="12">
                  <FormItem label="面试时间">
                    <DatePicker type="daterange" placement="bottom-end" placeholder="" v-model="formItem.interviewTime"></DatePicker>
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
                    公告列表
                </p>
                <Table border ref="selection" :columns="columns" :data="data1"></Table>
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
  import Vue from 'vue';
  import iviewArea from 'iview-area';
  import Util from '../../libs/util'
  Vue.use(iviewArea);

  export default {
    name: 'template_plan',
    data () {
      return {
        total:0,  //总数
        pageNumber:1,  //当前页数
        pageSize:20,
        formItem: {
          announcementName: '',
          provinceId: '',
          projectId:'',
          examStage: '',
          announcePublishTime: '',
          announceWrittenResultTime: [],
          writtenTime: [],
          interviewTime: [],
        },
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
            title: '公告名称',
            align: 'center',
            width: 200,
            key: 'announcementName',
            sortable: true
          },
          {
            title: '省份',
            align: 'center',
            key: 'province',
            render:(h,params)=>{
              return params.row.province.cityName
            }
          },
          {
            title: '项目类型',
            align: 'center',
            key: 'project',
            render:(h,params)=>{
              return params.row.project.projectName
            }
          },
          {
            title: '考试阶段',
            align: 'center',
            key: 'examStage'
          },
          {
            title: '招考人数',
            align: 'center',
            key: 'entranceNumber'
          },
          {
            title: '公告发布时间',
            align: 'center',
            key: 'announcePublishTime',
            sortable: true,
            render:(h,params)=>{
              return Util.formateDate(params.row.announcePublishTime)
            }
          },
          {
            title: '笔试时间',
            align: 'center',
            key: 'writtenCategorys',
            render: (h, params) => {
              if(params.row.writtenCategorys.length == 1 && params.row.writtenCategorys.categoryName == null){
                return '--'
              }else {
                return h('div', (() => {
                  let writtenCategorys = params.row.writtenCategorys;
                  let ele = [];
                  writtenCategorys.forEach((item, index) => {
                    if (item.category) {
                      ele.push(h('div', item.category.categoryName + ':' + Util.formateDate(item.writtenTime[0]) + '~' + Util.formateDate(item.writtenTime[1])))
                    }
                  });
                  return ele
                })())
              }
            },
          },
          {
            title: '出成绩时间',
            align: 'center',
            key: 'announceWrittenResultTime',
            render: (h, params) => {
              if(params.row.announceWrittenResultTime.length > 0){
                return h('div', (() => {
                  let announceWrittenResultTime = params.row.announceWrittenResultTime;
                  let ele = [];
                  for (let i = 0; i < announceWrittenResultTime.length; i++) {
                    let time = Util.formateDate(announceWrittenResultTime[i]);
                    ele.push(h('span',time));
                    if(i == 0) {
                      ele.push(h('span','~'));
                    }
                  }
                  return ele
                })())
              }else {
                return '--'
              }
            },
          },
          {
            title: '面试时间',
            align: 'center',
            key: 'interviewTime',
            render: (h, params) => {
              if(params.row.interviewTime.length > 0) {
                return h('div', (() => {
                  let interviewTime = params.row.interviewTime;
                  let ele = [];
                  for (let i = 0; i < interviewTime.length; i++) {
                    let time = Util.formateDate(interviewTime[i]);
                    ele.push(h('span',time));
                    if(i == 0) {
                      ele.push(h('span','~'));
                    }
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
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.$router.push({name:'template_planDetail',params:{id:params.row.id}})
                    }
                  }
                }, '规划'),
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  class:'addTemplate',
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.$router.push({name:'template_add',params:{id:params.row.id},query:{projectId:params.row.projectId,provinceId:params.row.provinceId}})
                    }
                  }
                }, '添加母版')
              ]);
            }
          }
        ],
        data1: []
      };
    },
    methods: {
      handleSelectAll (status) {
        this.$refs.selection.selectAll(status);
      },
      changePage (page) {
        this.pageNumber = page;
        this.search();
      },
      search(){
        let params = Util.deepClone(this.formItem);
        if(params.announcePublishTime) {
          params.announcePublishTime = params.announcePublishTime.getTime();
        }
        if(params.announceWrittenResultTime.length>0 && params.announceWrittenResultTime[0] != '' && params.announceWrittenResultTime[1] != '') {
          params.announceWrittenResultTime[0] = params.announceWrittenResultTime[0].getTime();
          params.announceWrittenResultTime[1] = params.announceWrittenResultTime[1].getTime();
        }
        if(params.writtenTime.length>0 && params.writtenTime[0] != '' && params.writtenTime[1] != '') {
          params.writtenTime[0] = params.writtenTime[0].getTime();
          params.writtenTime[1] = params.writtenTime[1].getTime();
        }
        if(params.interviewTime.length>0 && params.interviewTime[0] != '' && params.interviewTime[1] != '') {
          params.interviewTime[0] = params.interviewTime[0].getTime();
          params.interviewTime[1] = params.interviewTime[1].getTime();
        }
        let data={
          ...params,
          pageNumber:this.pageNumber,
          pageSize:this.pageSize
        };
        this.$http({
          method:'post',
          url:this.$store.state.app.baseUrl + 'announcement/query/',
          data: data,
          headers: {'Content-type': 'application/json'}
        })
          .then((res)=> {
            this.data1 = res.data.data.content;
            this.total = res.data.data.total;
          })
          .catch((error)=> {
            this.$Message.error(error.message)
          })
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
        this.$Message.error(error.message);
      });

      this.search()
    }
  };
</script>

<style>
    .ivu-row{
        margin-left: 0 !important;
    }
</style>
