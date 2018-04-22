<template>
    <div class="usermanage">
        <div class="search">
            <Select v-model="searchType" style="width:200px">
                <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Input v-model="searchvalue" placeholder="Enter something..." style="width: 300px"></Input>
            <Button type="primary" icon="ios-search" @click="searchbtn">Search</Button>
        </div>
        <div class="searchlist">
            <Table border :columns="columns1" :data="userdata"></Table>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    name: 'usernanage',
    data(){
        return{
            cityList: [
                    {
                        value: 'all',
                        label: '全部'
                    },
                    {
                        value: 'userid',
                        label: '用户名'
                    },
                    {
                        value: 'nickname',
                        label: '昵称'
                    },
                    {
                        value: 'sex',
                        label: '性别'
                    },
                    {
                        value: 'intro',
                        label: '简介'
                    },
                ],
            searchType: '',
            searchvalue:'',
            columns1: [
                    {
                        title: '用户名',
                        key: 'userid'
                    },
                    {
                        title: '昵称',
                        key: 'nickname'
                    },
                    {
                        title: '性别',
                        key: 'sex'
                    },
                    {
                        title: '年龄',
                        key: 'age'
                    },
                    {
                        title: '简介',
                        key: 'intro'
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
                                        let userid=this.userdata[params.index].userid;
                                        this.deleuser(userid,params.index);
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
                userdata: []
        }
    },
    mounted(){
        this.initdata();
    },
    methods:{
        initdata(){
            axios.get("http://193.112.95.221:9999/alluser",{}).then((res)=>{
                if(res.data.code){
                    console.log(res.data);
                    this.userdata=res.data.data;
                }
            })
        },
        deleuser(userid,index){
            axios.post("http://193.112.95.221:9999/deleuser",{
                userid:userid
            }).then((res)=>{
                if(res.data.code){
                    this.userdata.splice(index, 1);
                }
            })
        },
        searchbtn(){
            if(this.searchType=="all"){
                 this.initdata();return;
            }
            if(this.searchType==""){
                this.$Message.info('请选择搜索类型！');return;
            }
            if(this.searchvalue==""){
                this.$Message.info('请输入搜索内容！');return;
            }
            
            axios.get("http://193.112.95.221:9999/searchuser?searchType="+this.searchType+'&searchValue='+this.searchvalue,{}).then((res)=>{
                if(res.data.code){
                    console.log(res.data);
                    this.userdata=res.data.data;
                }
            })
        }
    }
};
</script>
<style scoped>
.usermanage{
    text-align: center;
}
.search{
    margin: 30px 0;
}
.searchlist{
    padding: 0 5%;
}
</style>
