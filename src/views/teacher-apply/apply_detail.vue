<template>
    <div>
        <Row>
            <Col span="24">
            <Card>
                <p slot="title">
                  <Icon type="pinpoint"></Icon>
                  班次信息
                </p>
              <div class="content">
                <div class="info">
                  <p>
                    <span class="t">班级名称：</span>
                    <span>{{classInfo.className}}</span>
                  </p>
                  <p>
                    <span class="t">班级地区：</span>
                    <span>{{classInfo.studyProvince}}</span>
                    <span>{{classInfo.studyCity}}</span>
                    <span>{{classInfo.studyCenter}}</span>
                  </p>
                  <p>
                    <span class="t">上课日期：</span>
                    <span v-for="d in classDays">{{d}}</span>
                  </p>
                  <p>
                    <span class="t">ERP人数：</span>
                    <span>{{erpNumber}}</span>
                  </p>
                  <p>
                    <span class="t">价格：</span>
                    <span>{{classInfo.price}}</span>
                  </p>
                  <p>
                    <span class="t">申请科目：</span>
                    <span>{{classAllInfo.categoryList.join(',')}}</span>
                  </p>
                  <p>
                    <span class="t">是否为封闭班级：</span>
                    <span>{{classAllInfo.isClosed == 1?'封闭班':'非封闭班'}}</span>
                  </p>
                  <p>
                    <span class="t">学员组成情况：</span>
                    <span>协议人数：{{classAllInfo.erpNumCompose.agreementNum}}</span>
                      <span>非协议人数: {{classAllInfo.erpNumCompose.noAgreementNum}}</span>
                  </p>
                </div>
              </div>
            </Card>
            <Card class="margin-top-10">
              <p slot="title">
                <Icon type="pinpoint"></Icon>
                课程表
              </p>
              <schedule ref="scheduleDom1" :lessonId="lessonId" :isEdit="isEdit" :editSchedule="scheduleData">-</schedule>
            </Card>
            <Card class="margin-top-10">
              <p slot="title">
                <Icon type="pinpoint"></Icon>
                课程信息
              </p>
              <Form ref="formItem" :rules="ruleValidate" :model="formItem" :label-width="100">
                  <FormItem label="上课地点" prop="place">
                      <Input v-model="formItem.place" placeholder=""></Input>
                  </FormItem>
                  <Row>
                    <Col span="12">
                      <FormItem label="查找班主任" prop="search">
                        <Row>
                          <Col span="16">
                            <Input v-model="searchTeacherName" placeholder="请输入is账号、工号、姓名或手机号"></Input>
                          </Col>
                          <Col span="4" style="margin-left: 10px">
                            <Button type="primary" icon="ios-search" @click="searchTeacher">查找</Button>
                          </Col>
                        </Row>
                      </FormItem>
                    </Col>
                    <Col span="12" v-if="!teachers.length > 0" style="color: #ccc; line-height: 33px">暂无查询结果</Col>
                  </Row>
                <!--<Row span="12" v-if="teachers.length > 0">-->
                  <!--<Row v-for="item in teachers">-->
                    <!--<Col span="3">-->
                    <!--<span style="line-height: 33px">{{item.headteacherName}}</span>-->
                    <!--</Col>-->
                    <!--<Col span="8">-->
                    <!--<DatePicker type="daterange" placeholder="选择带课日期" placement="bottom-end" v-model="teachersTime"></DatePicker>-->
                    <!--</Col>-->
                    <!--<Col span="4" style="margin-left: 10px">-->
                    <!--<Button type="success" @click="addTeacher">添加</Button>-->
                    <!--</Col>-->
                  <!--</Row>-->
                <!--</Row>-->
                <FormItem label="选择带课日期">
                  <Row>
                    <Col span="12">
                    <DatePicker type="daterange" placeholder="选择带课日期" placement="bottom-end" v-model="teachersTime"></DatePicker>
                    </Col>
                  </Row>
                </FormItem>
                  <FormItem label="查询结果 " v-if="teachers.length > 0">
                    <Table  :columns="columns1" :data="teachers" ></Table>
                  </FormItem>
                  <FormItem label="已选班主任" prop="teachers">
                    <Table  :columns="columns" :data="data" ></Table>
                  </FormItem>
                  <FormItem label="备注" prop="note">
                    <Input v-model="formItem.note" type="textarea" placeholder=""></Input>
                  </FormItem>
              </Form>
            </Card>
            <Card class="margin-top-10" style="text-align: center">
              <Button type="primary" size="large" @click="saveDraft('formItem')" v-if="!isEdit">存为待定课程</Button>
              <Button type="primary" size="large" @click="handleSubmit('formItem')" v-if="!isEdit && erpNumber>=forceNumber">提交</Button>
              <Button type="primary" size="large" @click="saveInfo('formItem')" v-if="isEdit">保存修改</Button>
              <Poptip v-if="!isEdit && erpNumber<forceNumber" trigger="hover"  content="当前报名人数过少">
              <Button type="warning" size="large" @click="forceHandleSubmit('formItem')" v-if="!isEdit && erpNumber<forceNumber">强制提交</Button>
              </Poptip>
            </Card>
            </Col>
        </Row>
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
        classAllInfo: {
          erpNumCompose: {},
          categoryList: []
        },
        classInfo: {},
        ruleValidate: {
          place: [
            { required: true, message: '请输入内容', trigger: 'blur' },
          ],
        },
        searchTeacherName: '',
        teachers: [],
        teachersTime: [],
        columns1:[
          {
            title: '姓名',
            align:'center',
            key:'headteacherName'
          },
          {
            title:'电话',
            align:'center',
            key:'headteacherTel'
          },
          {
            title:'操作',
            align:'center',
            render: (h,params) => {
              return h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.newTeacher = params.row;
                    this.addTeacher()
                  }
                }
              }, '添加')
            }
          }
        ],
        columns: [
          {
            title: '班主任名称',
            align: 'center',
            key: 'headteacherName',
            //sortable: true
          },{
            title: '联系电话',
            align: 'center',
            key: 'headteacherTel',
          },{
            title: '开始时间',
            align: 'center',
            key: 'appraiserName',
            render: (h,params) => {
              return this.timestampToTime(params.row.beginTime)
            }
          },{
            title: '结束时间',
            align: 'center',
            key: 'appraiserName',
            render: (h,params) => {
              return this.timestampToTime(params.row.endTime)
            }
          },{
            title: '操作',
            align: 'center',
            key: 'time',
            render: (h,params) => {
              return h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.data.splice(params.index, 1)
                  }
                }
              }, '删除')
            }
          }
        ],
        data: [],
        formItem: {
          place: '',
          note: ''
        },
        scheduleData: [],
        newTeacher:{}
      }
    },
    computed: {
      isEdit () {
        return this.$route.query.edit
      },
      lessonId () {
        return this.$route.query.id
      },
      erpNumber () {
        // 涉及erp人数 导致提交 或者 强制提交
        return this.classAllInfo ? this.classAllInfo.erpNumCompose.allNum : 0
      },
      forceNumber () {
        // todo 获取强制提交系数的地方
        return 10
      },
      classDays () {
        let daysArr = this.classInfo ? this.classInfo.classDays ? this.classInfo.classDays.split(',') : [] : []
        daysArr = daysArr.map((item,index)=>{
          return this.timestampToTime(+item)
        })
        return daysArr
      },
      formatDataDate () {
        console.log(this.data)
        let data = this.data
        data.map((item, index) => {
          item.beginTime = (typeof item.beginTime == 'object') ? item.beginTime.getTime() : item.beginTime
          item.endTime = (typeof item.endTime == 'object') ? item.endTime.getTime() : item.endTime
          return item
        })
        return data
      },
      submitData () {
        return {
          classInfo:{
            beiz: this.formItem.note,
            teachPlace: this.formItem.place
          },
          classInfoHeadteacherLinks: this.formatDataDate,
          /*classCourseTableVo: {
            courseTableLineItemVos: this.$refs.scheduleDom1.formatScheduleDate,
            courseTableName: this.$refs.scheduleDom1.title,
            id: this.lessonId
          }*/
        }
      }
    },
    methods: {
      timestampToTime(timestamp,formatType) {
        var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        let Y = date.getFullYear() + '.';
        let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '.';
        let D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
        let h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
        let m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
        let s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds());
        if(formatType){
          return Y+M+D+' '+h+m+s;
        }else{
          return Y+M+D;
        }
      },
      searchTeacher () {
        this.$http({
          method:'get',
          url:this.$store.state.app.baseUrl + 'classInfo/queryHeadTeacherByIsName?isName='+this.searchTeacherName,
          headers: {'Content-type': 'application/json'}
        })
          .then((res)=>{
            if(res.data.code == 0 ){
              console.log(res,'is接口查询')
              this.teachers = res.data.data || [];
            }else{
              this.$Message.error(res.data.message);
            }
          })
          .catch((error)=>{
            this.$Message.error('网络错误！')
          })
      },
      addTeacher () {
        /*let newTeacherIs = this.teachers.isName
        let flag = true
        this.data.map((item,index)=>{
          if(item.isName == newTeacherIs){
            flag = false
          }
        })
        if(!flag){
          this.$Message.error('请勿重复添加！')
          return false
        }*/
        let teachersTime = this.teachersTime
        let newTeacher = this.newTeacher;
        newTeacher.beginTime = teachersTime.length? teachersTime[0] : 0
        newTeacher.endTime = teachersTime.length? teachersTime[1] : 0
        this.data.push(newTeacher)
      },
      /*getLessonInfo () {
        this.$http(this.$store.state.app.baseUrl + 'classInfo/' + this.lessonId + '/getClassDetail')
          .then((res)=>{
          console.log(res,'获取课程信息')
          this.classAllInfo = res.data.data
          this.classInfo = res.data.data.classInfo
          })
          .catch((error)=>{
              this.$Message.error('网络错误');
          })
      },*/
      getLessonAllInfo () { // 拿到班级所有的信息
        this.$http(this.$store.state.app.baseUrl + 'classInfo/' + this.lessonId)
          .then((res)=>{
            console.log(res,'获取课程信息')
            if(res.data.code == 0 ){
              this.classAllInfo = res.data.data
              this.classInfo = res.data.data.classInfo
              this.data = res.data.data.classInfoHeadteacherLinks
              this.scheduleData = res.data.data.classCourseTableVo
              this.formItem.place = res.data.data.classInfo.teachPlace
              this.formItem.note = res.data.data.classInfo.beiz
              this.teachersTime = [res.data.data.classInfo.beginTime,res.data.data.classInfo.endTime]
            }else{
              this.$Message.error(res.data.message);
            }
          })
          .catch((error)=>{
            this.$Message.error('网络错误');
          })
      },
      /*getLessonInfo () {
        this.$http({
          method: 'get',
          url: this.$store.state.app.baseUrl + 'schedule/classInfo/' + this.$route.query.classInfoId + '/category/' + this.$route.query.categoryId,
        })
          .then((res) => {
            if (res.data.code == 0) {
              this.classInfo = res.data.data;
            } else {
              this.$Message.error('网络异常');
            }
          })
          .catch((error) => {
            console.log(error)
            this.$Message.error('网络异常');
          })
      },*/
      saveDraft (ref) {
        // 存到待定 POST /{version}/classInfo/{id}/initToUncertain
        if(!this.data.length){
          this.$Message.error('请添加至少一位班主任')
          return
        }
        this.$refs[ref].validate((valid) => {
            if (valid) {
              this.$http({
                method:'post',
                url:this.$store.state.app.baseUrl + 'classInfo/'+ this.lessonId +'/noApplyToUncertain',
                //url:'http://192.168.0.17:60000/v1/classInfo/'+ this.lessonId +'/noApplyToUncertain',
                data: this.submitData,
                headers: {'Content-type': 'application/json'}
              })
                .then((res)=>{
                  if(res.data.code == 0 ){
                    this.$Message.success('保存成功!');
                    this.$router.push({name:'teacher_draft_index'})
                  }else{
                    this.$Message.error(res.data.message);
                  }
                })
                .catch((error)=>{
                  this.$Message.error('网络错误！')
                })
            }
        })
      },
      handleSubmit (ref) {
          /*this.$refs.scheduleDom1.formatScheduleDate.map((item,index)=>{
            daysArr.push(this.timestampToTime(item.day))
            lengt = daysArr.length
          })*/
          // 提交申请
          if(!this.data.length){
            this.$Message.error('请添加至少一位班主任')
            return
          }
          this.$refs[ref].validate((valid) => {
            if (valid) {
              this.$http({
                method:'post',
                url:this.$store.state.app.baseUrl + 'classInfo/'+ this.lessonId +'/noApply/submit',
                data: this.submitData,
                headers: {'Content-type': 'application/json'}
              })
                .then((res)=>{
                  console.log(res)
                  if(res.data.code == 0 ){
                    this.$Message.success('提交成功!');
                    this.$router.push({name:'teacher_passed_index'})
                  }else{
                    this.$Message.error(res.data.message);
                  }
                })
                .catch((error)=>{
                  this.$Message.error('网络错误！')
                })
            }
          })
      },
      saveInfo (ref) {
        if(!this.data.length){
          this.$Message.error('请添加至少一位班主任')
          return
        }
        // 提交修改
        this.$refs[ref].validate((valid) => {
          if (valid) {
            this.$http({
              method:'post',
              url:this.$store.state.app.baseUrl + 'classInfo/'+ this.lessonId ,
              data: this.submitData,
              headers: {'Content-type': 'application/json'}
            })
              .then((res)=>{
                console.log(res)
                if(res.data.code == 0 ){
                  this.$Message.success('提交成功!');
                  // 这里留在页面刷新 或者跳转回列表
                  this.$router.go(-1)
                  //this.getLessonAllInfo()
                }else{
                  this.$Message.error('网络错误!');
                }
              })
              .catch((error)=>{
                this.$Message.error('网络错误！')
              })
          }
        })
      },
      forceHandleSubmit (ref) {
        // 强制提交
        /*this.$refs[ref].validate((valid) => {
          if (valid) {
            this.$http({
              method:'post',
              url:this.$store.state.app.baseUrl + 'classInfo/' + this.lessonId + '/init/forceSubmit',
              data:this.submitData,
              headers: {'Content-type': 'application/json'}
            })
              .then((res)=>{
                if(res.data.code == 0 ){
                  this.$Message.success('提交成功!');
                }else{
                  this.$Message.error('网络错误!');
                }
              })
              .catch((error)=>{
                  this.$Message.error('网络错误！')
              })
          }
        })*/

        // 提交申请
        if(!this.data.length){
          this.$Message.error('请添加至少一位班主任')
          return
        }
        this.$refs[ref].validate((valid) => {
          if (valid) {
            this.$http({
              method:'post',
              url:this.$store.state.app.baseUrl + 'classInfo/'+ this.lessonId +'/noApply/submit',
              data: this.submitData,
              headers: {'Content-type': 'application/json'}
            })
              .then((res)=>{
                console.log(res)
                if(res.data.code == 0 ){
                  this.$Message.success('提交成功!');
                  this.$router.push({name:'teacher_passed_index'})
                }else{
                  this.$Message.error(res.data.message);
                }
              })
              .catch((error)=>{
                this.$Message.error('网络错误！')
              })
          }
        })

      }//暂时不用了
    },
    mounted () {
      // 判断是否修改 或 创建
      /*if(!this.isEdit){
        // 根据id获取班级信息
        this.getLessonInfo()
      }else{
        this.getLessonAllInfo()
        // 获取班次的课程表---传edit进课程表里  ok
        // 获取班次的信息并回显
        // 获取班次的教师信息并回显
      }*/
       this.getLessonAllInfo()
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
    .subTitle{
        margin-bottom: 15px;
        font-size: 16px;
    }
    .content {
        padding: 0 10px;
        margin-bottom: 20px;
        .info {
          p{
            line-height: 2;
            .t{
              color: #aaa;
              font-weight: bold;
              margin-right: 10px;
              //font-family:'黑体';
            }
            span{
              font-family:'仿宋_GB2312';
              /*font-size:17px;*/
              margin-right: 30px;
            }
          }
        }
    }
</style>
