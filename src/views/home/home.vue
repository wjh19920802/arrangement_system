<template>
    <div class="home-main">
        <Card>
            <div class="title">欢迎使用中公教育排课系统 v1.0！</div>
            <div class="time">当前日期：{{curDate}}</div>
        </Card>
    </div>
</template>

<script>
export default {
    name: 'home',
    components: {
    },
    data () {
        return {}
    },
    computed: {
        curDate () {
          let date = new Date()
          console.log(date)
          let year = date.getFullYear()
          let month = date.getMonth() + 1
          let day = date.getDate()
          return year + '-' + month + '-' + day
        }
    },
    methods: {

    }
};
</script>
<style scoped>
    .title{
        color: hsl(22,100%,70%);
        font-size: 24px;
    }
</style>