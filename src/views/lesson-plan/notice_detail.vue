<template>
    <div>
        <Card>
          <NoticeInfo :id="id"></NoticeInfo>
        </Card>
        <Card class="margin-top-10">
            <Row>
                <Col span="4" offset="10">
                <Button type="primary" size="large" long @click="back()">返回</Button>
                </Col>
            </Row>
        </Card>
    </div>
</template>

<script>
    import NoticeInfo from './notice_Info'
    export default {
        name: "notice_detail",
        data(){
            return{
                id:''   //公告id
            }
        },
        beforeMount(){
            this.id = this.$route.params.id;
        },
        methods:{
          back(){
            window.history.back()
          },
        },
        components:{
            NoticeInfo
        }
    }
</script>

<style scoped>

</style>
