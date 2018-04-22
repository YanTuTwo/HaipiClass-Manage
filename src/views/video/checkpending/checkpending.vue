<template>
    <div class="checkpennding">
        <Row :gutter="16">
            <Col span="18" v-if="!isEmptyVideo">
                <Card>
                    <p slot="title">
                        <Icon type='android-remove'></Icon>
                        视频审核
                    </p>
                    <div class="edittable-table-height-con" style="overflow:hidden">
                        <Row :gutter="16">
                            <Col span="18">                                
                                <div class="videowrap">
                                    <video width="100%" :src="currentVideo.videoUrl" controls></video>
                                </div>                               
                            </Col>
                            <Col span="6">                                
                                <div class="videoaction">
                                    <dl>
                                        <dt><span>审核规则：</span>
                                            <p>《互联网信息服务管理办法》所严禁的九类信息</p>
                                            <p>（一）反对宪法所确定的基本原则的；
                                                （二）危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；
                                                （三）损害国家荣誉和利益的；
                                                （四）煽动民族仇恨、民族歧视，破坏民族团结的；
                                                （五）破坏国家宗教政策，宣扬邪教和封建迷信的；
                                                （六）散布谣言，扰乱社会秩序，破坏社会稳定的；
                                                （七）散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；
                                                （八）侮辱或者诽谤他人，侵害他人合法权益的；
                                                （八）侮辱或者诽谤他人，侵害他人合法权益的；</p>
                                        </dt>
                                        <dd><span>上传者id：</span>{{currentVideo.userid}}</dd>
                                        <dd><span>视频id：</span>{{currentVideo.videoid}}</dd>
                                        <dd><span>视频标题：</span>{{currentVideo.tit}}</dd>
                                        <dd><span>视频简介：</span>{{currentVideo.desc}}</dd>
                                        <dd><span>上传时间：</span>{{currentVideo.uptime | ConvertTime}}</dd>
                                    </dl>
                                </div>
                                <div class="pendingbtn">
                                    <Button type="success" long @click="showpass=true">通过</Button>
                                    <br><br>
                                    <Button type="error" long  @click="shownotpass=true">未通过</Button>
                                </div>                                
                            </Col>
                        </Row>
                        
                        
                    </div>
                </Card>
            </Col>
            <Col span="6" v-if="!isEmptyVideo">
                <Card>
                    <p slot="title">
                        <Icon type='android-remove'></Icon>
                        待审核视频列表
                    </p>
                    <div class="edittable-table-height-con">
                        <ul class="pendinglist">
                            <li :class="{active:currentIndex==index}" v-for="(item,index) in videoList" :key="item.videoid" @click="selectvideo(index)">
                                {{item.tit}}
                                <span> {{item.uptime | ConvertTime}}</span>
                            </li>                            
                        </ul>
                    </div>
                </Card>
            </Col>
        </Row>
        <Modal
            v-model="shownotpass"
            title="请填写未通过原因"
            @on-ok="notpassok">
                <Input v-model="nopassReason" type="textarea" :rows="4" placeholder="未通过原因...."></Input>
        </Modal>
        <Modal
            v-model="showpass"
            title="通过确认"
            @on-ok="passok">
                <p>根据相关视频规则，确认本视频通过审核！</p>
        </Modal>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
import axios from 'axios';
export default {
    name: 'checkpending',
    data(){
        return {
            shownotpass:false,
            showpass:false,
            videoList:[],
            nopassReason:'',
            currentIndex:0,
            currentVideo:{},
            isEmptyVideo:true,
        }
    },
    mounted(){
        this.getpendinglist();
    },
    methods:{
        getpendinglist(){
            this.loading=true;
            axios.get('http://193.112.95.221:9999/upload/videoList?pending=0',{}).then((res)=>{
                if(res.data.code){
                    this.videoList=res.data.videolist;  
                    if(this.videoList.length>0){
                        this.currentVideo=this.videoList[this.currentIndex];    
                        this.isEmptyVideo=false;
                    }else{
                        this.currentVideo=[];
                        this.isEmptyVideo=true;
                        this.closable();
                    }
                                 
                    this.loading=false;
                }
            })
        },
        pendresult(pending){
            axios.post('http://193.112.95.221:9999/pendresult',{
                videoid:this.currentVideo.videoid,
                puserid:Cookies.get('user'),
                pending:pending,
            }).then((res)=>{
                if(res.data.code){
                    this.addhistory(pending);                   
                }
            })
        },
        notpassok(){
            this.pendresult(2);
        },
        passok(){
            this.pendresult(1);            
        },
        addhistory(pending){
            axios.post('http://193.112.95.221:9999/addhistory',{
                videoid:this.currentVideo.videoid,
                tit:this.currentVideo.tit,
                uptime:this.currentVideo.uptime,
                userid:this.currentVideo.userid,
                videoUrl:this.currentVideo.videoUrl,
                videoimg:this.currentVideo.videoimg,
                pending:pending,
                puserid:Cookies.get('user'),
                reason:this.nopassReason,
            }).then((res)=>{
                if(res.data.code){
                   console.log("保存记录成功");
                   this.getpendinglist();
                }
            })
        },
        selectvideo(index){
            this.currentIndex=index;
            this.currentVideo=this.videoList[this.currentIndex];
        },
        closable () {
            this.$Message.info({
                content: '暂无视频需要审核！',
                duration: 3,
                closable: true
            });
        }
    }
};
</script>
<style scoped>
.videowrap{
    max-height: 700px;
}
video{
    width: 100%;
    max-height: 700px;
}
.videoaction{
    /* float: left; */
    /* width: 70%; */
    font-size: 12px;
}
.videoaction dt span{
     font-weight: 700;
}
.videoaction dd{
    margin: 15px 0;
}
.videoaction dd span{
    font-weight: 700;
}
.pendinglist{
    height: 700px;
    overflow-y: auto;
}
.pendinglist li{
    width: 100%;
    border-radius: 5px;
    border:1px solid #ccc;
    color: #666;
    padding:10px;
    margin: 5px 0;
    cursor: pointer;
    overflow: hidden;
}
.pendinglist li:hover{
    color: rgb(97, 159, 231);
    border:1px solid rgb(97, 159, 231);
}
.pendinglist li.active{
    color: rgb(97, 159, 231);
    border:1px solid rgb(97, 159, 231);
}
.pendinglist li span {
    float: right;
}
.pendingbtn{
    padding: 0 10px;
}
</style>
