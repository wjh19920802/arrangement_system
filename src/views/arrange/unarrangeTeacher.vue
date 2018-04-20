<template>
    <!--<div>-->
        <!--<Row>-->
            <!--<Col span="24">-->
            <!--<Card>-->
                <!--<p slot="title">-->
                    <!--<Icon type="pinpoint"></Icon>-->
                    <!--查询条件-->
                <!--</p>-->
                <!--<Form :model="formItem" :label-width="100">-->
                    <!--<Row>-->
                        <!--<Col span="6">-->
                        <!--<FormItem label="班级名称" prop="title">-->
                            <!--<Input v-model="formItem.title" placeholder=""></Input>-->
                        <!--</FormItem>-->
                        <!--</Col>-->
                        <!--<Col span="6">-->
                        <!--<FormItem label="省份" prop="province">-->
                            <!--<Select v-model="formItem.province">-->
                                <!--<Option v-for="item in provinces" :key="item.id" :value="item.id">{{item.label}}</Option>-->
                            <!--</Select>-->
                        <!--</FormItem>-->
                        <!--</Col>-->
                        <!--<Col span="6">-->
                        <!--<FormItem label="项目类型" prop="examType">-->
                            <!--<Select v-model="formItem.examType">-->
                                <!--<Option value="0">公务员（国考）</Option>-->
                                <!--<Option value="1">公务员（省考）</Option>-->
                                <!--<Option value="2">事业单位</Option>-->
                            <!--</Select>-->
                        <!--</FormItem>-->
                        <!--</Col>-->
                        <!--<Col span="6">-->
                        <!--<FormItem label="班级类型" prop="type">-->
                            <!--<Select v-model="formItem.type">-->
                                <!--<Option value="0">封闭班</Option>-->
                                <!--<Option value="1">精讲班</Option>-->
                                <!--<Option value="2">普通班</Option>-->
                            <!--</Select>-->
                        <!--</FormItem>-->
                        <!--</Col>-->
                    <!--</Row>-->
                    <!--<Row>-->
                        <!--<Col span="6">-->
                        <!--<FormItem label="考试阶段" prop="stage">-->
                            <!--<Select v-model="formItem.stage" :select="formItem.stage">-->
                                <!--<Option value="">请选择</Option>-->
                                <!--<Option value="1">笔试</Option>-->
                                <!--<Option value="2">面试</Option>-->
                                <!--<Option value="3">笔试 + 面试</Option>-->
                            <!--</Select>-->
                        <!--</FormItem>-->
                        <!--</Col>-->
                        <!--<Col span="6">-->
                        <!--<FormItem label="科目" prop="subject">-->
                            <!--<Select v-model="formItem.subject" multiple :select="formItem.subject">-->
                                <!--<Option value="">请选择</Option>-->
                                <!--<Option value="1">行测</Option>-->
                                <!--<Option value="2">申论</Option>-->
                                <!--<Option value="3">面试</Option>-->
                            <!--</Select>-->
                        <!--</FormItem>-->
                        <!--</Col>-->
                        <!--<Col span="6">-->
                        <!--<FormItem label="开课时间">-->
                            <!--<DatePicker type="daterange" placeholder="" v-model="formItem.open"></DatePicker>-->
                        <!--</FormItem>-->
                        <!--</Col>-->
                        <!--<Col span="6">-->
                        <!--<FormItem label="结课时间">-->
                            <!--<DatePicker type="daterange" placeholder="" v-model="formItem.close"></DatePicker>-->
                        <!--</FormItem>-->
                        <!--</Col>-->
                    <!--</Row>-->
                    <!--<Row>-->
                        <!--<Col span="6">-->
                        <!--<FormItem label="排序">-->
                            <!--<Select v-model="formItem.sort" :select="formItem.sort">-->
                                <!--<Option value="">请选择</Option>-->
                                <!--<Option value="1">科目时间由近及远</Option>-->
                                <!--<Option value="2">ERP人数由少及多</Option>-->
                            <!--</Select>-->
                        <!--</FormItem>-->
                        <!--</Col>-->
                        <!--<Col span="6">-->
                        <!--<FormItem>-->
                            <!--<Button type="primary">查询</Button>-->
                            <!--&lt;!&ndash;<Button type="ghost" style="margin-left: 8px">重置</Button>&ndash;&gt;-->
                        <!--</FormItem>-->
                        <!--</Col>-->
                    <!--</Row>-->
                <!--</Form>-->
            <!--</Card>-->
            <!--<Card class="margin-top-10">-->
                <!--<p slot="title">-->
                    <!--<Icon type="pinpoint"></Icon>-->
                    <!--班次列表-->
                <!--</p>-->
                <!--&lt;!&ndash;<div class="thead">-->
                    <!--<div class="tr">-->
                        <!--<div class="th" style="max-width: 30px"></div>-->
                        <!--<div class="th">班级名称</div>-->
                        <!--<div class="th">班级类型</div>-->
                        <!--<div class="th">申请科目</div>-->
                        <!--<div class="th">上课时间</div>-->
                        <!--<div class="th">已排科目</div>-->
                        <!--<div class="th">已排时间</div>-->
                        <!--<div class="th">已排师资</div>-->
                        <!--<div class="th">级别</div>-->
                        <!--<div class="th">性别</div>-->
                        <!--<div class="th">师资联系方式</div>-->
                        <!--<div class="th">课程是否通知</div>-->
                        <!--<div class="th">课程确认</div>-->
                        <!--<div class="th">ERP人数</div>-->
                        <!--<div class="th">上课酒店</div>-->
                        <!--<div class="th">预估安排师资人数</div>-->
                        <!--<div class="th">备注</div>-->
                        <!--<div class="th operate">操作</div>-->
                    <!--</div>-->
                <!--</div>-->
                <!--<div class="tbody">-->
                    <!--<div class="tr" v-for="(item,index) in lessons">-->
                        <!--<div class="td" style="max-width: 30px;">-->
                            <!--<Checkbox v-model="item.check" style=" margin-right: 0px;"></Checkbox>-->
                        <!--</div>-->
                        <!--<div class="td">-->
                            <!--{{item.name}}-->
                        <!--</div>-->
                        <!--<div class="td">-->
                            <!--{{item.type}}-->
                        <!--</div>-->
                        <!--<div class="td">-->
                            <!--{{item.subject}}-->
                        <!--</div>-->
                        <!--<div class="td">-->
                            <!--{{item.open}}-{{item.close}}-->
                        <!--</div>-->
                        <!--<div class="td">-->
                            <!--<div class="td" v-for="i in item.sub2"></div>-->
                        <!--</div>-->
                        <!--<div class="td">-->

                        <!--</div>-->
                        <!--<div class="td">-->

                        <!--</div>-->
                        <!--<div class="td">-->

                        <!--</div>-->
                        <!--<div class="td">-->

                        <!--</div>-->
                        <!--<div class="td">-->

                        <!--</div>-->
                        <!--<div class="td">-->

                        <!--</div>-->
                        <!--<div class="td">-->

                        <!--</div>-->
                        <!--<div class="td">-->
                            <!--{{item.erp}}-->
                        <!--</div>-->
                        <!--<div class="td">-->
                            <!--{{item.hotel}}-->
                        <!--</div>-->
                        <!--<div class="td">-->
                            <!--{{item.totalTeacher}}-->
                        <!--</div>-->
                        <!--<div class="td">-->
                            <!--{{item.note}}-->
                        <!--</div>-->
                        <!--<div class="td operate">-->
                            <!--<Button type="success" size="small" @click="arrangement(item.id)">排课</Button>-->
                            <!--<Button type="primary" size="small" @click="reject(item.id)">驳回</Button>-->
                            <!--<Button type="primary" size="small" @click="tag(item.id)">添加标记</Button>-->
                        <!--</div>-->
                    <!--</div>-->
                <!--</div>&ndash;&gt;-->
                <!--<table id="unarrange_table" border="1" width="100%" style="border-collapse:collapse;text-align: center;">-->
                <!--<tr>-->
                  <!--<th style="max-width: 30px"></th>-->
                  <!--<th>班级名称</th>-->
                  <!--<th>班级类型</th>-->
                  <!--<th>申请科目</th>-->
                  <!--<th>上课时间</th>-->
                  <!--<th>已排科目</th>-->
                  <!--<th>已排时间</th>-->
                  <!--<th>已排师资</th>-->
                  <!--<th>级别</th>-->
                  <!--<th>性别</th>-->
                  <!--<th>师资联系方式</th>-->
                  <!--<th>课程是否通知</th>-->
                  <!--<th>课程确认</th>-->
                  <!--<th>ERP人数</th>-->
                  <!--<th>上课酒店</th>-->
                  <!--<th>预估安排师资人数</th>-->
                  <!--<th>备注</th>-->
                  <!--<th>操作</th>-->
                <!--</tr>-->
                <!--<tr v-for="(item,index) in lessons">-->
                  <!--<td class="td" style="max-width: 30px;">-->
                    <!--<Checkbox v-model="item.check" style=" margin-right: 0px;"></Checkbox>-->
                  <!--</td>-->
                  <!--<td>{{item.name}}</td>-->
                  <!--<td>{{item.type}}</td>-->
                  <!--<td>{{item.subject}}</td>-->
                  <!--<td>{{item.open}}-{{item.close}}</td>-->
                  <!--<td>-->
                    <!--<div v-for="i in item.sub2"></div>-->
                  <!--</td>-->
                  <!--<td></td>-->
                  <!--<td></td>-->
                  <!--<td></td>-->
                  <!--<td></td>-->
                  <!--<td></td>-->
                  <!--<td></td>-->
                  <!--<td></td>-->
                  <!--<td>{{item.erp}}</td>-->
                  <!--<td>{{item.hotel}}</td>-->
                  <!--<td>{{item.totalTeacher}}</td>-->
                  <!--<td>{{item.note}}</td>-->
                  <!--<td class="operate" style="min-width: 220px">-->
                    <!--<Button type="success" size="small" @click="arrangement(item.id)">排课</Button>-->
                    <!--<Button type="primary" size="small" @click="reject(item.id)">驳回</Button>-->
                    <!--<Button type="primary" size="small" @click="tag(item.id)">添加标记</Button>-->
                    <!--<Button type="primary" size="small" @click="merge(item.id)">合并开班</Button>-->
                  <!--</td>-->
                <!--</tr>-->
              <!--</table>-->
            <!--</Card>-->
            <!--</Col>-->
        <!--</Row>-->
    <!--</div>-->
</template>

<script>
  export default {
    data () {
      return {
        formItem: {
          title: '',
          province: '',
          type: '',
          examType: '',
          stage: '',
          open: [],
          close: [],
          subject: [],
          sort: ''
        },
        // 地区数据
        provinces: [
          {id: 0, label: "北京"},
          {id: 1, label: "山东"},
          {id: 2, label: "浙江"},
          {id: 3, label: "江苏"},
          {id: 4, label: "湖南"},
          {id: 5, label: "湖北"},
          {id: 6, label: "四川"},
          {id: 7, label: "吉林"},
          {id: 8, label: "上海"},
          {id: 9, label: "山西"},
          {id: 10, label: "河北"},
          {id: 11, label: "重庆"},
          {id: 12, label: "广东"},
          {id: 13, label: "天津"},
          {id: 14, label: "河南"},
          {id: 15, label: "福建"},
          {id: 16, label: "广西"},
          {id: 17, label: "陕西"},
          {id: 18, label: "贵州"},
          {id: 19, label: "安徽"},
          {id: 20, label: "黑龙江"},
          {id: 21, label: "云南"},
          {id: 22, label: "甘肃"},
          {id: 23, label: "辽宁"},
          {id: 24, label: "江西"},
          {id: 25, label: "新疆"},
          {id: 26, label: "青海"},
          {id: 27, label: "宁夏"},
          {id: 28, label: "内蒙古"},
          {id: 29, label: "海南"},
          {id: 30, label: "西藏"}
        ],
        lessons: [{
          id: 11123,
          name: 'xxx',
          type: '培训班',
          subject: '行测',
          open: '09-10',
          close: '09-21',
          erp: 30,
          hotel: '7天',
          totalTeacher: 10,
          note: '',

          province: 1,
          city: 1,
          school: 1,
          price: '非协议-1800（酒店）',
          date: [11,22],
          edit: 1
        }],
      }
    },
    methods: {
      arrangement (id) {
        this.$router.push({name:'arrange_lesson',query:{id:id}})
      },
      reject (id) {
        this.$Modal.confirm({
          title:'驳回',
          render: (h, params) => {
            return h('Select',{
              style: {
                marginTop: '15px',
              }
            },[
              h('Option',{
                props: {
                  value: 0
                }
              },'驳回省院'),
              h('Option',{
                props: {
                  value: 1
                }
              },'驳回地方')
            ])
          }
        })
      },
      tag () {

      },
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  #unarrange_table {
    border: 1px solid #e9eaec;
    th{
      border: 1px solid #e9eaec;
      min-height: 55px;
      background-color: #f8f8f9;
      padding: 10px 5px;
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
  }
  /*.thead{
        text-align: center;
        .tr{
            background-color: #f8f8f9;
            width: 100%;
            display: flex;
            border-top:1px solid #e9eaec;
            border-left:1px solid #e9eaec;
            border-bottom:1px solid #e9eaec;
            justify-content: flex-start;
            .th{
                flex:1;
                border-right:1px solid #e9eaec;
                display: inline-block;
                min-width: 30px;
                min-height: 50px;
                padding: 14px 5px;
            }
            .operate{
                min-width: 250px;
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
                display: table-cell;
                line-height: 2;
                padding: 15px 5px;
            }
            .operate{
                min-width: 250px;
            }
        }
    }*/
</style>
