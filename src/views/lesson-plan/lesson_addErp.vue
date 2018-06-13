<template>
    <div>
        <Modal class="modal1"
                v-model="modal1"
                width="50%"
                @on-ok="confirmChangeDate"
                title="修改班次日期">
            <Row>
                <Col span="6" style="padding-right: 5px">
                <DatePicker :options="optionsDate" ref="addDate" type="daterange" placement="bottom-start" @on-change="addChangingDate" format="yyyy/MM/dd" placeholder="添加一段时间"></DatePicker>
                </Col>
                <Col span="6" style="padding-right: 5px">
                <DatePicker :options="optionsDate" ref="addDate" type="date" placement="bottom-start" @on-change="addChangingDate" format="yyyy/MM/dd" placeholder="单独添加一天"></DatePicker>
                </Col>
            </Row>
            <div class="chosen">
                        <span :class="{chosenItem: true, chosenClass: item.children}" v-for="item,index in changingDateArr">
                          {{timestampToTime(item)}}
                          <span v-if="item > new Date()" @click="removeChangingDate(index)" class="removeIcon"><Icon type="close-circled" size="14" ></Icon></span>
                        </span>
            </div>
            <div style="color: orange;">请添加 {{lessonDays}} 天的课程日期，当前已添加 {{changingDateArr.length}} 天，重复天数会被过滤</div>
            <div style="color: red;">* 今天及之前的课程日期无法修改</div>
        </Modal>
        <Row>
            <Col span="24">
            <Card>
                <p slot="title">
                    <Icon type="pinpoint"></Icon>
                    添加ERP班级信息
                </p>
                <Table border ref="selection" :columns="columns1" :data="data1"></Table>
            </Card>
            <Card class="margin-top-10">
                <p slot="title" style=" overflow: visible; line-height: 35px">
                    <Icon type="pinpoint"></Icon>
                    增加班次信息详情
                </p>
                <Form :label-width="100" label-position="right" :rules="formRules" ref="formItem" :model="formItem">
                <Row>
                  <!--<Col span="6">
                    <FormItem label="班级名称" prop="className">
                      <Input v-model="formItem.className" placeholder="请输入班级名称"></Input>
                    </FormItem>
                  </Col>-->
                  <Col span="24">
                  <FormItem label="上课地区" prop="area">
                    <Row>
                      <Col span="9" v-show="announceProvince != 2">
                      <FormItem prop="studyCity">
                        <Select ref="city" v-model="formItem.studyCity" @on-change="getThirdTree">
                          <Option v-for="ite,ind in secondTree" :key="ind" :value="ite.areaid">{{ite.name}}</Option>
                        </Select>
                      </FormItem>
                      </Col>
                      <Col span="9" :offset="announceProvince != 2 ? 2 : 0">
                      <FormItem prop="studyCenter">
                        <Select ref="school" v-model="formItem.studyCenter">
                          <Option v-for="(ite,ind) in thirdTree" :key="ind" :value="ite.areaid">{{ite.name}}</Option>
                        </Select>
                      </FormItem>
                      </Col>
                    </Row>
                  </FormItem>
                  </Col>
                </Row>
                <Row>
                    <Col span="8">
                        <FormItem label="价格" prop="price">
                          <Select v-model="formItem.price">
                            <Option v-for="item in data1PriceArr" placeholder="请选择班级价格" :value="item" :key="item">
                              {{item}}
                            </Option>
                          </Select>
                        </FormItem>
                    </Col>
                  <Col span="6">
                  <FormItem label="期数" prop="period">
                    <Select v-model="formItem.period" ref="period">
                      <Option v-for="item in periods" :value="item.id" :key="item.id">{{item.numberNum}}</Option>
                    </Select>
                  </FormItem>
                  </Col>
                  <Col span="6">
                  <FormItem label="是否核算业绩" prop="noPer">
                    <Select  v-model="formItem.noPer">
                      <Option value="1">是</Option>
                      <Option value="0">否</Option>
                    </Select>
                  </FormItem>
                  </Col>
                </Row>
                  <Row>
                    <Col span="6">
                    <FormItem label="是否包吃" prop="food">
                      <Select  v-model="formItem.food">
                        <Option value="1">是</Option>
                        <Option value="0">否</Option>
                        <Option value="2">其他</Option>
                      </Select>
                    </FormItem>
                    </Col>
                    <Col span="12" offset="2">
                    <FormItem label="是否包吃备注" prop="foodRemark">
                      <Input type="textarea" placement="bottom-end" :rows="1" v-model="formItem.foodRemark"></Input>
                    </FormItem>
                    </Col>
                  </Row>
                <Row>
                  <Col span="6">
                  <FormItem label="教师是否包吃" prop="teacherFood">
                    <Select  v-model="formItem.teacherFood">
                      <Option value="1">是</Option>
                      <Option value="0">否</Option>
                      <Option value="2">其他</Option>
                    </Select>
                  </FormItem>
                  </Col>
                  <Col span="12" offset="2">
                  <FormItem label="教师包吃备注" prop="foodRemark">
                    <Input type="textarea" placement="bottom-end" :rows="1" v-model="formItem.teacherFoodRemark"></Input>
                  </FormItem>
                  </Col>
                  </Row>
                  <Row>
                    <Col span="20" v-if="isShow">
                      <FormItem label="班次日期" prop="studyTimeList">
                      <Row>
                          <Col span="6" style="padding-right: 5px">
                          <DatePicker :options="optionsDate" ref="addDate" type="daterange" placement="bottom-start" @on-change="changeDate" format="yyyy/MM/dd" placeholder="添加一段时间"></DatePicker>
                          </Col>
                          <Col span="6" style="padding-right: 5px">
                          <DatePicker :options="optionsDate" ref="addDate" type="date" placement="bottom-start" @on-change="changeDate" format="yyyy/MM/dd" placeholder="单独添加一天"></DatePicker>
                          </Col>
                      </Row>
                      <div class="chosen">
                        <span :class="{chosenItem: true, chosenClass: item.children}" v-for="item,index in formItem.studyTimeList">
                          {{item}}
                          <span @click="removeClass(index)" class="removeIcon"><Icon type="close-circled" size="14" ></Icon></span>
                        </span>
                      </div>
                      <div style="color: orange;">请添加 {{lessonDays}} 天的课程日期，当前已添加 {{formItem.studyTimeList.length}} 天，重复天数会被过滤</div>
                      <div style="color: red;">* 今天及之前的课程日期无法选用</div>
                      </FormItem>

                    <!--<FormItem label="班次日期" prop="studyTimeList">
                      <DatePicker type="daterange" placement="bottom-start" @on-change="changeDate" format="yyyy/MM/dd"></DatePicker>
                      <DatePicker type="date" multiple placement="bottom-start" @on-change="changeDate" format="yyyy/MM/dd"></DatePicker>
                      <DatePicker type="daterange"  placement="bottom-start" @on-change="changeDate" format="yyyy/MM/dd"></DatePicker>
                      <span style="color: orange;">请添加{{lessonDays}}天的课程日期</span>
                    </FormItem>-->
                    </Col>

                  </Row>
                  <Row>
                      <Col span="6">
                      <FormItem>
                          <Button type="success" @click="addLesson">添加班次</Button>
                      </FormItem>
                      </Col>
                  </Row>
              </Form>
                <Table  :columns="lessonColumns" :data="newLesson" ></Table>
                <div class="submit margin-top-20">
                    <Row>
                        <Col span="4" offset="10">
                        <Button type="primary" size="large" long @click="submit">提交</Button>
                        </Col>
                    </Row>
                </div>
            </Card>
            <Card class="margin-top-10">
                <p slot="title">
                    <Icon type="pinpoint"></Icon>
                    已有班次
                </p>
                <Table border ref="selection" :columns="columns2" :data="data2"></Table>
            </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
  export default {
    data () {
      const validateTimeList = (rule, value, callback) => {
        if (this.lessonDays == this.formItem.studyTimeList.length && this.formItem.studyTimeList[0] != '') {
          callback();
        } else {
          callback(new Error('班级日期天数与课时不符'));
        }
      };
      const validatePeriod = (rule, value, callback) => {
        if (this.formItem.period != '') {
          callback();
        } else {
          callback(new Error('期数不能为空'));
        }
      };
      return {
        isShow:false,
        formItem: {
          className: '',
          studyCity: '',
          studyCenter: '',
          price: '',
          studyTimeList: [],
          food:'',
          foodRemark:'',
          noPer:-1,
          teacherFood:'',
          teacherFoodRemark:'',
          period:''
        },
        lessonColumns: [
          {
            title: '上课期数',
            align: 'center',
            key: 'periodName',
          },{
            title: '班级名称',
            align: 'center',
            key: 'className',
          },{
            title: '上课地区',
            align: 'center',
            key: 'studyCity',
            render: (h,params) => {
              return params.row.studyCity+'/'+params.row.studyCenter
            }
          },{
            title: '课程价格',
            align: 'center',
            key: 'price',
            /*render: (h,params) => {
              return this.timestampToTime(params.row.endTime)
            }*/
          },{
            title: '上课日期',
            align: 'center',
            key: 'date',
            render: (h,params) => {
             return params.row.studyTimeList.join(',')
             }
          }, {
            title: '操作',
            align: 'center',
            key: 'time',
            render: (h, params) => {
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
                    this.newLesson.splice(params.index, 1)
                  }
                }
              }, '删除')
            }
          }
        ],
        newLesson: [],
        lessonData: [],
        columns1: [
          {
            title: '班级编码',
            align: 'center',
            key: 'classCode'
          },
          {
            title: '班级名称',
            align: 'center',
            key: 'courseName',
          },
          {
            title: '班级类型',
            align: 'center',
            key: 'classType',
            render: (h,params) => {
              return params.row.classType==1? '组合' : '非组合'
            }
          },
          {
            title: '班级系列',
            align: 'center',
            key: 'classSeries',
            render: (h,params) => {
              return params.row.classSeries ? params.row.classSeries.classSeriesName : '--'
            }
          },
          /*{
            title: '根目录',
            align: 'center',
            key: 'rootDirectoryName',
            render: (h,params) => {
              return params.row.classType==1 ? '---' : params.row.rootDirectoryName
            }
          },*/
          {
            title: '课时',
            align: 'center',
            key: 'classHour'
          },
          {
            title: '价格',
            align: 'center',
            key: 'coursePrice',
            width: 200,
            render: (h, params) => {
              return h('div', (() => {
                let price=[];
                params.row.priceInfoArray.forEach((item)=>{
                  let writtenTf = item.writtenTf?'笔试不过退费:'+item.writtenTf:'';
                  let interviewTf = item.interviewTf?'-面试不过退费:'+item.interviewTf:'';
                  let str = item.agreement + '班-' + item.price + '-' + (item.stay==null?'':item.stay) + '-' + writtenTf + interviewTf;
                  price.push(str)
                });
                let ele = [];
                for (let i = 0; i < price.length; i++) {
                  ele.push(h('div', price[i]))
                }
                return ele
              })())
            },
          },
          {
            title: '课程内容',
            align: 'center',
            key: 'categoryName'
          },
          {
            title: '课时规划',
            align: 'center',
            key: 'hourDetail',
            render: (h,params) => {
              if(params.row.classHourPlans.length > 0) {
                return h('div',
                  params.row.classHourPlans.map((item,index)=>{
                    return h('span', item.categoryName + ':' + item.day + '天' + item.night + '晚')
                  })
                )
              }else {
                return '--'
              }
            }
          },
          {
            title: '项目',
            align: 'center',
            key: 'projectTag'
          },
          {
            title: '休息时间',
            align: 'center',
            key: 'dayOfRest',
            render: (h,params) => {
              return params.row.dayOfRest + '天'
            }
          },
          {
            title: '分组人数（面试）',
            align: 'center',
            key: 'interviewGroupNumber',
            render:(h,params)=>{
              if(params.row.interviewGroupNumber === null) {
                return '--'
              }else {
                return params.row.interviewGroupNumber
              }
            }
          },
          /*{
            title: '添加erp',
            key: 'action',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                  },
                  on: {
                    click: () => {
                      if (!params.row.status) {
                        this.$Modal.confirm({
                          title: '错误',
                          content: '添加Erp将 <b style="color: blue;">启用</b> 该课程，是否继续?',
                          onOk: function () {
                            //发请求 改状态
                          }
                        })
                      } else {
                        this.$router.push({name: 'lesson_addErp', query: {id: params.row.id}})
                      }
                    }
                  }
                }, '修改'),
              ])
            }
          },*/
          {
            title: '状态',
            align: 'center',
            key: 'isShow',
            render: (h, params) => {
              if (!params.row.isShow) {
                return h('Button', {
                  props: {
                    type: 'error',
                    size: 'small',
                  },
                  on: {
                    click: () => {
                      // 修改状态
                    }
                  }
                }, '已禁用')
              } else {
                return h('Button', {
                  props: {
                    type: 'success',
                    size: 'small',
                  },
                  on: {
                    click: () => {
                      // 修改状态
                    }
                  }
                }, '已启用')
              }
            }
          },
        ],
        data1: [],
        columns2: [
         /* {
            title: '上课期数',
            align: 'center',
            key: 'period',
            /!*render: (h,params) => {
              return h('div', '第 '+(params.index+1)+' 期')
            }*!/
          },*/
          {
            title: '班次编码',
            align: 'center',
            key: 'classCode',
            width: '15%'
          },
          {
            title: '班级名称',
            align: 'center',
            key: 'className',
            width: '20%'
          },
          {
            title: '上课省份',
            align: 'center',
            key: 'studyProvince',
            width: '8%'
          },
          {
            title: '上课地市',
            align: 'center',
            key: 'studyCity',
            width: '8%'
          },
          {
            title: '学习中心',
            align: 'center',
            key: 'studyCenter',
            width: '10%'
          },
          {
            title: '课程价格',
            align: 'center',
            key: 'price',
            width: '20%'
          },
          {
            title: '上课日期',
            align: 'center',
            key: 'beginTime',
            render: (h,params) => {
              return h('div',[this.timestampToTime(params.row.beginTime) + '-' + this.timestampToTime(params.row.endTime),
                this.isShow ?
                h('span', {
                  class: {'operate': true},
                  on: {click: () => {this.changingDate(params.row.id)}}
                }, '修改') : ''
              ])
            }
          }
        ],
        data2: [],
        // 地区数据
        areaInfo: [],
        thirdTree: [],
        //分页
        total:0,  //总数
        pageNumber:1,  //当前页数
        pageSize:20,
        periods:[],
        formRules:{
          className:[{required:true,message:'班级名称不能为空',trigger:'blur'}],
          price:[{required:true,message:'价格不能为空',trigger:'change'}],
          period:[{required:true,validator:validatePeriod,trigger:'change'}],
          noPer:[{required:true,message:'是否核算业绩不能为空',trigger:'change'}],
          food:[{required:true,message:'是否包吃不能为空',trigger:'change'}],
          teacherFood:[{required:true,message:'教师是否包吃不能为空',trigger:'change'}],
          //studyCity:[{required:true,message:'市不能为空',trigger:'change'}],
          studyCenter:[{required:true,message:'学习中心不能为空',trigger:'change'}],
          studyTimeList:[{validator:validateTimeList,required:true,trigger:'blur'}],
        },
        // 新增弹窗 修改日期
        modal1 : false,
        changingDateArr: [], //当前要修改的班次的日期
        changingId: '',
        optionsDate: {
          disabledDate (date) {
            return date && date.valueOf() < Date.now();
          }
        },
      }
    },
    computed: {
      lessonId () {
        return this.$route.query.lessonId
      },
      announceId () {
        return this.$route.params.announceId
      },
      announceProvince () {
        // todo这里获取公告的省份 给新增班次的操作 this.data1.provinceId
        return this.data1.length ? +this.data1[0].provinceId : 0
      },
      lessonDays () {
        let openClassTime = this.data1.length ? this.data1[0].openClassTime == '上午' ? 0 : 1 : 0
        let classHour = this.data1.length ? this.data1[0].classHour.split('天')[0] : 0
        return parseInt(openClassTime) + parseInt(classHour)
      },
      data1PriceArr () {
        let price = []
        if(this.data1.length > 0) {
          this.data1.forEach((item)=>{
            item.priceInfoArray.forEach((item2)=>{
              let writtenTf = item2.writtenTf?'笔试不过退费:'+item2.writtenTf:'';
              let interviewTf = item2.interviewTf?'-面试不过退费:'+item2.interviewTf:'';
              let str = item2.agreement + '班-' + item2.price + '-' + (item2.stay==null?'':item2.stay) + '-' + writtenTf + interviewTf;
              price.push(str)
            });
          })
        }
        return price;

      },
      secondTree () {
        return this.areaInfo.length? this.areaInfo[0].childrens: []
      }
    },
    methods: {
      timestampToTime(timestamp) {
        var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        let Y = date.getFullYear() + '/';
        let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '/';
        let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        //h = date.getHours() + ':';
        //m = date.getMinutes() + ':';
        //s = date.getSeconds();
        return Y+M+D;
      },
      getRangeTime (t) {
        return new Date(t).getTime()
      },
      deepUniqueArr (arr) {
        var hash = {};
        arr = arr.reduce(function(item, next) {
          hash[next] ? '' : hash[next] = true && item.push(next);
          return item
        }, [])
        return arr
      },
      removeClass (i) {
        this.formItem.studyTimeList.splice(i,1)
      },
      changeDate(dateList) {
        //this.formItem.studyTimeList = dateList.split(',');
        console.log(dateList)
        if(!dateList)return
        if(Object.prototype.toString.call(dateList)=='[object Array]'){
          let days = (this.getRangeTime(dateList[1]) - this.getRangeTime(dateList[0])) / 86400000 +1
          for(let i= 0 ; i<days; i++){
            this.formItem.studyTimeList.push(this.timestampToTime(this.getRangeTime(dateList[0])+86400000*i))
          }
        }else{
          this.formItem.studyTimeList.push(dateList)
        }
        this.formItem.studyTimeList = this.deepUniqueArr(this.formItem.studyTimeList)
      },
      addLesson () {
        console.log(new Date(this.formItem.studyTimeList[0]))
        //增加一行
        let form = this.formItem
        let newRow = {
          period:form.period,
          periodName: this.$refs.period.selectedSingle || '',
          className: form.className,
          province: this.announceProvince,
          studyCityId: this.announceProvince == 2 ? 2 : form.studyCity,
          studyCity: this.announceProvince == 2 ? '北京' : (this.$refs.city.selectedSingle || ''),
          studyCenterId: form.studyCenter,
          studyCenter: this.$refs.school.selectedSingle || '',
          price: form.price,
          studyTimeList: form.studyTimeList,
          noPer:form.noPer,
          food:form.food,
          foodRemark:form.foodRemark,
          teacherFood:form.teacherFood,
          teacherFoodRemark:form.teacherFoodRemark,
        };
        this.$refs['formItem'].validate((valid) => {
          if(valid) {
            // 添加一层校验 年份、ERP地区名称，公职类型名称，课表名称，期数，班次名称后缀拼成
            /*let className = this.$refs.school.selectedSingle +
            this.$http({
              method:'post',
              url: this.$store.state.app.baseUrl+'classInfo/checkName?className='+value,
              headers: {'Content-type': 'application/json'}
            })
              .then((res)=> {
                console.log(res,'地区树')
                if(value == 2){
                  // 北京的特殊处理
                  this.thirdTree = res.data.data[0].childrens
                }
                this.areaInfo = res.data.data
              })
              .catch((error)=> {
                this.$Message.error('获取地区列表失败，请刷新重试')
              })*/
            /*this.$http({
              method:'post',
              url: this.$store.state.app.baseUrl + 'classInfo/checkName/course/' + this.lessonId ,
              data:{studyCenter:newRow.studyCenter,periodName:newRow.periodName},
              headers: {'Content-type': 'application/json'}
            })
              .then((res)=> {
                console.log(res,'获取课程下的已有班次')
                if(res.data.code == 0) {
                  this.newLesson.push(newRow)
                } else {
                  this.$Message.error(res.data.message)
                }
              })
              .catch((error)=> {
                this.$Message.error(error.message)
              })*/
            this.newLesson.push(newRow)
            this.formRules.studyCenter[0].required = true;
          }
        })
      },
      getAreaTree (value) {
        this.$http({
          method:'get',
          url: this.$store.state.app.baseUrl+'area/studyCenterTree?provinceId='+value,
          headers: {'Content-type': 'application/json'}
        })
          .then((res)=> {
            console.log(res,'地区树')
            if(res.data.code == 0) {
              if(value == 2){
                // 北京的特殊处理
                this.thirdTree = res.data.data[0].childrens
              }
              this.areaInfo = res.data.data
            } else {
              this.$Message.error(res.data.message)
            }
          })
          .catch((error)=> {
            this.$Message.error(error.message)
          })
      },
      getThirdTree (value,index) {
        this.thirdTree = []
        let secondArea = this.secondTree.filter((item, index) => {
          return item.areaid == value
        })
        this.thirdTree = secondArea[0].childrens;
        if(this.thirdTree == null) {
          this.formRules.studyCenter[0].required = false;
          // this.formRules = Object.assign({},this.formRules);
        }
      },
      submit () {
        let vm = this
        if(!vm.data1[0].isShow){
          vm.$Modal.confirm({
            title: '提醒',
            content: '提交至Erp将 <b style="color: blue;">启用</b> 该课程，是否继续?',
            onOk: function () {
              //发请求 改状态
              //成功后 发送添加请求
              vm.addErp()
            }
          })
        }else{
          // 发请求 将新增班次添加至后台
          vm.addErp()
        }
      },
      addErp () {
        // 批量添加班次到该课程
        // 处理异步函数
        let vm = this
        if(!vm.newLesson.length){
          this.$Message.error('请先添加班次！')
          return
        }
        let submitArr = []
        let p = new Promise(function (resolve, reject) {
          vm.newLesson.map((item, index) => {
            let newItem = {
              announcementId: vm.announceId,
              courseId: vm.lessonId,
              className: item.className || '',
              period:item.period,
              periodName:item.periodName,
              studyProvince: vm.areaInfo[0].name,
              studyProvinceId: vm.announceProvince,
              studyCity: /*announceProvince == 2 ? '北京' :*/ item.studyCity,
              studyCityId: item.studyCityId,
              studyCenter: item.studyCenter,
              studyCenterId: item.studyCenterId,
              price: item.price,
              noPer:item.noPer==1?1:0,
              food:item.food,
              foodRemark:item.foodRemark,
              teacherFood:item.teacherFood,
              teacherFoodRemark:item.teacherFoodRemark,
              studyTimeList:vm.data1[0].classType == 1?[]:item.studyTimeList.map((item2)=>{ return  new Date(item2).getTime()})

              /*checkState: vm.data1[0].checkState,
              classCode: vm.data1[0].classCode,
              createTime: vm.data1[0].createTime,
              createUid: 0,
              id: '',
              ifCancel: true,
              ifCommitErp: true,
              ifCompose: true,
              ifOverClass: true,
              parentId: vm.data1[0].parentId,
              provinceId: vm.data1[0].provinceId,*/
            }
            submitArr.push(newItem)
            if(submitArr.length == vm.newLesson.length){
              vm.newLesson = []
              resolve()
            }
          })
        })
        p.then(function () {
          console.log(submitArr)
          vm.$http({
            method:'post',
            url: vm.$store.state.app.baseUrl + 'classInfo/batchInsert?courseId='+vm.lessonId,
            data: submitArr,
            headers: {'Content-type': 'application/json'}
          })
            .then((res)=> {
              console.log(res)
              if(res.data.code == 0) {
                vm.getLessonClasses()
                vm.newLesson = res.data.data ? res.data.data : []
                vm.newLesson.forEach((item1)=>{
                  item1.studyTimeList.forEach((item2,index)=>{
                    item1.studyTimeList[index] = vm.timestampToTime(item2);
                  })
                })
                if(res.data.data.length){
                  vm.$Message.error('有未添加成功的班次')
                }else{
                  vm.$Message.success('添加成功')
                }
              } else {
                vm.$Message.error(res.data.message)
              }
            })
            .catch((error)=> {
              vm.$Message.error(error.message)
            })
        })
      },
      getLessonClasses () {// 获取课程下的已有班次
        this.$http({
          method:'get',
          url: this.$store.state.app.baseUrl + 'classInfo/course/'+ this.lessonId +'/classInfoPage?pageNumber='+this.pageNumber+'&pageSize='+this.pageSize,
          headers: {'Content-type': 'application/json'}
        })
          .then((res)=> {
            console.log(res,'获取课程下的已有班次')
            if(res.data.code == 0) {
              this.data2 = res.data.data.content;
              this.total = res.data.data.total;
            } else {
              this.$Message.error(res.data.message)
            }
          })
          .catch((error)=> {
            this.$Message.error(error.message)
          })
      },
      getLessonInfo () {// 根据id获取课程信息
        this.$http({
          method:'get',
          url:this.$store.state.app.baseUrl + 'course/findById?courseId='+ this.lessonId,
          headers: {'Content-type': 'application/json'}
        })
          .then((res)=> {
            console.log(res,'根据id获取课程信息')
            if(res.data.code == 0) {
              this.data1 = [res.data.data];
              if(this.data1[0].classType == 1) {
                this.isShow = false;
              }else {
                this.isShow = true;
              }
              // 回显信息
              this.formItem.className = res.data.data.courseName
              // 发 省份 获得地区树
              //this.getAreaTree(res.data.data.provinceId)
              this.getAreaTree(this.announceProvince)
            } else {
              this.$Message.error(res.data.message)
            }
          })
          .catch((error)=> {
            this.$Message.error(error.message)
          })
      },
      getPeriods () {
        this.$http({
          method:'get',
          url: this.$store.state.app.baseUrl + '/classInfo/queryPeriod ',
          headers: {'Content-type': 'application/json'}
        })
          .then((res)=> {
            if(res.data.code == 0) {
              this.periods = res.data.data;
            } else {
              this.$Message.error(res.data.message)
            }
          })
          .catch((error)=> {
            this.$Message.error(error.message)
          })
      },
      changingDate (id) {
        // 修改班级日期
        this.modal1 = true
        this.changingDateArr = []
        this.getChangingDate(id)
      },
      getChangingDate (id) {
        this.$http({
          method:'get',
          url: this.$store.state.app.baseUrl+'classInfo/findClassDays?classId='+id,
          headers: {'Content-type': 'application/json'}
        })
          .then((res)=> {
            if(res.data.code == 0) {
              this.changingDateArr = res.data.data
              this.changingId = id
            } else {
              this.$Message.error(res.data.message)
            }
          })
          .catch((error)=> {
            this.$Message.error(error.message)
          })
      },
      addChangingDate (dateList) { //弹窗里的日期修改
        if(!dateList)return
        if(Object.prototype.toString.call(dateList)=='[object Array]'){
          let days = (this.getRangeTime(dateList[1]) - this.getRangeTime(dateList[0])) / 86400000 +1
          for(let i= 0 ; i<days; i++){
            this.changingDateArr.push(this.getRangeTime(dateList[0])+86400000*i)
          }
        }else{
          this.changingDateArr.push(this.getRangeTime(dateList))
        }
        this.changingDateArr = this.deepUniqueArr(this.changingDateArr)
      },
      removeChangingDate (i) {
        this.changingDateArr.splice(i,1)
      },
      confirmChangeDate () {
        if(this.changingDateArr.length != this.lessonDays){
          this.$Message.error('班次天数与课程不一致！')
          return
        }else{
          this.$http({
            method:'post',
            url: this.$store.state.app.baseUrl+'classInfo/updateClassDays',
            headers: {'Content-type': 'application/json'},
            data: {
              id: this.changingId,
              studyTimeList: this.changingDateArr
            }
          })
            .then((res)=> {
              if(res.data.code == 0) {
                this.$Message.success('修改成功')
                this.getLessonClasses()
              } else {
                this.$Message.error(res.data.message)
              }
            })
            .catch((error)=> {
              this.$Message.error(error.message)
            })
        }
      }
    },
    mounted() {
      this.getLessonInfo()
      this.getLessonClasses()
      this.getPeriods()
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
    .thead{
        width: 100%;
        .tr{
            background-color: #f8f8f9;
            width: 100%;
            /*display: flex;*/
            border-top:1px solid #e9eaec;
            border-left:1px solid #e9eaec;
            border-bottom:1px solid #e9eaec;
            //justify-content: flex-start;
            .th{
                text-align: center;
                /*flex:1;*/
                //display: table-cell;
                margin-right: -4px;
                border-right:1px solid #e9eaec;
                box-sizing: border-box;
                display: inline-block;
                //min-width: 100px;
                min-height: 50px;
                padding: 14px 5px;
            }
        }
    }
    .tbody{
        background-color: #fff;
        border-left:1px solid #e9eaec;
        border-bottom:1px solid #e9eaec;
        .tr{
            width: 100%;
            //display: flex;
            //justify-content: flex-start;
            .td{
                //flex:1;
                text-align: center;
                margin: 0 ;
                margin-right: -4px;
                border-right:1px solid #e9eaec;
                border-bottom:1px solid #e9eaec;
                box-sizing: border-box;
                //min-width: 100px;
                min-height: 50px;
                //display: table-cell;
                display: inline-block;
            }
            .add{
                padding: 0 10px;
                line-height: 50px;
            }
        }
    }
    .chosen{
        margin-top: 20px;
        border:1px solid #f0f0f0;
        padding: 15px 8px;
        display: flex;
        flex-wrap: wrap;
        .chosenItem{
            padding:3px 5px;
            border-radius: 4px;
            background-color: #f0f0f0;
            border:1px solid #f0f0f0;
            margin-top: 5px;
            margin-right: 8px;
            line-height: 1.5;
            /*white-space:nowrap;*/
        }
        .chosenClass{
            background-color: #ffffff;
            border:1px solid #f0f0f0;
            /*white-space:nowrap;*/
        }
        .removeIcon{
            cursor: pointer;
            color: #ccc;
        }
        .removeIcon:hover{
            color: #aaa;
        }
    }
</style>
