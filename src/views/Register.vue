<template>
    <div class="login_content">
        <div class="img_logo">
            <img class="logo" src="@/assets/logo.png" alt="">
            <img class="show_img" src="@/assets/auth-v2-register-illustration-dark.png" alt="">
            <div class="copyright">
            </div>
        </div>
        <div class="form_content">
            <div class="form_inner">
                <h1>欢迎注册医疗数据可视化系统</h1>
                <div class="userInfo">
                    <a-form :form="form" layout="vertical" :colon="false" @submit="sureClick">
                        <a-form-item prop="username">
                            <template slot="label"><span style="color: white">用户名</span></template>
                            <a-input v-decorator="['username', { rules: [{ required: true, message: '请输入用户名' }] }]"
                                placeholder="请输入用户名" autocomplete="off" />
                        </a-form-item>
                        <a-form-item prop="password">
                            <template slot="label"><span style="color: white">密码</span></template>
                            <a-input-password type="password" placeholder="请输入密码" autocomplete="off"
                                v-decorator="['password', { rules: [{ required: true, message: '请输入密码' }] }]" />
                        </a-form-item>
                        <div class="btns">
                            <a-button type="primary" html-type="submit" block>确定</a-button>
                            <h4>已有账号？<a class="register" @click="login">前往登录</a></h4>
                        </div>
                    </a-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            form: this.$form.createForm(this),
        }
    },
    methods: {
        sureClick(e) {
            e.preventDefault();
            this.form.validateFields((err, values) => {
                if (!err) {
                    this.$Apis.addUser({
                        ...values,
                        type: "3",
                        remark: ""
                    }).then((res) => {
                        if (res.data && res.data.code === 0) {
                            this.$router.push("/login");
                        }
                    });
                }
            });
        },
        resetClick() {
            this.form.resetFields();
        },
        register() {
            this.$router.push("/register");
        },
        login() {
            this.$router.push('/login')
        }
    }
}
</script>
<style lang="less" scoped>
.login_content {
    height: 100vh;
    width: 100vw;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    display: flex;
    justify-content: space-between;
    overflow: hidden;

    .img_logo {
        width: 68%;
        height: 100%;
        position: relative;
        background-color: #161d31;
        min-width: 50rem;

        display: flex;
        align-items: flex-end;
        justify-content: center;

        .logo {
            height: 50px;
            position: absolute;
            top: 23px;
            left: 33px;
        }

        .show_img {
            height: 70%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);

        }

        .copyright {
            margin-bottom: 10px;
            text-align: center;

            p {
                margin: 0px;
            }
        }
    }

    .form_content {
        width: 32%;
        background-color: #283046;
        padding: 4rem;
        display: flex;
        justify-content: center;
        align-items: center;

        .form_inner {
            min-height: 50%;
            min-width: 90%;

            h1 {
                color: white;
                text-align: center;
                margin-bottom: 0px;
            }

            h4 {
                color: white;
                text-align: center;
            }

            .userInfo {
                margin-top: 20px;

                .btns {
                    margin-top: 12px;

                    h4 {
                        margin-top: 12px;

                        .register {
                            color: #7367F0;
                        }
                    }
                }
            }
        }
    }


}

::v-deep .anticon svg {
    color: white;
}
</style>