<template>
    <div>
        <Row>
            <Col span="24">
            <Card>
                <p slot="title">
                    <Icon type="pinpoint"></Icon>
                    查询条件
                </p>
                <Form :model="formItem" :label-width="90">
                    <Row>
                        <Col span="12">
                        <FormItem label="班级编码" prop="code">
                            <Input v-model="formItem.code" placeholder=""></Input>
                        </FormItem>
                        </Col>
                        <Col span="12">
                        <FormItem label="课程名称" prop="courseName">
                            <Input v-model="formItem.courseName" placeholder=""></Input>
                        </FormItem>
                        </Col>
                      </Row>
                    <Row>
                        <Col span="12">
                        <FormItem label="班级类型" prop="classType">
                            <RadioGroup v-model="formItem.classType" type="button" size="small">
                                <Radio label="">全部</Radio>
                                <Radio label="1">组合班次</Radio>
                                <Radio label="2">非组合班次</Radio>
                            </RadioGroup>
                        </FormItem>
                        </Col>
                        <Col span="12">
                        <FormItem label="班级系列" prop="classSeries">
                          <Select v-model="formItem.classSeries">
                            <Option value="">请选择</Option>
                            <Option v-for="item in classSeries" :key="item.id" :value="item.id">{{item.classSeriesName}}</Option>
                          </Select>
                        </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                        <FormItem label="根目录" prop="rootDirectoryName">
                            <Select v-model="formItem.rootDirectoryName">
                                <Option value="">请选择</Option>
                                <Option value="1">题海实战班</Option>
                                <Option value="2">讲练结合班</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="12">
                        <FormItem label="课时" prop="classHour">
                            <InputNumber :min="1" v-model="formItem.day"></InputNumber> 天
                            <InputNumber :min="0" v-model="formItem.night"></InputNumber> 晚
                        </FormItem>
                        </Col>
                      </Row>
                    <Row>
                        <Col span="12">
                        <FormItem label="科目" prop="categoryNames">
                        <Select v-model="formItem.categoryNames" multiple>
                            <Option v-for="item in subjects" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                        </FormItem>
                        </Col>
                        <Col span="12">
                        <FormItem label="预计开课时间">
                            <Row>
                                <Col span="16">
                                <FormItem>
                                    <DatePicker type="date" placeholder="" v-model="formItem.schoolBeginsTime"></DatePicker>
                                </FormItem>
                                </Col>
                                <Col span="7" offset="1">
                                <Select v-model="formItem.moon">
                                    <Option value="">请选择</Option>
                                    <Option value="上午">上午</Option>
                                    <Option value="下午">下午</Option>
                                </Select>
                                </Col>
                            </Row>
                        </FormItem>
                        </Col>
                      </Row>
                    <Row>
                        <Col span="12">
                        <FormItem label="项目" prop="projectTag">
                            <RadioGroup v-model="formItem.projectTag" type="button" size="small">
                                <Radio label="">全部</Radio>
                                <Radio label="普通项目">普通</Radio>
                                <Radio label="公开课">公开课</Radio>
                                <Radio label="一对一项目">一对一</Radio>
                            </RadioGroup>
                        </FormItem>
                        </Col>
                        <Col span="12">
                        <FormItem label="审核状态" prop="checkStates">
                            <RadioGroup v-model="formItem.checkState" type="button" size="small">
                                <Radio label="1">全部</Radio>
                                <Radio label="2">已审核</Radio>
                                <Radio label="3">待审核</Radio>
                                <Radio label="4">已驳回</Radio>
                            </RadioGroup>
                        </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="1">
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
                        <Page  :total="total" :current="pageNumber" :page-size="pageSize" @on-change="changePage"  show-total ></Page>
                    </div>
                </div>
            </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
  import Util from '../../libs/util'
  export default {
    name: 'notice_manage',
    data () {
      return {
          id:'',   //公告id
        formItem: {
            classCode: '',
            courseName: '',
            classType: '',
            classSeries: '',
            rootDirectoryName: '',
            classHour: '',
            day: 0,
            night: 0,
            categoryNames: [],
            schoolBeginsTime: '',
            moon: '',
            projectTag: '',
            checkState: 0
        },
        classSeries:[],
        pageNumber:1,
        pageSize:20,
        total:0,
          subjects: [
              {value:'0',label:'公基'},
              {value:'1',label:'行测'}
          ],
        // 表格头部及配置
        columns: [
          {
            title: '班级编码',
            align: 'center',
            key: 'classCode'
          },
          {
            title: '课程名称',
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
              return params.row.classSeries?params.row.classSeries.classSeriesName:'--'
            }
          },
          {
            title: '根目录',
            align: 'center',
            key: 'rootDirectoryName',
            render:(h,params)=>{
              return params.row.rootDirectoryName?params.row.rootDirectoryName:'--'
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
            render(h, params) {
              if (params.row.schoolBeginsTime == '' || params.row.schoolBeginsTime == undefined) {
                return '--'
              } else {
                let date = new Date(params.row.schoolBeginsTime);
                let Y = date.getFullYear() + '-';
                let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
                let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate())

                return Y + M + D;
              }
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
            title: '审核状态',
            align: 'center',
            key: 'checkStates',
            render:(h,params)=>{
              switch (params.row.checkState) {
                case 1 :
                  return '待审核';
                  break;
                case 2 :
                  return '被驳回';
                  break;
                case 3 :
                  return '已审核';
                  break;
                case 4 :
                  return '被驳回';
                  break;
                case 5:
                  return '已审核';
                  break;
                case 6 :
                  return '被驳回';
                  break;
                case 7 :
                  return '已审核';
                  break;
              }
            }
          },
          {
            title: '查看',
            align: 'center',
            key: 'action',
            render: (h, params) => {
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
                      this.show(params.row.id,params.row.announcementId)   //课程id 公告id
                    }
                  }
                }, '查看')])}
          }
        ],
        data1: []
      };
    },
    methods: {
      handleSelectAll (status) {
        this.$refs.selection.selectAll(status);
      },
      show (id,announcementId) {
        this.$router.push({name:'lesson_listDetail',params:{id},query:{announcementId}})
      },
      changePage (page) {
        this.pageNumber = page;
        this.search();
      },
      search () {
            let url = this.$store.state.app.baseUrl  + 'course/query';
            let data = Util.deepClone(this.formItem);
            let checkStates = [];
            if(data.checkState == 1 || data.checkState == 0) {
                checkStates = [1,2,3,4,5,6,7];
            }else if(data.checkState == 2) {
                checkStates = [3,5,7];
            }else if(data.checkState == 3) {
                checkStates = [1];
            }else if(data.checkState == 4) {
                checkStates = [2,4,6];
            }
            data.checkStates = checkStates;
            if(data.day == 0 && data.night == 0) {
                data.classHour = null;
            }else {
                data.classHour = data.day + '天' + data.night + '晚';
            }
            data.schoolBeginsTime = new Date(data.schoolBeginsTime).getTime();
            data.pageNumber = this.pageNumber;
            data.pageSize = this.pageSize;
            this.$http({
                method: 'post',
                url: url,
                data: data,
                headers: {'Content-type': 'application/json'}
            })
                .then((res)=>{
                  this.data1 = res.data.data.content;
                  this.total = res.data.data.total;
                })
                .catch(()=>{
                    this.$Message.error(error.message)
                })
      },
      formateDate(timeStamp){
        if(timeStamp == '' || timeStamp == undefined){
          return '--'
        }else {
          let date = new Date(timeStamp);
          let Y = date.getFullYear() + '-';
          let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
          let D = (date.getDate()< 10 ? '0'+(date.getDate()) : date.getDate())

          return Y+M+D;
        }
      },
      // isObjectValueEqual(a, b) {
      //   var aProps = Object.getOwnPropertyNames(a);
      //   var bProps = Object.getOwnPropertyNames(b);
      //   if (aProps.length != bProps.length) {
      //     return false;
      //   }
      //   for (var i = 0; i < aProps.length; i++) {
      //     var propName = aProps[i];
      //     if (a[propName] !== b[propName]) {
      //       return false;
      //     }
      //   }
      //     return true;
      // }
    },
    mounted() {
      // this.search();
      let url = this.$store.state.app.baseUrl  + 'course/query';
      let data = Util.deepClone(this.formItem);
      let checkStates = [];
      if(data.checkState == 1 || data.checkState == 0) {
        checkStates = [1,2,3,4,5,6,7];
      }else if(data.checkState == 2) {
        checkStates = [3,5,7];
      }else if(data.checkState == 3) {
        checkStates = [1];
      }else if(data.checkState == 4) {
        checkStates = [2,4,6];
      }
      data.checkStates = checkStates;
      if(data.day == 0 && data.night == 0) {
        data.classHour = null;
      }else {
        data.classHour = data.day + '天' + data.night + '晚';
      }
      data.schoolBeginsTime = new Date(data.schoolBeginsTime).getTime();
      data.pageNumber = this.pageNumber;
      data.pageSize = this.pageSize;
      this.$http({
        method: 'post',
        url: url,
        data: data,
        headers: {'Content-type': 'application/json'}
      })
        .then((res)=>{
          this.data1 = res.data.data.content;
          this.total = res.data.data.total;
        })
        .catch(()=>{
          this.$Message.error(error.message)
        })

      //获取班级系列
      // 非组合班次
      this.$http({
        method:'get',
        url:this.$store.state.app.baseUrl + 'classSeries/findByExamStyle',
        headers: {'Content-type': 'application/json'}
      })
        .then((res)=>{
          if(res.data.code == 0) {
            this.classSeries = res.data.data;
          }
        })
        .catch((error)=>{

        })
    },
    created () {
      // 可在此从服务端获取表格数据
      // this.getData();
    }
  };
</script>

<style>
    .ivu-row{
        margin-left: 0 !important;
    }
</style>
