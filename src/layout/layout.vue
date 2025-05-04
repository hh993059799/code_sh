<template>
    <a-layout id="components-layout-demo-custom-trigger">
        <a-layout-sider v-model="collapsed" :trigger="null" width="250" collapsible>
            <div class="logo">
                <img v-if="!collapsed" src="@/assets/logo.png" alt="">
                <img v-else src="@/assets/logo-close.png" alt="">
            </div>
            <a-menu theme="dark" mode="inline" :selected-keys="selectKey" @click="menuClick">
                <template v-for="item in showMenuList">
                    <a-menu-item v-if="item.children == undefined" :key="item.key" :index="item.key">
                        <a-icon :type="item.icon" />
                        <span>{{ item.label }}</span>
                    </a-menu-item>

                    <a-sub-menu class="menu_left" v-if="item.children" :key="item.key" :index="item.key">
                        <template slot="title">
                            <a-icon :type="item.icon" />
                            <span>{{ item.label }}</span>
                        </template>
                        <a-menu-item v-for="cl in item.children" :key="cl.key" :index="cl.key">
                            <a-icon :type="cl.icon" />
                            {{ cl.label }}
                        </a-menu-item>
                    </a-sub-menu>
                </template>
            </a-menu>
        </a-layout-sider>
        <a-layout>
            <a-layout-header style="background: #fff; padding: 0">
                <a-icon class="trigger" :type="collapsed ? 'menu-unfold' : 'menu-fold'"
                    @click="() => (collapsed = !collapsed)" />

                <!-- 右侧用户栏 -->
                <a-dropdown class="user-action">
                    <div @click="e => e.preventDefault()">
                        <span class="ant-dropdown-link">
                            {{ userinfo.username }}
                        </span> <a-avatar :size="32" :src="userinfo.image" />
                    </div>
                    <a-menu slot="overlay">
                        <a-menu-item>
                            <a href="javascript:;" @click="exit">退出系统 <a-icon style="margin-left:4px" type="logout" /></a>
                        </a-menu-item>
                    </a-menu>
                </a-dropdown>
            </a-layout-header>
            <a-layout-content :style="{
                background: '#f0f2f5',
                minHeight: '280px',
            }">
                <slot></slot>

                <a-modal title="修改头像" :visible="visible" @ok="handleOk" @cancel="handleCancel" ok-text="确认"
                    cancel-text="取消">
                    <a-upload name="avatar" list-type="picture-card" class="avatar-uploader" :show-upload-list="false"
                        :before-upload="beforeUpload" @change="handleChange($event)">
                        <img v-if="imageUrl" :src="imageUrl" alt="avatar" height="100%" width="450px" />
                        <div v-else>
                            <a-icon :type="loading ? 'loading' : 'plus'" />
                            <div class="ant-upload-text">
                                Upload
                            </div>
                        </div>
                    </a-upload>
                </a-modal>
            </a-layout-content>
        </a-layout>
    </a-layout>
</template>

<script>
export default {
    data() {
        return {
            collapsed: false,
            selectKey: ["home"],
            showMenuList: [],
            visible: false,
            // 管理员菜单
            menuList: [
                {
                    label: "首页",
                    key: "home",
                    icon: "home",
                },
                {
                    label: "用户管理",
                    key: "users",
                    icon: "user",
                },
                {
                    label: "商品采购",
                    key: "fontHome",
                    icon: "gold",
                },
                {
                    label: "类别管理",
                    key: "types",
                    icon: "block",
                },
                {
                    label: "商品管理",
                    key: "communities",
                    icon: "gold",
                },
                {
                    label: "订单管理",
                    key: "purchases",
                    icon: "bars",
                },
                {
                    label: "咨询记录",
                    key: "orderList",
                    icon: "hdd",
                },
                // {
                //     label: "咨询管理",
                //     key: "consultation",
                //     icon: "carry-out",
                // },
            ],
            // 医生菜单
            customerMenuList: [
                {
                    label: "首页",
                    key: "home",
                    icon: "home",
                },
                {
                    label: "类别管理",
                    key: "types",
                    icon: "block",
                },
                {
                    label: "商品管理",
                    key: "communities",
                    icon: "gold",
                },
                {
                    label: "订单管理",
                    key: "purchases",
                    icon: "bars",
                },
                {
                    label: "咨询管理",
                    key: "consultation",
                    icon: "carry-out",
                },
            ],
            // 普通用户权限
            userMenuList: [
                {
                    label: "首页",
                    key: "home",
                    icon: "home",
                },
                {
                    label: "商品购买",
                    key: "fontHome",
                    icon: "gold",
                },
                {
                    label: "咨询记录",
                    key: "orderList",
                    icon: "hdd",
                },
            ],

            userinfo: {
                username: "",
                image: ""
            },
            showChangeButton: false,
            loading: false,
            imageUrl: '',
        };
    },

    mounted() {
        this.showChangeButton = false
        console.log(sessionStorage.getItem('userType'));
        if (sessionStorage.getItem('keyPath') != null) {
            this.selectKey = [sessionStorage.getItem('keyPath')]
        }
        if (sessionStorage.getItem('userType') == 1) {
            this.showMenuList = this.menuList
        }
        if (sessionStorage.getItem('userType') == 2) {
            this.showMenuList = this.customerMenuList
        }
        if (sessionStorage.getItem('userType') == 3) {
            this.showMenuList = this.userMenuList
        }


        this.userinfo = {
            username: sessionStorage.getItem('username'),
            image: sessionStorage.getItem('userImg')
        }

    },
    methods: {
        menuClick(val) {
            this.selectKey = [val.key]
            sessionStorage.setItem('keyPath', val.key)
            let path = val.keyPath.reverse().join("/");
            this.$router.push(`/${path}`);
        },
        exit() {
            this.$router.push('/login')
            this.$message.success("退出成功！")
        },
        goFont() {
            this.$router.push('/font/home')
        },
        goBack() {
            this.$router.push('/mall')
        },
        editIcon() {
            this.visible = true

            this.imageUrl = sessionStorage.getItem('userImg')
        },
        changeType() {
            this.$Apis.editUser({
                ...JSON.parse(sessionStorage.getItem('userInfo')),
                type: 1
            }).then(res => {
                sessionStorage.setItem('userType', '1')
                /* 刷新页面 */
                this.$router.go(0)
            })
        },
        handleOk() {
            this.$Apis.editUser({
                ...JSON.parse(sessionStorage.getItem('userInfo')),
                image: this.imageUrl
            }).then(res => {
                this.visible = false;
                sessionStorage.setItem('userImg', this.imageUrl)
                /* 刷新页面 */
                this.$router.go(0)
            })
        },
        handleCancel() {
            this.visible = false
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
    },
};
</script>
<style lang="less" scoped>
#components-layout-demo-custom-trigger {
    height: 100vh;

    .ant-layout {
        background-color: #25293c !important;
    }

    .ant-layout-header {
        background-color: #2F3248 !important;
        margin: 16px 24px 0px 24px;
        border-radius: 8px;
    }

    .ant-layout-content {
        background-color: #25293c !important;
        padding: 24px;
    }

    .trigger {
        font-size: 18px;
        line-height: 64px;
        padding: 0 24px;
        cursor: pointer;
        transition: color 0.3s;

        &:hover {
            color: #5ca0e0;
        }
    }

    .logo {
        height: 42px;
        // background: rgba(255, 255, 255, 0.2);
        margin: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;

        img {
            height: 100%;
        }
    }

    .user-action {
        float: right;
        margin-right: 32px;

        .ant-dropdown-link {
            margin-right: 4px;
            font-weight: 500;
        }
    }
}
</style>
