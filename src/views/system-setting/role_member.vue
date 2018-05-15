<template>
    <div>
        <Row>
            <Col span="24">
            <Card>
                <div class="title">
                    <p>筛选</p>
                </div>
                <Form :model="formItem" :label-width="80">
                    <Row>
                        <Col span="6">
                        <FormItem label="用户信息" prop="name">
                            <Input v-model="formItem.name" placeholder=""></Input>
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="角色" prop="role">
                            <Select v-model="formItem.role" :select="formItem.role" @on-change="getMenuList">
                                <Option value="">请选择</Option>
                                <Option v-for="r,index in roleList" :key="index" :value="r.id">{{r.roleName}}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="状态" prop="status">
                            <Select v-model="formItem.status" :select="formItem.status">
                                <Option value="">请选择</Option>
                                <Option value="1">启用</Option>
                                <Option value="0">禁用</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="4">
                        <FormItem>
                            <Button type="primary" @click="search">查询</Button>
                        </FormItem>
                        </Col>
                    </Row>

                </Form>
            </Card>
            <Card class="margin-top-10">
                <div class="title">
                    <p>用户列表</p>
                </div>
                <Table border ref="paperTable" :columns="columns" :data="data1" ></Table>
            </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
  export default {
    data () {
      return {
        roleList: [],
        formItem: {
          name: '',
          role: '',
          status: ''
        },
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },{
            title: 'ID',
            align: 'center',
            key: 'id',
            sortable: true
          },{
            title: 'IS账号',
            align: 'center',
            key: 'isName',
            sortable: true
          },{
            title: '姓名',
            align: 'center',
            key: 'realName',
            sortable: true
          },{
            title: '角色',
            align: 'center',
            key: 'roleName',
          },{
            title: '状态',
            align: 'center',
            key: 'status',
            render: (h,params)=> {
              return params.row.status? '已启用' : '已禁用'
            }
          },{
            title: '操作',
            align: 'center',
            key: 'operate',
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
                      this.$router.push({
                        name: 'user_edit',
                        params: {id:params.row.isName}
                      });
                    }
                  }
                }, '修改权限'),
                params.row.status ?
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.setStatus(params.row.id, false)
                    }
                  }
                }, '禁用') :
                  h('Button', {
                    props: {
                      type: 'success',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.setStatus(params.row.id, true)
                      }
                    }
                  }, '启用')
              ]);
            }
          }],
        data1: []
      }
    },
    computed: {
      searchData () {
        let form = this.formItem
        return {
          pageNumber: this.pageNumber || 1,
          pageSize: this.pageSize || 20,
          userParm: form.name,
          roleId: form.role,
          status: form.status,
        }
      },
      searchDataPage () {
        let form = this.currentInfo
        return {
          pageNumber: this.pageNumber || 1,
          pageSize: this.pageSize || 20,
          userParm: form.name,
          roleId: form.role,
          status: form.status,
        }
      }
    },
    methods: {
      getRoleList () {
        this.$http({
          method:'get',
          url:this.$store.state.app.baseUrl + 'sysPermission/findAllRoles',
          headers: {'Content-type': 'application/json'}
        })
          .then((res)=> {
          //console.log(res, '获得角色列表')
          if(res.data.code==0){
            this.roleList = res.data.data
          }else {
            this.$Message.error(res.data.message)
          }
          })
        .catch((error)=> {
          this.$Message.error(error.message)
        })
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
          method:'post',
          url:this.$store.state.app.baseUrl + 'sysPermission/user',
          data: this.searchData,
          headers: {'Content-type': 'application/json'}
        })
          .then((res)=> {
          if(res.data.code == 0 ){
            this.data1 = res.data.data.content || [];
            this.total = res.data.total;
          }else{
            this.$Message.error(res.data.message);
          }
        })
      .catch((error)=> {
          this.$Message.error(error.message)
        })
      },
      searchPage () {
        this.$http({
          method:'post',
          url:this.$store.state.app.baseUrl + 'sysPermission/user',
          data: this.searchDataPage,
          headers: {'Content-type': 'application/json'}
        })
          .then((res)=> {
          if(res.data.code == 0 ){
            this.data1 = res.data.data.content || [];
            this.total = res.data.total;
          }else{
            this.$Message.error(res.data.message);
          }
        })
      .catch((error)=> {
          this.$Message.error(error.message)
        })
      },
      setStatus (id, status) {
        this.$http({
          method:'put',
          url:this.$store.state.app.baseUrl + `sysPermission/user/${id}?status=${status}`,
          headers: {'Content-type': 'application/json'}
        })
          .then((res)=> {
          if(res.data.code==0){
            this.$Message.success('更新成功')
            this.searchPage()
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
      this.getRoleList()
      this.search()
    }
  }
</script>

<style>

</style>
