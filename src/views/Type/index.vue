<template>
    <div class="main">
        <div class="main-header">
            <a-form layout="inline" :form="form" @submit="handleSubmit">
                <a-form-item label="类型名">
                    <a-input v-decorator="[
                        'label',
                    ]" placeholder="请输入类型名">
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
                    <a-button type="primary" @click="addClick">新增类型</a-button>
                </a-form-item>
            </a-form>
        </div>
        <div class="main-content">
            <a-table :rowKey="(record, index) => { return index }" :columns="columns" :data-source="dataList">
                <span slot="action" slot-scope="text, record">
                    <a-button type="primary" @click="editClick(record)">编辑</a-button>
                    <a-popconfirm title="是否确定删除?" ok-text="确认" cancel-text="取消" @confirm="deleteClick(record)"
                        @cancel="cancel">
                        <a-button v-if="isAdmin" class="ml-8" type="danger">删除</a-button>
                    </a-popconfirm>
                </span>
            </a-table>

            <!-- 新增 编辑弹窗 -->
            <a-modal :title="title" :visible="visible" @ok="handleOk" @cancel="handleCancel" ok-text="确认" cancel-text="取消">
                <a-form :form="modalForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-form-item label="类型名">
                        <a-input style="width:100%" v-decorator="[
                            'label',
                            { rules: [{ required: true, message: '请输入类型名' }] },
                        ]" placeholder="请输入类型名">
                        </a-input>
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
            isAdmin: sessionStorage.getItem('userType') == 1,
            columns: [
                {
                    title: '编号',
                    dataIndex: 'id',
                    key: 'id',
                    width: 220,
                },
                {
                    title: '类型名',
                    dataIndex: 'label',
                    key: 'label',
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 220,
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

        }
    },
    created() {
        this.getListData()
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
            this.$Apis.getTypeList({
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
            this.$Apis.deleteType({
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
                        this.$Apis.addType({
                            ...send,
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
                        this.$Apis.editType({
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