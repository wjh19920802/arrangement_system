<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <p class="logo-wrap">
              <span class="logo-text">
                <img class="logo" src="../images/logo.png" key="max-logo" />排课系统
              </span>
            </p>
            <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules" action="./baidu.com" type="post">
                        <FormItem prop="userName">
                            <Input v-model="form.userName" placeholder="请输入用户名" autofocus>
                                <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" placeholder="请输入密码">
                                <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem>
                            <Button @click="handleSubmit" type="error" long :disabled="!switcher">登 录</Button>
                        </FormItem>
                    </Form>
                    <p class="login-tip">当前为排课系统测试版本</p>
                </div>
        </div>
    </div>
</template>

<script>
import Cookies from 'js-cookie'
import axios from 'axios'
export default {
    data () {
        return {
            form: {
                userName: '',
                password: ''
            },
            rules: {
                userName: [
                    { required: true, message: '账号不能为空', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                ]
            },
            switcher : true
        };
    },
    methods: {
        handleSubmit () {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                  this.switcher = false
                  this.$http({
                    method:'post',
                    url:this.$store.state.app.baseUrl + 'login',
                    data: {
                      username: this.form.userName,
                      password: this.form.password
                    },
                    headers: {'Content-type': 'application/json'}
                  })
                    .then((res)=> {
                      if(res.data.code==0){
                        this.$Message.success('登陆成功！');
                        let menus = res.data.data.user.topMenuList;
                        let secondMenuList = res.data.data.user.secondMenuList;
                        localStorage.setItem('secondMenuList',JSON.stringify(secondMenuList));
                        localStorage.setItem('menus',JSON.stringify(menus));
                        Cookies.set('user', this.form.userName);
                        Cookies.set('access', 0);
                        Cookies.set('accessToken', res.data.data.accessToken, 1);
                        axios.defaults.headers.common['accessToken'] = Cookies.get('accessToken');
                        setTimeout(() => {
                          //Cookies.set('password', this.form.password);
                          //this.$store.commit('setAvator', 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg');
                          // this.$router.push({
                          //   name: 'home_index'
                          // });
                          history.go(0) || window.location.reload();
                        },1000)
                      }else {
                        this.switcher = true
                        this.$Message.error(res.data.message)
                      }
                    })
                    .catch((error)=> {
                      this.switcher = true
                      this.$Message.error('网络错误')
                    })
                }
            });
        }
    }
};
</script>

<style>

</style>
