<template>
  <div class="scheduleTable">
    <Modal  class="edit_modal"
            v-model="modal1"
            title="课程信息"
            @on-ok="fillCurDate">
      <DatePicker type="date" v-model="curDate" placeholder="选择当前日期"></DatePicker>
    </Modal>
    <div class="thead flex">
      <span class="table-header flex-1">时间</span>
      <span class="flex-1">{{title}}   课程天数：{{row}}天</span>
    </div>
    <div class="tbody" style="overflow-x: auto">
      <div class="frontPage pageBtn" @click="toFrontPage" v-if="row>7">
        <Icon type="chevron-up"></Icon>
      </div>
      <div class="tr flex" v-for="(item, index) in row" v-show="(index+1) > (page-1)*7 && (index+1) <= page*7" >
        <!--<span class="date" :class="{weekend: formatWeek(formatDate(index))>5 || formatWeek(formatDate(index)) == 0}">
            &lt;!&ndash;<span class="weekend" v-if="formatWeek(formatDate(index))>5 || formatWeek(formatDate(index)) == 0">
                <span class="weekendFilter"></span>
            </span>&ndash;&gt;
           {{formatDate(index).m}}月{{formatDate(index).d}}日
        </span>-->
        <span class="date flex flex-align-center flex-pack-center">
            {{(typeof scheduleData[index].day == 'object') ? formatDate(scheduleData[index].day) : scheduleData[index].day>1000 ? formatDate(scheduleData[index].day) : '第'+ scheduleData[index].day+'天'}}
            <!--<span v-if="!isRead" class="operate" @click="editDate(index)">修改</span>-->
        </span>
        <span class="classes flex flex-v flex-align-center flex-pack-center"
              v-for="(c,i) in (scheduleData[index] ? scheduleData[index].courseTableItems : {})"
              :key="i">
            <div class="className">
                {{c.topCategoryName}} - {{c.itemContent}}
            </div>
            <div class="classTime">
                {{c.beginTime?formatTime(c.beginTime, c.endTime) : formatTime(c.time[0], c.time[1])}}
            </div>
        </span>
      </div>
      <div class="nextPage pageBtn" @click="toNextPage" v-if="row>7">
        <Icon type="chevron-down"></Icon>
      </div>
    </div>
    <!--<Button type="primary" size="large" class="margin-top-10" @click="handleSubmit('formValidate')">提交修改</Button>-->
  </div>
</template>

<script>
  import util from '../../../libs/util.js'
  export default {
    props: ['lessonId','isEdit','editSchedule','isRead'],
    data () {
      return {
        title: '',
        scheduleData: [],
        // 弹窗
        modal1: false,
        curDate: '',
        curIndex: '',
        page: 1,
      }
    },
    computed: {
      row () {
        return this.scheduleData ? this.scheduleData.length : 1
      },
      formatScheduleDate () {
        let data = this.scheduleData
        data.map((item, index) => {
          item.day = typeof item.day == 'object' ? item.day.getTime() : item.day
          return item
        })
        return data
      },
    },
    watch: {
      editSchedule () {
        this.getLessonScheduleInfo()
      }
    },
    methods: {
      // initTable () {
      //   // 如果是创建 获取课程的课程表 否则 获取班次的课程表
      //   // if(!this.isEdit){
      //   //   this.getScheduleInfo()
      //   // }else{
      //   //   this.getLessonScheduleInfo()
      //   // }
      // },
      getScheduleInfo () {
        this.$http(this.$store.state.app.baseUrl + 'classInfo/' + this.lessonId + '/getCourseTable')
          .then((res)=>{
            console.log(res, '课程表')
            if(res.data.code == 0) {
              this.scheduleData = res.data.data.courseTableLineItemVos || []
              this.title = res.data.data.courseTableName
            } else {
              this.$Message.error(res.data.message)
            }
          })
          .catch((error)=>{
            this.$Message.error(error.message);
          })
      },
      getLessonScheduleInfo () {
        // 获取班次的课程表
        console.log(this.editSchedule,'外部传来的课表')
        this.scheduleData = this.editSchedule?this.editSchedule.courseTableLineItemVos:[]
        this.title = this.editSchedule?this.editSchedule.classCourseTableName:''
      },
      formatTime (start, end) {
        if(start == 'undefined' || end == 'undefined'){
          return ''
        }
        let start_h = parseInt(start/100)
        let start_m = parseInt(start%100)
        start_h = start_h > 9 ? start_h : '0'+start_h
        start_m = start_m > 9 ? start_m : '0'+start_m
        let end_h = parseInt(end/100)
        let end_m = parseInt(end%100)
        end_h = end_h > 9 ? end_h : '0'+end_h
        end_m = end_m > 9 ? end_m : '0'+end_m
        return start_h + ':' + start_m + ' - ' + end_h + ':' + end_m
      },
      formatDate (dateObj) {
        return this.timestampToTime(dateObj)
      },
      timestampToTime(timestamp) {
        if(!(typeof timestamp == 'object')){
          var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        }else{
          var date = timestamp
        }
        let Y = date.getFullYear() + '.';
        let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '.';
        let D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
        //h = date.getHours() + ':';
        //m = date.getMinutes() + ':';
        //s = date.getSeconds();
        return Y+M+D;
      },
      toFrontPage () {
        this.page = (this.page-1)<1? 1 : this.page-1
      },
      toNextPage () {
        let pages = Math.ceil( this.row / 7 )
        this.page = (this.page+1) > pages ? pages : this.page+1
      },
      editDate (index) {
        this.modal1 = true;
        this.curIndex = index
      },
      fillCurDate () {
        debugger
        this.scheduleData[this.curIndex].day = this.curDate
        if(!this.formatDaysData()){
          this.$Message.error('请勿输入重复天数')
          this.scheduleData[this.curIndex].day = 0
        }
      },
      formatDaysData () {
        let daysArr = []
        let lengt = 0
        this.scheduleData.map((item,index)=>{
          daysArr.push(this.timestampToTime(item.day))
          lengt = daysArr.length
        })
        console.log(lengt,'1')
        return Array.from(new Set(daysArr)).length == lengt ? 1 : 0
      }
    },
    // mounted () {
    //   // this.initTable()
    //   this.getLessonScheduleInfo()
    // }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .scheduleTable{
    box-sizing: border-box;
    text-align: center;
    font-size: 12px;
    .edit_modal {
      .ivu-modal-wrap {
        z-index: 1000!important;
      }
    }
    .thead{
      background-color: #f8f8f9;
      width: 100%;
      //display: flex;
      border-top:1px solid #e9eaec;
      border-left:1px solid #e9eaec;
      border-bottom:1px solid #e9eaec;
      &>span{
        //flex:1;
        border-right:1px solid #e9eaec;
        display: inline-block;
        min-width: 100px;
        min-height: 50px;
        padding: 14px 5px;
      }
      .table-header{
        max-width: 150px;
        min-width: 150px;

      }
      .trigger{
        cursor: pointer;
        font-size: 17px;
        margin-right: 10px;
      }
    }
    .tbody{
      background-color: #fff;
      border-left:1px solid #e9eaec;
      border-bottom:1px solid #e9eaec;
      position: relative;
      .tr{
        width: 100%;
        //display: flex;
        //border-bottom: 1px solid #e9eaec;
        //border-right: 1px solid #e9eaec;
        &>span{
          min-width: 50px;
          min-height: 80px;
          padding: 14px 5px;
        }
        .classes{
          min-width: 100px;
          position: relative;
          //display: flex;
          //flex-direction: column;
          //align-items: center;
          //justify-content: center;
          border-right: 1px dotted #e9eaec;
          border-bottom: 1px dotted #e9eaec;
          transition: .3s;
          .deleteBtn{
            position: absolute;
            right: 5px;
            top:0;
            font-size: 0
          }
          .editBtn{
            position: absolute;
            right: 5px;
            bottom:0;
            font-size: 0
          }
          .classTime{
            font-size: 10px;
          }
        }
        .classes:hover{
          //color: #fff;
          background-color: #b1e0ed;
          margin: 2px;
          border-radius: 5px;
          box-shadow: 0 1px 6px rgba(0,0,0,.2);
          .deleteBtn{
            font-size: 18px;
            cursor: pointer;
            color: lightcoral;
          }
          .editBtn{
            font-size: 16px;
            cursor: pointer;
            color: #108bff;
          }
        }
        .date{
          background-color: #f8f8f9;
          border-right: 1px solid #e9eaec;
          border-bottom: 1px solid #e9eaec;
          max-width: 150px;
          min-width: 150px;
          //display: flex;
          //align-items: center;
          //justify-content: center;
          position: relative;
          font-size: 12px;
          .operate{
            color: #2d8cf0;
            font-size: 10px;
            margin-left: 8px;
            cursor: pointer;
          }
        }
      }
      .tr:last-of-type .classes{
        border-bottom: transparent;
      }
      .addBtn{
        max-width: 50px;
        font-size: 24px;
        //display: flex;
        //align-items: center;
        //justify-content: center;
        //color: #aaeed4;
        color: #ef2d36;
        margin:2px;
        opacity: .8;
      }
      .addBtn:hover{
        color: #fff;
        //background-color: #bdedba;
        background-color: #ef2d36;
        opacity: .4;
        box-shadow: 0 1px 6px rgba(0,0,0,.2);
        cursor: pointer;
      }
    }
    i.ivu-icon {
      margin-right: 0px;
    }
    .pageBtn{
      position: absolute;
      width:100px;
      cursor: pointer;
      transition: .3s;
      color: #ccc;
      z-index: 1000;
    }
    .pageBtn:hover{
      font-size: 20px;
      color: #ef2d36;
    }
    .nextPage{
      bottom: 0px;
    }
    .weekend{
      color: #4DB34D;
    }
  }

</style>

