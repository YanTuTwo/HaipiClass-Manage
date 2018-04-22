<style lang="less">
    @import "./main.less";
</style>
<template>
    <div class="main" :class="{'main-hide-text': shrink}">
        <div class="sidebar-menu-con" :style="{width: shrink?'60px':'200px', overflow: shrink ? 'visible' : 'auto'}">
            <shrinkable-menu 
                :shrink="shrink"
                :menu-list="menuList">
                <div slot="top" class="logo-con">
                    <img v-show="!shrink"  src="../images/logo.png" key="max-logo" />
                    <img v-show="shrink" src="../images/logo-min.jpg" key="min-logo" />
                </div>
            </shrinkable-menu>
        </div>
        <div class="main-header-con" :style="{paddingLeft: shrink?'60px':'200px'}">
            <div class="main-header">
                <div class="navicon-con">
                    <Button :style="{transform: 'rotateZ(' + (this.shrink ? '-90' : '0') + 'deg)'}" type="text" @click="toggleClick">
                        <Icon type="navicon" size="32"></Icon>
                    </Button>
                </div>
                <div class="header-middle-con">
                    <div class="main-breadcrumb">
                        <breadcrumb>
                            <BreadcrumbItem to="/home">首页</BreadcrumbItem>
                            <BreadcrumbItem v-if="showbread">{{seclist}}</BreadcrumbItem>
                            <BreadcrumbItem v-if="showbread">{{thrlist}}</BreadcrumbItem>
                        </breadcrumb>    
                    </div>
                </div>
                <div class="header-avator-con">
                    <div class="user-dropdown-menu-con">
                        <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
                            <Dropdown transfer trigger="click" @on-click="handleClickUserDropdown">
                                <a href="javascript:void(0)">
                                    <span class="main-user-name">{{ userName }}</span>
                                    <Icon type="arrow-down-b"></Icon>
                                </a>
                                <DropdownMenu slot="list">
                                    <DropdownItem name="loginout" divided>退出登录</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                            <Avatar icon="person" style="background: #619fe7;margin-left:10px;"></Avatar>
                        </Row>
                    </div>
                </div>
            </div>
        </div>
        <div class="single-page-con" :style="{left: shrink?'60px':'200px'}">
            <div class="single-page">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>
<script>
import Cookies from 'js-cookie';
import shrinkableMenu from './main-components/shrinkable-menu/shrinkable-menu.vue';

export default {
    components: {
        shrinkableMenu
    },
    data () {
        return {
            shrink: false,
            userName: '',
            showbread:true,
            seclist:'',
            thrlist:'',
        };
    },
    computed: {
        menuList () {
            return this.$store.state.app.menuList;
        }
    },
    methods: {
        init () {
            if(!Cookies.get('user')){
                this.$router.push({
                    name: 'login'
                });
            }
            this.userName = Cookies.get('user');
            
        },
        toggleClick () {
            this.shrink = !this.shrink;
        },
        handleClickUserDropdown (name) {
            this.$router.push({
                name: 'login'
            });
        },
        breadpath(path){
            if(path=='/' || path=='/home'){
                this.showbread=false;
                return;
            }else{
                this.showbread=true;
            }
            if(path.slice(1,6)=='video'){
                this.seclist='人员管理';
            }else{
                this.seclist='视频管理'
            }
            switch(path.slice(7)){
                case 'usermanage':
                    this.thrlist='用户管理';break;
                case 'pendingmanage':
                    this.thrlist='审核人员管理';break;
                case 'checkPending':
                    this.thrlist='待审核';break;
                case 'chenked':
                    this.thrlist='已审核';break;
                case 'videpList':
                    this.thrlist='视频管理';break;  
            }
        }
    },
    mounted () {
        this.init();
        console.log(this.$route);
        this.breadpath(this.$route.path);
    },
    watch:{
        $route(to, from) {    
            console.log(to);
            this.breadpath(to.path);
        }  
    }  
}
</script>
