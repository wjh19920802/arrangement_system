<template>
    <div id="notice_add">
        <!--<RadioGroup v-model="examprojectId" projectId="button" size="large" style="margin: 20px;" @on-change="handleReset">-->
            <!--<Radio label="0"  ><span>笔试</span></Radio>-->
            <!--<Radio label="1" ><span>面试</span></Radio>-->
        <!--</RadioGroup>-->
        <template>
                <Form ref="generalForm" label-position="left" :model="generalForm" :rules="generalRules" :label-width="100">
                    <Card class="general ">
                        <p slot="title">
                            <Icon type="pinpoint"></Icon>
                            基本信息
                        </p>
                        <Row>
                            <Col span="12">
                            <FormItem prop="projectId" label="项目类型">
                                  <Select v-model="generalForm.projectId" @on-change="changeInterviewForm">
                                    <Option value="1">公务员（国考）</Option>
                                    <Option value="2">公务员（省考）</Option>
                                    <Option value="4">事业单位</Option>
                                </Select>
                            </FormItem>
                            </Col>
                            <Col span="12">
                            <FormItem class="ivu-form-item-required" prop="announcePublishTime"  label="公告发布时间">
                                <DatePicker v-model="generalForm.announcePublishTime" placeholder="选择公告发布日期" style="width: 200px"></DatePicker>
                            </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="8" class="is_advertisement">
                            <FormItem prop="isPublish" label="是否出公告">
                                <RadioGroup v-model="generalForm.isPublish">
                                    <Radio label="1">是</Radio>
                                      <Poptip trigger="focus"  content="填写往年公告信息即可">
                                        <Radio label="0">否</Radio>
                                    </Poptip>

                                </RadioGroup>
                            </FormItem>
                            </Col>
                            <Col span="8">
                            <FormItem prop="enrollType" label="报名方式">
                                <RadioGroup v-model="generalForm.enrollType">
                                    <Radio label="1">网上</Radio>
                                    <Radio label="2">线下</Radio>
                                </RadioGroup>
                            </FormItem>
                            </Col>
                            <Col span="8">
                            <FormItem prop="isRoutine" label="常规考试">
                                <RadioGroup v-model="generalForm.isRoutine">
                                    <Radio label="1">是</Radio>
                                    <Radio label="0">否</Radio>
                                </RadioGroup>
                            </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="12">
                            <FormItem prop="announcementName" label="公告名称">
                                <Input v-model="generalForm.announcementName" placeholder="输入公告名称"></Input>
                            </FormItem>
                            </Col>
                            <Col span="12">
                            <FormItem prop="announcementLink" label="公告链接">
                                <Input v-model="generalForm.announcementLink" placeholder="输入公告链接"></Input>
                            </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="12">
                            <FormItem prop="provinceId" label="省份">
                                <Select v-model="generalForm.provinceId">
                                    <Option v-for="ite in provinces" :key="ite.areaid" :value="ite.areaid">{{ite.name}}</Option>
                                </Select>
                            </FormItem>
                            </Col>
                            <Col span="12">
                              <FormItem prop="signUpTime" label="报名时间">
                                <DatePicker format="yyyy/MM/dd" type="daterange" placement="bottom-start"  v-model="generalForm.signUpTime" placeholder="选择报名日期" style="width: 200px"></DatePicker>
                              </FormItem>
                            </Col>
                        </Row>
                         <Row>
                            <Col span="12">
                              <FormItem class="ivu-form-item-required" prop="payTime"  label="缴费时间">
                                <DatePicker v-model="generalForm.payTime" format="yyyy/MM/dd" type="daterange" placement="bottom-start" placeholder="选择缴费日期" style="width: 200px"></DatePicker>
                              </FormItem>
                            </Col>
                            <Col span="12" class="print">
                              <FormItem class="ivu-form-item-required" prop="printEntranceCardTime"  label="打印准考证时间">
                                <DatePicker v-model="generalForm.printEntranceCardTime" format="yyyy/MM/dd" type="daterange" placement="bottom-start" placeholder="选择打印准考证日期" style="width: 200px"></DatePicker>
                              </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="12">
                            <FormItem prop="entranceNumber" label="招考人数">
                                <InputNumber :min="0" v-model="generalForm.entranceNumber"></InputNumber>
                            </FormItem>
                            </Col>
                            <Col span="12" v-if="positionIsShow">
                            <FormItem prop="positionNumber" label="职位数">
                                <InputNumber :min="0" v-model="generalForm.positionNumber"></InputNumber>
                            </FormItem>
                            </Col>
                            <Col span="12" v-if="prepareIsShow">
                            <FormItem prop="examProvisionCycle" label="备考周期">
                                <InputNumber :min="0" v-model="generalForm.examProvisionCycle"></InputNumber>
                            </FormItem>
                            </Col>
                        </Row>
                        <Row style="margin-bottom:20px;">
                          <div class="add info">
                            <Upload
                              ref="upload"
                              :show-upload-list="true"
                              :on-success="handleSuccess1"
                              :on-remove="handleRemove1"
                              multiple
                              :action="url + 'upload/uploadFile'"
                            >
                              <Button type="ghost" icon="ios-cloud-upload-outline" >上传职位表</Button>
                            </Upload>
                          </div>
                          <div style="border: 1px dashed #7791FF;margin-top: 25px;padding:25px;">
                            <p style="font-weight:bold;font-size: 16px;margin-bottom: 10px;">
                              已上传的职位表
                            </p>
                            <div v-for="item,index in postInfoListBefore" style="margin-left: 4em;">
                              <span>{{item.filename}}</span> <a class="operate" :href="url + 'announce/download-attachment?url=' + item.ossUrl + '&filename=' + item.filename" >下载附件</a><span class="operate" @click="deletePostInfo(item,index)">删除附件</span>
                            </div>
                          </div>
                        </Row>
                        <Row>
                          <div class="add info">
                            <Upload
                              ref="upload"
                              :show-upload-list="true"
                              :on-success="handleSuccess2"
                              :on-remove="handleRemove2"
                              multiple
                              :action="url + 'upload/uploadFile'"
                            >
                              <Button type="ghost" icon="ios-cloud-upload-outline" >上传其他附件</Button>
                            </Upload>
                          </div>
                          <div style="border: 1px dashed #7791FF;margin-top: 25px;padding:25px;">
                            <p style="font-weight:bold;font-size: 16px;margin-bottom: 10px;">
                              已上传的其他附件
                            </p>
                            <div v-for="item,index in oldExamListBefore" style="margin-left: 4em;">
                              <span>{{item.filename}}</span> <a class="operate" :href="url + 'announce/download-attachment?url=' + item.ossUrl + '&filename=' + item.filename">下载附件</a><span class="operate" @click="deleteOldExam(item,index)">删除附件</span>
                            </div>
                          </div>
                        </Row>
                    </Card>
                    <Card class="margin-top-10">
                        <Row >
                            <Col>
                            <span style="font-size: 16px;font-weight: bold">是否有笔试</span>
                            <RadioGroup v-model="hasWrite">
                                <Radio label="1">是</Radio>
                                <Radio label="0">否</Radio>
                            </RadioGroup>
                            </Col>
                        </Row>
                    </Card>
                    <Card class="write_exam margin-top-10" v-if="hasWrite == 1">
                        <p slot="title" style="overflow: visible">
                        <Icon type="pinpoint" ></Icon>
                            笔试信息
                            <Button type="primary" style="margin-left: 15px" @click="add">添加</Button>
                        </p>
                        <Row v-for="(item,index) in generalForm.writtenCategorys" class="writeExam" :key="index" :rules="{required: true, message: 'Item ' + item.index +' can not be empty', trigger: 'blur'}">
                            <Col span="5">
                                <FormItem :prop="generalForm.writtenCategorys[index].categoryId" label="笔试科目">
                                    <Select v-model="generalForm.writtenCategorys[index].categoryId">
                                        <!--<Option value="1">行测</Option>-->
                                        <!--<Option value="2">申论</Option>-->
                                        <Option v-for="item,index in subjectList" :key="index" :value="item.id + '' ">{{item.categoryName}}</Option>
                                        <!--<Option value="2"></Option>-->
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span="5">
                                <FormItem :prop="generalForm.writtenCategorys[index].writtenDetail" label="笔试内容详情">
                                    <Input v-model="generalForm.writtenCategorys[index].writtenDetail"></Input>
                                </FormItem>
                            </Col>
                            <Col span="10">
                                <FormItem label="笔试考试时间">
                                    <DatePicker type="datetimerange" placeholder="选择笔试日期" v-model="generalForm.writtenCategorys[index].writtenTime"></DatePicker>
                                </FormItem>
                            </Col>
                            <Col span="2">
                                <Button type="error" style="margin-left: 15px" @click="remove(index)" v-show="generalForm.writtenCategorys.length > 1">删除</Button>
                            </Col>
                            <Col span="2" style="height: 30px;">
                            <div class="writtenCategorysValidate">请填写笔试信息</div>
                            </Col>
                        </Row>
                    </Card>
                    <Card class="margin-top-10">
                        <Row >
                            <Col>
                            <span style="font-size: 16px;font-weight: bold">是否有面试</span>
                            <RadioGroup v-model="hasFace" @on-change="getAllInterviewForm">
                                <Radio label="1">是</Radio>
                                <Radio label="0">否</Radio>
                            </RadioGroup>
                            </Col>
                        </Row>
                    </Card>
                    <Card class="face_exam margin-top-10" v-if="hasFace == 1">
                        <p slot="title">
                        <Icon type="pinpoint"></Icon>
                        面试信息
                        </p>
                        <Row type="flex" justify="space-between">
                            <Col span="12" v-if="hasWrite == 1">
                              <FormItem prop="announceWrittenResultTime" label="笔试出成绩时间" inline>
                                <DatePicker format="yyyy/MM/dd" type="daterange" placement="bottom-start" v-model="generalForm.announceWrittenResultTime" placeholder="输入笔试出成绩时间"></DatePicker>
                              </FormItem>
                            </Col>
                            <Col span="12">
                            <FormItem prop="interviewTime" label="面试时间">
                              <DatePicker format="yyyy/MM/dd" type="daterange" placement="bottom-end" v-model="generalForm.interviewTime" placeholder="输入面试时间"></DatePicker>
                            </FormItem>
                            </Col>
                          <Col span="12">
                          <FormItem label="拟录用名单时间" inline>
                            <DatePicker format="yyyy/MM/dd" type="daterange" placement="bottom-start" v-model="generalForm.draftListTime"  placeholder="输入拟录用名单时间"></DatePicker>
                          </FormItem>
                          </Col>
                            <Col span="12">
                                <FormItem label="面试形式">
                                    <Select v-model="generalForm.interviewForm" multiple>
                                        <Option v-for="item,index in interviewFormData" :key="item.id" :value="item.interviewFormName">{{item.interviewFormName}}</Option>
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span="12">
                                <FormItem label="进入面试比例">
                                    <Input class="" v-model="generalForm.interviewPercent" placeholder="输入面试比例 如：1:3"></Input>
                                </FormItem>
                            </Col>
                            <Col span="12">
                                <FormItem label="面试内容详情">
                                    <Input class="" v-model="generalForm.interviewDetail" placeholder="输入面试内容详情"></Input>
                                </FormItem>
                            </Col>
                          <Col span="12">
                          <FormItem label="面试资审时间" id="faceQua">
                            <DatePicker format="yyyy/MM/dd" type="daterange" placement="bottom-start" v-model="generalForm.qualificationCheckTime" placeholder="输入面试资审时间"></DatePicker>
                          </FormItem>
                          </Col>
                        </Row>
                    </Card>
                    <Card class="margin-top-10">
                      <Row>
                        <Col span="24">
                        <FormItem prop="remarks" label="备注">
                          <Input v-model="generalForm.remarks"  type="textarea" :rows="4" placeholder="请输入备注"></Input>
                        </FormItem>
                        </Col>
                      </Row>
                    </Card>
                </Form>
            </template>
        <Card class="margin-top-10">
            <div class="submit">
                <Row>
                    <Col span="4" offset="10">
                        <Button type="primary" size="large" long @click="submit">提交</Button>
                    </Col>
                </Row>
            </div>
        </Card>
    </div>
</template>

<script>
    import Util from '../../libs/util'
    export default {
        data () {
            const validateEntranceNumber = (rule, value, callback) => {
                if (value <= 0 ) {
                    callback(new Error('请输入正确的招考人数'));
                } else {
                    callback();
                }
            };
            const validatePositionNumber = (rule, value, callback) => {
                if (value <= 0 ) {
                    callback(new Error('请输入正确的职位数'));
                } else {
                    callback();
                }
            };
            const validateExamProvisionCycle = (rule, value, callback) => {
                if (value <= 0 ) {
                    callback(new Error('请输入正确的考试周期'));
                } else {
                    callback();
                }
            };
            const validateProvince = (rule, value, callback) => {
                if (value == '' && value !== 0 ) {
                    callback(new Error('省份不能为空'));
                } else {
                    callback();
                }
            };
          const validateAnnounceWrittenResultTime = (rule, value, callback) => {
            console.log(value)
            if (value.length == 0 || (value[0] == '' && value[1] == '') ) {
              callback(new Error('笔试出成绩时间不能为空'));
            } else {
              callback();
            }
          };
          const validateInterviewTime = (rule, value, callback) => {
            console.log(value)
            if (value.length == 0 || (value[0] == '' && value[1] == '') ) {
              callback(new Error('面试时间不能为空'));
            } else {
              callback();
            }
          };
          const validateDraftListTime = (rule, value, callback) => {
            console.log(value)
            if (value.length == 0 || (value[0] == '' && value[1] == '') ) {
              callback(new Error('拟录用名单时间不能为空'));
            } else {
              callback();
            }
          };
          const validateQualificationCheckTime = (rule, value, callback) => {
            console.log(value)
            if (value.length == 0 || (value[0] == '' && value[1] == '') ) {
              callback(new Error('面试资审时间不能为空'));
            } else {
              callback();
            }
          };
          const validateSignUpTime = (rule, value, callback) => {
            console.log(value)
            if (value.length == 0 || (value[0] == '' && value[1] == '') ) {
              callback(new Error('报名日期不能为空'));
            } else {
              callback();
            }
          };
          const validatePayTime = (rule, value, callback) => {
            console.log(value)
            if (value.length == 0 || (value[0] == '' && value[1] == '') ) {
              callback(new Error('缴费日期不能为空'));
            } else {
              callback();
            }
          };
          const validatePrintEntranceCardTime = (rule, value, callback) => {
            console.log(value)
            if (value.length == 0 || (value[0] == '' && value[1] == '') ) {
              callback(new Error('打印准考证日期不能为空'));
            } else {
              callback();
            }
          };
            return {
                url:this.$store.state.app.baseUrl,
                id:'',   //公告id
                hasWrite:2,   //1 是 0 否
                hasFace:2,
                examStyle:0,
                // 地区数据
                provinces: [],
                generalForm: {
                    projectId:'',    //项目类型
                    announcePublishTime:'',   //公告日期
                    isRoutine:'',   //是否是常规考试
                    announcementName:'',    //公告名称
                    announcementLink:'',    //公告链接
                    isPublish:'',  //是否已出公告
                    examStage:'', // 考试阶段
                    enrollType:'',  //报名方式
                    signUpTime:[],      //报名日期
                    payTime:[],         //缴费日期
                    printEntranceCardTime:[],       //打印日期
                    entranceNumber:0,      //招考人数
                    provinceId:'',   //省
                    positionNumber:0,   //职位数
                    examProvisionCycle:0,     //备考周期
                    writtenCategorys:[
                        {
                            categoryId:'',
                            writtenDetail:'',
                            writtenTime:[]
                        }
                    ],
                    announceWrittenResultTime:[],      //笔试出成绩时间
                    interviewTime:[],        //面试时间
                    draftListTime:[],     //拟录用名单时间
                    interviewForm:[],        //面试形式
                    interviewPercent:'',   //进入面试比例
                    interviewDetail:'',   //面试内容详情
                    qualificationCheckTime:[],     //面试资审时间
                    remarks:''          //备注

                },
                generalRules:{
                    projectId:[{required:true,message:'项目类型不能为空',trigger:'change'}],
                    announcePublishTime:[{required:true,type:'date',message:'公告日期不能为空',trigger:'change'}],
                    noticeTime:[{required:true,type:'date',message:'公告时间不能为空',trigger:'change'}],
                    provinceId:[{validator:validateProvince,required:true,trigger:'change'}],
                    isRoutine:[{required:true,message:'是否是常规考试不能为空',trigger:'change'}],
                    announcementName:[{required:true,message:'公告名称不能为空',trigger:'blur'}],
                    announcementLink:[{required:true,message:'公告链接不能为空',trigger:'blur'}],
                    isPublish:[{required:true,message:'是否已出公告不能为空',trigger:'change'}],
                    examStage:[{required:true,message:'考试阶段不能为空',trigger:'change'}],
                    enrollType:[{required:true,message:'报名方式不能为空',trigger:'change'}],

                    signUpTime:[{validator:validateSignUpTime,required:true,type:'array',trigger:'change'}],
                    payTime:[{validator:validatePayTime,required:true,type:'array',trigger:'change'}],
                    printEntranceCardTime:[{validator:validatePrintEntranceCardTime,required:true,type:'array',trigger:'change'}],

                    writtenTime:[{required:true,type:'date',message:'笔试日期不能为空',trigger:'change'}],
                    entranceNumber:[{validator:validateEntranceNumber,required:true,type:'number',trigger:'change'}],
                    positionNumber:[{validator:validatePositionNumber,required:true,type:'number',trigger:'change'}],
                    examProvisionCycle:[{validator:validateExamProvisionCycle,required:true,type:'number',trigger:'change'}],
                    announceWrittenResultTime:[{validator:validateAnnounceWrittenResultTime,required:true,type:'array',trigger:'change'}],
                    interviewTime:[{required:true,validator:validateInterviewTime,type:'array',trigger:'change'}],
                    draftListTime:[{validator:validateDraftListTime,required:false,type:'array',trigger:'change'}],
                    interviewForm:[{required:false,trigger:'change'}],
                    interviewPercent:[{required:false,message:'进入面试比例不能为空',trigger:'change'}],
                    interviewDetail:[{required:false,message:'面试内容详情不能为空',trigger:'blur'}],
                    qualificationCheckTime:[{validator:validateQualificationCheckTime,required:false,type:'array',trigger:'change'}],
                },
                flagArr:[],   //笔试信息列表判断数组  0 不通过 1 通过
                interviewFormData:[],  //面试形式数组

                postInfoList: [],
                oldExamList: [],
                postInfoListBefore:[],
                oldExamListBefore:[],
                subjectList:[
                    {id:1,categoryName:'行测'},
                    {id:2,categoryName:'申论'}
                ]

            }
        },
        methods: {
            submit () {
                let writeFlag = true;
                let requestData = Util.deepClone(this.generalForm);
                if(this.hasWrite == 1){
                    this.writtenCategorysValidator(this); //验证笔试信息
                    if(this.flagArr.indexOf(0)>=0) {
                        this.$Message.error('请将信息填写完整');
                        writeFlag = false;
                    } else {
                        requestData.writtenCategorys.forEach((item,index)=>{
                            if((typeof item.writtenTime[0]) == 'object' && (typeof item.writtenTime[1]) == 'object'){
                                item.writtenTime[0] = item.writtenTime[0].getTime();
                                item.writtenTime[1] = item.writtenTime[1].getTime();
                            }
                        });
                    }
                }


                this.$refs['generalForm'].validate((valid) => {
                        if (valid && writeFlag) {
                            if(this.hasWrite == 0 && this.hasFace == 0) {
                                this.$Message.error('请选择笔试或面试');
                                return
                            }
                            requestData.interviewForm = ''
                            if(this.hasFace == 1) {
                                requestData.announceWrittenResultTime[0] = new Date(this.generalForm.announceWrittenResultTime[0]).getTime();
                                requestData.announceWrittenResultTime[1] = new Date(this.generalForm.announceWrittenResultTime[1]).getTime();
                                requestData.interviewTime[0] = new Date(this.generalForm.interviewTime[0]).getTime();
                                requestData.interviewTime[1] = new Date(this.generalForm.interviewTime[1]).getTime();
                                requestData.draftListTime[0] = new Date(this.generalForm.draftListTime[0]).getTime();
                                requestData.draftListTime[1] = new Date(this.generalForm.draftListTime[1]).getTime();
                                requestData.qualificationCheckTime[0] = new Date(this.generalForm.qualificationCheckTime[0]).getTime();
                                requestData.qualificationCheckTime[1] = new Date(this.generalForm.qualificationCheckTime[1]).getTime();
                                requestData.interviewForm = this.generalForm.interviewForm.join(',');
                            }
                            requestData.announcePublishTime = new Date(this.generalForm.announcePublishTime).getTime();
                            requestData.signUpTime[0] = new Date(this.generalForm.signUpTime[0]).getTime();
                            requestData.signUpTime[1] = new Date(this.generalForm.signUpTime[1]).getTime();
                            requestData.payTime[0] = new Date(this.generalForm.payTime[0]).getTime();
                            requestData.payTime[1] = new Date(this.generalForm.payTime[1]).getTime();
                            requestData.printEntranceCardTime[0] = new Date(this.generalForm.printEntranceCardTime[0]).getTime();
                            requestData.printEntranceCardTime[1] = new Date(this.generalForm.printEntranceCardTime[1]).getTime();



                            //考试类型
                            if(this.hasWrite == 1 && (this.hasFace == 0 || this.hasFace == 2)) {
                                this.examStyle = '1';
                            }else if ((this.hasWrite == 0 || this.hasWrite == 2) && this.hasFace == 1){
                                this.examStyle = '2';
                            }else if (this.hasWrite == 1 && this.hasFace == 1){
                                this.examStyle = '3';
                            }else if(this.hasWrite == 2 && this.hasFace == 2){
                                this.examStyle = '0';
                            }
                            requestData.postInfoList = this.postInfoList.concat(this.postInfoListBefore);
                            requestData.oldExamList = this.oldExamList.concat(this.oldExamListBefore);
                            requestData.examStyle = this.examStyle;

                             //发送请求
                            if(this.examStyle != 0){
                                console.log(requestData.id)
                                if(requestData.id) {
                                    let url = this.$store.state.app.baseUrl + 'announcement/update';
                                    this.$http({
                                        method: 'post',
                                        url: url,
                                        data: requestData,
                                        headers: {'Content-type': 'application/json'}
                                    })
                                        .then((res)=> {
                                            if(res.data.code == 0) {
                                                this.$Message.success('提交成功');
                                                this.$refs['generalForm'].resetFields();
                                                this.generalForm.writtenCategorys.splice(0,this.generalForm.writtenCategorys.length,{categoryId:'', writtenDetail:'', writtenTime:[]})
                                                this.$router.push({name:'notice_manage'});
                                            }else {
                                                this.$Message.error(res.data.message)
                                            }
                                        })
                                        .catch((error)=> {
                                            console.log(error);
                                        });
                                }else {
                                    let url = this.$store.state.app.baseUrl + 'announcement';
                                    this.$http({
                                        method: 'post',
                                        url: url,
                                        data: requestData,
                                        headers: {'Content-type': 'application/json'}
                                    })
                                        .then((res)=> {
                                            if(res.data.code == 0) {
                                                this.$Message.success('提交成功');
                                                this.$refs['generalForm'].resetFields();
                                                this.generalForm.writtenCategorys.splice(0,this.generalForm.writtenCategorys.length,{categoryId:'', writtenDetail:'', writtenTime:[]})
                                                this.$router.push({name:'notice_manage'});
                                            }else {
                                                this.$Message.error(res.data.message);
                                            }
                                        })
                                        .catch((error)=> {
                                            console.log(error);
                                        });
                                }
                            }else {
                                this.$Message.error('请将信息填写完整');
                            }
                        } else {
                            this.$Message.error('请将信息填写完整');
                        }
                    });
            },
            add (index) {   // 添加
                this.generalForm.writtenCategorys.push({
                    categoryId:'',
                    writtenDetail:'',
                    writtenTime:[],   //2018/1/19
                })
            },
            remove (index) {    //删除
                if(this.generalForm.writtenCategorys.length > 1){
                    this.generalForm.writtenCategorys.splice(index,1);
                    this.flagArr.splice(index,1);
                }
            },
            addClass (obj, cls) {   //添加class
                var obj_class = obj.className;//获取 class 内容.
                if(obj_class.indexOf(cls) > 0){
                    return;
                }
                var blank = (obj_class != '') ? ' ' : '';//判断获取到的 class 是否为空, 如果不为空在前面加个'空格'.
                var added = obj_class + blank + cls;//组合原来的 class 和需要添加的 class.
                obj.className = added;//替换原来的 class.
            },
            removeClass (obj, cls){     // 删除class
                var obj_class = ' '+obj.className+' ';//获取 class 内容, 并在首尾各加一个空格. ex) 'abc    bcd' -> ' abc    bcd '
                obj_class = obj_class.replace(/(\s+)/gi, ' ');//将多余的空字符替换成一个空格. ex) ' abc    bcd ' -> ' abc bcd '
                var removed = obj_class.replace(' '+cls+' ', ' ');//在原来的 class 替换掉首尾加了空格的 class. ex) ' abc bcd ' -> 'bcd '
                removed = removed.replace(/(^\s+)|(\s+$)/g, '');//去掉首尾空格. ex) 'bcd ' -> 'bcd'
                obj.className = removed;//替换原来的 class.
            },
            writtenCategorysValidator (that){
                this.generalForm.writtenCategorys.forEach((item,index) =>{   //笔试信息数组遍历
                    this.writeCheck(item,index,that);
                })
            },
            writeCheck (item,index,that){     //笔试信息数组与dom数组一一对应
                const writeExamDom = document.getElementsByClassName('writeExam')[index];   //
                if(!item.categoryId || !item.writtenDetail || item.writtenTime.length == 0) {  //数组不完整时
                    this.addEvent (writeExamDom,item,index,that);
                    that.addClass(writeExamDom,'writtenCategorysIsCom');           // 添加验证不通过class
                    that.addClass(writeExamDom.getElementsByClassName('writtenCategorysValidate')[0],'writtenCategorysIsCom');
                    this.flagArr[index] = 0;
                }else{                                          // 删除验证不通过class
                    that.removeClass(writeExamDom,'writtenCategorysIsCom');
                    that.removeClass(writeExamDom.getElementsByClassName('writtenCategorysValidate')[0],'writtenCategorysIsCom');
                    this.flagArr[index] = 1;
                }
            },
            addEvent (writeExamDom,item,index,that) {   // 为失去焦点时绑定事件
               const inputDom = writeExamDom.getElementsByClassName('ivu-input');
               for(let i = 0 ;i<inputDom.length;i++){     //为每一个输出框绑定blur事件
                   inputDom[i].addEventListener('blur',function(){
                       that.writeCheck(item,index,that);
                   });
                   inputDom[i].addEventListener('change',function(){
                       that.writeCheck(item,index,that);
                   });
               }
            },
            handleSuccess1 (res,file, fileList) {
              console.log(fileList);
                if(res.code == 0) {
                  res.data.type = 1;
                  this.postInfoList = []
                  fileList.forEach((item)=>{
                    this.postInfoList.push(item.response.data)
                  })
                    this.$Message.success('上传成功');
                }else {
                    this.$Message.success('上传失败');
                }
            },
            handleRemove1 (file, fileList) {
                this.postInfoList = [];
                fileList.forEach((item)=>{
                    this.postInfoList.push(item.response.data)
                })
            },
            deletePostInfo (item,index) {
              this.postInfoListBefore.splice(index,1);
            },
            downLoad(ossUrl,filename) {
              this.$http({
                url:this.$store.state.app.baseUrl + 'announce/download-attachment?url=' + ossUrl + '&filename=' + filename,
                method:'get',
              })
                .then((res)=>{
                  if(res.data.code == 0) {

                  }else {
                    this.$Message.error('下载失败')
                  }
                })
                .catch((error)=>{
                  this.$Message.error('下载失败')
                })
            },
            handleSuccess2 (res,file,fileList) {
                res.data.type = 2;
                this.oldExamList = [];
                fileList.forEach((item)=>{
                  this.oldExamList.push(item.response.data)
                })
                if(res.code == 0) {
                    this.$Message.success('上传成功');
                }else {
                    this.$Message.success('上传失败');
                }
            },
            handleRemove2 (file, fileList) {
                this.oldExamList = [];
                fileList.forEach((item)=>{
                    this.oldExamList.push(item.response.data)
                })
            },
            deleteOldExam (item,index) {
              this.oldExamListBefore.splice(index,1);
            },
            getAllInterviewForm () {
              if(this.hasFace == 1) {
                //获取面试形式
                this.$http({
                  method:'get',
                  url:this.$store.state.app.baseUrl + 'announcement/getAllInterviewForm',
                })
                  .then((res)=>{
                    if(res.data.code == 0) {
                      this.interviewFormData = res.data.data;
                    } else {
                      this.$Message.error(res.data.message);
                    }
                  })
                  .catch((error)=>{
                    this.$Message.error(error.message);
                  })
              }
            },
            changeInterviewForm () {
                //获取科目
                this.$http({
                    method:'get',
                    url:this.$store.state.app.baseUrl + 'category/findByProject',
                    params:{
                        projectId:this.generalForm.projectId
                    }
                })
                    .then((res)=>{
                        if(res.data.code == 0) {
                            this.subjectList = res.data.data;
                        } else {
                            this.$Message.error(res.data.message);
                        }
                    })
                    .catch((error)=>{
                        this.$Message.error(error.message);
                    })
            },
            timeStampToDate() {
              for(let i = 0;i<arguments.length;i++) {
                arguments[i][0] = new Date(arguments[i][0]);
                arguments[i][1] = new Date(arguments[i][1]);
              }
            },
            // init () {   //添加红星星
            //     const formDom = document.getElementsByClassName('ivu-form-item');
            //     for(let i=0;i<formDom.length;i++){
            //         this.addClass(formDom[i],'ivu-form-item-required');
            //     }
            // }
        },
        mounted () {
            this.hasWrite = this.$route.query.hasWrite==undefined?2:this.$route.query.hasWrite + '';
            this.hasFace = this.$route.query.hasFace==undefined?2:this.$route.query.hasFace + '';
            //兼容性处理
            document.getElementsByClassName('single-page-con')[0].scrollTo && document.getElementsByClassName('single-page-con')[0].scrollTo(0,0);
            if(this.$route.query.id){
                this.id = this.$route.query.id;
                this.$http(this.$store.state.app.baseUrl + 'announcement/' + this.id)
                    .then((res)=>{
                        if(res.data.code == 0){
                            this.generalForm = res.data.data;
                            this.postInfoListBefore = res.data.data.postInfoList;
                            this.oldExamListBefore = res.data.data.oldExamList;
                            this.generalForm.interviewForm = res.data.data.interviewForm.split(',');
                            this.generalForm.projectId = this.generalForm.projectId + '';
                            this.generalForm.isPublish = this.generalForm.isPublish + '';
                            if(this.generalForm.examStage == '笔试'){
                                this.generalForm.examStage = '1';
                            }else if(this.generalForm.examStage == '面试'){
                                this.generalForm.examStage = '2';
                            }
                            this.generalForm.writtenCategorys.forEach((item,index)=>{
                                item.categoryId = item.categoryId + '';
                                item.writtenTime[0] = new Date(item.writtenTime[0]);
                                item.writtenTime[1] = new Date(item.writtenTime[1]);
                            });
                            if(this.generalForm.isRoutine == true) {
                                this.generalForm.isRoutine = '1';
                            }else {
                                this.generalForm.isRoutine = '0';
                            };
                            if(this.generalForm.examStyle == 2 || this.generalForm.examStyle == 3) {
                                this.getAllInterviewForm()
                            }

                            this.generalForm.announcePublishTime = new Date(this.generalForm.announcePublishTime);
                            this.timeStampToDate(this.generalForm.signUpTime,this.generalForm.payTime,this.generalForm.printEntranceCardTime,this.generalForm.announceWrittenResultTime,
                                                this.generalForm.interviewTime,this.generalForm.draftListTime,this.generalForm.qualificationCheckTime)
                        }
                    })
                    .catch((error)=>{
                        this.$Message.error(error.message);
                    })
            }
        },
        beforeMount () {
          this.$http(this.$store.state.app.baseUrl + 'area/getUserVisualProvince')
            .then((res)=>{
              if(res.data.code == 0 ){
                this.provinces = res.data.data;
              }else {
                this.$Message.error(res.data.message);
              }
            }).catch((error)=>{
            this.$Message.error(error.message);
          });
        },
        computed:{
            positionIsShow() {
                if((this.generalForm.projectId == 1 || this.generalForm.projectId == 2) && this.generalForm.projectId != ''){
                    return true
                }else {
                    return false
                }
            },
            prepareIsShow() {
                if(this.generalForm.projectId == 4){
                    return true
                }else {
                    return false
                }
            },
        },
        // watch:{
        //     hasWrite (curV,oldV){
        //         if(curV == 'true'){
        //             this.$nextTick(()=>{
        //                 this.init();
        //             });
        //         }
        //     }
        // }
    }
</script>

<style lang="less">
#notice_add{
    width: 100%;
    height: auto;
    box-sizing: border-box;
    .general{
        width: 100%;
        .title{
            position: relative;
            width: 100%;
            margin-bottom: 25px;
            p{
                width: 140px;
                font-size: 16px;
                height: 32px;
                line-height: 32px;
                border-bottom-color: #fff;
            }
        }
        .print{
            label{
                width: 110px!important;
            }
            .ivu-form-item-content{
                margin-left: 110px!important;
            }
        }
    }
    .write_exam {
        .writtenCategorysValidate {
            color:#ed3f14;
            height: 30px;
            line-height: 30px;
            font-size: 12px;
            display: none;
        }
        .writtenCategorysIsCom{
            .ivu-input,.ivu-select-selection{
                border: 1px solid #ed3f14;
            }
            .ivu-input-icon,.ivu-icon{
                color: #ed3f14;
            }
            .writtenCategorysIsCom {
                display: block;
            }
        }
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
    .face_exam {
        .title{
            position: relative;
            width: 100%;
            margin-bottom: 25px;
            p{
                width: 140px;
                font-size: 16px;
                height: 32px;
                line-height: 32px;
                border-bottom-color: #fff;
            }
        }
        /*.ivu-form-item{*/
            /*width: 40%;*/
        /*}*/
        /*.ivu-row .ivu-form-item{*/
            /*width: 100%;*/
        /*}*/
    }

    .ivu-radio-inner {
        display: inline-block;
        width: 20px;
        height: 20px;
        position: relative;
        top: 0;
        left: 0;
        background-color: #fff;
        border: 1px solid #dddee1;
        border-radius: 50%;
        transition: all .2s ease-in-out;
        &:after{
            width: 16px;
            height: 16px;
            left: 1px;
            top: 1px;
            border-radius: 100%;
        }
    }
    label{
       /* text-align: center!important;*/
    }
    .face_exam label{
        width: 110px!important;
    }
    .face_exam .ivu-form-item-content{
        margin-left: 110px!important;
    }
    .ivu-input-number{
        width: 100%;
    }
    .ivu-form-item-content{
        padding-right: 10px;
    }
    .width_50{
        width: 50%!important;
    }
  .operate{
    color: #2d8cf0;
    margin: 0 3px;
    cursor: pointer;
    padding:0 5px 0 ;
  }
}

</style>
