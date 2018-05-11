<template>
    <Card id="template_manage">
        <p slot="title">
            <Icon type="pinpoint"></Icon>
            母版列表
        </p>
        <table id="template_table" border="1" width="100%" style="border-collapse:collapse;text-align: center;">
            <tr>
                <th v-for="item in tableHeadData">{{item.value}}</th>
            </tr>
            <tr v-for="item in templateData">
                <td>{{item.classCode}}</td>
                <td>{{item.classType==1?'组合班次':'非组合班次'}}</td>
                <td>{{item.classSeries?item.classSeries.classSeriesName:''}}</td>
                <td>{{item.rootDirectoryName}}</td>
                <td>{{item.classHour}}</td>
                <td>
                  <div v-for="i in item.categorys">
                    {{i.categoryName}}
                  </div>
                </td>
                <td>{{item.schoolBeginsTime | formateDate}}</td>
                <td>{{item.openClassTime}}</td>
                <td>{{item.projectTag}}</td>
                <td>
                  <div v-for="item2 in item.priceInfoArray">{{item2.agreement + '班-' + item2.price + '-' + item2.stay  + (item2.writtenTf?'-笔试不过退费:'+item2.writtenTf:'') + (item2.interviewTf?'-面试不过退费:'+item2.interviewTf:'')}}&nbsp;&nbsp;</div>
                </td>
                <td>{{item.dayOfRest}}</td>
                <td>{{item.interviewGroupNumber}}</td>
                <td>
                    <!--<div  v-for="item2 in item.classHourPlans">{{item2.classHourDetail}}</div>-->
                    <div v-for="item2 in item.classHourPlans">{{item2.categoryName + ':' + item2.day + '天' + item2.night + '晚'}}</div>
                </td>
                <td>
                    <Button type="success" size="small" v-show="item.isShow">已启用</Button>
                    <Button type="error" size="small" v-show="!item.isShow">已禁用</Button>
                </td>
                <td>
                    <span v-if="!item.isShow" class="operate"  @click="enable(item)">启用</span>
                    <span v-if="item.isShow" class="operate"  @click="disable(item)">禁用</span>

                    <span v-if="item.classType == '组合班次'" class="operate" @click="showChild(item.courseModelId)">查看子班次</span>
                </td>
                <td style="padding: 5px;">
                  <span class="operate" @click="showProvinces(item.provinceIdList)">查看</span>
                </td>
                <td>
                  <div class="operate" @click="changeProvince(item.id,provinceIdList)">
                    确定
                  </div>
                </td>
            </tr>
        </table>
        <Modal
                v-model="modal1"
                title="子班次"
                class="childrenModal"
                width="1000px"
        >
            <table id="children_table" border="1" width="100%" style="border-collapse:collapse;text-align: center;">
                <tr>
                <th v-for="item in childrenHeadData">{{item.value}}</th>
            </tr>
                <tr v-for="item in childrenData">
                <td>{{item.classCode}}</td>
                <td>{{item.classType==1?'组合班次':'非组合班次'}}</td>
                <td>{{item.classSeries.classSeriesName}}</td>
                <td>{{item.rootDirectoryName}}</td>
                <td>{{item.classHour}}</td>
                <td>
                  <div v-for="i in item.categoryName.split(',')">
                    {{i}}
                  </div>
                </td>
                <td>{{item.schoolBeginsTime  | formateDate}}</td>
                <td>{{item.openClassTime}}</td>
                <td>{{item.projectTag}}</td>
                <td>
                  <div v-for="item2 in item.coursePrice.split(',')">{{item2}}&nbsp;&nbsp;</div>
                </td>
                <td>{{item.dayOfRest}}</td>
                <td>{{item.interviewGroupNumber}}</td>
                <td>
                  <div v-for="item2 in item.classHourPlans">{{item2.categoryName + ':' + item2.day + '天' + item2.night + '晚'}}</div>
                </td>
            </tr>
            </table>
        </Modal>
        <Modal v-model="provinceNotice" title="提示" width="500px" @on-ok="ok">
          <h3>确定修改适用省份吗？</h3>
        </Modal>
        <Modal v-model="showProvinceList" title="提示" width="500px">
          <Select v-model="provinceIdList" multiple @on-change="change">
            <Option v-for="item2 in provinces" :value="item2.id" :key="item2.id">{{item2.cityName}}</Option>
          </Select>
        </Modal>
      <Page :total="total" :current="pageNumber" :page-size="pageSize" @on-change="changePage" show-total style="text-align: center;margin-top: 10px;"></Page>
    </Card>
</template>

<script>
  import Util from '../../libs/util'
  export default {
        name: "template_manage",
        data(){
            return{
                modal1:false,
                provinceNotice:false,
                showProvinceList:false,
                currentId:-1,
                provinceIdList:[],
                tableHeadData:[
                    {
                      name:'classCode',
                      value:'班级编码'
                    },
                    {
                      name:'classType',
                      value:'班级类型'
                    },
                    {
                      name:'classSeriesId',
                      value:'班级系列'
                    },
                    {
                      name:'rootDirectoryName',
                      value:'根目录'
                    },
                    {
                      name:'classHour',
                      value:'课时'
                    },
                    {
                      name:'categoryIds',
                      value:'科目'
                    },
                    {
                      name:'schoolBeginsTime',
                      value:'预计开课日期'
                    },
                    {
                      name:'openClassTime',
                      value:'开班时间'
                    },
                    {
                      name:'projectTag',
                      value:'项目'
                    },
                    {
                      name:'coursePrice',
                      value:'价格'
                    },
                    {
                      name:'dayOfRest',
                      value:'休息时间'
                    },
                    {
                      name:'interviewGroupNumber',
                      value:'分组人数（面试）'
                    },
                    {
                      name:'classHourDetail',
                      value:'课时规划'
                    },
                    {
                      name:'checkStates',
                      value:'状态'
                    },
                    {
                      name:'action',
                      value:'操作'
                    },
                    {
                      name:'provinceId',
                      value:'适用省份'
                    },{
                      name:'operate',
                      value:'操作'
                  }
                  ],
                templateData: [],
                childrenHeadData:[{name:'classCode',value:'班级编码'},
                    {name:'classType',value:'班级类型'},
                    {name:'classSeriesId',value:'班级系列'},
                    {name:'rootDirectoryName',value:'根目录'},
                    {name:'classHour',value:'课时'},
                    {name:'categoryIds',value:'科目'},
                    {name:'schoolBeginsTime',value:'预计开课日期'},
                    {name:'openClassTime',value:'开班时间'},
                    {name:'projectTag',value:'项目'},
                    {name:'priceInfoArray',value:'价格'},
                    {name:'dayOfRest',value:'休息时间'},
                    {name:'interviewGroupNumber',value:'分组人数（面试）'},
                    {name:'classHourDetail',value:'课时规划'}],
                childrenData: [],
                provinces: [],
                selectedProvince:'',
                total:0,
                pageNumber:1,
                pageSize:20,
            }
        },
        methods:{
            enable(item) {
              this.$http({
                method:'get',
                url:this.$store.state.app.baseUrl + 'courseModel/startorend',
                headers: {'Content-type': 'application/json'},
                params:{
                  courseModelId:item.id,
                  isShow:1
                }
              })
                .then((res)=>{
                  if(res.data.code == 0) {
                    item.isShow = 1;
                  }else {
                    this.$Message.error(res.data.message);
                  }
                })
            },
            disable(item) {
              this.$http({
                method:'get',
                url:this.$store.state.app.baseUrl + 'courseModel/startorend',
                headers: {'Content-type': 'application/json'},
                params:{
                  courseModelId:item.id,
                  isShow:0
                }
              })
                .then((res)=>{
                  if(res.data.code == 0) {
                    item.isShow = 0;
                  }else {
                    this.$Message.error(res.data.message);
                  }
                })
            },
            change () {
                console.log(this.templateData)
            },
            showChild (courseModelId) {  //查看子班次
                this.$http({
                    method:'post',
                    url:this.$store.state.app.baseUrl + 'courseModel/getSubCourses',
                    params:{
                        courseModelId:courseModelId
                    },
                    headers: {'Content-type': 'application/json'}
                })
                    .then((res)=>{
                        if(res.data.code == 0) {
                            this.childrenData = res.data.data.content;
                        }else {
                          this.$Message.error(res.data.message);
                        }
                    });
                this.modal1 = true;
            },
            changePage(page) {
              this.pageNumber = page;
              this.search();
            },
            search() {
              let data = {};
              data.checkStates = [7];
              data.pageSize = this.pageSize;
              data.pageNumber = this.pageNumber;
              this.$http({
                method:'post',
                url:this.$store.state.app.baseUrl + 'courseModel/query',
                headers: {'Content-type': 'application/json'},
                data:data
              })
                .then((res)=>{
                  if(res.data.code == 0) {
                    this.templateData = res.data.data==null?[]:res.data.data.content;
                    this.total = res.data.data==null?0:res.data.data.total;
                  }else {
                    this.$Message.error(res.data.message);
                  }
                })
            },
            changeProvince (courseModelId,provinceIdList) {
              this.currentId = courseModelId;
              this.provinceIdList = provinceIdList;
              this.provinceNotice = true;
            },
            ok () {
              this.$http({
                method:'post',
                url:this.$store.state.app.baseUrl + 'courseModel/updateVisualArea',
                headers: {'Content-type': 'application/json'},
                data:{
                  courseModelId:this.currentId,
                  provinceIdList:this.provinceIdList
                }
              })
                .then((res)=>{
                  if(res.data.code == 0) {
                    this.$Message.success('修改成功')
                    this.search();
                  }else {
                    this.$Message.error(res.data.message);
                  }
                })
            },
            showProvinces (provinceIdList) {
              this.provinceIdList = provinceIdList;
              this.showProvinceList = true;
            }
        },
        filters:{
          formateDate : function(timeStamp){
            if(timeStamp == '' || timeStamp == undefined){
              return '--'
            }else {
              let date = new Date(timeStamp);
              let Y = date.getFullYear() + '-';
              let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
              let D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate())
              return Y+M+D;
            }
          }
        },
        mounted() {
          this.search();
          this.$http({
            method:'get',
            url:this.$store.state.app.baseUrl + 'area/',
            headers: {'Content-type': 'application/json'}
          })
            .then((res)=>{
              if(res.data.code == 0) {
                this.provinces = res.data.data;
              }else {
                this.$Message.error(res.data.message);
              }
            })
        }
    }
</script>

<style lang="less">
    #template_manage {
        #template_table,#children_table {
            border: 1px solid #e9eaec;
            th{
              border: 1px solid #e9eaec;
              background-color: #f8f8f9;
              padding: 10px 5px;
            }
            td {
              border: 1px solid #e9eaec;
              max-width: 150px;
              font-size: 12px;
              .ivu-select-selection{
                border: transparent!important;
              }
            }
        }
        .template_page {
            margin-top: 20px;
            text-align: center;
        }
        .operate{
            color: #2d8cf0;
            margin: 0 3px;
            cursor: pointer;
        }
    }
</style>
