<template>
    <div class="videolist">
        <div class="search">
            <Select v-model="searchType" style="width:200px">
                <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Input v-model="searchvalue" placeholder="Enter something..." style="width: 300px"></Input>
            <Button type="primary" icon="ios-search" @click="searchbtn">Search</Button>
            <RadioGroup v-model="radiovalue" style="marginLeft:20px" @on-change="changepend">
                <Radio label="全部"></Radio>
                <Radio label="待审核"></Radio>
                <Radio label="通过"></Radio>
                <Radio label="未通过"></Radio>
            </RadioGroup>
        </div>
        <div class="searchlist">
            <Table border :columns="columns1" :data="videolist"></Table>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    name: 'videolist',
    data(){
        return{
            radiovalue:'全部',
            cityList: [
                    {
                        value: 'all',
                        label: '全部'
                    },
                    {
                        value: 'videoid',
                        label: '视频编号'
                    },
                    {
                        value: 'tit',
                        label: '视频标题'
                    },
                    {
                        value: 'userid',
                        label: '上传者'
                    }
                ],
            searchType: '',
            searchvalue:'',
            columns1: [
                    {
                        title: '视频编号',
                        key: 'videoid'
                    },
                    {
                        title: '视频标题',
                        key: 'tit'
                    },
                    {
                        title: '上传时间',
                        key: 'uptime'
                    },
                    {
                        title: '上传者',
                        key: 'userid'
                    },
                    {
                        title: '视频地址',
                        key: 'videoUrl'
                    },
                    {
                        title: '审核情况',
                        key: 'pending'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('Poptip',{
                                props:{
                                    confirm:true,
                                    title:"您确定要删除这条数据吗？",
                                    transfer:true,
                                },
                                on:{
                                    'on-ok':()=>{
                                        let videoid=this.videolist[params.index].videoid;
                                        this.delevideo(videoid,params.index);
                                    }
                                }
                            }, [
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                }, '删除')
                            ]);
                        }
                    }
                ],
                videolist: [],//当前显示的数组
                allVideoList:[],//原来接口获取的数组
        }
    },
    mounted(){
        this.getallvideo();
    },
    methods:{
        getallvideo(){
            axios.get('http://193.112.95.221:9999/allvideo').then((res)=>{
                console.log(res.data);
                if(res.data.code){
                    this.allVideoList=res.data.data.reverse();
                    this.videolist=this.allVideoList;
                    for(var i=0;i<this.videolist.length;i++){
                        this.videolist[i].uptime=this.datefilter(this.videolist[i].uptime);
                        if(this.videolist[i].pending==1){
                            this.videolist[i].pending="通过"
                        }else if(this.videolist[i].pending==2){
                            this.videolist[i].pending="未通过"
                        }else if(this.videolist[i].pending==0){
                            this.videolist[i].pending="待审核"
                        }
                    }
                }
            })
        },
        delevideo(videoid,index){
            axios.post("http://193.112.95.221:9999/delevideo",{
                videoid:videoid
            }).then((res)=>{
                if(res.data.code){
                    this.videolist.splice(index, 1);
                }
            })
        },
        searchbtn(){
            if(this.searchType=="all"){
                 this.getallvideo();return;
            }
            if(this.searchType==""){
                this.$Message.info('请选择搜索类型！');return;
            }
            if(this.searchvalue==""){
                this.$Message.info('请输入搜索内容！');return;
            }
            
            axios.get("http://193.112.95.221:9999/searchvideo?searchType="+this.searchType+'&searchValue='+this.searchvalue,{}).then((res)=>{
                if(res.data.code){
                    console.log(res.data);
                    this.allVideoList=res.data.data.reverse();
                    this.videolist=this.allVideoList;
                    for(var i=0;i<this.videolist.length;i++){
                        console.log(this.videolist[i].uptime);
                        this.videolist[i].uptime=this.datefilter(this.videolist[i].uptime);
                        if(this.videolist[i].pending==1){
                            this.videolist[i].pending="通过"
                        }else if(this.videolist[i].pending==2){
                            this.videolist[i].pending="未通过"
                        }else if(this.videolist[i].pending==0){
                            this.videolist[i].pending="待审核"
                        }
                    }
                }
            })
        },
        datefilter(value){
            if (!value) return ''
            let date=new Date(value);
            let str="";
            let year = date.getFullYear();
            let month= date.getMonth()+1;
            let day = date.getDate();
            let hour = date.getHours();
            let minutes=date.getMinutes();
            let second = date.getSeconds();
            str=year+'-'+month+"-"+day+"    "+hour+":"+minutes+":"+second;
            return str
        },
        changepend(value){
            console.log(value);
            this.videolist=[];
            if(value=="待审核"){
                for(var i=0;i<this.allVideoList.length;i++){
                    if(this.allVideoList[i].pending=="待审核"){
                        this.videolist.push(this.allVideoList[i]);
                    }
                }
            }else if(value=="通过"){
                for(var i=0;i<this.allVideoList.length;i++){
                    if(this.allVideoList[i].pending=="通过"){
                        this.videolist.push(this.allVideoList[i]);
                    }
                }
            }else if(value=="未通过"){
                for(var i=0;i<this.allVideoList.length;i++){
                    if(this.allVideoList[i].pending=="未通过"){
                        this.videolist.push(this.allVideoList[i]);
                    }
                }
            }else if(value=="全部"){
               this.videolist=this.allVideoList;
            }
        }
    }
};
</script>
<style scoped>
.videolist{
    text-align: center;
}
.search{
    margin: 30px 0;
}
.searchlist{
    padding: 0 5%;
}
</style>
