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
                <a-form-item label="药物状态">
                    <a-select style="width: 220px;" v-decorator="[
                        'status',
                    ]" placeholder="请选择药物状态">
                        <a-select-option v-for="(item, index) in statusTypeList" :key="index" :value="item.value">{{
                            item.label
                        }}</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="批次号">
                    <a-input v-decorator="[
                        'code',
                    ]" placeholder="请输入药物批次号">
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
                    <a-button type="primary" @click="addClick">药品入库</a-button>
                </a-form-item>
            </a-form>
        </div>
        <div class="main-content">
            <a-table :rowKey="(record, index) => { return index }" :columns="columns" :data-source="dataList">
                <span slot="status" slot-scope="text,record">
                    {{ text == '0' ? '正常使用中' : text == '1' ? '过期废弃' : "-" }}
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
                    <a-form-item label="药品名">
                        <a-input style="width:100%" v-decorator="[
                            'name',
                            { rules: [{ required: true, message: '请输入药品名' }] },
                        ]" placeholder="请输入用户名">
                        </a-input>
                    </a-form-item>
                    <a-form-item label="药品类型">
                        <a-select v-decorator="[
                            'type_id',
                            { rules: [{ required: true, message: '请选择药品类型' }] },
                        ]" placeholder="请选择药品类型">
                            <a-select-option v-for="(item, index) in typeList" :key="index" :value="item.id">{{ item.label
                            }}</a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item label="数量">
                        <a-input-number style="width:100%" v-decorator="[
                            'account',
                            { rules: [{ required: true, message: '请输入数量' }] },
                        ]" placeholder="请输入数量">
                        </a-input-number>
                    </a-form-item>
                    <a-form-item label="单价">
                        <a-input-number style="width:100%" v-decorator="[
                            'price',
                            { rules: [{ required: true, message: '请输入单价' }] },
                        ]" placeholder="请输入单价">
                        </a-input-number>
                    </a-form-item>
                    <a-form-item label="批次号">
                        <a-input style="width:100%" v-decorator="[
                            'code',
                            { rules: [{ required: true, message: '请输入批次号' }] },
                        ]" placeholder="请输入批次号">
                        </a-input>
                    </a-form-item>
                    <a-form-item label="药品状态">
                        <a-select v-decorator="[
                            'status',
                            { rules: [{ required: true, message: '请选择药品状态' }] },
                        ]" placeholder="请选择药品状态">
                            <a-select-option v-for="(item, index) in statusTypeList" :key="index" :value="item.value">{{
                                item.label
                            }}</a-select-option>
                        </a-select>
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
                    title: '数量',
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
                    console.log(values);

                    if (this.title == '新增') {
                        let send = {
                            ...values,
                        }
                        this.$Apis.addCommodityList({
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
                            image: this.imageUrl,
                            id: this.clickRow.id,
                        }
                        this.$Apis.editCommodityList({
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