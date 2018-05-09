<template>
    <div>
        <Card>
            <div class="title">
                <p>角色列表</p>
            </div>
            <Table border ref="selection" :columns="columns" :data="data1"></Table>
        </Card>
    </div>
</template>

<script>
  import Cookies from 'js-cookie'
  export default {
    data () {
      return {
        columns: [
          {
            title: '角色类型',
            key: 'roleName',
            align: 'center',
          },
          {
            title: '创建人',
            key: 'creater',
            align: 'center',
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            render: (h, params) => {
            return h('div',
              [h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                  this.$router.push({ name: 'role_edit', query: { id:params.row.id, role: params.row.roleName}})
              }
          }
      }, '编辑')
        /*h('Button', {
         props: {
         type: 'primary',
         size: 'small'
         },
         style: {
         marginRight: '5px'
         },
         on: {
         click: () => {
         this.$router.push({ name: 'role_member', query: { access:params.row.rId}})
         }
         }
         }, '成员管理')*/
    ])
    }
    }
    ],
      data1: []
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
          if(res.data.code==0){
            this.data1 = res.data.data
          }else {
            this.$Message.error(res.data.message)
          }
      })
      .catch((error)=> {
          this.$Message.error(error.message)
      })
      }
    },
    mounted () {
      this.getRoleList()
    },
  }
</script>

<style>

</style>
