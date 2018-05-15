<template>
    <div>
      <Card>
        <Row>
          <Col span="24">
            <div class="title">
                <p>用户信息</p>
            </div>
            <Table border ref="paperTable" :columns="columns" :data="data1" ></Table>
          </Col>
        </Row>
      </Card>
      <Card class="margin-top-10">
        <div class="title">
          <p>设置</p>
        </div>
        <Form :model="formItem" ref="formItem" :label-width="80">
          <FormItem label="选择角色" prop="role">
            <Select v-model="formItem.role" :select="formItem.role" @on-change="getMenuList">
              <Option v-for="r,index in roleOptionList" :key="index" :value="r.id">{{r.roleName}}</Option>
            </Select>
          </FormItem>
          <FormItem label="菜单及功能" prop="menu">
            <div style="border: 1px solid #f0f0f0">
              <Tree :data="menuListTree" show-checkbox ref="menuTree"></Tree>
            </div>
          </FormItem>
          <FormItem label="管辖地区" prop="province">
            <!--<div style="border: 1px solid #f0f0f0">
              <Tree :data="areaListTree" show-checkbox ref="areaTree"></Tree>
            </div>-->
           <!-- <Button @click="allFirst">全部</Button>-->
            <CheckboxGroup v-model="areaChosenList">
            <span style="color: red; font-size: 12px" v-if="!areaList.length">* 首次加载较慢，请耐心等待</span>
            <table id="areaTable" border="1" width="100%" style="border-collapse:collapse;text-align: center;">
              <tr v-for="area in areaList">
                <td width="150">
                  <Checkbox :label="area.areaid">{{area.name}}</Checkbox>
                </td>
                <td class="area">
                  <div class="flex" v-for="secondArea in area.childrens">
                    <span class="secondArea">
                      <Checkbox :label="secondArea.areaid">{{secondArea.name}}</Checkbox>
                    </span>
                    <span class="thirdArea">
                      <span v-for="thirdArea in secondArea.childrens">
                        <Checkbox :label="thirdArea.areaid">{{thirdArea.name}}</Checkbox>
                      </span>
                    </span>
                  </div>
                </td>
              </tr>
            </table>
            </CheckboxGroup>

          </FormItem>
          <FormItem>
            <Button type="primary" @click="save">提交</Button>
          </FormItem>
        </Form>
      </Card>
    </div>
</template>

<script>
  export default {
      data () {
        return {
          userInfo: {},
          columns: [
            {
              title: 'ID',
              align: 'center',
              key: 'isName',
            },{
              title: '姓名',
              align: 'center',
              key: 'realName',
            },{
              title: '电话',
              align: 'center',
              key: 'tel',
            }],
          data1: [],
          formItem: {
            role: '',
          },
          roleList: [],
          menuList: [],
          menuChosenList: [],
          areaList: [],
          areaChosenList: []
      }
    },
    computed: {
      isname () {
        return this.$route.params.id
      },
      roleOptionList () {
        let roleArr = []
        if(this.roleList.length){
          this.roleList.map((item,index)=>{
            roleArr.push({
              id: item.id,
              roleName: item.roleName,
              status: item.status
            })
          })
        }
        return roleArr
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
      // 菜单最后生成的数组
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
      areaListTree () {
        let that = this
        /*let flag = 0
        switch (that.formItem.role) {
          case 1,3,5,9,10 :
            flag = 1; break;
          case 8 :
            flag = 2; break;
        }*/
        function getTree2(tree,level) {
          //flag = 2
          let arr = [];
          if (!!tree && tree.length !== 0) {
            tree.forEach(item => {
              let obj = {};
              obj.title = item.name;
              //obj.attr = item.attr; // 其他你想要添加的属性
              //obj.disabled = flag <= level ? true : false
              obj.expand = false;
              obj.checked = that.areaChosenList.indexOf(item.areaid)>=0 ? true : false;
              obj.selected = false;
              obj.children = getTree2(item.childrens,level+1); // 递归调用
              arr.push(obj);
            });
          }
          return arr;
        }
        return getTree2(this.areaList,1)
      },
      firstArr () {
        let firstArr = []
        this.areaList.map((item,index)=>{
          firstArr.push(item.areaid)
        })
        return firstArr
      }
    },
    methods: {
      // 1、 搜索is账号
      search () {
        this.$http({
          method:'get',
          url:this.$store.state.app.baseUrl + 'sysPermission/userPermission?isName='+this.isname,
          headers: {'Content-type': 'application/json'}
        })
          .then((res)=> {
            //console.log(res, '搜索is账户')
            if(res.data.code==0){
              this.initSetting()
              this.data1 = [res.data.data.sysUser]
              this.userInfo = res.data.data
              this.areaChosenList = res.data.data.deptIds
              this.menuChosenList = res.data.data.permissionIds
              this.formItem.role = res.data.data.roleIds[0]
            }else {
              this.$Message.error(res.data.message)
            }

          })
          .catch((error)=> {
            this.$Message.error(error.message)
          })
      },
      initSetting () {
        this.menuList = []
        this.getRoleList()
      },
      // 2、获取角色列表
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
              this.getMenuList()
            }else {
              this.$Message.error(res.data.message)
            }

          })
          .catch((error)=> {
            this.$Message.error(error.message)
          })
      },
      getMenuList () {
        console.log(this.formItem.role)
        if(this.formItem.role){
          this.$http({
            method:'get',
            url:this.$store.state.app.baseUrl + 'menu/findByRoleId?roleId='+this.formItem.role,
            headers: {'Content-type': 'application/json'}
          })
            .then((res)=>{
              //console.log(res.data.data)
              if(res.data.code == 0 ){
                this.menuList = res.data.data.menuTree
                if(this.formItem.role == this.userInfo.roleIds[0]){
                  this.menuChosenList = this.userInfo.permissionIds
                }else{
                  this.menuChosenList = res.data.data.defaultPermissionIds
                }
                this.getAreaList()
              }else{
                this.$Message.error(res.data.message);
              }
            })
            .catch((error)=>{
              this.$Message.error(error.message)
            })
        }
      },
      getAreaList () {
        console.log(new Date().getTime())
        this.$http({
          method:'get',
          url:this.$store.state.app.baseUrl + 'area/studyCenterTree',
          headers: {'Content-type': 'application/json'}
        })
          .then((res)=> {
            //console.log(res,'地区数据')
            this.areaListAll = res.data.data;
            this.areaList = this.areaListAll
          })
          .catch((error)=> {
            this.$Message.error(error.message)
          })
      },
      save () {
        if(!this.formItem.role){
          this.$Message.error('请选择至少一个角色！')
          return
        }
        if(!this.areaChosenList.length){
          this.$Message.error('所选地区不能为空！')
          return
        }
        //console.log(this.menuChosenLast)
        //console.log(this.$refs.menuTree.flatState)
        this.$http({
          method:'post',
          url:this.$store.state.app.baseUrl + `sysPermission/updateUserPermission?isName=${this.data1[0].isName === null ? '' : this.data1[0].isName}&roleId=${this.formItem.role}`,
          data: {
            deptIds: this.areaChosenList,
            permissionIds: this.menuChosenLast,
            sysUser: this.userInfo.sysUser
          },
          headers: {'Content-type': 'application/json'}
        })
          .then((res)=>{
            //console.log(res.data.data)
            if(res.data.code == 0 ){
              this.$Message.success('提交成功！');
            }else{
              this.$Message.error(res.data.message);
            }
          })
          .catch((error)=>{
            this.$Message.error(error.message)
          })
      },
    },
    mounted () {
      this.search()
      //this.getMenuList()
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  #areaTable{
    border: 1px solid #f0f0f0;
    td {
      border: 1px solid #f0f0f0;
      font-size: 12px;
      .ivu-select-selection{
        border: transparent!important;
      }
    }
    .area{
      div{
        border-bottom: 1px solid #f0f0f0;
      }
    }
    .secondArea{
      flex:1;
    }
    .thirdArea{
      flex:3;
    }
  }
  .ivu-tree{
    margin: 18px 36px;
    li{
      margin: 0 0!important;
    }
  }
</style>
