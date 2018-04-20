<template>
    <div id="teacher_add">
        <Card>
            <Row >
                <Col>
                <span style="font-size: 16px;font-weight: bold;margin-right: 20px">师资类型</span>
                <RadioGroup v-model="teacherType">
                    <Radio label="1">在职师资</Radio>
                    <Radio label="0">兼职师资</Radio>
                </RadioGroup>
                </Col>
            </Row>
        </Card>
        <Card class="margin-top-10" v-if="teacherType==1">
            <Row >
                <Col span="12">
                <Input v-model="onlineInfo" class="searchBar" size="large" placeholder="师资姓名、工号、手机号搜索">
                <Button slot="append" type="primary" size="large" >检索</Button>
                </Input>
                </Col>
            </Row>
            <div class="subTitle margin-top-20">
                <p><Icon type="ios-list-outline"></Icon>查询结果</p>
            </div>
            <Row >
                <Col span="8" v-for="item,index in onlineMemberList" :key="index">
                <div class="memberItem" >
                    <div class="avatar">
                        <img src="https://avatars2.githubusercontent.com/u/14959?s=96&v=4" alt="">
                    </div>
                    <div class="memberInfo" style="margin-left: 10px">
                        <div class="name">{{item.name}}</div>
                        <div class="isId">IS: {{item.isId}}</div>
                    </div>
                </div>
                </Col>
            </Row>
        </Card>
        <Card class="margin-top-10" v-if="teacherType==0">
            <div class="subTitle">
                <p><Icon type="compose"></Icon>基础信息</p>
            </div>
            <Form :model="offlineInfo" :label-width="100">
                <Row>
                    <Col span="12">
                    <FormItem label="姓名" prop="name">
                        <Input v-model="offlineInfo.name"></Input>
                    </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                    <FormItem label="临时工号" prop="temporaryId">
                        <Input v-model="offlineInfo.temporaryId"></Input>
                    </FormItem>
                    </Col>
                </Row>
            </Form>
        </Card>
        <Card class="margin-top-10">
            <div class="subTitle">
                <p><Icon type="more"></Icon>添加信息</p>
            </div>
            <Form :model="offlineInfo" :label-width="80">
                <Row>
                    <Col span="6" v-if="teacherType==0">
                    <FormItem label="所属部门" prop="department">
                        <Select v-model="formItem.department">
                            <Option value="0">课研</Option>
                            <Option value="1">研究院</Option>
                            <Option value="2">XXX</Option>
                        </Select>
                    </FormItem>
                    </Col>
                    <Col span="6" v-if="teacherType==0">
                    <FormItem label="性别" prop="gender">
                        <Select v-model="formItem.gender" :select="formItem.gender">
                            <Option value="0">男</Option>
                            <Option value="1">女</Option>
                        </Select>
                    </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="6">
                    <FormItem label="师资状态" prop="status">
                        <Select v-model="formItem.status">
                            <Option value="">请选择</Option>
                            <Option value="0">正常</Option>
                            <Option value="1">预离职</Option>
                            <Option value="2">已离职</Option>
                            <Option value="3">禁用（被投诉）</Option>
                            <Option value="4">禁用（借调）</Option>
                            <Option value="5">禁用（停课）</Option>
                        </Select>
                    </FormItem>
                    </Col>
                    <Col span="6">
                    <FormItem label="师资属性" prop="property">
                        <Select v-model="formItem.property" :select="formItem.property">
                            <Option value="0" v-if="teacherType==1">师资序列</Option>
                            <Option value="1" v-if="teacherType==1">内部兼职</Option>
                            <Option value="2" v-if="teacherType==0">外部兼职</Option>
                            <Option value="3" v-if="teacherType==1">研发编辑</Option>
                        </Select>
                    </FormItem>
                    </Col>
                    <Col span="6">
                    <FormItem label="级别" prop="level">
                        <Select v-model="formItem.level" :select="formItem.level">
                            <Option value="">请选择</Option>
                            <Option value="1">1</Option>
                            <Option value="2">2</Option>
                            <Option value="3">3</Option>
                        </Select>
                    </FormItem>
                    </Col>
                </Row>
            </Form>
            <Collapse v-model="collVal">
                <Panel name="1">
                    <Icon type="ios-pricetag"></Icon>主修 <span class="subjectItem">行测</span>
                    <Table slot="content" border></Table>
                </Panel>
                <Panel name="2">
                    <Icon type="ios-pricetags-outline"></Icon>辅修 <span class="subjectItem">选中后的文字</span>
                    <Table slot="content" border></Table>
                </Panel>

            </Collapse>
        </Card>
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
  export default {
    data () {
      return {
        teacherType: '1',
        onlineInfo: '',
        offlineInfo: {
          name: '',
          temporaryId: ''
        },
        onlineMemberList: [
          {
            name: '李兰花',
            isId: 'llh38383'
          }
        ],
        formItem:{
          department: '',
          gender: '',
          status: 0,
          property: '',
          level: ''
        },
        collVal: [1]
      }
    },
    methods: {
      submit () {

      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less" >
    #teacher_add{
        .ivu-radio-group{
            .ivu-radio-wrapper {
                font-size: 14px;
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
            }
        }
        .searchBar{
            input{
                height: 40px;
            }
            .ivu-input-group-append{
                width: 120px;
                background-color: #2d8cf0;
                color: #fff;
            }
        }
        .memberItem{
            box-sizing: border-box;
            padding: 24px 8px;
            display: flex;
            .avatar{
                display: inline-block;
                overflow: hidden;
                line-height: 1;
                vertical-align: middle;
                border-radius: 3px;
                img{
                    height: 48px;
                    width: 48px;
                }
            }
            .memberInfo{
                min-height: 48px;
                padding: 0;
                font-size: 14px;
                font-weight: normal;
                line-height: 20px;
                .name{
                    font-size: 14px;
                    font-weight: bold;
                }
                .isId{
                    margin-top: 8px
                }
            }
        }
        .memberItem:hover{
            border: 1px solid #f0f0f0;
        }
        .ivu-collapse .ivu-collapse-header i{
            margin-right: 10px;
        }
        .ivu-collapse .ivu-collapse-header .ivu-icon-arrow-right-b {
            display: none;
        }
        .subjectItem{
            font-size: 12px;
            color: #2d8cf0;
        }
    }
</style>
