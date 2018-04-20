<template>
    <div>
        <Row>
            <Col span="24">
            <Card>
                <div class="title">
                    <p>筛选</p>
                </div>
                <Form :model="formItem" :label-width="100">
                    <Row>
                        <Col span="5">
                        <FormItem label="角色名称" prop="name">
                            <Input v-model="formItem.name" placeholder=""></Input>
                        </FormItem>
                        </Col>
                        <Col span="5">
                        <FormItem label="省份" prop="province">
                            <Input v-model="formItem.province" placeholder=""></Input>
                        </FormItem>
                        </Col>
                        <Col span="5">
                        <FormItem label="用户名" prop="username">
                            <Input v-model="formItem.username" placeholder=""></Input>
                        </FormItem>
                        </Col>
                        <Col span="5">
                        <FormItem label="真实姓名" prop="realname">
                            <Input v-model="formItem.realname" placeholder=""></Input>
                        </FormItem>
                        </Col>
                        <Col span="4">
                        <FormItem>
                            <Button type="primary">查询</Button>
                        </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Card>
            <Card class="margin-top-10">
                <div class="title">
                    <p>角色人员列表</p>
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
        formItem: {
          name: '',
          province: '',
          username: '',
          realname: '',
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
            title: '姓名',
            align: 'center',
            key: 'realname',
            sortable: true
          },{
            title: '审批角色',
            align: 'center',
            key: 'role',
          },{
            title: '省份',
            align: 'center',
            key: 'province',
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
                        name: 'role_edit'
                      });
                    }
                  }
                }, '修改权限'),
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
                      this.show(params.index)
                    }
                  }
                }, '删除')
              ]);
            }
          }],
        data1: [{
          id: '127',
          realname: '星期三',
          role: '管理员',
          province: ['北京','天津'],
          status: 0
        },]
      }
    }
  }
</script>

<style>

</style>
