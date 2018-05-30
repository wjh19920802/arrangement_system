<template>
  <div>
    <Card>
      <p slot="title">
        <Icon type="pinpoint"></Icon>
        查询条件
      </p>
      <Form :model="formItem" :label-width="90">
        <Row>
          <Col span="12">
          <FormItem label="班级编码" prop="code">
            <Input v-model="formItem.classCode" placeholder=""></Input>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="课程名称" prop="courseName">
            <Input v-model="formItem.courseName" placeholder=""></Input>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
          <FormItem label="班级类型" prop="classType">
            <RadioGroup v-model="formItem.classType" type="button" size="small">
              <Radio label="">全部</Radio>
              <Radio label="1">组合班次</Radio>
              <Radio label="2">非组合班次</Radio>
            </RadioGroup>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="班级系列" prop="classSeries">
            <Select v-model="formItem.classSeriesId">
              <Option value="">请选择</Option>
              <Option v-for="item in classSeries" :key="item.id" :value="item.id">{{item.classSeriesName}}</Option>
            </Select>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <!--<Col span="12">
          <FormItem label="根目录" prop="rootDirectoryName">
              <Select v-model="formItem.rootDirectoryName">
                  <Option value="">请选择</Option>
                  <Option value="1">题海实战班</Option>
                  <Option value="2">讲练结合班</Option>
              </Select>
          </FormItem>
          </Col>-->
          <Col span="12">
          <FormItem label="项目类型" prop="projectId">
            <Select v-model="formItem.projectId">
              <Option value="">请选择</Option>
              <Option value="1">公务员（国考）</Option>
              <Option value="2">公务员（省考）</Option>
              <Option value="4">事业单位</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="母版可见省份" prop="userVisibleArea">
            <Select v-model="formItem.userVisibleArea" multiple>
              <Option v-for="item in provinces"  :key="item.id" :value="item.id">{{item.cityName}}</Option>
            </Select>
          </FormItem>
          </Col>
        </Row>
          <!--<Col span="12">-->
          <!--<FormItem label="课时" prop="classHour">-->
            <!--<InputNumber :min="1" v-model="formItem.day"></InputNumber> 天-->
            <!--<InputNumber :min="0" v-model="formItem.night"></InputNumber> 晚-->
          <!--</FormItem>-->
          <!--</Col>-->
          <!--<Col span="12">-->
          <!--<FormItem label="科目" prop="categoryNames">-->
            <!--<Select v-model="formItem.categoryNames" multiple>-->
              <!--<Option v-for="item in subjects" :value="item.categoryName" :key="item.value">{{ item.categoryName }}</Option>-->
            <!--</Select>-->
          <!--</FormItem>-->
          <!--</Col>-->
        <Row>
          <Col span="12">
          <FormItem label="预计开课时间">
            <Row>
              <Col span="24">
              <FormItem>
                <DatePicker type="date" placeholder="" v-model="formItem.schoolBeginsTime"></DatePicker>
              </FormItem>
              </Col>
              <!--<Col span="7" offset="1">-->
              <!--<Select v-model="formItem.moon">-->
                <!--<Option value="">请选择</Option>-->
                <!--<Option value="上午">上午</Option>-->
                <!--<Option value="下午">下午</Option>-->
              <!--</Select>-->
              <!--</Col>-->
            </Row>
          </FormItem>
          </Col>
          <!--<Col span="12">
          <FormItem label="项目" prop="projectTag">
            <RadioGroup v-model="formItem.projectTag" type="button" size="small">
              <Radio label="">全部</Radio>
              <Radio label="普通项目">普通</Radio>
              <Radio label="公开课">公开课</Radio>
              <Radio label="一对一项目">一对一</Radio>
            </RadioGroup>
          </FormItem>
          </Col>-->
          <Col span="12">
          <FormItem label="审核状态" prop="checkStates">
            <RadioGroup v-model="formItem.checkState" type="button" size="small">
              <Radio label="1">全部</Radio>
              <Radio label="2">已规划</Radio>
              <Radio label="3">待规划</Radio>
            </RadioGroup>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="1">
          <FormItem>
            <Button type="primary" @click="search">查询</Button>
            <!--<Button type="ghost" style="margin-left: 8px">重置</Button>-->
          </FormItem>
          </Col>
        </Row>
      </Form>
    </Card>
    <Card id="template_manage">
      <p slot="title">
        <Icon type="pinpoint"></Icon>
        母版列表
      </p>
      <table id="template_table" border="1" width="100%" style="border-collapse:collapse;text-align: center;">
        <tr>
          <th v-for="item in tableHeadData" :style="{width: item.width? item.width +'px' : 'auto'}">{{item.value}}</th>
        </tr>
        <tr v-for="item in templateData">
          <td>{{item.courseName}}</td>
          <td>{{item.classCode}}</td>
          <td>{{item.classType==1?'组合班次':'非组合班次'}}</td>
          <td>{{item.classSeries?item.classSeries.classSeriesName:'--'}}</td>
          <!--<td>{{item.rootDirectoryName}}</td>-->
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
            <td>{{item.courseName}}</td>
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
      <Modal v-model="showProvinceList" title="提示" width="500px" @on-ok="okProvince" @on-cancel="okProvince" >
        <Select v-model="provinceIdList" multiple @on-change="change">
          <Option value="-1">全选 <span style="color: #ff0000;font-size: 10px;">(第二次点击为全部取消)</span></Option>
          <Option v-for="item2 in provinces" :value="item2.id" :key="item2.id">{{item2.cityName}}</Option>
        </Select>
      </Modal>
      <Page :total="total" :current="pageNumber" :page-size="pageSize" @on-change="changePage" show-total style="text-align: center;margin-top: 10px;"></Page>
    </Card>
  </div>
</template>

<script>
  import Util from '../../libs/util'
  export default {
        name: "template_manage",
        data(){
            return{
                formItem: {
                  classCode: '',
                  courseName: '',
                  classType: '',
                  classSeriesId: '',
                  projectId: '',
                  classHour: '',
                  day: 0,
                  night: 0,
                  categoryNames: [],
                  schoolBeginsTime: '',
                  // moon: '',
                  projectTag: '',
                  checkState: 0,
                  userVisibleArea:[]
                },
                classSeries:[],
                modal1:false,
                provinceNotice:false,
                showProvinceList:false,
                currentId:-1,
                provinceIdList:[],
                tableHeadData:[
                    {
                      name:'courseName',
                      value:'课程名称'
                    },
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
                    // {
                    //   name:'rootDirectoryName',
                    //   value:'根目录'
                    // },
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
                      value:'休息时间',
                      width: 60
                    },
                    {
                      name:'interviewGroupNumber',
                      value:'分组人数（面试）',
                      width: 60
                    },
                    {
                      name:'classHourDetail',
                      value:'课时规划'
                    },
                    {
                      name:'checkStates',
                      value:'状态',
                      width: 60
                    },
                    {
                      name:'action',
                      value:'操作',
                      width: 60
                    },
                    {
                      name:'provinceId',
                      value:'适用省份',
                      width: 60
                    },{
                      name:'operate',
                      value:'操作',
                      width: 60
                    }
                  ],
                templateData: [],
                childrenHeadData:[
                    {name:'courseName',value:'课程名称'},
                    {name:'classCode',value:'班级编码'},
                    {name:'classType',value:'班级类型'},
                    {name:'classSeriesId',value:'班级系列'},
                    // {name:'rootDirectoryName',value:'根目录'},
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
                isAll:true
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
              if(this.provinceIdList.indexOf('-1') > -1) {
                if(this.isAll) {
                  if(this.provinceIdList.length == this.provinces.length + 1) {
                    this.provinceIdList.splice(0,this.provinceIdList.length);
                  }else {
                    this.provinceIdList.splice(0,this.provinceIdList.length);
                    this.provinces.forEach((item) => {
                      this.provinceIdList.push(item.id)
                    });
                    this.isAll = false ;
                  }
                }else {
                  this.provinceIdList.splice(0,this.provinceIdList.length);
                  this.isAll = true ;
                }

              }
                console.log(this.templateData)
            },
            okProvince () {
              this.isAll = true ;
            },
           /* okProvince () {

            },*/
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
           /* search() {
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
            },*/
            search () {
              let url = this.$store.state.app.baseUrl  + 'courseModel/query';
              let data = Util.deepClone(this.formItem);
              let checkStates = [];
              if(data.checkState == 1 || data.checkState == 0) {
                checkStates = [3,7];
              }else if(data.checkState == 2) {
                checkStates = [7];
              }else if(data.checkState == 3) {
                checkStates = [3];
              }
              data.checkStates = checkStates;
              if(data.day == 0 && data.night == 0) {
                data.classHour = null;
              }else {
                data.classHour = data.day + '天' + data.night + '晚';
              }
              data.schoolBeginsTime = new Date(data.schoolBeginsTime).getTime();
              data.pageNumber = this.pageNumber;
              data.pageSize = this.pageSize;
              this.$http({
                method: 'post',
                url: url,
                data: data,
                headers: {'Content-type': 'application/json'}
              })
                .then((res)=>{
                  this.templateData = res.data.data.content;
                  this.total = res.data.data.total;
                })
                .catch(()=>{
                  this.$Message.error(error.message)
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
        computed:{
          announceWrittenResultTimeStamp(){
            if(this.formItem.announceWrittenResultTime.length>0 ) {
              if(this.formItem.announceWrittenResultTime[0] != '' && this.formItem.announceWrittenResultTime[1] != '') {
                return [this.formItem.announceWrittenResultTime[0].getTime(),this.formItem.announceWrittenResultTime[1].getTime()];
              }else {
                return [];
              }
            }else {
              return [];
            }
          },
          writtenTimeStamp(){
            if(this.formItem.writtenTime.length>0) {
              if(this.formItem.writtenTime[0] != '' && this.formItem.writtenTime[1] != '') {
                return [this.formItem.writtenTime[0].getTime(),this.formItem.writtenTime[1].getTime()];
              }else {
                return [];
              }
            }else {
              return [];
            }
          },
          interviewTimeStamp(){
            if(this.formItem.interviewTime.length>0) {
              if(this.formItem.interviewTime[0] != '' && this.formItem.interviewTime[1] != '') {
                return [this.formItem.interviewTime[0].getTime(),this.formItem.interviewTime[1].getTime()];
              }else {
                return [];
              }
            }else {
              return [];
            }
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
            });

          // 非组合班次
          this.$http({
            method:'get',
            url:this.$store.state.app.baseUrl + 'classSeries/findByExamStyle',
            headers: {'Content-type': 'application/json'}
          })
            .then((res)=>{
              if(res.data.code == 0) {
                this.classSeries = res.data.data;
              }
            })
            .catch((error)=>{
              this.$Message.error(error.message)
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
