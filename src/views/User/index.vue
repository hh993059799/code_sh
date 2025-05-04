<template>
    <div class="main">
        <div class="main-header">
            <a-form layout="inline" :form="form" @submit="handleSubmit">
                <a-form-item label="用户名">
                    <a-input v-decorator="[
                        'username',
                    ]" placeholder="请输入用户名">
                    </a-input>
                </a-form-item>
                <a-form-item label="类型">
                    <a-select style="width: 220px;" v-decorator="[
                        'type',
                    ]" placeholder="请选择类型">
                        <a-select-option v-for="(item, index) in typeList" :key="index" :value="item.id">{{ item.label
                        }}</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="备注">
                    <a-input v-decorator="[
                        'remark',
                    ]" placeholder="请输入备注">
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
                    <a-button type="primary" @click="addClick">新增用户</a-button>
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
                    <a-form-item label="用户名">
                        <a-input style="width:100%" v-decorator="[
                            'username',
                            { rules: [{ required: true, message: '请输入用户名' }] },
                        ]" placeholder="请输入用户名">
                        </a-input>
                    </a-form-item>
                    <a-form-item label="密码">
                        <a-input style="width:100%" v-decorator="[
                            'password',
                            { rules: [{ required: true, message: '请输入密码' }] },
                        ]" placeholder="请输入密码">
                        </a-input>
                    </a-form-item>
                    <a-form-item label="头像">
                        <a-upload name="avatar" list-type="picture-card" class="avatar-uploader" :show-upload-list="false"
                            :before-upload="beforeUpload" @change="handleChange($event)">
                            <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
                            <div v-else>
                                <a-icon :type="loading ? 'loading' : 'plus'" />
                                <div class="ant-upload-text">
                                    Upload
                                </div>
                            </div>
                        </a-upload>
                    </a-form-item>
                    <a-form-item label="用户类型">
                        <a-select v-decorator="[
                            'type',
                            { rules: [{ required: true, message: '请选择用户类型' }] },
                        ]" placeholder="请选择用户类型">
                            <a-select-option v-for="(item, index) in typeList" :key="index" :value="item.id">{{ item.label
                            }}</a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item label="备注">
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
                    title: '用户名',
                    dataIndex: 'username',
                    key: 'username',
                },
                {
                    title: '密码',
                    dataIndex: 'password',
                    key: 'password',
                },
                {
                    title: '头像',
                    dataIndex: 'image',
                    key: 'image',
                    scopedSlots: { customRender: 'image' },
                },
                {
                    title: '用户类型',
                    dataIndex: 'typeStr',
                    key: 'type',
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
            typeList: [
                {
                    id: "1",
                    label: "超级管理员"
                },
                {
                    id: "2",
                    label: "医生"
                },
                {
                    id: "3",
                    label: "普通用户"
                }
            ],
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
            this.$Apis.getUserList({
                ...this.formLine,
            }).then(res => {
                let arr = []
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
                this.dataList = arr
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
            this.$Apis.deleteUser({
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
                        this.$Apis.addUser({
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
                            price: this.clickRow.price,
                            id: this.clickRow.id,
                        }
                        this.$Apis.editUser({
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