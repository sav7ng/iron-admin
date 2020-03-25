<template>
  <a-popover
    v-model="visible"
    trigger="click"
    placement="bottomRight"
    overlayClassName="header-notice-wrapper"
    :getPopupContainer="() => $refs.noticeRef.parentElement"
    :autoAdjustOverflow="true"
    :arrowPointAtCenter="true"
    :overlayStyle="{ width: '300px', top: '50px' }"
  >
    <template slot="content">
      <a-tabs>
        <a-tab-pane tab="通知" key="1">
          <a-list>
            <a-list-item v-for="(item, index) in messageList" :key="index">
              <a-list-item-meta :title="item.message" :description="item.date">
                <a-avatar style="background-color: white" slot="avatar" src="https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png"/>
              </a-list-item-meta>
            </a-list-item>
            <!-- <a-list-item>
                <a-list-item-meta title="你推荐的 曲妮妮 已通过第三轮面试" description="一年前">
                  <a-avatar style="background-color: white" slot="avatar" src="https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png"/>
                </a-list-item-meta>
              </a-list-item>
              <a-list-item>
                <a-list-item-meta title="这种模板可以区分多种通知类型" description="一年前">
                  <a-avatar style="background-color: white" slot="avatar" src="https://gw.alipayobjects.com/zos/rmsportal/kISTdvpyTAhtGxpovNWd.png"/>
                </a-list-item-meta>
              </a-list-item> -->
          </a-list>
        </a-tab-pane>
        <a-tab-pane tab="消息" key="2">
          <a-list>
          </a-list>
        </a-tab-pane>
        <a-button
          slot="tabBarExtraContent"
          type="primary"
          :disabled="clean"
          shape="round"
          size="small"
          @click="cleanMessage">清空</a-button>
      </a-tabs>
    </template>
    <span @click="fetchNotice" class="header-notice" ref="noticeRef" style="padding: 0 18px">
      <a-badge :count="messageCount">
        <a-icon style="font-size: 16px; padding: 4px" type="bell" />
      </a-badge>
    </span>
  </a-popover>
</template>

<script>
import SockJS from 'sockjs-client'
import Stomp from 'webstomp-client'
import moment from 'moment'
export default {
  name: 'HeaderNotice',
  data () {
    return {
      loading: false,
      visible: false,
      clean: true,
      messageCount: 0,
      messageList: []
    }
  },
  mounted () {
    this.initWebSocket()
  },
  methods: {
    fetchNotice () {
      // if (!this.visible) {
      // this.loading = true
      // setTimeout(() => {
      //   this.loading = false
      // }, 2000)
      // } else {
      // this.loading = false
      // }
      this.visible = !this.visible
      this.messageCount = 0
    },
    initWebSocket () {
      this.connection()
    },
    connection () {
      const socket = new SockJS('https://api.aimei66.cn/iron/webSocket')
      // const socket = new SockJS('http://localhost:9777/iron/webSocket')
      this.stompClient = Stomp.over(socket)
      this.stompClient.connect({}, (frame) => {
        // console.log(frame)
        this.stompClient.subscribe('/topic/subscribe', (val) => {
          var subscribeData = JSON.parse(val.body)
          var date = moment(subscribeData.data).format('YYYY-MM-DD HH:mm:ss')
          subscribeData.date = date
          this.messageList.unshift(subscribeData)
          this.messageCount += 1
          this.$notification.open({
            message: '消息提醒',
            icon: <a-icon type="message" theme="twoTone"/>,
            description: subscribeData.message,
            duration: 2,
            placement: 'bottomRight'
          })
          if (this.messageList != null) {
            this.clean = false
          }
        })
      })
    },
    cleanMessage () {
      this.messageList = []
      this.clean = true
    }
  }
}
</script>

<style lang="css">
  .header-notice-wrapper {
    top: 50px !important;
  }
</style>
<style lang="less" scoped>
  .header-notice{
    display: inline-block;
    transition: all 0.3s;

    span {
      vertical-align: initial;
    }
  }
</style>
