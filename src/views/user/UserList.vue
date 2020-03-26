<template>
  <a-card :bordered="false">
    <!-- <component @onEdit="handleEdit" @onGoBack="handleGoBack" :record="record" :is="currentComponet"></component> -->
    <div>
      <span>iRON</span>
    </div>
    <a-table
      bordered
      :columns="columns"
      :dataSource="data"
      :components="components"
    >
      <a slot="name" slot-scope="text">{{ text }}</a>
    </a-table>
  </a-card>
</template>

<script>

import ATextarea from 'ant-design-vue/es/input/TextArea'
import AInput from 'ant-design-vue/es/input/Input'

// 动态切换组件
// import List from '@/views/user/table/List'
// import Edit from '@/views/user/table/Edit'
const columns = [
  {
    title: '用户ID',
    dataIndex: 'id',
    // sorter: true,
    width: '5%'
    // scopedSlots: { customRender: 'name' }
  },
  {
    title: '手机号码',
    dataIndex: 'username',
    // sorter: true,
    width: '20%'
  },
  {
    title: '是否有效',
    dataIndex: 'datalevel',
    // sorter: true,
    width: '20%'
  },
  {
    title: '用户名',
    dataIndex: 'nickName',
    // sorter: true,
    width: '20%'
  }
  // ,
  // {
  //   title: 'Gender',
  //   dataIndex: 'id',
  //   filters: [{ text: 'Male', value: 'male' }, { text: 'Female', value: 'female' }],
  //   width: '20%'
  // },
  // {
  //   title: 'Email',
  //   dataIndex: 'email'
  // }
]

export default {
  name: 'UserListWrapper',
  components: {
    AInput,
    ATextarea
    // List,
    // Edit
  },
  mounted () {
    this.fetch()
  },
  data () {
    return {
      data: [],
      pagination: {},
      loading: false,
      columns
    }
  },
  methods: {
    handleTableChange (pagination, filters, sorter) {
      console.log(pagination)
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.fetch({
        results: pagination.pageSize,
        page: pagination.current,
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...filters
      })
    },
    fetch (params = {}) {
      console.log('params:', params)
      this.loading = true
      // { params: { username: '18316260997' } }
      this.$http.get('/admin/users/findAll').then(res => {
        console.log(res)
        this.pagination.total = res.data.totalElements
        this.loading = false
        this.data = res.data.content
        console.log(this.loading)
        // this.pagination = pagination
      }, res => {

      })

      // reqwest({
      //   url: 'https://randomuser.me/api',
      //   method: 'get',
      //   data: {
      //     results: 10,
      //     ...params
      //   },
      //   type: 'json'
      // }).then(data => {
      //   const pagination = { ...this.pagination }
      //   // Read total count from server
      //   // pagination.total = data.totalCount;
      //   pagination.total = 200
      //   this.loading = false
      //   this.data = data.results
      //   this.pagination = pagination
      // })
    }
  }

}
</script>
