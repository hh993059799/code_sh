<template>
    <div class="main">
        <div class="main-header">
            <a-form layout="inline" :form="form" @submit="handleSubmit">
                <a-form-item label="内容">
                    <a-input v-decorator="[
                        'title',
                    ]" placeholder="请输入内容">
                    </a-input>
                </a-form-item>
                <a-form-item>
                    <a-button type="primary" html-type="submit">
                        查询
                    </a-button>
                    <a-button class="ml-8" @click="resetClick">
                        重置
                    </a-button>
                </a-form-item>
                <a-form-item style="float:right">
                    <a-button type="primary" @click="addClick">新增提问</a-button>
                </a-form-item>
            </a-form>
        </div>
        <div class="main-content">
            <a-table :rowKey="(record, index) => { return index }" :columns="columns" :data-source="dataList">
                <span slot="type" slot-scope="text">
                    {{ text == 0 ? '待回复' : text == 1 ? "已回复" : text == 2 ? "已解决" : '-' }}
                </span>
                <span slot="action" slot-scope="text, record">
                    <a-button type="primary" @click="showChat(record)">详情</a-button>
                    <!-- <a-button class="ml-8" type="primary" @click="editClick(record)">编辑</a-button> -->
                    <a-popconfirm title="是否确定删除?" ok-text="确认" cancel-text="取消" @confirm="deleteClick(record)"
                        @cancel="cancel">
                        <a-button class="ml-8" type="danger">删除</a-button>
                    </a-popconfirm>
                </span>
            </a-table>

            <!-- 新增 编辑弹窗 -->
            <a-modal :title="title" :visible="visible" @ok="handleOk" @cancel="handleCancel" ok-text="确认" cancel-text="取消">
                <a-form :form="modalForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-form-item label="标题">
                        <a-input :disabled="title == '编辑'" style="width:100%" v-decorator="[
                            'title',
                            { rules: [{ required: true, message: '请输入标题' }] },
                        ]" placeholder="请输入标题">
                        </a-input>
                    </a-form-item>
                    <a-form-item label="提问内容">
                        <a-textarea v-decorator="[
                            'info',
                            { rules: [{ required: true, message: '请输入提问内容' }] },
                        ]" placeholder="请输入提问内容"></a-textarea>
                    </a-form-item>
                </a-form>
            </a-modal>

            <!-- 详情聊天框 -->
            <detail-component :title="chatTitle" :visible="chatVisible" page_name="order" :detailData="detailData"
                :detailId="detailId" :detailStatus="detailStatus"></detail-component>
        </div>
    </div>
</template>

<script>
import detailComponent from '../detail.vue'
export default {
    components: {
        detailComponent
    },
    data() {
        return {
            columns: [
                {
                    title: '编号',
                    dataIndex: 'id',
                    key: 'id',
                    width: "80px"
                },
                {
                    title: '标题',
                    dataIndex: 'title',
                    key: 'title',
                },
                {
                    title: '类型',
                    dataIndex: 'typeStr',
                    key: 'typeStr',
                },
                {
                    title: '提问人',
                    dataIndex: 'username',
                    key: 'username',
                },
                {
                    title: '创建时间',
                    dataIndex: 'create_time',
                    key: 'create_time',
                },
                {
                    title: '当前状态',
                    dataIndex: 'status',
                    key: 'status',
                    scopedSlots: { customRender: 'type' },
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 300,
                    scopedSlots: { customRender: 'action' },
                },
            ],
            dataList: [],
            form: this.$form.createForm(this),
            formLine: {},

            // 弹窗相关
            title: "新增",
            visible: false,
            clickRow: {},
            modalForm: this.$form.createForm(this),


            // 聊天
            chatTitle: "",
            chatVisible: false,
            detailData: [],
            detailId: null,
            detailStatus: false
        }
    },
    created() {
        this.$nextTick(() => {
            this.getListData()
        })
    },
    methods: {
        // 重置参数
        resetClick() {
            this.form.resetFields()
            this.formLine = {}
            this.$nextTick(() => {
                this.getListData()
            })
        },
        // 提交查询
        handleSubmit(e) {
            e.preventDefault();
            this.form.validateFields((err, values) => {
                if (!err) {
                    this.formLine = values
                    this.getListData()
                }
            });
        },
        // 获取列表数据
        getListData() {
            this.$Apis.getOrderList({
                ...this.formLine,
            }).then(res => {
               
                this.dataList = res.data
            })
        },
        // 新增
        addClick() {
            this.visible = true
            this.modalForm.resetFields()
            this.title = '新增'
        },
        // 编辑
        editClick(emit) {
            console.log(emit)
            this.visible = true
            this.title = '编辑'
            this.$nextTick(() => {
                this.clickRow = emit
                this.modalForm.setFieldsValue({ ...emit })
            })
        },
        // 删除
        deleteClick(emit) {
            console.log(emit);
            this.$Apis.deleteOrder({
                id: emit.id
            }).then(res => {
                if (res.data.code === 0) {
                    this.visible = false
                    this.getListData()
                }
            })
        },

        // 弹窗相关
        handleOk() {
            this.modalForm.validateFields((err, values) => {
                if (!err) {
                    console.log(values);

                    if (this.title == '新增') {
                        let send = {
                            ...values,
                        }
                        this.$Apis.addOrder({
                            ...send,
                            user_id: sessionStorage.getItem('userId')
                        }).then(res => {
                            if (res.data.code === 0) {
                                this.visible = false
                                this.getListData()
                            }
                        })
                    }

                    if (this.title == '编辑') {
                        let send = {
                            ...values,
                            id: this.clickRow.id,
                        }
                        this.$Apis.editOrder({
                            ...send,
                        }).then(res => {
                            if (res.data.code === 0) {
                                this.visible = false
                                this.getListData()
                            }
                        })
                    }
                }
            });
        },
        handleCancel() {
            this.visible = false
        },
        cancel() {
            this.$message.info('取消删除');
        },


        // 聊天
        chatHandleOk() {
            this.chatVisible = false
        },
        chatCancel() {
            this.chatVisible = false
        },
        showChat(record) {
            console.log(record);
            this.detailStatus = record.status == '2' ? true : false
            this.getChatInfo(record.id)
            this.chatVisible = true
            this.chatTitle = record.title
            this.detailId = record.id
          
            console.log( this.detailStatus);
        },
        getChatInfo(id) {
            this.$Apis.getChatInfoList({
                order_id: id
            }).then(res => {

                this.detailData = res.data
            })
        },
    }
}
</script>

<style lang="less" scoped>
.avatar-uploader {
    img {
        height: 120px;
    }
}
</style>