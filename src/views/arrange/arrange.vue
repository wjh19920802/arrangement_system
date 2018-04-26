<template>
    <div>
        <Row>
            <Col span="24">
            <Card>
                <div class="title">
                    <p>班次信息</p>
                </div>
                <div class="content">
                    <div class="info">
                        <p>
                            <span>班级名称：{{classInfo.className}}</span>
                        </p>
                        <p>
                          上课日期：<span v-for="item in classInfo.extraData.date">{{item | formateDate}}</span>
                        </p>
                        <p>
                            <span>ERP人数：{{classInfo.extraData.erpNumCompose.allNum}}</span>
                        </p>
                        <p>
                            <span>价格：{{classInfo.price}}</span>
                        </p>
                        <p>
                            <span>申请科目：{{classInfo.extraData.categoryName}}</span>
                        </p>
                        <!--<p>-->
                            <!--<span>是否为封闭班级：{{classInfo.extraData.isClosed == 1?'封闭班':'非封闭班'}}</span>-->
                        <!--</p>-->
                        <p>
                            <span>学员组成情况：协议人数：{{classInfo.extraData.erpNumCompose.agreementNum}} &nbsp;&nbsp;&nbsp;   非协议人数:{{classInfo.extraData.erpNumCompose.noAgreementNum}}</span>
                        </p>
                        <p>
                          <span>备注:  {{classInfo.Beiz?classInfo.Beiz:'--'}}</span>
                        </p>
                    </div>
                </div>
            </Card>
            <Card class="margin-top-10">
              <p slot="title">
                <Icon type="pinpoint"></Icon>
                课程表
              </p>
              <schedule ref="scheduleDom1" :lessonId="lessonId" :isEdit="1" :isRead="1" :editSchedule="scheduleData">-</schedule>
            </Card>

            <Card class="margin-top-10">
                <div class="title">
                    <p>检索师资</p>
                </div>
                <div class="teacher_table">
                  <div v-for="item in data1" class="category">
                    <div class="cell category_name">
                      <div class="category_name_content">
                        {{item.categoryName}}
                      </div>
                    </div>
                    <div class="category_item_wrap">
                      <div v-for="i in item.items" class="cell category_item">
                        <Checkbox v-model="i.value" v-show="!i.state" @on-change="selectCourse(i.classCourseTableId)"></Checkbox>
                        <span class="category_time">{{i.day | formateDate}}  {{i.beginTime | numberToTime}}-{{i.endTime | numberToTime}}</span>
                        <span v-show="i.state != '确认'" style="color:red;">{{i.state == ''?'待排课':i.state}}</span>
                        <span v-show="i.state == '确认'" style="color:limegreen;">{{i.state == ''?'待排课':i.state}}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Form :label-width="150" >
                    <Row>
                        <Col span="8">
                        <FormItem label="姓名／工号／手机号" prop="teacherName">
                            <Input v-model="formItemName.teacherName" placeholder=""></Input>
                        </FormItem>
                        </Col>
                        <Col span="3" style="margin-left: 10px">
                            <Button type="primary" @click="getTeachersByName">搜索</Button>
                        </Col>
                    </Row>
                </Form>
                <Form :label-width="80">
                    <!--<Row>-->
                        <!--<Col span="6">-->
                        <!--<FormItem label="目前所在地" prop="place">-->
                            <!--<Input v-model="formItem.place" placeholder=""></Input>-->
                        <!--</FormItem>-->
                        <!--</Col>-->
                        <!--<Col span="6">-->
                        <!--</Col>-->
                        <!--<Col span="6">-->
                        <!--</Col>-->
                    <!--</Row>-->
                    <Row>
                        <Col span="8">
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
                        <Col span="8">
                        <FormItem label="性别" prop="gender">
                            <Select v-model="formItem.gender" :select="formItem.gender">
                                <Option value="">请选择</Option>
                                <Option value="男">男</Option>
                                <Option value="女">女</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <!--<Col span="6">-->
                        <!--<FormItem label="级别排序" prop="sort">-->
                            <!--<Select v-model="formItem.sort" :select="formItem.sort">-->
                                <!--<Option value="">请选择</Option>-->
                                <!--<Option value="1">1</Option>-->
                            <!--</Select>-->
                        <!--</FormItem>-->
                        <!--</Col>-->
                        <Col span="8">
                        <FormItem label="所属研究院" prop="institute">
                            <Select v-model="formItem.institute" filterable>
                                <Option value="">请选择</Option>
                                <Option :value="item.name" v-for="item,index in instituteList" :key="index">{{item.name}}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="主修" prop="major">
                            <Select v-model="formItem.major" :select="formItem.major" filterable>
                                <Option value="">请选择</Option>
                                <Option :value="item.id" v-for="item,index in levelData" :style="{textIndent:item.level*20+'px'}" :key="index">{{item.name}}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="辅修" prop="minor">
                            <Select v-model="formItem.minor" :select="formItem.minor" filterable>
                                <Option value="">请选择</Option>
                                <Option :value="item.id" v-for="item,index in levelData" :style="{textIndent:item.level*20+'px'}" :key="index">{{item.name}}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="5" style="margin-left: 10px">
                          <Button type="primary" @click="getTeachers">搜索</Button>
                        </Col>
                    </Row>
                </Form>
                <table id="arrange_table1" border="1" width="100%" style="border-collapse:collapse;text-align: center;">
                  <tr>
                    <th>师资姓名</th>
                    <th>性别</th>
                    <th>级别</th>
                    <th>所属研究院</th>
                    <th>联系方式</th>
                    <th>主修授课能力</th>
                    <th>辅修授课能力</th>
                    <th>拒课次数</th>
                    <!--<th>被投诉次数</th>-->
                    <!--<th>被投诉次数</th>-->
                    <!--<th>目前所在地</th>-->
                    <th class="frontPage pageBtn" @click="toFrontPage" v-if="queryDays ? queryDays.length>5 : 0">
                      <Icon type="chevron-left"></Icon>
                    </th>
                    <th class="calender" v-for="i,index in queryDays" v-show="(index+1) > (page-1)*5 && (index+1) <= page*5" >
                      {{timestampToTime(i)}}
                    </th>
                    <th class="nextPage pageBtn" @click="toNextPage" v-if="queryDays ? queryDays.length>5 : 0">
                      <Icon type="chevron-right"></Icon>
                    </th>
                    <th class="operate">操作</th>
                  </tr>
                  <tr v-for="(item,index) in data2" :class="{arranged:item.arranged}">
                    <td>{{item.name}}</td>
                    <td>{{item.gender}}</td>
                    <td>{{item.level}}</td>
                    <td>{{item.institute}}</td>
                    <td>{{item.mobile?item.mobile:'--'}}</td>
                    <td>{{item.major?item.major:'--'}}</td>
                    <td>{{item.minor?item.minor:'--'}}</td>
                    <td>{{item.complaints == null?'--':item.complaints}}</td>
                    <!--<td>{{item.complaints}}</td>-->
                    <!--<td>{{item.place}}</td>-->
                    <td class="pageBtn frontPage" v-if="queryDays ? queryDays.length>5 : 0"></td>
                    <td class="calender" :class="{blank:ite.length === 0}" v-for="(ite, ind) in item.extraData.items" v-show="(ind+1) > (page-1)*5 && (ind+1) <= page*5" >
                      <div v-for="i in ite">{{i}}</div>
                    </td>
                    <td class="pageBtn nextPage" v-if="queryDays ? queryDays.length>5 : 0"></td>
                    <td class="operate">
                      <Button type="success" size="small" @click="arrangement(item,item.teacherId)">选择老师</Button>
                    </td>
                  </tr>
                </table>
                <div style="margin: 10px;overflow: hidden">
                  <div style="float: right;">
                    <Page :total="total1" :current="pageNo" :page-size="pageSize1" @on-change="changePage1" show-total></Page>
                  </div>
                </div>
                <div class="margin-top-10">
                  <div class="title">
                    <p>已排师资</p>
                  </div>
                  <table id="arrange_table2" border="1" width="100%" style="border-collapse:collapse;text-align: center;">
                    <tr>
                      <th>科目</th>
                      <th>授课角色</th>
                      <th>师资姓名</th>
                      <th>联系方式</th>
                      <th>级别</th>
                      <th>性别</th>
                      <th>所属研究院</th>
                      <!--<th>目前所在地</th>-->
                      <th>上课时间</th>
                      <th class="operate">操作</th>
                    </tr>
                    <tr v-for="(item,index) in data3">
                      <td>{{item.itemContent}}</td>
                      <td>{{item.teacherInfoDo!=null?item.teacherInfoDo.gender:''}}</td>
                      <td>{{item.teacherInfoDo!=null?item.teacherInfoDo.name:''}}</td>
                      <td>{{item.teacherInfoDo!=null?item.teacherInfoDo.mobile:''}}</td>
                      <td>{{item.teacherInfoDo!=null?item.teacherInfoDo.level:''}}</td>
                      <td>{{item.teacherInfoDo!=null?item.teacherInfoDo.gender:''}}</td>
                      <td>{{item.teacherInfoDo!=null?item.teacherInfoDo.institute:''}}</td>
                      <td>{{item.day | formateDate}} {{item.beginTime | numberToTime}}-{{item.endTime | numberToTime}}</td>
                      <td class="operate">
                      <Button type="primary" size="small" @click="modifyItem(item.teacherItemId)">修改</Button>
                      <Button type="error" size="small" @click="deleteItem(item.teacherItemId)">删除</Button>
                      </td>
                    </tr>
                  </table>
                  <div style="margin: 10px;overflow: hidden">
                    <div style="float: right;">
                      <Page :total="total2" :current="pageNumber2" :page-size="pageSize2" @on-change="changePage2" show-total></Page>
                    </div>
                  </div>
                </div>
            </Card>
            <Card class="margin-top-10">
                <div class="title">
                    <p>添加备注</p>
                </div>
                <div class="content">
                    <div class="info">
                        <Input v-model="beiz" type="textarea" placeholder=""></Input>
                    </div>
                </div>
                <div style="width: 100%;text-align: center">
                  <Button type="primary" size="large" @click="save">保存备注</Button>
                  <!--<Button type="primary" size="large">取消</Button>-->
                </div>
            </Card>
            <Card id="modify_history" class="margin-top-10">
              <div class="title">
                <p>修改轨迹</p>
              </div>
              <div class="modify_content">
                <div v-for="item in modifyHistoryList" class="modify_item">
                  <div class="month">{{item.day | stampToMonth}}</div>
                    <div v-for="i in item.categoryScheduleRouteLogVo" class="detail">
                      <div>{{ new Date(i.date).toLocaleString()}}</div>&nbsp;&nbsp;
                      <span>师资:{{i.teacherId}}</span>&nbsp;&nbsp;
                      <span><span>{{i.operateId==0?'添加排课':i.operateId==1?'编辑排课':'删除排课'}}:</span>{{i.operateContent}}</span>&nbsp;&nbsp;
                    </div>
                </div>
              </div>
            </Card>
            </Col>
        </Row>
        <Modal title="修改上课时间" v-model="modifyModal" @on-ok="modifyTime" width="300px">
          <Row>
            <TimePicker type="timerange" placement="bottom" placeholder="选择时间" format="HH:mm" style="width: 168px" v-model="timeValue"></TimePicker>
          </Row>
        </Modal>
        <Modal title="删除" v-model="deleteModal" @on-ok="deleteOk" width="520px">
          <Row style="margin-bottom: 20px;">
            <Col span="6">
              <h3 style="line-height:32px;">删除原因</h3>
            </Col>
            <Col span="18">
              <Select v-model="reason">
                <Option value=""></Option>
                <Option value="aaaaa">aaaaa</Option>
                <Option value="bbbbb">bbbbb</Option>
                <Option value="ccccc">ccccc</Option>
              </Select>
            </Col>
          </Row>
          <Row>
            <Col span="6">
              <h3>备注</h3>
            </Col>
            <Col span="18">
              <Input v-model="note" type="textarea" placeholder=""></Input>
            </Col>
          </Row>
        </Modal>
    </div>
</template>

<script>
  import schedule from '@/views/my-components/schedule/schedule.vue'
  export default {
    components: {
      schedule
    },
    data () {
      return {
        classInfo:{
          className:'',
          extraData:{
            erpNumCompose:{}
          },
          priceDesc:'',
          beiz:''
        },
        beiz:'' ,    //备注
        // ruleValidate: {
        //   place: [
        //     { required: true, message: '请输入内容', trigger: 'blur' },
        //   ],
        // },
        formItem: {
          level:'',
          gender:'',
          institute:'',
          major: '',
          minor: ''
        },
        formItemName:{
          teacherName: ''
        },
        data1: [],    //三级科目列表
        // 行数 通过props 传入
        page: 1,
        scheduleData:[],
        data2:[],   //师资列表
        data3:[],   //已排师资
        // columns:[],
        total1:0,
        pageNo:1,
        pageSize1:20,
        total2:0,
        pageNumber2:1,
        pageSize2:20,
        flag:1,
        lessonList:[],
        modifyModal:false,
        timeValue:['',''],
        currentId:'',    //当前点击修改的数据的id
        deleteModal:false,
        reason:'',
        note:'',
        teacherItemId:'',
        modifyHistoryList:[],   //修改历史
        // classDaysArr:[]
        majorList: [], // 主修辅修列表
        instituteList: [] //研究院列表
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
        this.majorList.map((item,index) => {
          pushBranch(item, 1)
        })
        return data3
      },
      queryDays () { // 教师日程 的天数列表
        return this.classInfo.extraData ? this.classInfo.extraData.queryTeacherDates : []
      },
      daysArr () {
        return [31,28+this.is_leap(this.curYear),31,30,31,30,31,31,30,31,30,31]
      },
      isEdit () {
        return this.$route.query.edit
      },
      lessonId () {
        return this.$route.query.classInfoId
      }
    },
    methods: {
      timestampToTime(timestamp) {
        var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        let Y = date.getFullYear() + '.';
        let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '.';
        let D = date.getDate() < 10 ? '0' + (date.getDate()):date.getDate();
        //h = date.getHours() + ':';
        //m = date.getMinutes() + ':';
        //s = date.getSeconds();
        return M+D;
      },
      is_leap(year) {
        return (year % 100 == 0 ? (year % 400 == 0 ? 1 : 0) : (year % 4 == 0 ? 1 : 0));
      },
      formatDate(index) {
        let vm = this
        let mon = this.date.split('月')[0]
        let da = this.date.split('月')[1].split('日')[0]
        let resultDay = parseInt(da) + index
        let date = ''
        addDay(mon, da)

        function addDay(month, day) {
          let m = month, d = day;
          if (resultDay > vm.daysArr[m - 1]) {
            resultDay = resultDay - vm.daysArr[m - 1]
            m = parseInt(m) + 1
            d = resultDay
            addDay(m, d)
          } else {
            d = resultDay
            //date = m+'月'+d+'日'
            date = {
              y: vm.curYear,
              m: m,
              d: d
            }
          }
        }

        return date

      },
       toFrontPage() {
         this.page = (this.page - 1) < 1 ? 1 : this.page - 1
       },
       toNextPage() {
         let pages = Math.ceil(this.queryDays.length / 5)
         this.page = (this.page + 1) > pages ? pages : this.page + 1
       },
      submit() {
        /*this.$Modal.confirm({
           title: '提示',
           content: '人数少于5人，是否提交？',
           okText: '强制提交',
           onOk: function () {
           console.log(i)
           // 发请求删除该条数据
           }
           })*/
      },
      arrangement(item,teacherId) {    //将老师和课程关联
        if(this.lessonList.length == 0) {
          this.$Message.error('科目不能为空')
        } else {
          this.$http({
            method: 'post',
            url: this.$store.state.app.baseUrl + 'schedule/teacher/tableItem/arrange/classInfo/' + this.$route.query.classInfoId + '/category/' + this.$route.query.categoryId + '/',
            data: {
              items: this.lessonList,
              teacherId: teacherId
            }
          })
            .then((res) => {
              if (res.data.code == 0) {
                this.lessonList = [];
                item.arranged = true;
                this.getArrangedTeachers();
                this.getThirdCourses();
              }
            })
        }
      },
      selectCourse(classCourseTableId) {  //选择课程
        this.lessonList = [];
        this.data1.forEach((item) => {
          item.items.forEach((item2) => {
            if (item2.value) {
              this.lessonList.push(item2.id)
            }
          })
        });
        console.log(this.lessonList)
      },
      changePage1(page) {
        if (this.flag == 1) {
          this.pageNo = page;
          this.getTeachersByName();
        } else {
          this.pageNo = page;
          this.getTeachers();
        }
      },
      changePage2(page) {
        this.pageNumber2 = page;
        this.getArrangedTeachers();
      },
      modifyItem(id) {
        this.currentId = id;
        this.modifyModal = true;
        this.data3.forEach((item) => {
          if (item.teacherItemId == id) {
            // debugger
            this.timeValue[0] = this.numberToTime(item.beginTime) + ':00';
            this.timeValue[1] = this.numberToTime(item.endTime) + ':00';
            this.$data.timeValue = Object.assign([], this.$data.timeValue)
          }
        })
      },
      modifyTime() {
        let beginDate = this.timeValue[0];
        let endDate = this.timeValue[1];
        // let beginArr = beginDate.toTimeString().split(' ');
        // let beginTime = beginArr[0];
        // let endArr = endDate.toTimeString().split(' ');
        // let endTime = endArr[0];
        this.$http({
          method: 'put',
          url: this.$store.state.app.baseUrl + 'schedule/scheduled/classCourseTableItem/' + this.currentId,
          data: {
            beginTime: this.timeToNumber(beginDate),
            endTime: this.timeToNumber(endDate)
          }
        })
          .then((res) => {
            if (res.data.code == 0) {
             this.data3.forEach((item)=>{
               if(item.teacherItemId == this.currentId) {
                 item.beginTime = this.timeToNumber(beginDate);
                 item.endTime = this.timeToNumber(endDate);
                 this.$data.data3 = Object.assign([], this.$data.data3)
               }
             })
              this.getThirdCourses();
              this.getClassInfo();
            }
          })
      },
      deleteItem(teacherItemId) {
        this.deleteModal = true;
        this.teacherItemId = teacherItemId;
      },
      deleteOk() {
        this.$http({
          method: 'delete',
          url: this.$store.state.app.baseUrl + 'schedule/scheduled/batchDeleteTeacherItems',
          data: [this.teacherItemId],
          params:{
            reason:this.reason,
            note:this.note
          }
        })
          .then((res)=>{
            if(res.data.code ==0) {
              this.data3.forEach((item,index)=>{
                if(item.teacherItemId == this.teacherItemId) {
                  this.data3.splice(index,1);
                }
              });
              this.getModifyHistory();
              this.$Message.success('删除成功');
              this.getThirdCourses();
            }else {
              this.$Message.error(res.data.message);
            }
          })
      },
      getClassInfo() {     //获取课程信息
        this.$http({
          method: 'get',
          url: this.$store.state.app.baseUrl + 'schedule/classInfo/' + this.$route.query.classInfoId + '/category/' + this.$route.query.categoryId,
        })
          .then((res) => {
            if (res.data.code == 0) {
              this.classInfo = res.data.data;
              this.scheduleData = res.data.data.extraData.classCourseTableVo;
            } else {
              this.$Message.error(res.data.message);
            }
          })
          .catch((error) => {
            console.log(error)
            this.$Message.error(error.message);
          })
      },
      // getSchedule(){
      //   this.$http({
      //     method:'get',
      //     url:this.$store.state.app.baseUrl + 'schedule/classCourseTable/' + this.$route.query.classInfoId +'/category/' + this.$route.query.categoryId,
      //   })
      //     .then((res)=>{
      //       if(res.data.code == 0) {
      //         this.scheduleData = res.data.data;
      //       } else {
      //         this.$Message.error(error.message);
      //       }
      //     })
      //     .catch((error)=>{
      //       console.log(error)
      //       this.$Message.error(error.message);
      //     })
      // },
      // getLessonAllInfo () { // 拿到班级所有的信息
      //   this.$http(this.$store.state.app.baseUrl + 'classInfo/' + this.lessonId)
      //     .then((res)=>{
      //       // this.classAllInfo = res.data.data
      //       // this.classInfo = res.data.data.classInfo
      //       // this.data = res.data.data.classInfoHeadteacherLinks
      //       // this.scheduleData = res.data.data.classCourseTableVo
      //       // this.formItem.place = res.data.data.classInfo.teachPlace
      //       // this.formItem.note = res.data.data.classInfo.beiz
      //     })
      //     .catch((error)=>{
      //       this.$Message.error(error.message);
      //     })
      // },
      getThirdCourses() {  //获取三级科目
        this.$http({
          method: 'get',
          url: this.$store.state.app.baseUrl + 'schedule/classCourseTableAsThirdCategory/classInfo/' + this.$route.query.classInfoId + '/category/' + this.$route.query.categoryId,
          params: {}
        })
          .then((res) => {
            if (res.data.code == 0) {
              this.data1 = res.data.data;
              setTimeout(() => {
                let wrapDomList = document.getElementsByClassName('category_item_wrap');
                for (let i = 0; i < wrapDomList.length; i++) {
                  let itemList = wrapDomList[i].getElementsByClassName('category_item');
                  if (itemList.length % 4 == 1) {
                    itemList[itemList.length - 1].style.borderBottom = 'none';
                  } else if (itemList.length % 4 == 2) {
                    itemList[itemList.length - 1].style.borderBottom = 'none';
                    itemList[itemList.length - 2].style.borderBottom = 'none';
                  } else if (itemList.length % 4 == 3) {
                    itemList[itemList.length - 1].style.borderBottom = 'none';
                    itemList[itemList.length - 2].style.borderBottom = 'none';
                    itemList[itemList.length - 3].style.borderBottom = 'none';
                  } else if (itemList.length % 4 == 0) {
                    itemList[itemList.length - 1].style.borderBottom = 'none';
                    itemList[itemList.length - 2].style.borderBottom = 'none';
                    itemList[itemList.length - 3].style.borderBottom = 'none';
                    itemList[itemList.length - 4].style.borderBottom = 'none';
                  }
                }
              }, 100)
            } else {
              this.$Message.error(res.data.message);
            }
          })
          .catch((error) => {
            console.log(error)
            this.$Message.error(error.message);
          })
      },
      getTeachersByName() {   // 通过姓名工号获取师资
        this.formItemName.pageNo = this.pageNo;
        this.formItemName.pageSize = this.pageSize1;
        if(this.formItemName.teacherName == '') {
          this.$Message.error('请输入教师姓名、工号或手机号')
        }else {
          this.$http({
            method: 'post',
            url: this.$store.state.app.baseUrl + 'schedule/teacher/searcher/classInfo/' + this.$route.query.classInfoId + '/category/' + this.$route.query.categoryId + '/',
            data: this.formItemName
          })
            .then((res) => {
              if (res.data.code == 0) {
                this.data2 = res.data.data?res.data.data.pageList:[];
                this.total1 = res.data.data?res.data.data.total:0;
                this.flag = 1;
              }else {
                this.$Message.error(res.data.message)
              }
            })
        }
      },
      getTeachers() {       //搜索获取师资
        this.formItem.pageNo = this.pageNo;
        this.formItem.pageSize = this.pageSize1;
        this.$http({
          method: 'post',
          url: this.$store.state.app.baseUrl + 'schedule/teacher/searcher/classInfo/' + this.$route.query.classInfoId + '/category/' + this.$route.query.categoryId + '/',
          data: this.formItem
        })
          .then((res) => {
            if (res.data.code == 0) {
              this.data2 = res.data.data.pageList;
              this.data2.forEach((item)=>{
                item.arranged = false;
              });
              this.data2.forEach((item)=>{
                this.data3.forEach((item2)=>{
                  if(item.teacherId == item2.teacherId) {
                    item.arranged = true;
                  }
                })
              })
              this.total1 = res.data.data.total;
              this.flag = 2;
            }else {
              this.$Message.error(res.data.message)
            }
          })
      },
      getArrangedTeachers() {   //获取已排课老师
        this.$http({
          method: 'get',
          url: this.$store.state.app.baseUrl + 'schedule/teacher/arranged/classInfo/' + this.$route.query.classInfoId + '/category/' + this.$route.query.categoryId + '/?pageNumber=' + this.pageNumber2 + '&pageSize=' + this.pageSize2,
        })
          .then((res) => {
            if (res.data.code == 0) {
              this.data3 = res.data.data.content;
              this.total2 = res.data.data.total;
            }else {
              this.$Message.error(res.data.message)
            }
          })
      },
      getModifyHistory() {
        this.$http({
          method:'get',
          url:this.$store.state.app.baseUrl + 'schedule/scheduled/trail/classInfo/' + this.$route.query.classInfoId + '/category/' + this.$route.query.categoryId
          // url:this.$store.state.app.baseUrl + 'schedule/scheduled/trail/classInfo/' + 19 + '/category/' + 3
        })
          .then((res)=>{
            if(res.data.code == 0) {
              this.modifyHistoryList = res.data.data;
            }
          })
      },
      save() {      //保存备注
        this.$http({
          method:'post',
          url:this.$store.state.app.baseUrl + 'schedule/classInfo/' + this.$route.query.classInfoId + '/category/' + this.$route.query.categoryId + '/beiz',
          // url:this.$store.state.app.baseUrl + 'schedule/classInfo/' + 19 + '/category/' + 3 + '/' + this.classInfo.beiz
          data:{beiz:this.beiz === null?'':this.beiz}
        })
          .then((res)=>{
            if(res.data.code == 0) {
              this.$Message.success('保存成功')
            }else {
              this.$Message.error('保存失败')
            }
          })
          .catch((error)=>{
            this.$Message.error(error.message)
          })
      },
      getBeiz() {      //保存备注
        this.$http({
          method:'get',
          url:this.$store.state.app.baseUrl + 'schedule/classInfo/' + this.$route.query.classInfoId + '/category/' + this.$route.query.categoryId + '/beiz',
        })
          .then((res)=>{
            if(res.data.code == 0) {
              this.beiz = res.data.data;
            }else {
              this.$Message.error('获取备注失败')
            }
          })
          .catch((error)=>{
            this.$Message.error(error.message)
          })
      },
      numberToTime(number) {
        if (number) {
          let h = parseInt(number/100);
          let m = number%100;
          if(h == 0) {
            if (m < 10) {
              return '00' + ':0' + m;
            } else {
              return '00' + ':' + m;
            }
          }else if (h>0 && h < 10) {
            if (m < 10) {
              return '0' + h + ':0' + m;
            } else {
              return '0' + h + ':' + m;
            }
          } else {
            if (m < 10) {
              return h + ':0' + m;
            } else {
              return h + ':' + m;
            }
          }
        }else if(number === 0) {
          return '00:00'
        }
      },
      timeToNumber(time) {
        let arr = time.split(':')
        let number = parseInt(arr[0] + '' + arr[1]);
        return number
      },
      getMajorAndMinor () {
        // 主修、辅修的多级列表
        this.$http({
          method:'get',
          url: this.$store.state.app.baseUrl + 'dossier/category',
          headers: {'Content-type': 'application/json'}
        })
          .then((res)=> {
            console.log(res)
            if(res.data.code == 0 ){
              this.majorList = res.data.data
            }else {
              this.$Message.error(res.data.message)
            }
          })
          .catch((error)=> {
            this.$Message.error(error.message)
          })
      },
      getInstituteList() {
        this.$http(this.$store.state.app.baseUrl + 'schedule/instituteList')
          .then((res)=>{
            if(res.data.code == 0 ){
              this.instituteList = res.data.data;
            }else {
              this.$Message.error(res.data.message);
            }
          }).catch((error)=>{
          this.$Message.error(error.message);
        });
      }
    },
    filters: {
      formateDate: function (timeStamp) {
        if (timeStamp == '' || timeStamp == undefined) {
          return '--'
        } else {
          let date = new Date(+timeStamp);
          let Y = date.getFullYear() + '-';
          let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
          let D = (date.getDate()< 10 ? '0' + (date.getDate()) : date.getDate())

          return Y + M + D;
        }
      },
      numberToTime:function(number){
        if (number !== '' && number !== null) {
          let h = parseInt(number/100);
          let m = number%100;
          if(h == 0) {
            if (m < 10) {
              return '00' + ':0' + m;
            } else {
              return '00' + ':' + m;
            }
          }else if (h>0 && h < 10) {
            if (m < 10) {
              return '0' + h + ':0' + m;
            } else {
              return '0' + h + ':' + m;
            }
          } else {
            if (m < 10) {
              return h + ':0' + m;
            } else {
              return h + ':' + m;
            }
          }
        }
      },
      stampToMonth(timeStamp) {
        let y = new Date(timeStamp).getFullYear();
        let m = new Date(timeStamp).getMonth() + 1;
        return y + '年' + m +  '月'
      }
    },
    mounted() {


      this.getClassInfo();
      // this.getSchedule();
      // this.getLessonAllInfo();
      this.getThirdCourses();
      this.getArrangedTeachers();
      this.getModifyHistory();
      this.getBeiz();
      this.getMajorAndMinor()
      this.getInstituteList()
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
    #arrange_table1,#arrange_table2 {
      border: 1px solid #e9eaec;
      th{
        border: 1px solid #e9eaec;
        min-height: 55px;
        background-color: #f8f8f9;
        padding: 10px 5px;
      }
      th.frontPage{
        width: 30px;
        border-top: 1px dashed #ff6f73;
        border-left: 1px dashed #ff6f73;
      }
      th.nextPage{
        width: 30px;
        border-top: 1px dashed #ff6f73;
        border-right: 1px dashed #ff6f73;
      }
      th.calender{
        border-top: 1px dashed #ff6f73;
      }
      td {
        border: 1px solid #e9eaec;
        max-width: 150px;
        min-height: 45px;
        font-size: 12px;
        .ivu-select-selection{
          border: transparent!important;
        }
      }
      td.frontPage{
        border-left: 1px dashed #ff6f73;
      }
      td.nextPage{
        border-right: 1px dashed #ff6f73;
      }
    }
    /*.thead{
        text-align: center;
        .tr{
            background-color: #f8f8f9;
            width: 100%;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            border-top:1px solid #e9eaec;
            border-left:1px solid #e9eaec;
            border-bottom:1px solid #e9eaec;
            .th{
                font-size: 12px;
                flex:1;
                border-right:1px solid #e9eaec;
                display: flex;
                align-items: center;
                justify-content: center;
                min-width: 30px;
                min-height: 50px;
                padding: 15px 0px;
            }
            .pageBtn{
                max-width: 30px;
            }
            .operate{
                min-width: 150px;
            }
            .frontPage{
                border-top: 1px dashed #ff6f73;
                border-left: 1px dashed #ff6f73;
            }
            .nextPage{
                border-top: 1px dashed #ff6f73;
                border-right: 1px dashed #ff6f73;
            }
            .calender{
                border-top: 1px dashed #ff6f73;
            }
        }
    }
    .tbody{
        text-align: center;
        background-color: #fff;
        border-left:1px solid #e9eaec;
        border-bottom:1px solid #e9eaec;
        font-size: 12px;
        .tr{
            display: flex;
            justify-content: flex-start;
            .td{
                flex:1;
                border-right:1px solid #e9eaec;
                border-bottom:1px solid #e9eaec;
                min-width: 30px;
                min-height: 50px;
                line-height: 2;
                padding: 15px 5px;
            }
            .pageBtn{
                max-width: 30px;
            }
            .operate{
                min-width: 150px;
            }
            .blank{
                background-color: #ffc9cb;

            }

            .frontPage{
                border-left: 1px dashed #ff6f73;
            }
            .nextPage{
                border-right: 1px dashed #ff6f73;
            }
        }
        .tr:last-child .frontPage, .tr:last-child .nextPage, .tr:last-child .calender{
            border-bottom: 1px dashed #ff6f73;
        }
    }*/
    .subTitle{
        margin-bottom: 15px;
        font-size: 16px;
    }
    .content {
        padding: 0 10px;
        margin-bottom: 20px;
        .info {
            p {
                line-height: 2;
                span {
                    margin-right: 30px;
                }
            }
        }
    }
    .pageBtn{
        cursor: pointer;
        transition: .3s;
        color: #ccc;
        z-index: 1000;
    }
    .pageBtn:hover{
        font-size: 20px;
        color: #ef2d36;
    }
    .nextPage{
        right:20px;
    }
    .teacher_table{
      margin-bottom: 50px;
      .category {
        display: flex;
        .cell {
          padding: 20px;
          /*border-top:1px solid black;*/
          /*border-left:1px solid black;*/
        }
        .category_name{
          flex-basis: 100px;
          border-top: 1px solid #e9eaec;
          border-left: 1px solid #e9eaec;
          display: flex;
          .category_name_content {
            align-self: center;
          }
        }
        .category_item_wrap{
          display: flex;
          flex-wrap: wrap;
          flex-basis:calc(~"100% - 100px");
          border: 1px solid #e9eaec;
          border-bottom: none;
          .category_item{
            /*flex-grow:1;*/
            width:25%;
          }
          .category_item {
            border-right: 1px solid #e9eaec;
            border-bottom: 1px solid #e9eaec;
            .category_time {
              margin-right: 20px;
            }
          }
          .category_item:nth-of-type(4n) {
            border-right: none;
          }
        }
      }
      .category:last-of-type {
        .category_name{
          border-bottom: 1px solid #e9eaec;
        }
        .category_item_wrap{
          border-bottom: 1px solid #e9eaec;
        }
      }
    }
  #modify_history {
    .modify_content {
      padding: 100px 100px 100px 100px;
      .modify_item {
        position: relative;
        border-left: 1px solid #ccc;
        padding: 20px;
        margin-bottom: 20px;
        .month {
          position: absolute;
          top: -30px;
          left: -50px;
          width: 100px;
          text-align: center;
          height: 30px;
          line-height: 30px;
          color: white;
          background: #57a3f3;
          border-radius: 8px;
        }
        .detail {
          margin: 5px 0 5px 0;
        }
      }
    }
  }
    .arranged {
     background-color: #5cadff;
    }
</style>
