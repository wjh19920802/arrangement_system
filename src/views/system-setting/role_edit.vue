<template>
    <div>
        <Card>
            <div class="title">修改权限</div>
            <Form :model="formItem" :label-width="100">
                <FormItem label="用户名" prop="username">
                    {{info.username}}
                    <input type="hidden" v-model="formItem.username">
                </FormItem>
                <FormItem label="真实姓名" prop="realname">
                    {{info.realname}}
                    <input type="hidden" v-model="formItem.realname">
                </FormItem>
                <FormItem label="选择角色" prop="realname">
                    <Select v-model="info.role" style="width:200px">
                       <Option v-for="i in roles" :value="i.code" :key="i.code">{{ i.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="菜单及功能" prop="province">
                  <div style="border: 1px solid #f0f0f0">
                    <Tree :data="menuListTree" show-checkbox ref="menuTree"></Tree>
                  </div>
                  <!--<table id="functionTable" border="1" width="100%" style="border-collapse:collapse;text-align: center;">
                    <tr v-for="area in areaList">
                      <td width="150">
                        <Checkbox>{{area.name}}</Checkbox>
                      </td>
                      <td>
                        <div class="flex" v-for="secondArea in area.childrens">
                          <td class="secondArea">
                            <Checkbox>{{secondArea.name}}</Checkbox>
                          </td>
                          <td class="thirdArea">
                            <span v-for="thirdArea in secondArea.childrens">
                              <Checkbox>{{thirdArea.name}}</Checkbox>
                            </span>
                          </td>
                        </div>
                      </td>
                    </tr>
                  </table>-->
                </FormItem>
                <FormItem label="管辖地区" prop="province">
                  <div style="border: 1px solid #f0f0f0">
                    <Tree :data="areaListTree" show-checkbox ref="areaTree"></Tree>
                  </div>
                  <table id="areaTable" border="1" width="100%" style="border-collapse:collapse;text-align: center;">
                    <tr v-for="area in areaList">
                      <td width="150">
                        <Checkbox>{{area.name}}</Checkbox>
                      </td>
                      <td>
                        <div class="flex" v-for="secondArea in area.childrens">
                          <td class="secondArea">
                            <Checkbox>{{secondArea.name}}</Checkbox>
                          </td>
                          <td class="thirdArea">
                            <span v-for="thirdArea in secondArea.childrens">
                              <Checkbox>{{thirdArea.name}}</Checkbox>
                            </span>
                          </td>
                        </div>
                      </td>
                    </tr>
                  </table>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="save">保存</Button>
                    <!--<Button type="ghost" style="margin-left: 8px">重置</Button>-->
                </FormItem>
            </Form>
        </Card>
    </div>
</template>

<script>
  import area from './area.json'
  export default {
    data () {
      return {
        formItem: {
          username: '',
          realname: '',
          role: ''
        },
        roles: [{
          code: 0,
          name: '管理员'
        }],
        info: {
          username: '星期五',
          realname: '王祖贤',
          role: '',
          province: []
        },
        // 地区数据
        menuList: [],
        menuChosenList: [5,6],
        areaList: area.data
      }
    },
    computed: {
      menuListTree () {
        let that = this
        function getTree(tree) {
          let arr = [];
          if (!!tree && tree.length !== 0) {
            tree.forEach(item => {
              console.log(that.menuChosenList.indexOf(item.id))
              let obj = {};
              obj.title = item.permissionName;
              //obj.attr = item.attr; // 其他你想要添加的属性
              obj.expand = false;
              obj.checked = that.menuChosenList.indexOf(item.id)>=0 ? true : false;
              obj.selected = false;
              obj.children = getTree(item.menus); // 递归调用
              arr.push(obj);
            });
          }
          return arr;
        }
        return getTree(this.menuList)
      },
      areaListTree () {
        function getTree(tree) {
          let arr = [];
          if (!!tree && tree.length !== 0) {
            tree.forEach(item => {
              let obj = {};
              obj.title = item.name;
              //obj.attr = item.attr; // 其他你想要添加的属性
              obj.expand = false;
              obj.selected = false;
              obj.children = getTree(item.childrens); // 递归调用
              arr.push(obj);
            });
          }
          return arr;
        }
        return getTree(this.areaList)
      }
    },
    methods: {
      getMenuList () {
        this.$http({
          method:'get',
          url:this.$store.state.app.baseUrl + 'menu/findAll',
          headers: {'Content-type': 'application/json'}
        })
          .then((res)=>{
            console.log(res.data.data)
            if(res.data.code == 0 ){
              this.menuList = res.data.data
            }else{
              this.$Message.error(res.data.message);
            }
          })
          .catch((error)=>{
            this.$Message.error('网络错误！')
          })
      },
      save () {
        console.log(this.$refs.menuTree.getCheckedNodes())
        console.log(this.$refs.areaTree.getCheckedNodes())
      }
    },
    mounted () {
      console.log(area.data)
      this.getMenuList()
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
