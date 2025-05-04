<template>
    <!-- 详情弹窗 -->
    <a-modal :title="title" :visible="visible" @cancel="handleCancel" width="720px" :footer="null">
        <a-spin :spinning="spinning">
            <div class="content" ref="infoContent">
                <div v-for="(item, index) in contentData" :key="index">
                    <div>
                        <div v-if="item.side === 'right'" class="question_side">
                            <div class="title">
                                <div class="time">{{ item.create_time }}</div>
                                <div>
                                    <span>{{ item.username }}</span>
                                </div>
                            </div>
                            <div class="info">
                                {{ item.info }}
                            </div>
                            <div style="width: 0px; height: 0px; clear: both"></div>
                        </div>
                        <div style="width: 0px; height: 0px; clear: both"></div>
                    </div>
                    <div>
                        <div v-if="item.side === 'left'" class="reply_side">
                            <div class="title">
                                <div>
                                    <span style="">{{ item.username }}</span>
                                </div>
                                <div class="time">{{ item.create_time }}</div>
                            </div>
                            <div class="info">
                                {{ item.info }}
                            </div>
                            <div style="width: 0px; height: 0px; clear: both"></div>
                        </div>
                        <div style="width: 0px; height: 0px; clear: both"></div>
                    </div>
                </div>

                <!-- 是否解决 -->
                <div v-if="page_name == 'order'">
                    <div v-if="!hidden">
                        <div class="isFinish" v-if="!done">
                            <div style="display: flex; align-items: center">
                                <span style="margin-left: 6px"> 问题是否已经解决？ </span>
                            </div>
                            <div>
                                <a-button type="primary" style="margin-right: 10px" @click="isFinishClick">已解决</a-button>
                                <a-button type="" @click="hiddenIsFinishDiv">暂未解决</a-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </a-spin>

        <div v-if="!done" class="contentStyle">
            <!-- 文本框区域 -->
            <a-form :form="formText">
                <a-form-item>
                    <a-textarea ref="infoInput" placeholder="请输入" v-decorator="[
                        'info',
                        {
                            rules: [
                                {
                                    message: `最大不操作500字符`,
                                    max: 500
                                }
                            ]
                        }
                    ]" style="resize: none; margin-top: 10px" :autoSize="{ minRows: 3 }"
                        @change="fontSizeChange($event)"></a-textarea>
                </a-form-item>
            </a-form>

            <!-- 图片上传区域 -->
            <div style="margin-top: 10px">
                <div style="
                                                						display: flex;
                                                						justify-content: space-between;
                                                						align-items: flex-end;
                                                					">
                    <div class="img_tips" style="width: 100%; color: rgba(255, 255, 255, 0.65)">
                        <!--  <p style="margin: 0px; display: inline-block">
                            {{ $t('operation.question.uploadMsg') }}
                        </p> -->
                        <div style="
                                                								margin: 0px;
                                                								display: inline-block;
                                                								float: right;
                                                								margin-right: 16px;
                                                							" class="paper-length-maxlength">
                            <span>{{ question_count }}</span> /
                            <span>500</span>
                        </div>
                    </div>
                    <a-button type="primary" @click="sendMsg">
                        发送
                    </a-button>
                </div>
            </div>
        </div>
        <div v-else class="final">
            工单问题已解决！
        </div>
    </a-modal>
</template>

<script>
export default {
    data() {
        return {
            formText: this.$form.createForm(this),
            previewImages: [],
            fileList: [], // 文件列表
            question_count: 0,
            // 对话框内容
            contentData: [],
            // 提问是否完成
            done: false,
            hidden: false,
            info: null,
            spinning: false,
            imgHeight: null
        };
    },
    props: [
        "title",
        "visible",
        "page_name",
        "detailData",
        "detailId",
        "detailStatus"
    ],
    mounted() { },
    watch: {
        visible(newVal) {
            if (!newVal) {
                this.$refs.infoContent.scrollTop = 0;
                this.contentData = [];
                this.question_count = 0;
                this.info = null;
                this.formText.resetFields();
            }
        },
        detailData(newVal) {
            let side = "right";
            this.spinning = true;
            newVal.map((info, index) => {
                if (this.page_name === "order") {
                    // 在线指导，医生消息左侧，提问人消息右侧
                    info.userType == 3
                        ? (side = "right")
                        : (side = "left");
                } else {
                    // 解答，医生消息右侧，提问人消息左侧
                    info.userType == 3
                        ? (side = "left")
                        : (side = "right");
                }
                newVal[index].side = side;
            });
            setTimeout(() => {
                this.$refs.infoContent.scrollTop =
                    this.$refs.infoContent.scrollHeight;
                this.spinning = false;
            }, 500);
            this.contentData = newVal;
            if (newVal.length > 0) {
                if (newVal[newVal.length - 1].userType == 3) {
                    this.hidden = false;
                } else {
                    this.hidden = true;
                }
            } else {
                this.hidden = true;
            }
        },
        detailStatus(newVal) {
            //已解决
            if (newVal) {
                this.done = true;
            } else {
                this.done = false;
            }
        }
    },
    methods: {
        sendMsg() {
            if (this.info) {
                if (this.info.length > 500) {
                    console.log('字数大于500');
                } else {
                    this.$Apis.addChatInfo({
                        user_id: sessionStorage.getItem('userId'),
                        order_id: this.detailId,
                        info: this.info,
                        isReplica: this.page_name == 'consultation'
                    }).then(res => {
                        this.$parent.getListData();
                        this.$parent.getChatInfo(this.detailId);
                        this.formText.resetFields();
                    })
                    this.info = null;
                    this.formText.resetFields();
                    this.fileList = [];
                    this.question_count = 0;
                }
            }

        },
        handleCancel() {
            // 通知父组件修改visible
            this.$parent.chatCancel();
        },

        fontSizeChange(e) {
            console.log(e);
            let len = e.target.value.length;
            this.question_count = len;
            this.info = e.target.value
            console.log(e.target.value.length);
        },

        // 是
        isFinishClick() {
            // 调用接口，将提问状态改为已完成

            // editStatus
            this.$Apis.chatFinish({
                order_id: this.detailId
            }).then(res => {
                console.log(res);
                this.$parent.chatCancel();
                this.$parent.getListData();
                this.done = true;
            })
        },
        // 否
        hiddenIsFinishDiv() {
            // 暂时隐藏是否完成项
            // this.isFinish = true;
            this.hidden = true;
            this.$refs.infoInput.focus()
        },
    }
};
</script>

<style lang="less" scoped>
.content {
    min-height: 300px;
    max-height: 540px;
    overflow-y: auto;
    padding: 10px 24px;

    &::-webkit-scrollbar {
        /*滚动条整体样式*/
        width: 4px;
        height: 4px;
        background: #283363;
    }

    &::-webkit-scrollbar-track {
        background: none;
    }

    &::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        border-radius: 3px;
        background-color: #314a68;
    }

    .question_side {
        float: right;
        max-width: 472px;
        // padding-right: 10px;
        margin-bottom: 10px;

        .title {
            text-align: right;
            display: flex;
            justify-content: right;

            .time {
                padding-right: 10px;
                // border-right: 2px solid #024366;
            }
        }

        .info {
            width: auto;
            max-width: 472px;
            display: inline-block !important;
            display: inline;
            // background: rgba(53, 70, 146, 0.4);
            background: #283363;
            border: 1px solid #3b4f75;
            border-radius: 4px;
            text-align: left;
            padding: 12px;
            margin-top: 5px;
            float: right;
        }

        .imgs {
            display: flex;
            justify-content: right;
            flex-wrap: wrap;
            align-items: flex-start;

            // padding: 5px;
            .imgThumbnail {
                width: 76px;
                height: 80px;
                border: 1px solid #283363;
                margin-left: 2px;
                margin-top: 6px;
                display: flex;
                justify-content: center;
                align-items: center;

                img {}
            }
        }
    }

    .reply_side {
        float: left;
        max-width: 472px;
        // padding-left: 10px;
        margin-bottom: 10px;

        .title {
            text-align: left;
            display: flex;
            justify-content: left;

            .time {
                padding-left: 10px;
            }
        }

        .info {
            max-width: 472px;
            background: rgba(1, 239, 182, 0.6);
            border: 1px solid #3b4f75;
            border-radius: 4px;
            text-align: left;
            padding: 12px;
            margin-top: 5px;
            width: auto;
            display: inline-block !important;
            display: inline;
            float: left;
        }

        .imgs {
            display: flex;
            justify-content: left;
            flex-wrap: wrap;
            align-items: flex-start;

            // padding: 5px;
            .imgThumbnail {
                width: 76px;
                height: 80px;
                border: 1px solid #283363;
                margin-left: 2px;
                margin-top: 6px;
                display: flex;
                justify-content: center;
                align-items: center;

                img {}
            }
        }
    }
}

.contentStyle {
    // margin: 10px -20px;
    // padding: 0px 20px 20px 20px;
    padding: 10px 24px;
    background: #25293c;
}

.isFinish {
    height: 56px;
    background: #25293c;
    border: 1px solid #25293c;
    border-radius: 5px;
    margin-bottom: 10px;
    margin-right: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 16px;

    button {}
}

.final {
    width: 100%;
    background: rgba(1, 239, 182, 0.12);
    border: 1px solid #024366;
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 56px;
}

.paper-length-maxlength {
    text-align: right;
}

.ant-carousel .slick-slide {
    text-align: center;
    height: 160px;
    line-height: 160px;
    background: #364d79;
    overflow: hidden;
}

.ant-carousel .custom-slick-arrow {
    width: 25px;
    height: 25px;
    font-size: 25px;
    color: #fff;
    background-color: rgba(31, 45, 61, 0.11);
    opacity: 0.3;
}

.ant-carousel .custom-slick-arrow:before {
    display: none;
}

.ant-carousel .custom-slick-arrow:hover {
    opacity: 0.5;
}

.ant-carousel .slick-slide h3 {
    color: #fff;
}

// 修改弹窗样式
/deep/ .ant-modal-content {
    .ant-modal-header {
        background: #2f3349;
        border-bottom: 1px solid #024366;
    }

    .ant-modal-body {
        background: #2f3349;
        padding: 0px;
    }
}

/deep/ .ant-upload-list-picture-card {
    .ant-upload-list-item-info::before {
        background-color: rgba(2, 22, 51, 0.6);
    }
}
</style>

