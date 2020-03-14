<template>
  <page-view :avatar="avatar" :title="false">
    <div slot="headerContent">
      <div class="title">{{ timeFix }}，{{ nickname }}<span class="welcome-text">，{{ welcome }}</span></div>
      <div style="margin-bottom: 10px;"> Power By Ant Design And 爱敲代码的猫 </div>
    </div>

    <div>
      <a-row :gutter="16" >
        <a-col
          :xl="6"
          :lg="6"
          :md="12"
          :sm="12"
          :xs="12"
          :style="{ marginBottom: '16px' }">
          <analysis-card
            :loading="userTotalLoading"
            title="用户总数"
            :number="userTotal"
          >
            <router-link
              :to="{ name:'BaseForm' }"
              slot="action"
            >
              <a-icon type="link" />
            </router-link>
          </analysis-card>
        </a-col>

        <a-col
          :xl="6"
          :lg="6"
          :md="12"
          :sm="12"
          :xs="12"
          :style="{ marginBottom: '16px' }">
          <analysis-card
            :loading="loading"
            title="作品总数"
            :number="userProductionTotal"
          >
            <router-link
              :to="{ name:'BaseForm' }"
              slot="action"
            >
              <a-icon type="link" />
            </router-link>
          </analysis-card>
        </a-col>

        <a-col
          :xl="6"
          :lg="6"
          :md="12"
          :sm="12"
          :xs="12"
          :style="{ marginBottom: '16px' }">
          <analysis-card
            :loading="loading"
            title="总访问量"
            :number="userBrowserLogTotal"
          >
            <a-tooltip slot="action">
              <template slot="title">
                专辑总访问共 {{ userBrowserLogTotal }} 次
              </template>
              <a href="javascript:void(0);">
                <a-icon type="info-circle-o" />
              </a>
            </a-tooltip>
          </analysis-card>
        </a-col>

        <a-col
          :xl="6"
          :lg="6"
          :md="12"
          :sm="12"
          :xs="12"
          :style="{ marginBottom: '16px' }">
          <analysis-card
            :loading="loading"
            title="交易流水"
            :number="totalFlow"
            :decimals="2"
          >
            <a-tooltip slot="action">
              <template slot="title">用户充值总金额</template>
              <a href="javascript:void(0);">
                <a-icon type="info-circle-o" />
              </a>
            </a-tooltip>
          </analysis-card>
        </a-col>

      </a-row>
    </div>
  </page-view>
</template>

<script>
import { timeFix } from '@/utils/util'
import { mapState } from 'vuex'
import AnalysisCard from './components/AnalysisCard'

import { PageView } from '@/layouts'
import HeadInfo from '@/components/tools/HeadInfo'
import { Radar } from '@/components'

// import { getRoleList, getServiceList } from '@/api/manage'

// const DataSet = require('@antv/data-set')

export default {
  name: 'Workplace',
  components: {
    PageView,
    HeadInfo,
    Radar,
    AnalysisCard
  },
  data () {
    return {
      timeFix: timeFix(),
      user: {},

      loading: true,
      userTotalLoading: true,
      tokenInfo: '',
      userTotal: 0,
      userBrowserLogTotal: 0,
      userProductionTotal: 0,
      totalFlow: 0
    }
  },
  computed: {
    ...mapState({
      nickname: (state) => state.user.name,
      welcome: (state) => state.user.welcome,
      avatar: (state) => state.user.avatar
    })
  },
  created () {
  },
  mounted () {
    this.init()
    this.getByToken()
    this.getUserTotal()
  },
  methods: {
    init () {
      this.$store.dispatch('GetInfo')
    },
    getByToken () {
      this.$http.get('/admin/users/getByToken').then(res => {
        // debugger
        this.tokenInfo = res || '空'
        this.loading = false
      }, res => {

      })
    },
    getUserTotal () {
      this.$http.get('/admin/dashboard/getDashboard').then(res => {
        this.userTotal = res.data.userTotal || 0
        this.userBrowserLogTotal = res.data.userBrowserLogTotal || 0
        this.userProductionTotal = res.data.userProductionTotal || 0
        this.totalFlow = res.data.totalFlow || 0
        this.userTotalLoading = false
      }, res => {

      })
    }
  }
}
</script>

<style lang="less" scoped>
  .project-list {

    .card-title {
      font-size: 0;

      a {
        color: rgba(0, 0, 0, 0.85);
        margin-left: 12px;
        line-height: 24px;
        height: 24px;
        display: inline-block;
        vertical-align: top;
        font-size: 14px;

        &:hover {
          color: #1890ff;
        }
      }
    }
    .card-description {
      color: rgba(0, 0, 0, 0.45);
      height: 44px;
      line-height: 22px;
      overflow: hidden;
    }
    .project-item {
      display: flex;
      margin-top: 8px;
      overflow: hidden;
      font-size: 12px;
      height: 20px;
      line-height: 20px;
      a {
        color: rgba(0, 0, 0, 0.45);
        display: inline-block;
        flex: 1 1 0;

        &:hover {
          color: #1890ff;
        }
      }
      .datetime {
        color: rgba(0, 0, 0, 0.25);
        flex: 0 0 auto;
        float: right;
      }
    }
    .ant-card-meta-description {
      color: rgba(0, 0, 0, 0.45);
      height: 44px;
      line-height: 22px;
      overflow: hidden;
    }
  }

  .item-group {
    padding: 20px 0 8px 24px;
    font-size: 0;
    a {
      color: rgba(0, 0, 0, 0.65);
      display: inline-block;
      font-size: 14px;
      margin-bottom: 13px;
      width: 25%;
    }
  }

  .members {
    a {
      display: block;
      margin: 12px 0;
      line-height: 24px;
      height: 24px;
      .member {
        font-size: 14px;
        color: rgba(0, 0, 0, .65);
        line-height: 24px;
        max-width: 100px;
        vertical-align: top;
        margin-left: 12px;
        transition: all 0.3s;
        display: inline-block;
      }
      &:hover {
        span {
          color: #1890ff;
        }
      }
    }
  }

  .mobile {

    .project-list {

      .project-card-grid {
        width: 100%;
      }
    }

    .more-info {
      border: 0;
      padding-top: 16px;
      margin: 16px 0 16px;
    }

    .headerContent .title .welcome-text {
      display: none;
    }
  }

</style>
