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
                        <Col span="10">
                        <FormItem label="班级名称" prop="title">
                            <Input v-model="formItem.title" placeholder=""></Input>
                        </FormItem>
                        </Col>
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
          title: '',
        },
        currentInfo: {},
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
                      this.$router.push({name:'apply_detail',query:{id:params.row.id}})
                    }
                  }
                }, '查看')
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
        return {
          classInfoName: this.formItem.title,
          pageSize:this.pageSize,
          pageNumber:this.pageNumber
        }
      },
      searchDataPage () {
        let form = this.currentInfo
        return {
          classInfoName: form.title,
          pageSize:this.pageSize,
          pageNumber:this.pageNumber
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
      changePage (page) {
        this.pageNumber = page;
        this.searchPage();
      },
      search () {
        //console.log(this.searchData)
        this.pageNumber = 1;
        this.currentInfo = this.formItem
        this.$http({
          method:'get',
          url: this.$store.state.app.baseUrl + 'classInfo/cancel/list',
          params: this.searchData,
          headers: {'Content-type': 'application/json'}
        })
          .then((res) => {
          console.log(res,'查询')
          if(res.data.code == 0 ){
            this.data1 = res.data.data.content;
            this.total = res.data.data.total;
          }else{
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
          method:'get',
          url: this.$store.state.app.baseUrl + 'classInfo/cancel/list',
          params: this.searchDataPage,
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
            this.$Message.error('网络错误')
          })
      }
    },
    mounted () {
      this.search()
    }
  };
</script>

<style>
</style>
