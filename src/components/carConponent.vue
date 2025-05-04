<template>
    <div class="card-content" :style="{ width: width, height: height }">
        <div class="title" v-if="title">
            {{ title }}
            <a-icon type="more" />
        </div>
        <slot></slot>
    </div>
</template>

<script>
export default {
    props: {
        width: {
            type: String,
            default: () => {
                return '0px'
            }
        },
        height: {
            type: String,
            default: () => {
                return '0px'
            }
        },
        title: {
            type: String,
            default: () => {
                return ''
            }
        }
    },
    data() {
        return {}
    }
}
</script>

<style lang="less" scoped>
.card-content {
    display: inline-block;
    // max-width: 244px;
    min-height: 120px;
    background-color: #4a4f68;
    color: rgba(228, 230, 244, 0.87);
    transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    border-radius: 6px;
    box-shadow: rgba(12, 16, 27, 0.15) 0px 3px 9px 1px, rgba(12, 16, 27, 0.1) 0px 8px 9px 0px, rgba(12, 16, 27, 0.08) 0px 1px 6px 4px;
    background-image: none;
    overflow: hidden;
    padding: 16px;
    color: white;
    margin-bottom: 16px;

    .title {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 16px;

        display: flex;
        justify-content: space-between;
        align-items: center;

        i {
            cursor: pointer;
        }
    }
}
</style>