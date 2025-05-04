<template>
    <div>
        <a-table :rowKey="(record, index) => { return index }" :columns="columns" :data-source="data">
        </a-table>
    </div>
</template>

<script>
export default {
    data() {
        return {
            columns: [
                {
                    title: '采购人',
                    dataIndex: 'username',
                    key: 'username',
                },
                {
                    title: '采购药物',
                    dataIndex: 'commoditieName',
                    key: 'commoditieName',
                },
                {
                    title: '采购数量',
                    dataIndex: 'account',
                    key: 'account',
                },
                {
                    title: '采购时间',
                    dataIndex: 'create_time',
                    key: 'create_time',
                },
            ],
            data: [],
            ifno: ""
        }
    },
    created() {
        this.onSearch()
    },
    methods: {
        onSearch() {
            this.$Apis.getPurchase({}).then(res => {
                console.log(res);
                this.data = res.data
            })
        }
    }
}
</script>

<style lang="less" scoped></style>