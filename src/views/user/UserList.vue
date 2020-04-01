<template>

  <a-row>
    <a-col :style="{ marginBottom: '16px' }">
      <a-card :bordered="false" class="table-page-search-wrapper" >
        <a-form layout="inline">
          <a-row :gutter="24" type="flex" align="middle" justify="center">
            <a-col
              :md="10"
              :sm="24"
            >
              <a-form-item label="手机号">
                <a-input v-model="queryParam.username"></a-input>
              </a-form-item>
            </a-col>

            <a-col
              :md="10"
              :sm="24"
            >
              <a-form-item label="用户名">
                <a-input v-model="queryParam.nickName"></a-input>
              </a-form-item>
            </a-col>

            <a-col
              :md="4"
              :sm="24"
            >
              <a-button
                type="primary"
                @click="handleQuery()"
                :style="{ marginRight: '16px' }">
                搜索
              </a-button>
              <a-button
                @click="resetQuery()">
                重置
              </a-button>
            </a-col>
          </a-row>
        </a-form>
      </a-card>
    </a-col>

    <a-col>
      <a-card
        :bordered="false">
        <a-table
          :columns="columns"
          :dataSource="data"
          :rowKey="record => record.id"
          :loading="loading"
          :pagination="pagination"
          @change="handleTableChange(pagination)">
          <span slot="datalevel" slot-scope="datalevel">
            <a-tag :color="datalevel === 'EFFECTIVE' ? '#87d068' : '#f5222d'">
              {{ datalevel === 'EFFECTIVE' ? '有效' : '无效' }}
            </a-tag>
          </span>
          <span slot="nickName" slot-scope="nickName">
            {{ nickName == null ? '空' : nickName }}
          </span>
          <span slot="createTime" slot-scope="createTime">
            {{ createTime | formatDate }}
          </span>
          <span slot="updateTime" slot-scope="updateTime">
            {{ updateTime | formatDate }}
          </span>
          <span slot="roles" slot-scope="roles">
            <div v-for="(role, index) in roles" :key="index">
              <a-tag
                v-if="role.authority.slice(5) === 'USER'"
                color="cyan"
                :style=" index > 0 ? { marginTop: '8px' } : ''">
                {{ role.authority.slice(5) === 'USER' ? '用户' : '' }}
              </a-tag>
              <a-tag
                color="pink"
                v-else-if="role.authority.slice(5) === 'MODEL'"
                :style=" index > 0 ? { marginTop: '8px' } : ''">
                {{ role.authority.slice(5) === 'MODEL' ? '模特' : '' }}
              </a-tag>
              <a-tag
                color="purple"
                v-else-if="role.authority.slice(5) === 'PHOTO'"
                :style=" index > 0 ? { marginTop: '8px' } : ''">
                {{ role.authority.slice(5) === 'PHOTO' ? '摄影师' : '' }}
              </a-tag>

            </div>
          </span>
          <span slot="action" slot-scope="action, record">
            <a-button type="primary" @click="getInfo(record.id)" :style="{ marginRight: '16px' }">详情</a-button>
            <a-tooltip placement="topLeft" title="封禁后用户无法登录" arrowPointAtCenter v-if="record.datalevel === 'EFFECTIVE'">
              <a-button type="danger" @click="banUserById(record.id, 'UNEFFECTIVE')">封禁</a-button>
            </a-tooltip>
            <a-button v-else @click="banUserById(record.id, 'EFFECTIVE')" class="unblock">解封</a-button>
          </span>
        </a-table>
      </a-card>
    </a-col>

    <a-drawer
      width="640"
      :placement="placement"
      :closable="false"
      @close="onClose"
      :visible="visible">
      <p :style="[pStyle]">用户详情</p>
      <p>{{ userInfo.data }}</p>
    </a-drawer>
  </a-row>

</template>

<script>

import { userFindAll, banUserById, getUserInfoById } from '@/api/userList'
import moment from 'moment'// 可以不用use

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: '5%',
    align: 'center'
  },
  {
    title: '用户名',
    dataIndex: 'nickName',
    width: '10%',
    align: 'center',
    scopedSlots: { customRender: 'nickName' }
  },
  {
    title: '手机号码',
    dataIndex: 'username',
    width: '15%',
    align: 'center'
  },
  {
    title: '注册时间',
    dataIndex: 'createTime',
    width: '15%',
    align: 'center',
    scopedSlots: { customRender: 'createTime' }
  },
  {
    title: '最近登录时间',
    dataIndex: 'updateTime',
    width: '15%',
    align: 'center',
    scopedSlots: { customRender: 'updateTime' }
  },
  {
    title: '角色',
    dataIndex: 'roles',
    width: '10%',
    align: 'center',
    scopedSlots: { customRender: 'roles' }
  },
  {
    title: '是否有效',
    key: 'datalevel',
    dataIndex: 'datalevel',
    width: '10%',
    align: 'center',
    scopedSlots: { customRender: 'datalevel' }
  },
  {
    title: '操作',
    key: 'action',
    dataIndex: 'action',
    width: '20%',
    align: 'center',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  filters: {
    formatDate (time) {
      return moment(time).format('YYYY-MM-DD hh:mm')
    }
  },
  name: 'UserListWrapper',
  components: {
    moment
  },
  mounted () {
    this.fetch(this.queryParam)
  },
  data () {
    return {
      pStyle: {
        fontSize: '18px',
        color: 'rgba(0,0,0,0.85)',
        lineHeight: '24px',
        display: 'block',
        marginBottom: '16px',
        fontWeight: 'bold'
      },
      columns,
      data: [],
      loading: false,
      visible: false,
      placement: 'left',
      pagination: {
        current: 1,
        total: 0,
        pageSize: 0,
        pageSizeOptions: ['2', '5', '10', '20', '30', '40', '50'],
        showSizeChanger: true,
        showTotal: (count = this.pagination.total) => {
          return '总共 ' + count + ' 条数据'
        },
        onChange: (current, pageSize) => {
          this.pagination.current = current
          this.pagination.pageSize = pageSize
        },
        onShowSizeChange: (current, pageSize) => {
          this.pagination.current = current
          this.pagination.pageSize = pageSize
        }
      },
      queryParam: {
        username: null,
        nickName: null,
        page: null,
        size: null
      },
      banUserParam: {
        userId: null,
        datalevel: null
      },
      userInfo: {
        data: null
      }
    }
  },
  methods: {

    handleQuery () {
      // console.log(this.queryParam)
      this.fetch(this.queryParam)
    },

    handleTableChange (pagination, filters, sorter) {
      this.pagination.current = pagination.current
      this.queryParam.page = pagination.current - 1
      this.queryParam.size = pagination.pageSize
      this.fetch(this.queryParam)
    },

    fetch (params = {}) {
      // console.log('params:', params)
      this.loading = true
      userFindAll(params).then(response => {
        this.pagination.total = response.data.totalElements
        this.pagination.current = response.data.number + 1
        this.pagination.pageSize = response.data.size
        this.loading = false
        this.data = response.data.content
      }).catch(response => {})
    },

    resetQuery () {
      this.queryParam.username = null
      this.queryParam.nickName = null
      this.fetch(this.queryParam)
    },

    getInfo (e) {
      getUserInfoById({ userId: e }).then(response => {
        console.log(response)
        this.userInfo.data = response.data
      }).catch(response => {})
      this.visible = true
    },
    onClose () {
      this.visible = false
    },
    onChange (e) {
      this.placement = e.target.value
    },

    banUserById (...value) {
      this.banUserParam.userId = value[0]
      this.banUserParam.datalevel = value[1]
      banUserById(this.banUserParam).then(response => {
        if (this.banUserParam.datalevel === 'UNEFFECTIVE') {
          this.$message.error('封禁成功')
        } else {
          this.$message.success('解封成功')
        }
        this.fetch(this.queryParam)
      }).catch(response => {})
    }

  }

}
</script>

<style lang="less" scoped>
</style>
