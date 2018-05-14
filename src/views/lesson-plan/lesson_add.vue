<template>
  <transition name="show">
    <Card id="lesson_add">
      <template>
        <Form ref="lessonAddNotGroup" :rules="addNotGroupRules" :model="lessonAddNotGroup" :label-width="150">
          <div class="" v-if="isShow">
            <Row>
              <Col span="12">
              <FormItem prop="classType" label="班级类型" >
                <Select v-model="lessonAddNotGroup.classType" @on-change="changeGroup">
                  <Option v-for="item in classType" :key="item.value" :value="item.value">{{item.label}}</Option>
                </Select>
              </FormItem>
              </Col>
              <Col span="12">
              <FormItem prop="examStyleId" label="考试类型">
                <Select v-model="lessonAddNotGroup.examStyleId" @on-change="searchClassSeries">
                  <Option value="">请选择</Option>
                  <Option v-for="item in examStyleList" :key="item.value" :value="item.value">{{item.label}}</Option>
                </Select>
              </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="12">
              <FormItem prop="classSeriesId" label="班级系列">
                <Select v-model="lessonAddNotGroup.classSeriesId">
                  <Option value="">请选择</Option>
                  <Option v-for="item in classSeriesIdNotGroup" :key="item.id" :value="item.id + ''">{{item.classSeriesName}}</Option>
                </Select>
              </FormItem>
              </Col>
              <!--<Col span="12">-->
              <!--<FormItem prop="rootDirectoryName" label="根目录">-->
                <!--<Input v-model="lessonAddNotGroup.rootDirectoryName"></Input>-->
              <!--</FormItem>-->
              <!--</Col>-->
              <Col span="12">
              <FormItem label="课时" prop="classHour" class="classHour">
                <InputNumber :min="1" v-model="lessonAddNotGroup.classHour.day"></InputNumber>
                <span style="display: inline-block;width: 10px;text-align: center;margin:0 20px;">天</span>
                <InputNumber :min="0" v-model="lessonAddNotGroup.classHour.night"></InputNumber>
                <span style="display: inline-block;width: 10px;text-align: center;margin:0 20px;">晚</span>
              </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="12">
              <FormItem prop="categoryIds" label="科目">
                <Select multiple v-model="lessonAddNotGroup.categoryIds"  :label-in-value="true" >
                  <Option v-for="item in categoryName" :key="item.id" :value="item.id">{{item.categoryName}}</Option>
                </Select>
              </FormItem>
              </Col>
              <Col span="12">
              <FormItem prop="schoolBeginsTime" label="预计开课日期">
                <DatePicker type="date" v-model="lessonAddNotGroup.schoolBeginsTime" placeholder="输入预计开课时间"></DatePicker>
              </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="12">
              <FormItem prop="courseName" label="课程名称">
                <Input v-model="lessonAddNotGroup.courseName"></Input>
              </FormItem>
              </Col>
              <Col span="12">
              <FormItem prop="openClassTime" label="开班时间">
                <Select v-model="lessonAddNotGroup.openClassTime">
                  <Option value="上午">上午</Option>
                  <Option value="下午">下午</Option>
                  <Option value="晚上">晚上</Option>
                </Select>
              </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="12">
              <FormItem prop="projectTag" label="项目">
                <Select v-model="lessonAddNotGroup.projectTag">
                  <Option value="普通项目">普通项目</Option>
                  <Option value="一对一项目">一对一项目</Option>
                  <Option value="公开课">公开课</Option>
                </Select>
              </FormItem>
              </Col>
              <Col span="12">
              <FormItem label="休息天数" prop="dayOfRest" class="dayOfRest">
                <InputNumber :min="0" v-model="lessonAddNotGroup.dayOfRest"></InputNumber>
              </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="12">
              <FormItem prop="erpClassTypeId" label="erp班级类型">
                <Select v-model="lessonAddNotGroup.erpClassTypeId">
                  <Option value="">请选择</Option>
                  <Option v-for="item in erpClassTypeList" :value="item.id" :key="item.id">{{item.classTypeName}}</Option>
                </Select>
              </FormItem>
              </Col>
              <Col span="12">
              <FormItem prop="writeMan" label="主办人-笔试：" class="writeMan" v-if="lessonAddNotGroup.examStyleId == 1 && this.createModel">
                <Select v-model="lessonAddNotGroup.writeMan" style="width:200px" placeholder="选择人员">
                  <Option value="">请选择</Option>
                  <Option v-for="item,index in writeManList" :value="item.planerId" :key="item.planerName">{{ item.planerName }}</Option>
                </Select>
              </FormItem>
              </Col>
              <Col span="12">
              <FormItem prop="writeMan" label="主办人-面试：" class="faceMan" v-if="lessonAddNotGroup.examStyleId == 2 && this.createModel">
                <Select v-model="lessonAddNotGroup.faceMan" style="width:200px" placeholder="选择人员">
                  <Option value="">请选择</Option>
                  <Option v-for="item,index in faceManList" :value="item.planerId" :key="item.planerName">{{ item.planerName }}</Option>
                </Select>
              </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="6" v-if="lessonAddNotGroup.examStyleId == 2">
              <FormItem prop="interviewGroupNumber" label="面试分组人数" class="interviewGroupNumber">
                <Input :min="1" v-model="lessonAddNotGroup.interviewGroupNumber"></Input>
              </FormItem>
              </Col>
            </Row>
            <p style="border-bottom: 1px solid #e9eaec;padding: 14px 16px;line-height: 1;    margin-bottom: 20px;">
              <Icon type="pinpoint" ></Icon>
              价格
              <Button type="primary" style="margin-left: 15px" @click="addInfo">添加</Button>
              <span style="font-size: 12px;color:red;">(请填写价格，否则将提交默认值)</span>
            </p>
            <Row v-for="item,index in lessonAddNotGroup.priceInfoArray" :key="index" class="priceItem">
              <Row>
                <Col span="8">
                <FormItem prop="agreement" label="是否协议">
                  <Select v-model="item.agreement">
                    <Option value="协议">协议</Option>
                    <Option value="非协议">非协议</Option>
                  </Select>
                </FormItem>
                </Col>
                <Col span="8">
                <FormItem prop="isClosed" label="封闭班">
                  <Select v-model="item.isClosed">
                    <Option value="1">是</Option>
                    <Option value="0">否</Option>
                  </Select>
                </FormItem>
                </Col>
                <Col span="6">
                <FormItem prop="price" label="价格">
                  <InputNumber :min="0" v-model="item.price"></InputNumber>
                </FormItem>
                </Col>
                <Col span="2">
                <Row type="flex" justify="space-around">
                  <!--<Button type="primary" @click="addInfo">增加</Button>-->
                  <Button type="error"  @click="delInfo(index)">删除</Button>
                </Row>
                </Col>
              </Row>
              <Row>
                <Col span="8" v-if="item.isClosed == 1">
                <FormItem prop="stay" label="住宿地址">
                  <Select v-model="item.stay">
                    <Option value="基地">基地</Option>
                    <Option value="酒店">酒店</Option>
                  </Select>
                </FormItem>
                </Col>
                <Col span="8" v-if="item.agreement == '协议'">
                <div v-if="lessonAddNotGroup.examStyleId == 1 && item.agreement == '协议'">
                  <FormItem prop="writtenTf" label="笔试不过退费">
                    <InputNumber :min="0" v-model="item.writtenTf"></InputNumber>
                  </FormItem>
                </div>
                <div v-if="lessonAddNotGroup.examStyleId == 2 && item.agreement == '协议'">
                  <FormItem prop="interviewTf" label="面试不过退费">
                    <InputNumber :min="0" v-model="item.interviewTf"></InputNumber>
                  </FormItem>
                </div>
                </Col>
                <Col span="8" class="price_mark">
                <FormItem label="备注">
                  <Input type="textarea" v-model="item.mark" :rows="1"></Input>
                </FormItem>
                </Col>
              </Row>
            </Row>
            <Row>
              <Col span="12">
              <FormItem label="课程定位" prop="classOrientation">
                <Input type="textarea" :rows="4" v-model="lessonAddNotGroup.classOrientation"></Input>
              </FormItem>
              </Col>
              <Col span="12">
              <FormItem label="课时设置/分校意见" prop="branchCampusOption">
                <Input  type="textarea" :rows="4" v-model="lessonAddNotGroup.branchCampusOption"></Input>
              </FormItem>
              </Col>
            </Row>
          </div>
        </Form>
        <Form ref="lessonAddGroup" :rules="addGroupRules" :model="lessonAddGroup" :label-width="150">
          <div class="" v-if="!isShow">
            <Row>
              <Col span="6">
              <FormItem prop="classType" label="子班级班级类型">
                <Select v-model="lessonAddGroup.classType" @on-change="changeGroup">
                  <Option v-for="item in classType" :key="item.value" :value="item.value">{{item.label}}</Option>
                </Select>
              </FormItem>
              </Col>
              <Col span="6" style="text-align: center;height: 30px;line-height: 30px;"><h3> 请选择子班次:</h3></Col>
            </Row>
            <Row>
              <Col span="6">
              <FormItem prop="examStyleId" label="考试类型">
                <Select v-model="lessonAddGroup.examStyleId" @on-change="searchClassSeries">
                  <Option value="">请选择</Option>
                  <Option v-for="item in examStyleList" :key="item.value" :value="item.value">{{item.label}}</Option>
                </Select>
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem label="班级系列" prop="childrenClassSeriesId">
                <Select v-model="lessonAddGroup.childrenClassSeriesId">
                  <Option value="">请选择</Option>
                  <Option v-for="seriesItem in classSeriesIdGroup" :key="seriesItem.id" :value="seriesItem.id">{{seriesItem.classSeriesName}}</Option>
                </Select>
              </FormItem>
              </Col>
              <!--<Col span="6">
              <FormItem label="根目录" prop="rootDirectoryName">
                <Select  v-model="lessonAddGroup.rootDirectoryName">
                  <Option value="">请选择</Option>
                  <Option v-for="rootItem in rootDirectoryNameGroup" :key="rootItem.id" :value="rootItem.rootDirectoryName">{{rootItem.rootDirectoryName}}</Option>
                </Select>
              </FormItem>
              </Col>-->
              <Col span="6" style="text-align: center">
              <Button type="success" style="margin-right: 40px;" @click="searchChild">搜索</Button>
              </Col>
            </Row>
            <Row>
              <table id="template_table" border="1" width="100%" style="border-collapse:collapse;text-align: center;margin-bottom: 50px;">
                <tr>
                  <th v-for="item in tableHeadData">{{item.value}}</th>
                  <th>操作</th>
                </tr>
                <tr v-for="item,index in mergedData" style="background-color:rgba(153, 153, 255,0.5)">
                  <td>{{item.courseName}}</td>
                  <td>{{item.classSeries.classSeriesName}}</td>
                  <!--<td>{{item.rootDirectoryName}}</td>-->
                  <td>{{item.examStyleId ==1?'笔试':item.examStyleId ==2?'面试':'笔试+面试'}}</td>
                  <td>{{item.classHour}}</td>
                  <td>{{item.categoryName}}</td>
                  <td>{{item.schoolBeginsTime | formateDate}}</td>
                  <td>{{item.openClassTime}}</td>
                  <td>{{item.projectId ==1?'公务员(国考)':item.projectId ==2?'公务员(省考)':'事业单位'}}</td>
                  <td>{{item.isClosed ==1?'封闭班':'非封闭班'}}</td>
                  <td>{{item.dayOfRest}}</td>
                  <td>
                    <div v-for="i in item.priceInfoArray">
                      <span>{{i.agreement + '班-' + i.price  + (i.stay==null?'-':'-'+i.stay)  + (i.writtenTf?'-笔试不过退费:'+i.writtenTf:'') + (i.interviewTf?'-面试不过退费:'+i.interviewTf:'')}}</span>
                    </div>
                  </td>
                  <td>{{item.interviewGroupNumber}}</td>
                  <td>{{item.classOrientation}}</td>
                  <td>{{item.branchCampusOption}}</td>
                  <td>
                    <span style="color: #ff0000;">已添加</span>
                    <span class="operate" @click="deleteData(index)">删除</span>
                  </td>
                </tr>
                <tr v-for="item,index in searchedData">
                  <td>{{item.courseName}}</td>
                  <td>{{item.classSeries.classSeriesName}}</td>
                  <!--<td>{{item.rootDirectoryName}}</td>-->
                  <td>{{item.examStyleId ==1?'笔试':item.examStyleId ==2?'面试':'笔试+面试'}}</td>
                  <td>{{item.classHour}}</td>
                  <td>{{item.categoryName}}</td>
                  <td>{{item.schoolBeginsTime | formateDate}}</td>
                  <td>{{item.openClassTime}}</td>
                  <td>{{item.projectId ==1?'公务员(国考)':item.projectId ==2?'公务员(省考)':'事业单位'}}</td>
                  <td>{{item.isClosed == 1?'封闭班':'非封闭班'}}</td>
                  <td>{{item.dayOfRest}}</td>
                  <td>
                    <div v-if="item.priceInfoArray.length > 0" v-for="i in item.priceInfoArray">
                      <span>{{i.agreement + '班-' + i.price  + (i.stay==null?'-':'-'+i.stay)  + (i.writtenTf?'-笔试不过退费:'+i.writtenTf:'') + (i.interviewTf?'-面试不过退费:'+i.interviewTf:'')}}</span>
                    </div>
                    <div v-if="item.priceInfoArray.length == 0">
                      <span>--</span>
                    </div>
                  </td>
                  <td>{{item.interviewGroupNumber}}</td>
                  <td>{{item.classOrientation?item.classOrientation:'--'}}</td>
                  <td>{{item.branchCampusOption?item.branchCampusOption:'--'}}</td>
                  <td class="operate" @click="addToMergedData(index,item.examStyleId)">添加</td>
                </tr>
              </table>
            </Row>
            <p style="border-bottom: 1px solid #e9eaec;padding: 14px 16px;line-height: 1;margin-bottom: 20px;">
              <Icon type="pinpoint" ></Icon>
              价格
              <Button type="primary" style="margin-left: 15px" @click="addInfo">添加</Button>
            </p>
            <Row v-for="item,index in lessonAddGroup.priceInfoArray" :key="index" class="priceItem">
              <Row>
                <Col span="8">
                <FormItem prop="agreement" label="是否协议">
                  <Select v-model="item.agreement">
                    <Option value="协议">协议</Option>
                    <Option value="非协议">非协议</Option>
                  </Select>
                </FormItem>
                </Col>
                <Col span="6">
                <FormItem prop="price" label="价格">
                  <InputNumber :min="0" v-model="item.price"></InputNumber>
                </FormItem>
                </Col>
                <Col span="4" offset="6">
                <Row type="flex" justify="space-around">
                  <Button type="error"  @click="delInfo(index)">删除</Button>
                </Row>
                </Col>
              </Row>
              <Row>
                <Col span="8" v-if="tfIsShow == 1 || tfIsShow == 3">
                <FormItem prop="writtenTf" label="笔试不过退费">
                  <InputNumber  v-model="item.writtenTf" :min="0"></InputNumber>
                </FormItem>
                </Col>
                <Col span="8" v-if="tfIsShow == 2 || tfIsShow == 3">
                <FormItem prop="interviewTf" label="面试不过退费">
                  <InputNumber  v-model="item.interviewTf" :min="0"></InputNumber>
                </FormItem>
                </Col>
                <Col span="8" class="price_mark">
                <FormItem label="备注">
                  <Input type="textarea" v-model="item.mark" :rows="1"></Input>
                </FormItem>
                </Col>
              </Row>
            </Row>
            <Row>
              <Col span="12">
              <FormItem prop="erpClassTypeId" label="erp班级类型">
                <Select v-model="lessonAddGroup.erpClassTypeId">
                  <Option value="">请选择</Option>
                  <Option v-for="item in erpClassTypeList" :value="item.id" :key="item.id">{{item.classTypeName}}</Option>
                </Select>
              </FormItem>
              </Col>
              <Col span="12">
              <FormItem prop="classSeriesId" label="班级系列">
                <Select v-model="lessonAddGroup.classSeriesId">
                  <Option value="">请选择</Option>
                  <Option v-for="item in classSeriesIdGroupSelf" :value="item.id" :key="item.id">{{item.classSeriesName}}</Option>
                </Select>
              </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="6">
              <FormItem prop="courseName" label='课程名称'>
                <Input v-model="lessonAddGroup.courseName"></Input>
              </FormItem>
              </Col>
            </Row>
          </div>
        </Form>
        <div class="submit">
          <Row>
            <Col span="4" offset="10">
            <Button type="primary" size="large" long @click="submit" :disabled="disabled">提交</Button>
            </Col>
          </Row>
        </div>
      </template>
    </Card>
  </transition>
</template>

<script>
  import Util from '../../libs/util'
  export default {
    name: "lesson_add",
    props:[
      'createModel',
      'search2'
    ],
    data() {
      const validateCourseName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('课程名称不能为空'));
        }else {
          this.checkExist(callback)
        }
      };

      const validateSeries = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('班级系列不能为空'));
        }else {
          callback();
        }
      };

      const validateErp = (rule, value, callback) => {
        if (value == '') {
          callback(new Error('erp班级系列不能为空'));
        }else {
          callback();
        }
      };

      const validateAddErp = (rule, value, callback) => {
        if (value == '') {
          callback(new Error('erp班级类型不能为空'));
        }else {
          callback();
        }
      };

      const validateClassSeriesId = (rule, value, callback) => {
        if (value == '') {
          callback(new Error('班级系列不能为空'));
        }else {
          callback();
        }
      };

      const validateSponsor = (rule, value, callback) => {
        if(value == '') {
          if(this.lessonAddNotGroup.examStyleId == 1) {
            callback(new Error('笔试主办人不能为空'));
          }else if (this.lessonAddNotGroup.examStyleId == 2) {
            callback(new Error('面试主办人不能为空'));
          }
        }else {
          callback();
        }

      }
      return {
        disabled:false,
        lessonAddNotGroup: {
          courseName:'',     //班级名称
          classType: '',   //班级类型
          classSeriesId: '', //班级系列
          // rootDirectoryName: '',    //根目录
          examStyleId:'',    //考试类型
          //课时
          classHour:{
            day:1,
            night:0
          },
          categoryIds:[],     //科目
          schoolBeginsTime:'',     //预计开课日期
          openClassTime:'',        //开班日期
          projectTag:'',     // 项目
          // isClosed:'',
          dayOfRest:0, //休息天数
          classOrientation:'',   //课程定位
          branchCampusOption:'',       //课时设置／分校意见
          interviewGroupNumber:0 ,       //分组人数
          erpClassTypeId:'',
          priceInfoArray:[
            {
              agreement:'协议',   //是否协议  0 协议 1 非协议
              stay:'基地',        //住宿地址  0 基地 1 酒店
              price:0,       // 价格
              isClosed:'1',      //是否封闭班 1 是 0 否
              writtenTf:0,     //面试不过退费
              interviewTf:0,     //笔试不过退费
              mark:''
            }
          ],
          projectId:'',
          announcementId:'',
          writeMan:'',
          faceMan:''
        },  //非组合班次
        addNotGroupRules: {
          courseName:[{validator:validateCourseName,required:true,trigger:'blur'}],
          classType:[{required:true,message:'班级类型不能为空',trigger:'change'}],
          classSeriesId:[{validator:validateSeries,required:true,trigger:'change'}],
          examStyleId:[{required:true,message:'考试类型不能为空',trigger:'change'}],
          // rootDirectoryName:[{validator:validateRoot,required:true,trigger:'blur'}],
          categoryIds:[{required:true,type:'array',message:'科目不能为空',trigger:'change'}],
          schoolBeginsTime:[{required:true,type:'date',message:'预计开课日期不能为空',trigger:'change'}],
          openClassTime:[{required:true,message:'开班日期不能为空',trigger:'change'}],
          projectTag:[{required:true,message:'项目不能为空',trigger:'change'}],
          writeMan:[{validator:validateSponsor,required:true,trigger:'change'}],
          erpClassTypeId:[{validator:validateErp,required:true,trigger:'change'}]
        },

        lessonAddGroup:{
          examStyleId:'',
          classType: '',   //班级类型
          childrenClassSeriesId: '', //班级系列
          // rootDirectoryName: '',    //根目录
          priceInfoArray:[
            {
              agreement:'协议',   //是否协议  0 协议 1 非协议
              // stay:'基地',        //住宿地址  0 基地 1 酒店
              price:0,       // 价格
              writtenTf:0,     //面试不过退费
              interviewTf:0,     //笔试不过退费
              mark:''
            }
          ],
          erpClassTypeId:'',
          classSeriesId:'',
          courseName:'',     //班级名称
        },      //组合班次
        addGroupRules:{
          courseName:[{validator:validateCourseName,required:true,trigger:'blur'}],
          classType:[{required:true,message:'班级类型不能为空',trigger:'change'}],
          classSeriesId:[{required:true,validator:validateClassSeriesId,trigger:'change'}],
          erpClassTypeId:[{validator:validateAddErp,required:true,trigger:'change'}],
        },

        classType: [
          {
            value: '1',
            label: '组合班次'
          },
          {
            value: '2',
            label: '非组合班次'
          }
        ],

        examStyleList:[
          {
            value:'1',
            label:'笔试'
          },
          {
            value:'2',
            label:'面试'
          }
        ],          //考试类型


        //获取的数据
        classSeriesIdGroup:[],      //班级系列  组合班次子班次
        classSeriesIdNotGroup: [],    //班级系列  非组合班次
        classSeriesIdGroupSelf:[],    //组合班次自身的班级系列
        categoryName: [],    //科目名称
        // rootDirectoryNameGroup:[],      //组合班次根目录名称
        erpClassTypeList:[],

        selectedSub:[],     //  选中的科目
        tableHeadData:[
          {name:'name',value:'班级名称'},
          {name:'classSeriesId',value:'班级系列'}, //班级系列
          // {name:'rootDirectoryName',value:'根目录'},    //根目录
          {name:'examStyleId',value:'考试类型'},    //考试类型
          {name:'classHour',value:'课时'},
          {name:'categoryName',value:'科目'},
          {name:'schoolBeginsTime',value:'预计开课日期'},
          {name:'openClassTime',value:'开班时间'},
          {name:'projectId',value:'项目'},
          {name:'isClosed',value:'封闭班'},
          {name:'dayOfRest',value:'休息天数'},
          {name:'coursePrice',value:'课程价格'},
          {name:'interviewGroupNumber',value:'分组人数'},
          {name:'classOrientation',value:'课程定位'},
          {name:'branchCampusOption',value:'课时设置／分校意见'}
        ],
        searchedData: [],
        mergedData:[],
        isShow:true,    // 组合和非组合显示隐藏
        examStyle:'',   //选中的考试类型
        writeManList:[],
        faceManList:[],
        tfIsShow:0,
        examStyleIdList:[],
        map:new Map()
      }
    },
    methods:{
      submit () {
        if(this.createModel) {   //创建母版时
          if(this.isShow) {    //非组合母版
            this.$refs['lessonAddNotGroup'].validate((valid) => {
              if (valid) {
                this.disabled = true;
                let data = {};
                data = Util.deepClone(this.lessonAddNotGroup);
                let priceArr = [];
                // data.infoArr.forEach((item,index)=>{
                //     priceArr.push(item.agreement + '班-' + item.price + '-' + item.stay + '-' + item.writtenTf + '-' + item.interviewTf)
                // });
                // let price = priceArr.join(',');
                // data.coursePrice = price;
                data.classHour =  data.classHour.day + '天' + data.classHour.night + '晚';
                data.schoolBeginsTime = data.schoolBeginsTime.getTime();
                data.announcementId = this.$route.params.id;
                data.projectId = this.$route.query.projectId;
                data.provinceId = this.$route.query.provinceId;
                data.studyStyleId = 1;
                data.isShow = 1;

                if(this.lessonAddNotGroup.writeMan == '' && this.lessonAddNotGroup.faceMan == '') {
                  this.$Message.error('请选择主办人');
                  this.disabled = false;
                  return;
                }
                let writeManName,faceManName;
                this.writeManList.forEach((item)=>{
                  if(item.planerId == this.lessonAddNotGroup.writeMan) {
                    writeManName = item.planerName;
                  }
                });
                this.faceManList.forEach((item)=>{
                  if(item.planerId == this.lessonAddNotGroup.faceMan) {
                    faceManName = item.planerName;
                  }
                });
                let writeManObj = {
                  planerId:this.lessonAddNotGroup.writeMan,
                  planerName:writeManName,
                  examStyleId:1
                };
                let faceManObj = {
                  planerId:this.lessonAddNotGroup.faceMan,
                  planerName:faceManName,
                  examStyleId:2
                };
                data.coursePlaners = [writeManObj,faceManObj];

                //发送请求
                this.$http({
                  method:'post',
                  url:this.$store.state.app.baseUrl + 'courseModel/create',
                  data: data,
                  headers: {'Content-type': 'application/json'}
                })
                  .then((res)=>{
                    this.disabled = false;
                    if(res.data.code == 0) {
                      this.$Message.success('提交成功!');
                      this.$refs['lessonAddNotGroup'].resetFields();
                      this.lessonAddNotGroup.priceInfoArray.splice(0,this.lessonAddNotGroup.priceInfoArray.length,{agreement:'协议', stay:'基地', price:0, writtenTf:0,interviewTf:0})
                      this.lessonAddNotGroup.categoryIds.splice(0,this.lessonAddNotGroup.categoryIds.length);
                    }else {
                      this.$Message.error(res.data.message);
                    }
                  })
              } else {
                this.disabled = false;
                this.$Message.error('请将信息填写完整');
              }
            });
          }else {          //组合母版
            this.$refs['lessonAddGroup'].validate((valid) => {
              if (valid) {
                this.disabled = true;
                // let priceArr = [];
                // this.lessonAddGroup.priceInfoArray.forEach((item,index)=>{
                //     priceArr.push(item.agreement + '-' + item.price + '-' + item.stay + '-' + item.writtenTf + '-' + item.interviewTf)
                // });
                // let price = priceArr.join(',');
                let data = {
                  priceInfoArray:this.lessonAddGroup.priceInfoArray,
                  erpClassTypeId:this.lessonAddGroup.erpClassTypeId,
                  classSeriesId:this.lessonAddGroup.classSeriesId,
                  courseName:this.lessonAddGroup.courseName,
                  classType:this.lessonAddGroup.classType,
                  provinced:this.$route.query.provinceId,
                  subCourses:this.mergedData
                }
                this.$http({
                  method:'post',
                  url:this.$store.state.app.baseUrl + 'courseModel/group',
                  data:data,
                  headers: {'Content-type': 'application/json'}
                })
                  .then((res)=>{
                    this.disabled = false;
                    if(res.data.code == 0) {
                      this.$Message.success('提交成功!');
                      this.$refs['lessonAddGroup'].resetFields();
                      this.lessonAddGroup.priceInfoArray.splice(0,this.lessonAddGroup.priceInfoArray.length,{agreement:'协议', price:0, writtenTf:0,interviewTf:0})
                    }else {
                      this.$Message.error(res.data.message);
                    }
                  })
                  .catch((error)=>{
                    this.disabled = false;
                    this.$Message.error(error.message)
                  })

              } else {
                this.disabled = false;
                this.$Message.error('请将信息填写完整');
              }
            });
          }
        }else{   //创建课程时
          if(this.isShow) {        //非组合课程
            this.$refs['lessonAddNotGroup'].validate((valid) => {
              if (valid) {
                this.disabled = true;
                let data = {};
                data = Util.deepClone(this.lessonAddNotGroup);
                // let priceArr = [];
                // data.infoArr.forEach((item,index)=>{
                //     priceArr.push(item.agreement + '班-' + item.price + '-' + item.stay + '-' + item.writtenTf + '-' + item.interviewTf)
                // });
                // let price = priceArr.join(',');
                // data.coursePrice = price;
                data.classHour =  data.classHour.day + '天' + data.classHour.night + '晚';
                data.schoolBeginsTime = data.schoolBeginsTime.getTime();
                data.announcementId = this.$route.params.id;
                data.projectId = this.$route.query.projectId;
                data.provinceId = this.$route.query.provinceId;
                data.studyStyleId = 1;
                data.isShow = 1;
                //发送请求
                this.$http({
                  method:'post',
                  url:this.$store.state.app.baseUrl + 'course/create',
                  data: data,
                  headers: {'Content-type': 'application/json'}
                })
                  .then((res)=>{
                    this.disabled = false;
                    if(res.data.code == 0) {
                      this.$Message.success('提交成功!');
                      this.$refs['lessonAddNotGroup'].resetFields();
                      this.lessonAddNotGroup.priceInfoArray.splice(0,this.lessonAddNotGroup.priceInfoArray.length,{agreement:'协议', stay:'基地', price:0,  writtenTf:0,interviewTf:0});
                      this.lessonAddNotGroup.categoryIds.splice(0,this.lessonAddNotGroup.categoryIds.length);
                      this.search2();
                    }else {
                      this.$Message.error(res.data.message);
                    }
                  })
              } else {
                this.disabled = false;
                this.$Message.error('请将信息填写完整');
              }
            });
          }else {
            this.$refs['lessonAddGroup'].validate((valid) => {
              if (valid) {
                this.disabled = true;
                // let priceArr = [];
                // this.lessonAddGroup.infoArr.forEach((item,index)=>{
                //     priceArr.push(item.agreement + '班-' + item.price + '-' + item.stay + '-' + item.writtenTf + '-' + item.interviewTf)
                // });
                // let price = priceArr.join(',');
                let data = {
                  priceInfoArray:this.lessonAddGroup.priceInfoArray,
                  erpClassTypeId:this.lessonAddGroup.erpClassTypeId,
                  classSeriesId:this.lessonAddGroup.classSeriesId,
                  courseName:this.lessonAddGroup.courseName,
                  interviewTf:this.lessonAddGroup.interviewTf,
                  writtenTf:this.lessonAddGroup.writtenTf,
                  subCourses:this.mergedData
                };

                if(this.mergedData.length == 0) {
                  this.$Message.error('请添加子课程');
                  this.disabled = false;
                }else {
                  this.$http({
                    method:'post',
                    url:this.$store.state.app.baseUrl + 'course/createGroup',
                    data:data,
                    headers: {'Content-type': 'application/json'}
                  })
                    .then((res)=>{
                      this.disabled = false;
                      if(res.data.code == 0 ){
                        this.$Message.success('提交成功!');
                        this.$refs['lessonAddGroup'].resetFields();
                        this.lessonAddGroup.priceInfoArray.splice(0,this.lessonAddGroup.priceInfoArray.length,{agreement:'协议', price:0, writtenTf:0,interviewTf:0})
                        this.search2();
                      }else{
                        this.$Message.error(res.data.message);
                      }
                    })
                    .catch((error)=>{
                      this.disabled = false;
                      this.$Message.error(error.message)
                    })
                }
              } else {
                this.disabled = false;
                this.$Message.error('请将信息填写完整');
              }
            });
          }
        }
      },
     /* searchRootByClassSeries(){       //根据班级系列获取根目录
        this.$http({
          method:'get',
          url:this.$store.state.app.baseUrl + 'classSeries/findRootDirectory',
          params:{
            examStyle:this.examStyle,
            classSeriesId:this.lessonAddGroup.childrenClassSeriesId
          },
          headers: {'Content-type': 'application/json'}
        })
          .then((res)=>{
            this.rootDirectoryNameGroup = res.data.data
          })
          .catch((error)=>{
          this.$Message.error(error.message)
          })
      },*/
      searchClassSeries() {       //根据笔试面试获取班级系列
        if(this.isShow) {   //非组合班次
          this.examStyle = this.lessonAddNotGroup.examStyleId;
          this.$http({
            method:'get',
            url:this.$store.state.app.baseUrl + 'classSeries/findByExamStyle',
            params:{
              examStyle:this.examStyle
            },
            headers: {'Content-type': 'application/json'}
          })
            .then((res)=>{
              if(res.data.code == 0) {
                this.classSeriesIdNotGroup = res.data.data;
              }else{
                this.$Message.error(res.data.message);
              }
            })
            .catch((error)=>{
            this.$Message.error(error.message)
            })
        }else {     //组合班次
          this.examStyle = this.lessonAddGroup.examStyleId;
          this.$http({
            method:'get',
            url:this.$store.state.app.baseUrl + 'classSeries/findByExamStyle',
            params:{
              examStyle:this.examStyle
            },
            headers: {'Content-type': 'application/json'}
          })
            .then((res)=>{
              if(res.data.code == 0) {
                this.classSeriesIdGroup = res.data.data;
              }else{
                this.$Message.error(res.data.message);
              }
            })
            .catch((error)=>{
            this.$Message.error(error.message)
            })
        }

         // 创建母版 需要指定规划人
        if(this.createModel) {
          if(this.isShow) { //非组合
            this.$http({
              method:'get',
              url:this.$store.state.app.baseUrl + 'course/CoursePlaner',
              params:{
                examStyleId:this.lessonAddNotGroup.examStyleId
              }
            })
              .then((res)=>{
                if(res.data.code == 0) {
                  this.writeManList = res.data.data;
                } else {
                  this.$Message.error(res.data.message);
                }
              })
              .catch((error)=>{
                this.$Message.error(error.message);
              })
          }
        }

      },
      checkExist (callback) {     //根目录查重
        let courseName = this.lessonAddNotGroup.courseName;
        if(this.lessonAddNotGroup.classType == 2 || (this.lessonAddNotGroup.classType == '' && this.lessonAddGroup.classType == '')) {
          courseName = this.lessonAddNotGroup.courseName;
        }else if(this.lessonAddGroup.classType == 1) {
          courseName = this.lessonAddGroup.courseName;
        }
        let projectId = this.$route.query.projectId;
        if(this.createModel) {   //母版
          this.$http({
            method:'get',
            url:this.$store.state.app.baseUrl + 'courseModel/checkCourseName',
            params:{
              courseModelName:courseName,
              projectId:projectId,
            },
            headers: {'Content-type': 'application/json'}
          })
            .then((res)=>{
              if(res.data.code == 0) {
                if(res.data.data == false) {
                  callback(new Error('母版名称已存在'));
                }else {
                  callback();
                }
              }else{
                this.$Message.error(res.data.message);
              }
            })
            .catch((error)=>{
              this.$Message.error(error.message);
            })
        }else {    //课程
          this.$http({
            method:'get',
            url:this.$store.state.app.baseUrl + 'course/checkCourseName',
            params:{
              courseName:courseName,
              projectId:projectId,
            },
            headers: {'Content-type': 'application/json'}
          })
            .then((res)=>{
              if(res.data.code == 0) {
                if(res.data.data == false) {
                  callback(new Error('课程名称已存在'));
                }else {
                  callback();
                }
              }else{
                this.$Message.error(res.data.message);
              }
            })
            .catch((error)=>{
              this.$Message.error(error.message);
            })
        }

      },
      searchChild () {
        let classType = 2;
        let examStyle = this.lessonAddGroup.examStyleId;
        let classSeries = this.lessonAddGroup.childrenClassSeriesId;
        // let rootDirectoryName = this.lessonAddGroup.rootDirectoryName;
        let announcementId = this.$route.params.id;
        let checkStates=[7];
        let data = {
          classType:classType,
          examStyle:examStyle,
          classSeries:classSeries,
          // rootDirectoryName:rootDirectoryName,
          announcementId:announcementId,
          checkStates:checkStates
        };
        this.$http({
          method:'POST',
          url:this.$store.state.app.baseUrl + 'course/query',
          data:data,
          headers: {'Content-type': 'application/json'}
        })
          .then((res)=>{
            this.searchedData = res.data.data.content;
          })
          .catch(()=>{
            this.$Message.error(error.message);
          })
      },
      addInfo () {
        if(this.isShow) {
          this.lessonAddNotGroup.priceInfoArray.push({
            agreement:'协议',   //是否协议  0 协议 1 非协议
            stay:'基地',        //住宿地址  0 基地 1 酒店
            price:0,       // 价格
            isClosed:1,
            writtenTf:0,     //面试不过退费
            interviewTf:0     //笔试不过退费
          })
        }else {
          this.lessonAddGroup.priceInfoArray.push({
            agreement:'协议',   //是否协议  0 协议 1 非协议
            stay:'基地',        //住宿地址  0 基地 1 酒店
            price:0,       // 价格
            isClosed:1,
            writtenTf:0,     //面试不过退费
            interviewTf:0     //笔试不过退费
          })
        }

      },
      delInfo (index) {
        if(this.isShow) {
          if(this.lessonAddNotGroup.priceInfoArray.length > 1) {
            this.lessonAddNotGroup.priceInfoArray.splice(index,1);
          }
        }else {
          if(this.lessonAddGroup.priceInfoArray.length > 1) {
            this.lessonAddGroup.priceInfoArray.splice(index,1);
          }
        }
      },
      changeGroup () {
        if(this.isShow) {
          if(this.lessonAddNotGroup.classType == '1'){
            this.isShow = false;
            this.lessonAddGroup.classType = '1';
            this.$http({
              method:'get',
              url:this.$store.state.app.baseUrl + 'classSeries/findAllClassSeries',

            })
              .then((res)=>{
                if(res.data.code == 0) {
                  this.classSeriesIdGroupSelf = res.data.data;
                } else {
                  this.$Message.error(res.data.message);
                }
              })
              .catch((error)=>{
                this.$Message.error(error.message);
              })
          }
        } else {
          if(this.lessonAddGroup.classType == '2') {
            this.isShow = true;
            this.lessonAddNotGroup.classType = '2';
          }
        }
      },
      addToMergedData(index,examStyleId){
        let data = this.searchedData[index];
        let id = data.id;
        let flag = true;
        let write = false;
        let interview = false;
        this.mergedData.forEach((item)=>{
          if(item.id == id) {
            flag = false;
            this.$Message.error('请勿重复添加相同课程！')
          }
        });
        if(flag) {
          this.mergedData.push(data);
        }
        this.mergedData.forEach((item)=>{
          if(item.examStyleId == 1) {
            this.tfIsShow = 1;
            write = true;
          }else if(item.examStyleId == 2) {
            this.tfIsShow = 2;
            interview = true;
          }
        })
        if(write == true && interview == true) {
          this.tfIsShow = 3;
        }
      },
      deleteData(index) {
        this.mergedData.splice(index,1);
        let write = false;
        let interview = false;
        this.mergedData.forEach((item)=>{
          if(item.examStyleId == 1) {
            console.log(1)
            this.tfIsShow = 1;
            write = true;
          }else if(item.examStyleId == 2) {
            console.log(2)
            this.tfIsShow = 2;
            interview = true;
          }
        })
        if(write == true && interview == true) {
          this.tfIsShow = 3;
        }
        if(this.mergedData.length == 0) {
          this.tfIsShow = 0;
        }
      }
    },
    filters:{
      formateDate:function(timeStamp){
        if(timeStamp == '' || timeStamp == undefined){
          return '--'
        }else {
          let date = new Date(timeStamp);
          let Y = date.getFullYear() + '-';
          let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
          let D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate());
          return Y+M+D;
        }
      }
    },
    beforeMount () {

    },
    mounted(){

      let projectId = this.$route.query.projectId;
      //获取科目
      this.$http({
        method:'get',
        url:this.$store.state.app.baseUrl + 'category/findByProject',
        params:{
          projectId:projectId
        }
      })
        .then((res)=>{
          if(res.data.code == 0) {
            this.categoryName = res.data.data;
          } else {
            this.$Message.error(res.data.message);
          }
        })
        .catch((error)=>{
          this.$Message.error(error.message);
        })


      this.$http({
        method:'get',
        url:this.$store.state.app.baseUrl + '/erpClassType/findAll',
      })
        .then((res)=>{
          if(res.data.code == 0) {
            this.erpClassTypeList = res.data.data;
          } else {
            this.$Message.error(res.data.message);
          }
        })
        .catch((error)=>{
          this.$Message.error(error.message);
        })
    }
  }
</script>

<style lang="less">
  #lesson_add{
    .icon_wrap{
      position: absolute;
      right: 20px;
      top: 0;
      width: 30px;
      height: 30px;
    }
    .ivu-icon-plus-circled{
      position: absolute;
      top: 3px;
      right: 3px;
      color: #2d8cf0;
    }
    .ivu-modal-confirm-head{
      margin-bottom: 40px!important;
    }
    .classHour,.dayOfRest,.interviewGroupNumber,.classclassHourPlan{
      .ivu-form-item-label:before{
        content: "*";
        display: inline-block;
        margin-right: 4px;
        line-height: 1;
        font-family: SimSun;
        font-size: 12px;
        color: #ed3f14;
      }
    }
    .ivu-form-item-label {
      text-align: right;
      padding-left: 10px;
    }
    .classclassHourPlan{
      .ivu-col{
        margin-bottom: 20px;
      }
    }
    .plan_word {
      display: inline-block;
      width: 80px;
      text-align: right;
      vertical-align: middle;
      float: left;
      font-size: 12px;
      color: #495060;
      line-height: 1;
      padding: 10px 12px 10px 0;
      box-sizing: border-box;
    }
    th,td {
      padding: 8px 10px;
    }
    th{
      background-color: #c3c3c3;
    }
    .operate{
      color: #2d8cf0;
      margin: 0 3px;
      cursor: pointer;
    }
  }
  .priceItem {
    border: 1px solid #eee;
    padding-top: 20px;
    padding-right: 20px;
    margin-bottom: 20px;
  }
  .priceItem,.other .ivu-input-number {
    width: 100%!important;
  }
  .priceItem{
    .ivu-form-item-label:before{
      content: "*";
      display: inline-block;
      margin-right: 4px;
      line-height: 1;
      font-family: SimSun;
      font-size: 12px;
      color: #ed3f14;
    }
    .priceTip {
      color:#ed3f14;
      height: 30px;
      line-height: 30px;
      font-size: 12px;
      text-align: center;
      display: none;
    }
  }
  .price_mark .ivu-form-item-label:before {
    content: "";
    display: inline-block;
  }
  .priceIsCom{
    .ivu-input,.ivu-select-selection,.ivu-input-number{
      border: 1px solid #ed3f14;
    }
    .ivu-input-icon,.ivu-icon{
      color: #ed3f14;
    }
    .priceIsCom {
      display: block;
    }
  }
  .zhubanren .ivu-form-item-label {
    width: 120px!important;
  }
</style>

