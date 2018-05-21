<template>
    <div style="position: relative;">
        <Row>
            <Col span="24">
            <Card>
              <NoticeInfo :id="id" ref="noticeIndo"></NoticeInfo>
            </Card>
            <Card class="margin-top-10">
                <div class="title">
                    <p>课程信息</p>
                </div>
                <div class="content">
                    <Table :data="waitData" :columns="columns1" border class="waitTable"></Table>
                    <Page :total="total" :current="pageNumber" :page-size="pageSize" @on-change="changePage1" show-total style="text-align: right;margin-top: 10px;"></Page>
                </div>
            </Card>
            <Card class="margin-top-10">
                <div class="title">
                    <p>班次信息</p>
                </div>
                <div class="content">
                    <Table :data="lessonData" :columns="columns2" border></Table>
                    <Page :total="total2" :current="pageNumber2" :page-size="pageSize2" show-total style="text-align: right;margin-top: 10px;"></Page>
                </div>
            </Card>
            <Card class="margin-top-10">
                <Row>
                    <Col span="4" offset="10">
                    <Button type="primary" size="large" long @click="back()">返回</Button>
                    </Col>
                </Row>
            </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
  import $ from 'jquery'
  import Cookies from 'js-cookie'
  import NoticeInfo from './notice_Info'
  export default {
    data () {
      return {
        id:this.$route.params.id,
        url:this.$store.state.app.baseUrl,
        columns1: [
          {
            title: '班级编码',
            align: 'center',
            key: 'classCode'
          },
          {
            title: '班级名称',
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
              return params.row.classSeries ? params.row.classSeries.classSeriesName : '--'
            }
          },
          // {
          //   title: '根目录',
          //   align: 'center',
          //   key: 'rootDirectoryName',
          //   render:(h,params)=>{
          //     return params.row.rootDirectoryName ? params.row.rootDirectoryName : '--'
          //   }
          // },
          {
            title: '课时',
            align: 'center',
            key: 'classHour'
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
            title: '课时规划',
            align: 'center',
            key: 'hourPlans',
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
          /*{
            title: '预计开课日期',
            align: 'center',
            key: 'publish',
          },
          {
            title: '开班日期',
            align: 'center',
            key: 'moon',
          },*/
          {
            title: '项目',
            align: 'center',
            key: 'projectTag'
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
            title: '添加erp',
            key: 'action',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                  },
                  on: {
                    click: () => {
                      if(!params.row.isShow){
                        this.$Modal.confirm({
                          title: '错误',
                          content: '添加Erp将 <b style="color: blue;">启用</b> 该课程，是否继续?',
                          onOk: () => {
                            //发请求 改状态
                            this.$router.push({name:'lesson_addErp',query:{lessonId:params.row.id, announceId:this.announceId}})
                            this.waitData[params.index].isShow = 1;   //params.row.isShow  1 启用 0 禁用
                            let data = {
                              courseIds:params.row.id,
                              enable:params.row.isShow == 1?false:true
                            };
                            this.$http({
                              method:'get',
                              url: this.$store.state.app.baseUrl + '/course/enable',
                              headers: {'Content-type': 'application/json'},
                              params:data,
                            })
                              .then((res)=> {
                                if(res.data.code == 0 ){
                                  this.$Message.success('启用成功');
                                }else{
                                  this.$Message.error(res.data.message)
                                }
                              })
                              .catch((error)=> {
                                this.$Message.error(error.message);
                              })
                          }
                        })
                      }else{
                        this.$router.push({name:'lesson_addErp',query:{lessonId:params.row.id, announceId:this.announceId}})
                      }
                    }
                  }
                }, '添加'),
              ])
            }
          },
          {
            title: '操作',
            align: 'center',
            key: 'status',
            render: (h, params) => {
              if(!params.row.isShow){
                return h('Button', {
                  props: {
                    type: 'success',
                    size: 'small',
                  },
                  on: {
                    click: () => {
                      // 修改状态
                      this.waitData[params.index].isShow = 1;   //params.row.isShow  1 启用 0 禁用
                      let data = {
                        courseIds:params.row.id,
                        enable:params.row.isShow == 1?false:true
                      };
                      this.$http({
                        method:'get',
                        url: this.$store.state.app.baseUrl + '/course/enable',
                        headers: {'Content-type': 'application/json'},
                        params:data,
                      })
                        .then((res)=> {
                          if(res.data.code == 0 ){
                            this.$Message.success('启用成功');
                          }else{
                            this.$Message.error(res.data.message)
                          }
                        })
                        .catch((error)=> {
                          this.$Message.error(error.message);
                        })
                    }
                  }
                }, '启用')
              }else{
                return h('Button', {
                  props: {
                    type: 'error',
                    size: 'small',
                  },
                  on: {
                    click: () => {
                      // 修改状态
                      this.waitData[params.index].isShow = 0;   //params.row.isShow  1 启用 0 禁用
                      let data = {
                        courseIds:params.row.id,
                        enable:params.row.isShow == 1?false:true
                      };
                      this.$http({
                        method:'get',
                        url: this.$store.state.app.baseUrl + '/course/enable',
                        headers: {'Content-type': 'application/json'},
                        params:data,
                      })
                        .then((res)=> {
                          if(res.data.code == 0 ){
                            this.$Message.success('禁用成功');
                          }else{
                            this.$Message.error(res.data.message)
                          }
                        })
                        .catch((error)=> {
                          this.$Message.error(error.message);
                        })
                    }
                  }
                }, '禁用')
              }
            }
          },
        ],
        waitData: [],
        current1: 1,
        sizeArray1: [],
        columns2: [
          {
            title: '班级编码',
            align: 'center',
            key: 'classCode'
          },
          {
            title: '班级名称',
            align: 'center',
            key: 'className',
          },
          {
            title: '班级类型',
            align: 'center',
            key: 'classType'
          },
          {
            title: '班级系列',
            align: 'center',
            key: 'classSeriesName',
            render:(h,params)=>{
              return params.row.classSeries ? params.row.classSeries.classSeriesName : '--'
            }
          },
          /*{
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
            title: '价格',
            align: 'center',
            key: 'price',
            /*render: (h, params) => {
              return h('div', (() => {
                let price = params.row.price;
                let ele = [];
                for (let i = 0; i < price.length; i++) {
                  ele.push(h('div', price[i]))
                }
                return ele
              })())
            },*/
          },
          {
            title: '课程内容',
            align: 'center',
            key: 'categoryName',
            render: (h,params) => {
              return params.row.categoryName.join(',')
            }
          },
          // {
          //   title: '课时规划',
          //   align: 'center',
          //   key: 'hourDetail',
          // },
          {
            title: '预计开课日期',
            align: 'center',
            key: 'beginTime',
            render: (h,params) => {
              return this.timestampToTime(params.row.beginTime) + '-' + this.timestampToTime(params.row.endTime)
            }
          },
          {
            title: '开班日期',
            align: 'center',
            key: 'openClassTime',
          },
          {
            title: '操作',
            align: 'center',
            key: 'status',
            render: (h, params) => {
                return h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                  },
                  on: {
                    click: () => {
                      // 结课
                      this.$http({
                      method:'put',
                      //url:this.$store.state.app.baseUrl + 'v1/classInfo/init/list',
                      url: this.$store.state.app.baseUrl+'classInfo/'+ params.row.id +'/overClass',
                      headers: {'Content-type': 'application/json'}
                    })
                      .then((res)=> {
                        console.log(res)
                        if(res.data.code == 0){
                          this.$Message.success('结课成功')
                          this.lessonData = res.data.data?res.data.data.content:[];
                          this.total2 = res.data.data?res.data.data.total:0
                        }else{
                          this.$Message.error(res.data.message)
                        }
                        //this.data1 = res.data.data.content;
                        //this.total = res.data.data.total;
                      })
                      .catch((error)=> {
                        this.$Message.error(error.message)
                      })
                    }
                  }
                }, '结课')
            }
          },
        ],
        lessonData: [],
        //分页
        total:0,  //总数
        pageNumber:1,  //当前页数
        pageSize:20,
        //已有班次分页
        total2:0,  //总数
        pageNumber2:1,  //当前页数
        pageSize2:20,
      }
    },
    computed: {
      announceId () {
        return this.$route.params.id
      }
    },
    methods: {
      back () {
        window.history.go(-1);
      },
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
      getCourses() {
        let data = {};
        let url = this.$store.state.app.baseUrl  + 'course/query';
        data.checkStates = [7];
        data.announcementId = this.id;
        data.pageNumber = this.pageNumber;
        data.pageSize = this.pageSize;
        this.$http({
          method: 'post',
          url: url,
          data: data,
          headers: {'Content-type': 'application/json'}
        })
          .then((res)=>{
            if(res.data.code == 0){
              this.waitData = res.data.data.content;
              this.total = res.data.data.total;
            }else{
              this.$Message.error(res.data.message)
            }
          })
          .catch(()=>{
            this.$Message.error(error.message)
          })
      }
    },
    created () {

    },
    mounted() {
      this.$http({
        method:'get',
        url: this.$store.state.app.baseUrl + 'classInfo/announcement/'+ this.announceId +'/classInfoPage?pageNumber='+this.pageNumber2+'&pageSize='+this.pageSize2,
        headers: {'Content-type': 'application/json'}
      })
        .then((res)=> {
          console.log(res)
          if(res.data.code == 0){
            this.lessonData = res.data.data == null?[]:res.data.data .content;
            this.total2 = res.data.data == null?0:res.data.data.total;
          }else{
            this.$Message.error(res.data.message)
          }
        })
        .catch((error)=> {
          this.$Message.error(error.message)
        })
      this.getCourses();
    },
    components:{
      NoticeInfo,
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
    .subTitle{
        margin-bottom: 15px;
        font-size: 16px;
    }
    .content{
        padding: 0 10px;
        margin-bottom: 20px;
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
</style>
