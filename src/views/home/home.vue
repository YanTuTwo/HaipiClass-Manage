<template>
    <div class="home-main">
       <div class="welcome">
           <p>欢迎您，{{pusername}}</p>
       </div>
       <Row :gutter="16" type="flex" justify="space-around" >
            <Col span="6">
                <div class="cardItem">
                    <div class="icon" style="background: rgb(45,140,240);"><Icon type="android-people" size="40" color="#fff"></Icon></div>
                    <div class="count">
                        <span style="color: rgb(45,140,240);">{{indexlist.usercount}}</span>
                        <p>总用户数</p>
                    </div>
                </div>                   
            </Col>
            <Col span="6">
                <div class="cardItem">
                    <div class="icon" style="background: rgb(100,213,114);"><Icon type="android-cloud" size="40" color="#fff"></Icon></div>
                    <div class="count">
                        <span style="color: rgb(100,213,114);">{{indexlist.pendcount}}</span>
                        <p>待审核视频</p>
                    </div>
                </div>                   
            </Col>
        </Row>
        <br><br>
        <Row :gutter="16" type="flex" justify="space-between" >
            <Col span="6">
                <div class="cardItem">
                    <div class="icon" style="background: rgb(255,213,114);"><Icon type="android-archive" size="40" color="#fff"></Icon></div>
                    <div class="count">
                        <span style="color: rgb(255,213,114);">{{indexlist.passcount}}</span>
                        <p>已通过视频</p>
                    </div>
                </div>                   
            </Col>
            <Col span="6">
                <div class="cardItem">
                    <div class="icon" style="background: rgb(100,94,67);"><Icon type="android-cloud-done" size="40" color="#fff"></Icon></div>
                    <div class="count">
                        <span style="color: rgb(100,94,67);">{{indexlist.historycount}}</span>
                        <p>已审核视频</p>
                    </div>
                </div>                   
            </Col>
            <Col span="6">
                <div class="cardItem">
                    <div class="icon" style="background: rgb(242,94,67);"><Icon type="android-delete" size="40" color="#fff"></Icon></div>
                    <div class="count">
                        <span style="color: rgb(242,94,67);">{{indexlist.notpasscount}}</span>
                        <p>未通过视频</p>
                    </div>
                </div>                   
            </Col>
       </Row>
       <Row>
            <Col span="8" offset="8">
                <div class="imgwrap">
                    <img src="./home.gif" alt="">
                </div>
                
            </Col>
       </Row>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
import axios from 'axios'
export default {
    name: 'home',
    data () {
        return {
            indexlist:{},
            puserinfo:{},
            pusername:'Admin',
        };
    },
    mounted(){
        this.$store.commit('updateMenulist');
        this.initData();
    },
    methods:{
        initData(){
            this.puserid = Cookies.get('user');
            axios.get('http://193.112.95.221:9999/pindex').then((res)=>{
                console.log(res.data);
                if(res.data.code){
                    this.indexlist=res.data.data;
                }
            });
            if(this.puserid=='admin'){
                 this.pusername='Admin';
                return ;
            }
            axios.get('http://193.112.95.221:9999/puserinfo?puserid='+this.puserid).then((res)=>{
                console.log(res.data);
                if(res.data.code){
                    this.puserinfo=res.data.data;
                    this.pusername=this.puserinfo.puserdata.name;
                }
            })
        }
    }
};
</script>
<style scoped>
.home-main{
    width: 100%;
    height: 100%;
    background-color: rgb(243, 243, 243);
    padding: 0 5%;
}
img{
    width: 100%;
}
.welcome{
    width: 100%;
    text-align: center;
    padding: 50px 0;
}
.welcome p{
    text-align: center;
    /* color: #666; */
    font-size: 50px;
    font-weight: 700;
    color: #fff; text-shadow: 0 1px 0 #ccc, 0 2px 0 #c9c9c9, 0 3px 0 #bbb, 0 4px 0 #b9b9b9, 0 5px 0 #aaa, 0 6px 1px rgba(0,0,0,0.1), 0 0 5px rgba(0,0,0,0.1),0 1px 3px rgba(0,0,0,0.3),0 3px 5px rgba(0,0,0,0.2),0 5px 10px rgba(0,0,0,0.25);
}
.cardItem{
    width: 100%;
    height: 100px;
    text-align: center;
    background: #fff;
    overflow: hidden;
    border-radius: 2px;
}
.icon{
    float: left;
    width: 33.33%;
    height: 100%;
    padding: 30px 0;
}
.count{
    float: left;
    width: 66.66%;
    height: 100%;
    text-align: center;
    padding: 15px 0;
}
.count span{
    font-size: 30px;
    line-height: 50px;
}
.count p{
    color: #ccc;
    font-size: 14px;
    line-height: 20px;
    text-align: center;
}
</style>
