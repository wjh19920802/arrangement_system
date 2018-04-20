import Cookies from 'js-cookie';

const user = {
    state: {
       /* schedule: []*/
    },
    actions: {
        /*// 更新state里的课程表数据
        updateSchedule () {

        },
        // 增加课程
        addLesson () {

        },
        editLesson () {

        },
        removeLesson () {

        }*/
    },
    mutations: {
        logout (state, vm) {
          vm.$http({
            method:'post',
            url:vm.$store.state.app.baseUrl + 'logout?accessToken=' + Cookies.get('accessToken'),
            headers: {'Content-type': 'application/json'}
          })
            .then((res)=> {
              if(res.data.code==0){
                vm.$Message.success('登出成功！')
                setTimeout(() => {
                  Cookies.remove('user');
                  Cookies.remove('accessToken');
                  //Cookies.remove('password');
                  Cookies.remove('access');
                  vm.$store.commit('clearOpenedSubmenu');
                  vm.$router.push({
                    name: 'login'
                  });
                },1000)
              }else{
                vm.$Message.error(res.data.message)
              }
            })
            .catch((error)=> {
              vm.$Message.error('请求失败请重试')
            })
        }
    }
};

export default user;
