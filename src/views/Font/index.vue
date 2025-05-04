<template>
    <div class="main">
        <div class="main-header">
            <a-form layout="inline" :form="form" @submit="handleSubmit">
                <a-form-item label="药品名">
                    <a-input v-decorator="[
                        'name',
                    ]" placeholder="请输入药品名">
                    </a-input>
                </a-form-item>
                <a-form-item label="类型">
                    <a-select style="width: 220px;" v-decorator="[
                        'type_id',
                    ]" placeholder="请选择类型">
                        <a-select-option v-for="(item, index) in typeList" :key="index" :value="item.id">{{ item.label
                        }}</a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item>
                    <a-button type="primary" html-type="submit">
                        查询
                    </a-button>
                    <a-button class="ml-8" @click="resetClick">
                        重置
                    </a-button>
                </a-form-item>
            </a-form>
        </div>
        <div class="main-content">
            <a-table :rowKey="(record, index) => { return index }" :columns="columns" :data-source="dataList">
                <span slot="status" slot-scope="text,record">
                    {{ text == '0' ? '正常保质期内' : text == '1' ? '过期废弃' : "-" }}
                </span>
                <span slot="action" slot-scope="text, record">
                    <a-button type="primary" @click="editClick(record)">购买</a-button>
                    <a-button type="primary" class="ml-8" @click="goComment(record)">药品评论</a-button>
                </span>
            </a-table>

            <!-- 新增 编辑弹窗 -->
            <a-modal :title="title" :visible="visible" @ok="handleOk" @cancel="handleCancel" ok-text="确认" cancel-text="取消">
                <a-form :form="modalForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">

                    <a-form-item label="数量">
                        <a-input-number style="width:100%" v-decorator="[
                            'account',
                            { rules: [{ required: true, message: '请输入数量' }] },
                        ]" placeholder="请输入数量">
                        </a-input-number>
                    </a-form-item>
                </a-form>
            </a-modal>

            <!-- 评论弹窗 -->
            <a-modal title="商品评价" width="800px" :visible="msgVisible" @ok="handleMsgOk" @cancel="handleMsgCancel"
                ok-text="确认" cancel-text="取消" :footer='false'>
                <a-list item-layout="horizontal" :data-source="msgDataList">
                    <a-list-item slot="renderItem" slot-scope="item, index">
                        <a-list-item-meta :description="item.msg">
                            <div slot="title">
                                留言人：{{ item.username }}
                                留言时间：{{ item.create_time }}
                            </div>
                        </a-list-item-meta>
                    </a-list-item>
                </a-list>

                <a-textarea style="margin-top: 16px;" v-model="msg" placeholder="请输入留言"></a-textarea>
                <div style="display: flex;justify-content: end;">
                    <a-button type="primary" style="margin-top: 16px;width: 150px;" @click="addCommodityMsg">发布</a-button>
                </div>

            </a-modal>
        </div>
    </div>
</template>

<script>
export default {
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
                    title: '药品名',
                    dataIndex: 'name',
                    key: 'name',
                },
                {
                    title: '药物类别',
                    dataIndex: 'type_name',
                    key: 'type_name',
                },
                {
                    title: '剩余数量',
                    dataIndex: 'account',
                    key: 'account',
                },
                {
                    title: '单价',
                    dataIndex: 'price',
                    key: 'price',
                },
                {
                    title: '批次号',
                    dataIndex: 'code',
                    key: 'code',
                },
                {
                    title: '当前状态',
                    dataIndex: 'status',
                    key: 'status',
                    scopedSlots: { customRender: 'status' },
                },
                {
                    title: '入库时间',
                    dataIndex: 'create_time',
                    key: 'create_time',
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 220,
                    scopedSlots: { customRender: 'action' },
                },
            ],
            statusTypeList: [
                {
                    label: "正常使用中",
                    value: '0'
                },
                {
                    label: "过期废弃",
                    value: '1'
                },
            ],
            typeList: [],
            dataList: [],
            form: this.$form.createForm(this),
            formLine: {},
            loading: false,
            imageUrl: '',

            // 弹窗相关
            title: "新增",
            visible: false,
            clickRow: {},
            modalForm: this.$form.createForm(this),

            msgVisible: false,
            msgDataList: [
                {
                    title: 'Ant Design Title 1',
                },
                {
                    title: 'Ant Design Title 2',
                },
                {
                    title: 'Ant Design Title 3',
                },
                {
                    title: 'Ant Design Title 4',
                },
            ],
            msg: ""

        }
    },
    created() {
        this.getTypeList()
        this.getListData()
    },
    methods: {
        getTypeList() {
            this.$Apis.getTypeList().then(res => {
                this.typeList = res.data
            })
        },
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
            this.$Apis.getCommodityList({
                ...this.formLine,
            }).then(res => {
                this.dataList = res.data
                /*  let arr = []
                 res.data.map(el => {
                     let typeStr = ''
                     this.typeList.map(cl => {
                         if (cl.id == el.type) {
                             typeStr = cl.label
                         }
                     })
                     arr.push({
                         ...el,
                         typeStr
                     })
                 })
                 this.dataList = arr */
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
            this.title = '购买'
            this.$nextTick(() => {
                this.clickRow = emit
                // this.modalForm.setFieldsValue({ ...emit })
            })
        },
        // 评论
        goComment(record) {
            this.msgVisible = true
            console.log(record);

            this.clickRow = record

            this.getMsgList(record.id)
        },
        addCommodityMsg() {
            if (this.msg == '') {
                this.$message.warning('请输入留言内容后重试！')
            } else {
                this.$Apis.addCommodityMsgList({
                    commodity_id: this.clickRow.id,
                    user_id: sessionStorage.getItem('userId'),
                    msg: this.msg
                }).then(res => {
                    this.msg = ''
                    this.getMsgList(this.clickRow.id)
                })
            }

        },
        // 删除
        deleteClick(emit) {
            console.log(emit);
            this.$Apis.deleteCommodityList({
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
                    console.log(this.clickRow);
                    let send = {
                        ...values,
                        commodity_id: this.clickRow.id,
                        price: this.clickRow.price,
                        creator_id: sessionStorage.getItem('userId'),
                        user_id: sessionStorage.getItem('userId'),
                        remark: ""
                    }
                    this.$Apis.addPurchase({
                        ...send,
                    }).then(res => {
                        if (res.data.code === 0) {
                            this.visible = false
                            this.getListData()
                        }
                    })
                }
            });
        },
        handleChange(info) {
            if (info.file.status === 'uploading') {
                this.loading = true;
                return;
            }
        },
        getMsgList(id) {
            this.$Apis.getCommodityMsgList({ id }).then(res => {

                this.msgDataList = res.data
                console.log(res);
                console.log("留言内容");
            })
        },
        handleMsgOk() {
            this.msgVisible = false
        },
        handleMsgCancel() {
            this.msgVisible = false
        },
        handleCancel() {
            this.visible = false
        },
        cancel() {
            this.$message.info('取消删除');
        }
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