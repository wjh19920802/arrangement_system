<template>
        <div>
            <LessonAdd :createModel="createModel"></LessonAdd>
        </div>
</template>

<script>
    import LessonAdd from './lesson_add.vue'
    export default {
        name: "template_add",
        data(){
            return{
                createModel:true
            }
        },
        components:{
            LessonAdd
        }
    }
</script>

<style scoped>

</style>
