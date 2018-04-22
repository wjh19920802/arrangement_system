<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="pinpoint"></Icon>
                模糊查询
            </p>
                <Row>
                  <Col span="8" style="margin-left: 80px">
                    <Input v-model="searchInfo" placeholder="师资姓名、工号、手机号搜索"></Input>
                  </Col>
                  <Col span="4" style="margin-left: 10px">
                    <Button type="primary" @click="search(0)">查询</Button>
                  </Col>
                </Row>
        </Card>
        <Card class="margin-top-10">
            <p slot="title">
                <Icon type="pinpoint"></Icon>
                条件查询
            </p>
            <Form :model="formItem" :label-width="80">
              <Row>
                <Col span="6">
                <!--<FormItem label="所属部门" prop="department">
                  <Select v-model="formItem.department">
                    <Option value="0">课研</Option>
                    <Option value="1">研究院</Option>
                    <Option value="2">XXX</Option>
                  </Select>
                </FormItem>-->
                </Col>
                <Col span="6">
                <FormItem label="性别" prop="gender">
                  <Select v-model="formItem.gender" :select="formItem.gender">
                    <Option value="">请选择</Option>
                    <Option value="男">男</Option>
                    <Option value="女">女</Option>
                  </Select>
                </FormItem>
                </Col>
                <Col span="6">
                <FormItem label="师资状态" prop="status">
                  <Select v-model="formItem.status">
                    <Option value="">请选择</Option>
                    <Option value="正常">正常</Option>
                    <Option value="预离职">预离职</Option>
                    <Option value="已离职">已离职</Option>
                    <Option value="禁用（被投诉）">禁用（被投诉）</Option>
                    <Option value="禁用（借调）">禁用（借调）</Option>
                    <Option value="禁用（停课）">禁用（停课）</Option>
                  </Select>
                </FormItem>
                </Col>
                <Col span="6">
                <FormItem label="师资属性" prop="property">
                  <Select v-model="formItem.property" :select="formItem.property">
                    <Option value="">请选择</Option>
                    <Option value="师资序列">师资序列</Option>
                    <Option value="内部兼职">内部兼职</Option>
                    <Option value="外部兼职">外部兼职</Option>
                    <Option value="研发编辑">研发编辑</Option>
                  </Select>
                </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="6">
                <FormItem label="级别" prop="level">
                  <Select v-model="formItem.level" :select="formItem.level">
                    <Option value="">请选择</Option>
                    <Option value="实习生">实习生</Option>
                    <Option value="助教">助教</Option>
                    <Option value="初一">初一</Option>
                    <Option value="初二">初二</Option>
                    <Option value="初三">初三</Option>
                    <Option value="初四">初四</Option>
                    <Option value="中一">中一</Option>
                    <Option value="中二">中二</Option>
                    <Option value="中三">中三</Option>
                    <Option value="高一">高一</Option>
                    <Option value="高二">高二</Option>
                    <Option value="高三">高三</Option>
                  </Select>
                </FormItem>
                </Col>
                <Col span="6">
                <FormItem label="主修" prop="major">
                  <Select v-model="formItem.major" :select="formItem.major" filterable>
                    <Option value="">请选择</Option>
                    <Option :value="item.id" v-for="item,index in levelData" :style="{textIndent:item.level*20+'px'}" :key="index">{{item.name}}</Option>
                  </Select>
                </FormItem>
                </Col>
                <Col span="6">
                <FormItem label="辅修" prop="minor">
                  <Select v-model="formItem.minor" :select="formItem.minor" filterable>
                    <Option value="">请选择</Option>
                    <Option :value="item.id" v-for="item,index in levelData" :style="{textIndent:item.level*20+'px'}" :key="index">{{item.name}}</Option>
                  </Select>
                </FormItem>
                </Col>
                <Col span="6">
                <FormItem>
                  <Button type="primary" @click="search(1)">查询</Button>
                </FormItem>
                </Col>
              </Row>
            </Form>
        </Card>
        <Card class="margin-top-10">
            <p slot="title">
                <Icon type="pinpoint"></Icon>
                师资列表
            </p>
            <Table border :columns="column1" :data="data1"></Table>
            <div style="margin: 10px;overflow: hidden">
                <div style="float: left;">
                    <span class="margin-left-10 margin-top-20">
                        <Button type="success" size="large" @click="addTeacher"><Icon type="plus-round"></Icon> 添加师资</Button>
                    </span>
                </div>
                <div style="float: right;">
                    <Page :total="total" :current="pageNumber" :page-size="pageSize" @on-change="changePage" show-total ></Page>
                </div>
            </div>
        </Card>
    </div>
</template>

<script>
  export default {
    data () {
      return {
        searchInfo: '',
        formItem: {
          department: '',
          gender: '',
          status: '',
          property: '',
          level: '',
          major: '',
          minor: ''
        },
        column1: [
          {
            title: '所属部门',
            align: 'center',
            key: 'institute',
          },
          {
            title: '姓名',
            align: 'center',
            key: 'name',
          },
          {
            title: '性别',
            align: 'center',
            key: 'gender',
            /*render: (h,params) => {
              return params.row.gender ? '女' : '男'
            }*/
          },
          {
            title: '工号',
            align: 'center',
            key: 'teacherId',
          },
          {
            title: '联系方式',
            align: 'center',
            key: 'mobile',
          },
          {
            title: '主授课方向',
            align: 'center',
            key: 'major',
          },
          {
            title: '职级',
            align: 'center',
            key: 'level',
          },
          {
            title: '师资属性',
            align: 'center',
            key: 'attribute',
          },
          {
            title: '职位',
            align: 'center',
            key: 'position',
          },
          {
            title: '被投诉次数',
            align: 'center',
            key: 'complaints',
          },
          {
            title: '培训次数',
            align: 'center',
            key: 'trainings',
          },
          {
            title: '师资状态',
            align: 'center',
            key: 'state',
            width: 160,
            render:(h,params)=>{
              return h('Select',{
                props: {
                  value: params.row.state
                },
                style: {
                  padding: '0 8px'
                },
                on:{
                  'on-change': (val) => {
                    this.$Modal.confirm({
                      title: '提示',
                      content: '是否确认改变该师资状态?',
                      onOk: () => {
                        this.$http({
                          method:'put',
                          //url:this.$store.state.app.baseUrl + `dossier/teacher?id=${params.row.teacherId}&state=${val}`,
                          url: `http://192.168.65.250:8088/dossier/teacher?id=${params.row.teacherId}&state=${val}`,
                          headers: {'Content-type': 'application/json'}
                        })
                          .then((res)=> {
                            if(res.data.code == 0 ){
                              this.$Message.success('状态更新成功')
                            }else{
                              this.$Message.error(res.data.message)
                            }
                          })
                          .catch((error)=> {
                            this.$Message.error('网络错误')
                          })
                      }
                    })
                  }
                }
              }, [
                h('Option',{
                  props: {
                    value: '正常'
                  }
                },'正常'),
                h('Option',{
                  props: {
                    value: '预离职'
                  }
                },'预离职'),
                h('Option',{
                  props: {
                    value: '已离职'
                  }
                },'已离职'),
                h('Option',{
                  props: {
                    value: '禁用（被投诉）'
                  }
                },'禁用（被投诉）'),
                h('Option',{
                  props: {
                    value: '禁用（借调）'
                  }
                },'禁用（借调）'),
                h('Option',{
                  props: {
                    value: '禁用（停课）'
                  }
                },'禁用（停课）'),
              ])
            }
          },
          /*{
            title: '详情',
            key: 'action',
            width: 250,
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
                      this.$router.push({ name: 'teacher_detail', params: {id: params.row.teacherId}});
                    }
                  }
                }, '详情'),
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                    display:'none'
                  },
                  class:'addTemplate',
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.$Modal.confirm ({
                        title: '删除',
                        content: '是否确定删除该老师？',
                        onOk: function () {
                          // 发请求删除该条数据
                        }
                      })
                    }
                  }
                }, '删除'),
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                    display:'none'
                  },
                  class:'addTemplate',
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                    }
                  }
                }, '操作轨迹')
              ]);
            }
          }*/
        ],
        data1: [],
        searchType: 1,
        currentInfo: {},
        //分页
        total:0,  //总数
        pageNumber:1,  //当前页数
        pageSize:20,
        data2 : []
      }
    },
    computed: {
      levelData () {
        let data3 = []
        function pushBranch(obj,level) {
          data3.push({id:obj.id, name:obj.name, level:level})
          if(!obj.children.length){
            return
          }
          obj.children.map(function (item, index) {
            pushBranch(item, level+1)
          })
        }
        this.data2.map((item,index) => {
          pushBranch(item, 1)
        })
        return data3
      },
      fuzzySearchString () {
        let search = {
          pageNo: this.pageNumber-1 || 0,
          pageSize: this.pageSize || 20,
          searchString: this.searchInfo
        }
        return `searchString=${search.searchString}&pageNo=${search.pageNo}&pageSize=${search.pageSize}`
      },
      fuzzySearchStringPage () {
        let search = {
          pageNo: this.pageNumber-1 || 0,
          pageSize: this.pageSize || 20,
          searchString: this.currentInfo
        }
        return `searchString=${search.searchString}&pageNo=${search.pageNo}&pageSize=${search.pageSize}`
      },
      searchString () {
        let form = this.formItem
        let search = {
          pageNo: this.pageNumber-1 || 0,
          pageSize: this.pageSize || 20,
          institute: form.department,
          gender: form.gender,
          state: form.status,
          attr: form.property,
          level: form.level,
          major: form.major,
          minor: form.minor
        };
        let string1 = Object.keys(search).map((item,index) => {
          if(search[item]){
            return item + '=' + search[item]
          }
        }).filter((item,index)=>{
          return item
        })
        return string1.join('&')
      },
      searchStringPage () {
        let form = this.currentInfo
        let search = {
          pageNo: this.pageNumber-1 || 0,
          pageSize: this.pageSize || 20,
          institute: form.department,
          gender: form.gender,
          state: form.status,
          attr: form.property,
          level: form.level,
          major: form.major,
          minor: form.minor
        };
        let string1 = Object.keys(search).map((item,index) => {
          if(search[item]){
            return item + '=' + search[item]
          }
        }).filter((item,index)=>{
          return item
        })
        return string1.join('&')
      }
    },
    methods: {
      addTeacher () {
        this.$router.push({ name: 'teacher_add_index'});
      },
      changePage (page) {
        this.pageNumber = page;
        this.searchPage(this.searchType);
      },
      // 通过查询搜索
      search (type) {
        //console.log(this.searchString, this.fuzzySearchString)
        // 修改当前的查询规则
        this.pageNumber = 1;
        if(type){// 1是条件查询 0是模糊查询
          this.currentInfo = this.formItem
          this.$http({
            method:'get',
            //url:this.$store.state.app.baseUrl + 'dossier/search?'+ this.searchString,
            url: 'http://192.168.65.250:8088/dossier/search?'+ this.searchString,
            headers: {'Content-type': 'application/json'}
          })
            .then((res)=> {
              console.log(res)
              if(res.data.code == 0 ){
                this.data1 = res.data.value.pageList || [];
                this.total = res.data.value.total || 0;
                this.searchType = 1
              }else{
                this.$Message.error(res.data.message)
              }
            })
            .catch((error)=> {
              this.$Message.error('网络错误')
            })
        }else{
          this.currentInfo = this.searchInfo
          this.$http({
            method:'get',
            //url:this.$store.state.app.baseUrl + 'dossier/search?'+ this.searchString,
            url: 'http://192.168.65.250:8088/dossier/fuzzysearch?'+ this.fuzzySearchString,
            headers: {'Content-type': 'application/json'}
          })
            .then((res)=> {
              //console.log(res)
              if(res.data.code == 0 ){
                this.data1 = res.data.value.pageList || [];
                this.total = res.data.value.total || 0;
                this.searchType = 0
              }else {
                this.$Message.error(res.data.message)
              }
            })
            .catch((error)=> {
              this.$Message.error('网络错误')
            })
        }

      },
      // 通过分页搜索
      searchPage (type) {
        // 分页的搜索 需要页数，用当前的搜索数据
        if(type){
          this.$http({
            method:'get',
            //url:this.$store.state.app.baseUrl + 'dossier/search?'+ this.searchString,
            url: 'http://192.168.65.250:8088/dossier/search?'+ this.searchStringPage,
            headers: {'Content-type': 'application/json'}
          })
            .then((res)=> {
              console.log(res)
              if(res.data.code == 0 ){
                this.data1 = res.data.value.pageList || [];
                this.total = res.data.value.total || 0;
                this.searchType = 1
              }else {
                this.$Message.error(res.data.message)
              }
            })
            .catch((error)=> {
              this.$Message.error('网络错误')
            })
        }else{
          this.$http({
            method:'get',
            //url:this.$store.state.app.baseUrl + 'dossier/search?'+ this.searchString,
            url: 'http://192.168.65.250:8088/dossier/fuzzysearch?'+ this.fuzzySearchStringPage,
            headers: {'Content-type': 'application/json'}
          })
            .then((res)=> {
              console.log(res)
              if(res.data.code == 0 ){
                this.data1 = res.data.value.pageList || [];
                this.total = res.data.value.total || 0;
                this.searchType = 0
              }else {
                this.$Message.error(res.data.message)
              }
            })
            .catch((error)=> {
              this.$Message.error('网络错误')
            })
          }
      },
      setStatus (id, status) {
        this.$http({
          method:'get',
          url:this.$store.state.app.baseUrl + `class/resource/updateQuestionStatus?questionId=${id}&status=${!status}`,
          data: this.searchData,
          headers: {'Content-type': 'application/json'}
        })
          .then((res)=> {
            if(res.data.code == 0 ){
              this.data1 = res.data.data;
              this.total = res.data.totalCount;
            }else {
              this.$Message.error(res.data.message)
            }
          })
          .catch((error)=> {
            this.$Message.error('网络错误')
          })
      }
    },
    mounted () {
      // 主修、辅修的多级列表
      this.$http({
        method:'get',
        //url:this.$store.state.app.baseUrl + 'dossier/search?'+ this.searchString,
        url: 'http://192.168.65.250:8088/dossier/category',
        headers: {'Content-type': 'application/json'}
      })
        .then((res)=> {
          console.log(res)
          if(res.data.code == 0 ){
            this.data2 = res.data.value
          }else {
            this.$Message.error(res.data.message)
          }
        })
        .catch((error)=> {
          this.$Message.error('网络错误')
        })
      //this.search(1)
    }
  }
</script>

<style>

</style>
