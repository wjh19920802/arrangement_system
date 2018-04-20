<template>
    <div>
        <Card>
            <div class="title">权限更改</div>
            <div>当前权限值为 {{accessCode}}</div>
            <Table border ref="selection" :columns="columns4" :data="data1"></Table>
        </Card>
    </div>
</template>

<script>
  import Cookies from 'js-cookie';
  export default {
    data () {
      return {
        accessCode: 0,
        columns4: [
          {
            title: '角色类型',
            key: 'role'
          },
          {
            title: '权限数值',
            key: 'code'
          },
          {
            title: '操作',
            key: 'action',
            render: (h, params) => {
              if(this.accessCode == params.row.code){
                return h('div', [ h('Button', {
                  props: {
                    type: 'success',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                }, '当前权限')])
              }else{
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
                        this.setAccess(params.row.code)
                      }
                    }
                  }, '设为当前权限')])
              }
            }
          }
        ],
        data1: [
          {
            role: '超级管理员',
            code: 0,
          },
          {
            role: '预留',
            code: 1,
          },
          {
            role: '课程研发管理员',
            code: 2,
          },
          {
            role: '课程研发',
            code: 3,
          },
          {
            role: '研究院管理员',
            code: 4,
          },
          {
            role: '研究院',
            code: 5,
          },
          {
            role: '分校管理员',
            code: 6,
          },
          {
            role: '分校',
            code: 7,
          }
        ]
      }
    },
    methods: {
      handleSelectAll (status) {
        this.$refs.selection.selectAll(status);
      },
      setAccess (code) {
        this.accessCode = code
        Cookies.set('access', code);
        this.$store.commit('changeMenulist');
        this.$store.commit('updateMenulist');
      }
    },
    created () {
      this.accessCode = Cookies.get('access')
    }
  }
</script>

<style>

</style>
