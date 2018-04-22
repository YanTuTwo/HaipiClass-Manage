<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    欢迎登录嗨皮课堂
                </p>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="userName">
                            <Input v-model="form.userName" placeholder="请输入用户名">
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
                            <Button @click="handleSubmit" type="primary" long>登录</Button>
                        </FormItem>
                    </Form>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
import util from '../libs/util'
import Cookies from 'js-cookie';
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
            }
        };
    },
    methods: {
        handleSubmit () {
            var self=this;
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    axios.post("http://193.112.95.221:9999/plogin",{
                        puserid:self.form.userName,
                        password:self.form.password
                    }).then((res)=>{
                        console.log(res.data);
                        if(res.data.code){
                            Cookies.set('user', this.form.userName);
                            Cookies.set('access', res.data.lv);
                            this.$router.push({
                                name: 'home_index'
                            });
                        }else{
                            this.$Message.info(res.data.msg);
                        }
                        
                    })                 
                }
            });
        }
    }
};
</script>

<style>

</style>
