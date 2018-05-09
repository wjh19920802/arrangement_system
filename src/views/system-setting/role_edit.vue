<template>
    <div>
        <Card>
            <div class="title">
                <p>修改角色默认权限</p>
            </div>
            <Form :label-width="100">

                <FormItem label="角色名称" prop="username">
                    <Input v-model="roleName" readonly disabled style="width:40%"></Input>
                </FormItem>
                <FormItem label="权限设置" prop="auth">
                    <div style="border: 1px solid #f0f0f0">
                        <Tree :data="menuListTree" show-checkbox ref="menuTree"></Tree>
                    </div>
                    <span style="color: red; font-size: 12px">* 请慎重修改权限！</span>
                </FormItem>

                <!--<FormItem label="选择角色" prop="realname">
                    <Select v-model="" style="width:40%">
                       <Option v-for="i in rolesList" :value="i.code" :key="i.code">{{ i.name }}</Option>
                    </Select>
                </FormItem>-->
                <!--<FormItem label="管辖地区" prop="province">
                  <Select multiple v-model="formItem.province" :select="formItem.province">
                    &lt;!&ndash;<Option value="">全国</Option>&ndash;&gt;
                    <Option :value="item.areaid" v-for="item,index in provinces" :key="index">{{item.name}}</Option>
                  </Select>
                </FormItem>-->
                <FormItem>
                    <Button type="primary" @click="save">提交</Button>
                    <Button type="ghost" @click="back">返回</Button>
                </FormItem>
            </Form>
        </Card>
    </div>
</template>

<script>
  export default {
    data () {
      return {
        menuList: [],
        menuChosenList: [],
      }
    },
    computed: {
      roleId () {
        return this.$route.query.id
      },
      roleName () {
        return this.$route.query.role
      },
      menuListTree () {
        let that = this
        function getTree1(tree) {
          let arr = [];
          if (!!tree && tree.length !== 0) {
            tree.forEach(item => {
              let obj = {};
              obj.title = item.permissionName;
              //obj.attr = item.attr; // 其他你想要添加的属性
              obj.expand = false;
              obj.checked = that.menuChosenList.indexOf(item.id)>=0 ? true : false;
              obj.selected = false;
              obj.children = getTree1(item.menus); // 递归调用
              obj.id = item.id
              arr.push(obj);
            });
          }
          return arr;
        }
        return getTree1(this.menuList)
      },
      menuChosenLast () {
        let menuArr = []
        this.$refs.menuTree.getCheckedNodes().map((item,index)=>{
          console.log(item)
          if(!item.children.length){
            menuArr.push(item.id)
          }
        })
        return menuArr
      },
    },
    methods: {
      save () {
        if(this.menuChosenLast.length == 0){
          this.$Modal.confirm({
            title: '提醒',
            content: '当前未选择任何权限，是否确认修改?',
            onOk: () => {
              this.$http({
                method:'post',
                url:this.$store.state.app.baseUrl + `/sysPermission/setRoleDefaultPermission`,
                data: {
                  roleId: this.roleId,
                  permissionIds: this.menuChosenLast,
                },
                headers: {'Content-type': 'application/json'}
              })
                .then((res)=>{
                  console.log(res.data.data)
                  if(res.data.code == 0 ){
                    this.$Message.success('提交成功！');
                  }else{
                    this.$Message.error(res.data.message);
                  }
                })
                .catch((error)=>{
                  this.$Message.error(error.message)
                })
            }
          })
        }else{
          this.$http({
            method:'post',
            url:this.$store.state.app.baseUrl + `/sysPermission/setRoleDefaultPermission`,
            data: {
              roleId: this.roleId,
              permissionIds: this.menuChosenLast,
            },
            headers: {'Content-type': 'application/json'}
          })
            .then((res)=>{
              console.log(res.data.data)
              if(res.data.code == 0 ){
                this.$Message.success('提交成功！');
              }else{
                this.$Message.error(res.data.message);
              }
            })
            .catch((error)=>{
              this.$Message.error(error.message)
            })
        }
      },
      back () {
        this.$router.go(-1)
      },
      getRoleMenu () {
        this.$http({
          method:'get',
          url:this.$store.state.app.baseUrl + 'menu/findByRoleId?roleId='+this.roleId,
          headers: {'Content-type': 'application/json'}
        })
          .then((res)=>{
            console.log(res.data.data)
            if(res.data.code == 0 ){
              this.menuList = res.data.data.menuTree
              this.menuChosenList = res.data.data.defaultPermissionIds
            }else{
              this.$Message.error(res.data.message);
            }
          })
          .catch((error)=>{
            this.$Message.error(error.message)
          })
      }
    },
    mounted () {
      this.getRoleMenu()
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
    .ivu-tree{
        margin: 18px 36px;
        li{
            margin: 0 0!important;
        }
    }
</style>
