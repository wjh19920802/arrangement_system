<template>
    <div class="scheduleTable">
        <Modal  class="edit_modal"
                v-model="modal1"
                title="课程信息"
                @on-ok="fillTitle">
            <Form :model="modalInfo" :label-width="100">
                <FormItem label="科目" prop="topCategoryId" class="firstCategory">
                    <Select ref="firstCat" v-model="modalInfo.topCategoryId" label-in-value placeholder="一级科目" @on-change="getCategoryTree(modalInfo.topCategoryId)">
                        <Option v-for="(s,i) in modalSubject" :key="s.id" :value="s.id">{{s.categoryName}}</Option>
                        <Option  value="-1">早自习</Option>
                        <Option  value="-3">晚自习</Option>
                        <Option  value="-4">休息</Option>
                    </Select>
                </FormItem>
                <FormItem label="课程项目" prop="itemContent">
                    <!--<Cascader :data="modalProject.length?modalProject:[]" v-model="modalInfo.itemContent"></Cascader>-->
                    <Select ref="secondCat" v-model="secondId" @on-change="getThirdTree" placeholder="二级科目">
                        <Option v-for="(s,i) in modalProject" :key="s.value" :value="s.value">{{s.label}}</Option>
                    </Select>
                    <Select ref="thirdCat" v-model="modalInfo.categoryId" placeholder="三级科目">
                        <Option v-for="(s,i) in thirdTree" :key="s.value" :value="s.value">{{s.label}}</Option>
                    </Select>
                    <!--<Input v-model="modalInfo.project" placeholder=""></Input>-->
                </FormItem>
                <FormItem label="课程时间" prop="time">
                    <TimePicker v-model="modalInfo.time" :steps="[1, 5]" format="HH:mm" type="timerange" placement="bottom-start" placeholder="课程时间" ></TimePicker>
                </FormItem>
            </Form>
        </Modal>
        <div class="thead flex">
            <span class="table-header flex-1">时间</span>
            <span class="flex-1">{{title}}   课程天数：{{row}}天</span>
        </div>
        <div class="tbody" style="overflow-x: auto">
            <div class="frontPage pageBtn" @click="toFrontPage" v-if="row>7">
                <Icon type="chevron-up"></Icon>
            </div>
            <!--<div class="tr" v-for="(item, index) in data1" v-show="(index+1) > (page-1)*7 && (index+1) <= page*7" >-->
            <div class="tr flex" v-for="(item, index) in row" v-show="(index+1) > (page-1)*7 && (index+1) <= page*7" >
                <!--<span class="date" :class="{weekend: formatWeek(formatDate(index))>5 || formatWeek(formatDate(index)) == 0}">
                    &lt;!&ndash;<span class="weekend" v-if="formatWeek(formatDate(index))>5 || formatWeek(formatDate(index)) == 0">
                        <span class="weekendFilter"></span>
                    </span>&ndash;&gt;
                   {{formatDate(index).m}}月{{formatDate(index).d}}日
                </span>-->
                <span class="date flex flex-align-center flex-pack-center">
                    第{{index+1}}天
                </span>
                <span class="classes flex flex-v flex-align-center flex-pack-center" v-for="(c,i) in (data1[index] ? data1[index].courseTableItems : {})" :key="i" :style="formatClass(c.time[0], c.time[1])">
                    <div class="className">
                        {{c.itemContent}}
                    </div>
                    <div class="classTime">
                        {{formatTime(c.time[0], c.time[1])}}
                    </div>
                    <span class="deleteBtn" @click="deleteClass(index, i)" v-if="scheduleEdit"><Icon type="android-close"></Icon></span>
                    <span class="editBtn" @click="editClass(index, i)" v-if="scheduleEdit"><Icon type="android-create"></Icon></span>
                </span>
                <span class="addBtn flex flex-align-center flex-pack-center" @click="addClass(index)" v-if="scheduleEdit">
                   <Icon type="android-add-circle"></Icon>
                </span>
                </span>
            </div>
            <div class="nextPage pageBtn" @click="toNextPage" v-if="row>7">
                <Icon type="chevron-down"></Icon>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    props: {
      lessonData: {
        type: Object
      },
      scheduleData: {
        type: Array
      },
      scheduleEdit: {
        type: Boolean
      }
    },
    data () {
      return {
        // 弹窗
        isEdit: false,
        modal1: false,
        secondId:'',
        modalInfo: {
          topCategoryId: '',
          topCategoryName: '',
          categoryId: '',
          categoryName: '',
          itemContent: '',
          time: ['08:00','09：00']
        },
        modalProject: [],
        thirdTree: [],
        data1: [{
          courseTableItems: []
        }],
        curRowIndex: 0,
        curColIndex: 0,
        // 行数 通过props 传入
        //row: 15,// 天数
        date: '1月31日',
        curYear: 2018,
        page: 1,

      }
    },
    computed: {
      // 课表的科目列表
      modalSubject () {
        return this.lessonData ? this.lessonData.categorys : []
      },
      /*secondCategorys () {
        let secondArr = []
        this.modalProject.map((item,index)=>{
          secondArr.push()
        })
        return
      },*/
      thirdCategorys () {

      },
      // 数组 arr的length 为天数   内为时间
      scheduleArr () {
        //console.log(this.row,'rowowowowowowowowowowowow')
        let arr =  new Array(this.row);   //表格有多少行
        for(let i = 0;i < arr.length; i++){
          arr[i] = {
            courseTableItems: []
          }
        }
        return arr
      },
      title () {
        return this.lessonData ? this.lessonData.courseName : '课程表'
      },
      row () {
        return this.lessonData ? (this.lessonData.openClassTime == '下午' || this.lessonData.openClassTime == '晚上') ? +this.lessonData.classHour.split('天')[0]+1 : +this.lessonData.classHour.split('天')[0]: 1
      },
      /*data1 () {
        return this.$store.state.user.schedule
      },*/
      daysArr () {
        return [31,28+this.is_leap(this.curYear),31,30,31,30,31,31,30,31,30,31]
      }
    },
    watch: {
      row (val) {
        this.initTable()
      },
      scheduleData () {
        this.data1 = this.scheduleArr
        this.initTable()
      }
    },
    methods: {
      initTable () {
        //console.log('initinit',this.scheduleData.length, this.scheduleData)
        if(this.scheduleData && this.scheduleData.length){
          this.data1 = this.scheduleData
        }else{
          //console.log('new blank')
          this.data1 = this.scheduleArr
        }
        this.curRowIndex = 0;
        this.curColIndex = 0;
      },
      is_leap (year) {
        return (year%100==0?(year%400==0?1:0):(year%4==0?1:0));
      },
      formatDate (index) {
        let vm = this
        let mon = this.date.split('月')[0]
        let da = this.date.split('月')[1].split('日')[0]
        let resultDay = parseInt(da) + index
        let date = ''
        addDay(mon, da)
        function addDay(month, day) {
          let m = month,d = day;
          if(resultDay > vm.daysArr[m-1]){
            resultDay = resultDay - vm.daysArr[m-1]
            m = parseInt(m)+1
            d = resultDay
            addDay(m, d)
          }else{
            d = resultDay
            //date = m+'月'+d+'日'
            date = {
              y: vm.curYear,
              m: m,
              d: d
            }
          }
        }
        return date

      },
      formatWeek (o) {
        let y = o.y, m = o.m-1, d = o.d;
        let dateObj = new Date(y,m,d);
        return dateObj.getDay();
      },
      formatTime (start, end) {
        if(start == 'undefined' || end == 'undefined'){
          return ''
        }
        /*let start_h =  +(''+((+start).toFixed(2))).split('.')[0]
        let start_m =  (''+((+start).toFixed(2))).split('.')[1]
        start_h = start_h > 9 ? start_h : '0'+start_h
        let end_h =  +(''+((+end).toFixed(2))).split('.')[0]
        let end_m =  (''+((+end).toFixed(2))).split('.')[1]
        end_h = end_h > 9 ? end_h : '0'+end_h*/
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
      addClass (index) {
        this.modalInfo.topCategoryId = ''
        //this.modalInfo.time = [];
        this.modal1 = true;
        this.curRowIndex = index
      },
      formatClass (start, end) {
        return {width: parseInt(end-start)+'px'}
      },
      editClass (index, i) {
        this.isEdit = true
        this.modal1 = true;
        this.curRowIndex = index
        this.curColIndex = i
        this.modalInfo = {
          topCategoryId: this.data1[index].courseTableItems[i].topCategoryId,
          topCategoryName: this.data1[index].courseTableItems[i].topCategoryName,
          categoryId: this.data1[index].courseTableItems[i].categoryId,
          categoryName: this.data1[index].courseTableItems[i].categoryName,
          itemContent: this.data1[index].courseTableItems[i].itemContent,
          time: []
        }
        this.$refs.secondCat.selectedSingle = this.modalInfo.secondCategoryName;
        this.$refs.thirdCat.selectedSingle = this.modalInfo.categoryName;
      },
      deleteClass (index, i) {
        this.data1[index].courseTableItems.splice(i,1)
      },
      fillTitle () {
        if(this.modalInfo.topCategoryId == '') {
          alert('添加科目')
          return
        }else if(this.secondId == '') {
          this.$refs.secondCat.selectedSingle = '';
          this.$refs.thirdCat.selectedSingle = '';
        }

        let start = this.modalInfo.time[0];
        let end = this.modalInfo.time[1];
        //console.log(this.$refs.firstCat)
        let newItem = {
          topCategoryId: this.modalInfo.topCategoryId,
          topCategoryName: this.$refs.firstCat.selectedSingle || '',
          categoryId: this.modalInfo.categoryId,
          categoryName: this.$refs.thirdCat.selectedSingle || '',
          itemContent: this.$refs.firstCat.selectedSingle + (this.$refs.secondCat.selectedSingle?('/' + this.$refs.secondCat.selectedSingle + '/' + this.$refs.thirdCat.selectedSingle):''),
          time: [0, 0],
        }
        console.log(newItem)
        console.log(this.$refs.secondCat.selectedSingle)
        if(start){
          //newItem.time[0] = start.getHours()*100 + start.getMinutes();
          newItem.time[0] = parseInt(start.split(':')[0])*100 + parseInt(start.split(':')[1]);
        }
        if(end){
          //newItem.time[1] = end.getHours()*100 + end.getMinutes();
          newItem.time[1] = parseInt(end.split(':')[0])*100 + parseInt(end.split(':')[1]);
        }
        if(newItem.topCategoryName != '') {
          if(!(this.isEdit)){
            this.data1[this.curRowIndex].courseTableItems.push(newItem)
            //this.$store.state.user.schedule[this.curRowIndex].push(newItem)
          }else{
            this.data1[this.curRowIndex].courseTableItems[this.curColIndex] = newItem
            //this.$store.state.user.schedule[this.curRowIndex][this.curColIndex] = newItem
          }
        }else {
          this.$Modal.confirm({
            title: '提示',
            content: '请选择一级科目',
            okText: '确定',
            cancelText: '取消'
          });
        }
        // this.$refs.firstCat.selectedSingle = '';
        // this.$refs.secondCat.selectedSingle = '';
        // this.$refs.thirdCat.selectedSingle = '';
        // 将数组重新排序
        this.data1[this.curRowIndex].courseTableItems.sort(function (a, b) {
          if (a.time[0] < b.time[0]) {
            return -1;
          } else if (a.time[0] > b.time[0]) {
            return 1;
          } else {
            return 0;
          }
        })
        this.isEdit = false
      },
      toFrontPage () {
        this.page = (this.page-1)<1? 1 : this.page-1
      },
      toNextPage () {
        let pages = Math.ceil( this.row / 7 )
        this.page = (this.page+1) > pages ? pages : this.page+1
      },
      getCategoryTree (val) {
        console.log(val)
        this.modalProject = []
        this.thirdTree = []
        this.$http({
          method:'get',
          url:this.$store.state.app.baseUrl + 'category/categoryTree?categoryId='+val,
        })
          .then((res)=>{
            //console.log(res)
            if(res.data.code == 0) {
              this.modalProject = res.data.data
            } else {
              this.$Message.error(res.data.message)
            }
          })
          .catch((error)=>{
            this.$Message.error(error.message);
          })
      },
      getThirdTree (value) {
        this.thirdTree = []
        let secondTree = this.modalProject.filter((item, index) => {
          return item.value == value
        })
        //console.log(secondTree)
        if(this.modalProject.length){
          this.thirdTree = secondTree[0].children
        }
      }
    },
    mounted () {
      this.$nextTick(()=>{
        this.initTable()
      })
    }
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
                max-width: 100px;
                min-width: 100px;

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
                justify-content: space-between;
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
                    flex-grow:1;
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
                    max-width: 100px;
                    min-width: 100px;
                    //display: flex;
                    //align-items: center;
                    //justify-content: center;
                    position: relative;
                    font-size: 12px;
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
            /*width: 0;
            height: 0;
            border-top: 30px solid #ff6b83;
            border-right: 30px solid transparent;
            position: absolute;
            left:0;
            top:0;
            .weekendFilter{
                width: 0;
                height: 0;
                border-top: 15px solid #f8f8f9;
                border-right: 15px solid transparent;
                position: absolute;
                left:0;
                top:-30px;
            }*/
        }
        .firstCategory>.ivu-form-item-label {
          content: '*';
          display: inline-block;
          margin-right: 4px;
          line-height: 1;
          font-family: SimSun;
          font-size: 12px;
          color: #ed3f14;
        }
    }

</style>

