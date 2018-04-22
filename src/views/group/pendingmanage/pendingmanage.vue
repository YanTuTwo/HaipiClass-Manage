<template>
    <div class="pendingmanage">
        <div class="search">
            <Select v-model="searchType" style="width:200px">
                <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Input v-model="searchvalue" placeholder="Enter something..." style="width: 300px"></Input>
            <Button type="primary" icon="ios-search" @click="searchbtn">Search</Button>
            <div class="addpuser" @click="showaddpuser=true"><Icon type="person-add"></Icon></div>
        </div>
        <div class="searchlist">
            <Table border :columns="columns1" :data="puserdata"></Table>
        </div>
        <Modal
            v-model="showaddpuser"
            title="添加审核人员">
            <div slot="footer">
                <Button type="success" size="large" long :loading="modal_loading" @click="addpuser">添加</Button>
            </div>
            <Form :model="formItem" :label-width="80">
                <FormItem label="编号">
                    <Input v-model="formItem.puserid" placeholder="请输入编号"></Input>
                </FormItem>
                <FormItem label="姓名">
                    <Input v-model="formItem.name" placeholder="请输入姓名"></Input>
                </FormItem>
                 <FormItem label="密码">
                    <Input v-model="formItem.password" placeholder="请输入密码" type="password"></Input>
                </FormItem>
                <FormItem label="性别">
                    <RadioGroup v-model="formItem.sex">
                        <Radio label="男">男</Radio>
                        <Radio label="女">女</Radio>
                    </RadioGroup>
                </FormItem>               
            </Form>
        </Modal>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    name: 'pendingmanage',
    data(){
        return{
            modal_loading:false,
            formItem: {
                puserid: '',
                pname:'',
                sex:'男',
                password:'',
            },
            showaddpuser:false,
            cityList: [
                    {
                        value: 'all',
                        label: '全部'
                    },
                    {
                        value: 'puserid',
                        label: '编号'
                    },
                    {
                        value: 'name',
                        label: '姓名'
                    },
                    {
                        value: 'sex',
                        label: '性别'
                    }
                ],
            searchType: '',
            searchvalue:'',
            columns1: [
                    {
                        title: '编号',
                        key: 'puserid'
                    }, 
                    {
                        title: '密码',
                        key: 'password'
                    },
                    {
                        title: '姓名',
                        key: 'name'
                    },
                    {
                        title: '性别',
                        key: 'sex'
                    },
                    {
                        title: '最后一次登录时间',
                        key: 'lastlogin',
                        "sortable": true
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
                                        let puserid=this.puserdata[params.index].puserid;
                                        this.delepuser(puserid,params.index);
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
                puserdata: []
        }
    },
    mounted(){
        this.initdata();
    },
    methods:{
        initdata(){
            axios.get('http://193.112.95.221:9999/getpuserinfo',this.formItem).then((res)=>{
                console.log(res.data);
                if(res.data.code){
                    this.puserdata=res.data.data;
                    // this.$Message.info('添加成功！');
                }else{
                    //  this.$Message.info('添加失败！');
                }
            })
        },
        addpuser(){
            if(this.formItem.puserid=='' || this.formItem.password=='' || this.formItem.name==''){
                this.$Message.info("请填写完整信息！");
                return ;
            }
            this.modal_loading=true;
            axios.post('http://193.112.95.221:9999/pregister',this.formItem).then((res)=>{
                console.log(res.data);
                if(res.data.code){
                    this.formItem.puserid='';
                    this.formItem.password='';
                    this.formItem.name='';
                    this.showaddpuser=false;
                    this.$Message.info(res.data.msg);
                }else{
                    this.$Message.info(res.data.msg);
                }
                this.modal_loading=false;
            })
        },
        delepuser(puserid,index){
            axios.post("http://193.112.95.221:9999/delepuser",{
                puserid:puserid
            }).then((res)=>{
                if(res.data.code){
                    this.puserdata.splice(index, 1);
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
            
            axios.get("http://193.112.95.221:9999/searchpuser?searchType="+this.searchType+'&searchValue='+this.searchvalue,{}).then((res)=>{
                if(res.data.code){
                    console.log(res.data);
                    this.puserdata=res.data.data;
                }
            })
        }
    }
};
</script>
<style scoped>
.pendingmanage{
    text-align: center;
}
.search{
    margin: 30px 0;
    position: relative;
}
.searchlist{
    padding: 0 5%;
}
.search .addpuser{
    position: absolute;
    top: 0;
    left: 30px;
    font-size: 30px;
    cursor: pointer;
}
</style>
