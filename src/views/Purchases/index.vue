<template>
    <div class="main">
        <div class="main-header">
            <a-form layout="inline" :form="form" @submit="handleSubmit">
                <a-form-item label="商品">
                    <a-select style="width: 220px;" v-decorator="[
                        'commodity_id',
                    ]" placeholder="请选择商品">
                        <a-select-option v-for="(item, index) in communityList" :key="index" :value="item.id">{{ item.name
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
                <span slot="image" slot-scope="text,record">
                    <img :src="record.image" alt="" height="60px">
                </span>
                <span slot="action" slot-scope="text, record">
                    <a-button type="primary" @click="editClick(record)">编辑</a-button>
                    <a-popconfirm title="是否确定删除?" ok-text="确认" cancel-text="取消" @confirm="deleteClick(record)"
                        @cancel="cancel">
                        <a-button class="ml-8" type="danger">删除</a-button>
                    </a-popconfirm>
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
                    <a-form-item label="备注信息">
                        <a-textarea v-decorator="[
                            'remark',
                        ]" placeholder="请输入备注" :rows="4" />
                    </a-form-item>
                </a-form>
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
                    title: '购买人',
                    dataIndex: 'username',
                    key: 'username',
                },
                {
                    title: '药品名',
                    dataIndex: 'commoditieName',
                    key: 'commoditieName',
                },
                {
                    title: '数量',
                    dataIndex: 'account',
                    key: 'account',
                },
                {
                    title: '总价格',
                    dataIndex: 'total_price',
                    key: 'total_price',
                },
                {
                    title: '操作人',
                    dataIndex: 'creatorName',
                    key: 'creatorName',
                },
                {
                    title: '备注',
                    dataIndex: 'remark',
                    key: 'remark',
                    width: 220,
                },
                {
                    title: '创建时间',
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
            communityList: [],
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

        }
    },
    created() {
        this.getCommodityList()
        this.getListData()
    },
    methods: {
        getCommodityList() {
            this.$Apis.getCommodityList({
                ...this.formLine,
            }).then(res => {
                this.communityList = res.data
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
            this.$Apis.getPurchase({
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
                this.imageUrl = emit.image
                this.modalForm.setFieldsValue({ ...emit })
            })
        },
        // 删除
        deleteClick(emit) {
            console.log(emit);
            this.$Apis.deletePurchase({
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
                        this.$Apis.addPurchase({
                            ...send,
                            image: this.imageUrl
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
                            commodity_id: this.clickRow.commodity_id,
                        }
                        this.$Apis.editPurchase({
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
        handleChange(info) {
            if (info.file.status === 'uploading') {
                this.loading = true;
                return;
            }
        },
        beforeUpload(file) {
            this.loading = true;
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
                this.$message.error('You can only upload JPG file!');
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                this.$message.error('Image must smaller than 2MB!');
            }

            if (isJpgOrPng && isLt2M) {
                const reader = new FileReader();
                reader.addEventListener('load', (res) => {
                    this.imageUrl = reader.result
                    this.loading = false;
                });
                reader.readAsDataURL(file);
            }
            return false
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