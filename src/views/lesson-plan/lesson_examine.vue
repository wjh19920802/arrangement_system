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
                            <Select v-model="provinceId">
                                <Option value="">请选择</Option>
                                <Option v-for="item in provinces" :key="item.areaid" :value="item.areaid">{{item.name}}</Option>
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
                        <FormItem label="审核状态" prop="checkStates">
                            <RadioGroup v-model="formItem.checkStates" type="button" size="small">
                                <Radio label="1">全部</Radio>
                                <Radio label="2">已审核</Radio>
                                <Radio label="3">待审核</Radio>
                                <Radio label="4">已驳回</Radio>
                            </RadioGroup>
                        </FormItem>
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
    name: 'lesson_examine',
    data () {
      return {
        formItem: {
          announcementName: '',
          projectId:'',
          examStage: '',
          announcePublishTime: '',
          announceWrittenResultTime: [],
          writtenTime: [],
          interviewTime: [],
          status:'0',
          checkStates:0
        },
        provinceId: '',
        // 地区数据
        provinces: [],
        // 表格头部及配置
        columns: [
          {
            type: 'selection',
            width: 30,
            align: 'center'
          },
          {
            title: '公告名称',
            align: 'center',
            key: 'announcementName',
            sortable: true
          },
          {
            title: '省份',
            align: 'center',
            key: 'province',
            render:(h,params)=>{
              return params.row.province.cityName;
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
            title: '招考人数/人',
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
              if(params.row.writtenCategorys.length  > 1 || (params.row.writtenCategorys[0].category != null && params.row.writtenCategorys[0].category.categoryName != null)) {
                return h('div', (() => {
                  let writtenCategorys = params.row.writtenCategorys;
                  let ele = [];
                  writtenCategorys.forEach((item, index) => {
                    if (item.category) {
                      ele.push(h('div', item.category.categoryName + ':' + Util.formateDate(item.writtenTime[0]) + '---' + Util.formateDate(item.writtenTime[1])))
                    }
                  });
                  return ele
                })())
              }else {
                return '--'
              }
            }
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
            align: 'center',
            render: (h, par) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      // params.row.id  公告id
                      let id = par.row.id;
                      let projectId = par.row.projectId;

                      this.$router.push({ name: 'lesson_examineDetail', params: {id:id},query:{projectId:projectId}});
                    }
                  }
                }, '审核')
              ]);
            }
          }
        ],
        data1: [],
        total:0,
        pageNumber:1,
        pageSize:20
      };
    },
    methods: {
      changePage () {},
      search () {
        let data = Util.deepClone(this.formItem);

        if(data.checkStates == 0 || data.checkStates == 1) {
          data.courseCheckStates = [1,2,3,4,5,6,7];
        }else if(data.checkStates == 2) {
          data.courseCheckStates = [3,5,7];
        }else if(data.checkStates == 3) {
          data.courseCheckStates = [1];
        }else if(data.checkStates == 4) {
          data.courseCheckStates = [2,4,6];
        }

        data.pageNumber = this.pageNumber;
        data.pageSize = this.pageSize;
        data.provinceIdList = [];
        if(this.provinceId == '') {
          this.provinces.forEach((item)=>{
            data.provinceIdList.push(item.areaid)
          })
        }else {
          data.provinceIdList = [this.provinceId];
        }
        if(data.announcePublishTime) {
          data.announcePublishTime = data.announcePublishTime.getTime();
        }
        data.announceWrittenResultTime = this.announceWrittenResultTimeStamp;
        data.writtenTime = this.writtenTimeStamp;
        data.interviewTime = this.interviewTimeStamp;
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
    computed:{
      announceWrittenResultTimeStamp(){
        if(this.formItem.announceWrittenResultTime.length>0 ) {
          if(this.formItem.announceWrittenResultTime[0] != '' && this.formItem.announceWrittenResultTime[1] != '') {
            return [this.formItem.announceWrittenResultTime[0].getTime(),this.formItem.announceWrittenResultTime[1].getTime()];
          }else {
            return [];
          }
        }else {
          return [];
        }
      },
      writtenTimeStamp(){
        if(this.formItem.writtenTime.length>0) {
          if(this.formItem.writtenTime[0] != '' && this.formItem.writtenTime[1] != '') {
            return [this.formItem.writtenTime[0].getTime(),this.formItem.writtenTime[1].getTime()];
          }else {
            return [];
          }
        }else {
          return [];
        }
      },
      interviewTimeStamp(){
        if(this.formItem.interviewTime.length>0) {
          if(this.formItem.interviewTime[0] != '' && this.formItem.interviewTime[1] != '') {
            return [this.formItem.interviewTime[0].getTime(),this.formItem.interviewTime[1].getTime()];
          } else {
            return [];
          }
        }else {
          return [];
        }
      }
    },
    mounted(){
      this.$http(this.$store.state.app.baseUrl + 'area/getUserProvince')
        .then((res)=>{
          if(res.data.code == 0 ){
            this.provinces = res.data.data;
            this.search();
          }else {
            this.$Message.error(res.data.message);
          }
        })
        .catch((error)=>{
          this.$Message.error(error.message);
        });
    }
  };
</script>

<style>
    .ivu-row{
        margin-left: 0 !important;
    }
</style>
