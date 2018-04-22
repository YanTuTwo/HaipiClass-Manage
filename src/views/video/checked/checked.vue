<template>
    <div class="videolist">
        <div class="searchlist">
            <Table border :columns="columns1" :data="historylist"></Table>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    name: 'videolist',
    data(){
        return{
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
                        title: '审核地址',
                        key: 'videoUrl'
                    },
                    {
                        title: '审核情况',
                        key: 'pending'
                    },
                    {
                        title: '未通过原因',
                        key: 'reason'
                    },
                    {
                        title: '审核人',
                        key: 'puserid'
                    },
                ],
                historylist: [],
        }
    },
    mounted(){
        this.getvideohistory();
    },
    methods:{
        getvideohistory(){
            axios.get('http://193.112.95.221:9999/getvideohistory',{}).then((res)=>{
                if(res.data.code){
                    this.historylist=res.data.data.reverse();
                    for(var i=0;i<this.historylist.length;i++){
                        console.log(this.historylist[i].uptime);
                        this.historylist[i].uptime=this.datefilter(this.historylist[i].uptime);
                        if(this.historylist[i].pending==1){
                            this.historylist[i].pending="通过"
                        }else if(this.historylist[i].pending==2){
                            this.historylist[i].pending="未通过"
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
        
    }
};
</script>
<style>
.videolist{
    text-align: center;
}
.searchlist{
    padding: 0 2%;
}
    .ivu-table .demo-table-info-row td{
        background-color: #2db7f5;
        color: #fff;
    }
    .ivu-table .demo-table-error-row td{
        background-color:rgb(247, 118, 89);
        color: #fff;
    }
    .ivu-table td.demo-table-info-column{
        background-color: #2db7f5;
        color: #fff;
    }
    .ivu-table .demo-table-info-cell-name {
        background-color: #2db7f5;
        color: #fff;
    }
    .ivu-table .demo-table-info-cell-age {
        background-color: #ff6600;
        color: #fff;
    }
    .ivu-table .demo-table-info-cell-address {
        background-color: #187;
        color: #fff;
    }
</style>
