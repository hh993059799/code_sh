<template>
    <div class="login_content">
        <div class="img_logo">
            <img class="logo" src="@/assets/logo.png" alt="">
            <img class="show_img" src="@/assets/auth-v2-login-illustration-dark.png" alt="">
        </div>
        <div class="form_content">
            <div class="form_inner">
                <h1>欢迎登录医疗数据可视化系统</h1>
                <div class="userInfo">
                    <a-form :form="form" layout="vertical" :colon="false" @submit="login">
                        <a-form-item prop="username">
                            <template slot="label"><span style="color: white">用户名</span></template>
                            <a-input v-decorator="['username']" placeholder="请输入用户名" autocomplete="off" />
                        </a-form-item>
                        <a-form-item prop="password">
                            <template slot="label"><span style="color: white">密码</span></template>
                            <a-input-password type="password" placeholder="请输入密码" autocomplete="off"
                                v-decorator="['password']" />
                        </a-form-item>
                        <div class="btns">
                            <a-button type="primary" html-type="submit" block>登录</a-button>
                            <h4>还没有账号？<a class="register" @click="register">前往注册</a></h4>
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
        login(e) {
            e.preventDefault();
            this.form.validateFields((err, values) => {
                if (!err) {
                    this.$Apis.login(values).then((res) => {
                        if (res.data && res.data.code === 0) {
                            const { type } = res.data.data
                            if (type == '0') {
                                sessionStorage.setItem('keyPath', 'home')
                                this.$nextTick(()=>{
                                    this.$router.push("/home");
                                })
                            } else {
                                sessionStorage.setItem('keyPath', 'home')
                                this.$router.push("/home");
                            }
                            sessionStorage.setItem('userId', res.data.data.id)
                            sessionStorage.setItem('username', res.data.data.username)
                            sessionStorage.setItem('userType', res.data.data.type)
                            sessionStorage.setItem('userImg', res.data.data.image)

                            // 存储全量信息
                            sessionStorage.setItem('userInfo', JSON.stringify(res.data.data))
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