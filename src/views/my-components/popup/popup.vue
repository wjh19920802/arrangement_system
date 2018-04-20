<template>
    <div class="popup">
        <Card class="popup_content">
            <div class="pass_wrap" v-show="passOrReject">
                <Row>
                    <Col span="6" offset="5">
                        <span class="height_30">主办人－笔试：</span>
                    </Col>
                    <Col span="8">
                        <Select v-model="writeMan" style="width:200px" placeholder="选择人员">
                            <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </Col>
                </Row>
                <Row>
                    <Col span="6" offset="5">
                        <span class="height_30">主办人－面试：</span>
                    </Col>
                    <Col span="8">
                        <Select v-model="faceMan" style="width:200px" placeholder="选择人员">
                            <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </Col>
                </Row>
            </div>
            <div class="reject_wrap" v-show="!passOrReject">
                <Row>
                    <Col span="21" offset="3">
                        <h1>请选择驳回原因</h1>
                    </Col>
                </Row>
                <Row class="reason">
                    <Col span="10" offset="7">
                        <Select v-model="reason" style="width:200px" placeholder="课程价格">
                            <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </Col>
                </Row>
            </div>
            <div class="buttons">
                <div class="btn_left btn_float">
                    <Button type="primary" long size="large" @click="confirm">确定</Button>
                </div>
                <div class="btn_right btn_float">
                    <Button type="error" long size="large" @click="cancel">取消</Button>
                </div>
            </div>
        </Card>
    </div>
</template>

<script>
    export default {
        name: "popup",
        props: {
            cityList:Array,
            passOrReject:Boolean,
            closePopup:Function,
            submitCheckedInfo:Function,
            submitRejectReason:Function,
            selectedStashData:Array
        },
        data(){
            return{
                writeMan:'',
                faceMan:'',
                reason:''
            }
        },
        methods:{
            confirm () {
              this.closePopup();
              //发送请求
                if(this.passOrReject) {
                    this.submitCheckedInfo(this.writeMan,this.faceMan,this.selectedStashData);
                }else {
                    this.submitRejectReason(this.reason);
                }
            },
            cancel () {
                this.closePopup();
            }
        },
        computed:{

        }
    }
</script>

<style lang="less">
    .popup{
        position: fixed;
        z-index: 1000;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(55,55,55,.6);
        .popup_content{
            position: absolute;
            bottom: 50%;
            left: 50%;
            width: 500px;
            height: 300px;
            margin-left: -200px;
            margin-bottom: -150px;
            background-color: #fff;
            .pass_wrap{
                position: relative;
                height: 180px;
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                &:after{
                    content: '';
                    position: absolute;
                    bottom:0;
                    left: -16px;
                    width: ~'calc(100% + 32px)';
                    height: 1px;
                    background-color: #ccc;
                }
                .height_30{
                    height: 30px;
                    line-height: 30px;
                }
            }
            .reject_wrap{
                position: relative;
                height: 180px;
                padding-top: 20px;
                box-sizing: border-box;
                &:after{
                    content: '';
                    position: absolute;
                    bottom:0;
                    left: -16px;
                    width: ~'calc(100% + 32px)';
                    height: 1px;
                    background-color: #ccc;
                }
                .reason{
                    margin-top: 30px;
                }
            }
            .buttons{
                position: relative;
                width: 100%;
                height: 100px;
                display: flex;
                justify-content: space-around;
                align-items: center;
                &:after{
                    content: '';
                    position: absolute;
                    left: 50%;
                    bottom: 0;
                    width: 1px;
                    height: 100%;
                    background-color: #ccc;
                }
            }
        }

    }
</style>
