<template>
  <div class="homepage-hero-module">
    <div class="video-container">
      <div :style="fixStyle" class="filter"></div>
      <video :style="fixStyle" autoplay loop class="fillWidth" @canplay="canplay">
        <!-- <source src="../../assets/video/MP4/iron.mp4" type="video/mp4"/> -->
        <source src="https://emmy-works.oss-cn-beijing.aliyuncs.com/admin/iron.mp4" type="video/mp4"/>
        <!-- <source src="../../assets/video/WEBM/Coding.webm" type="video/webm"/> -->
        <!-- 浏览器不支持 video 标签，建议升级浏览器。 -->
      </video>
      <div class="poster hidden" v-if="!vedioCanPlay">
        <img :style="fixStyle" src="../../assets/video/Snapshots/iron.jpg" alt="">
      </div>
    </div>

    <div
      class="container-wrapper">
      <div class="iron-logo animated fadeInUp">
        <span>iRON</span>
      </div>
      <div
        class="login-form animated"
      >
        <a-form
          @keyup.enter.native="handleLogin"
        >
          <a-form-item
            class="animated fadeInUp"
            :style="{'animation-delay': '0.2s'}"
          >
            <a-input
              placeholder="用户名/邮箱"
              v-model="username"
            >
              <a-icon
                slot="prefix"
                type="user"
                style="color: rgba(0,0,0,.25)"
              />
            </a-input>
          </a-form-item>
          <a-form-item
            class="animated fadeInUp"
            :style="{'animation-delay': '0.4s'}"
          >
            <a-input
              v-model="password"
              type="password"
              placeholder="密码"
            >
              <a-icon
                slot="prefix"
                type="lock"
                style="color: rgba(0,0,0,.25)"
              />
            </a-input>
          </a-form-item>

          <a-row type="flex" justify="space-between">
            <a-col>
              <a-form-item
                class="animated fadeInUp"
                :style="{'animation-delay': '0.6s'}"
              >
                <a-switch
                  defaultChecked
                  v-model="rememberMe"
                  :style="{'animation-delay': '0.6s',
                           'margin-right': '10px'}">
                           <!-- <a-icon type="check" slot="checkedChildren" />
                <a-icon type="close" slot="unCheckedChildren" /> -->
                </a-switch>
                Remember Me
              </a-form-item>
            </a-col>
          </a-row>

          <a-form-item
            class="animated fadeInUp"
            :style="{'animation-delay': '0.8s'}"
          >
            <a-button
              :loading="landing"
              type="primary"
              :block="true"
              @click="handleLogin"
            >登录</a-button>
          </a-form-item>

        </a-form>
      </div>

    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { timeFix } from '@/utils/util'

export default {
  components: {
  },
  data () {
    return {
      loginBtn: false,
      username: null,
      password: null,
      landing: false,
      rememberMe: true,
      vedioCanPlay: false,
      fixStyle: ''
    }
  },
  methods: {

    ...mapActions(['Login', 'Logout', 'GetInfo']),

    handleLogin () {
      const {
        Login
      } = this

      if (!this.username) {
        this.$message.warn('用户名不能为空！')
        return
      }

      if (!this.password) {
        this.$message.warn('密码不能为空！')
        return
      }

      this.landing = true

      Login({ username: this.username, password: this.password, rememberMe: this.rememberMe })
        .then((res) => this.loginSuccess(res))
        .catch((err) => this.requestFailed(err))
        .finally(() => {
          this.loginBtn = false
        })
    },

    loginSuccess (res) {
      const { GetInfo } = this

      GetInfo()
        .then()
        .catch()
        .finally()
      // 账号密码错误
      if (res.code === 400) {
        this.isLoginError = true
        this.$notification['error']({
          message: '错误',
          description: res.message || '请求出现错误，请稍后再试',
          duration: 4
        })
        return
      }

      this.$router.push({ path: '/' })
      // 延迟 1 秒显示欢迎信息
      setTimeout(() => {
        this.$notification.success({
          message: '欢迎',
          description: `${timeFix()}，欢迎回来`,
          duration: 2
        })
      }, 1000)
      this.isLoginError = false
    },

    requestFailed (err) {
      this.isLoginError = true
      this.$notification['error']({
        message: '错误',
        description: ((err.response || {}).data || {}).message || '请求出现错误，请稍后再试',
        duration: 4
      })
    },

    canplay () {
      this.vedioCanPlay = true
    }

  },

  mounted () {
    window.onresize = () => {
      const windowWidth = document.body.clientWidth
      const windowHeight = document.body.clientHeight
      const windowAspectRatio = windowHeight / windowWidth
      let videoWidth
      let videoHeight
      if (windowAspectRatio < 0.5625) {
        videoWidth = windowWidth
        videoHeight = videoWidth * 0.5625
        this.fixStyle = {
          height: windowWidth * 0.5625 + 'px',
          width: windowWidth + 'px',
          'margin-bottom': (windowHeight - videoHeight) / 2 + 'px',
          'margin-left': 'initial'
        }
      } else {
        videoHeight = windowHeight
        videoWidth = videoHeight / 0.5625
        this.fixStyle = {
          height: windowHeight + 'px',
          width: windowHeight / 0.5625 + 'px',
          'margin-left': (windowWidth - videoWidth) / 2 + 'px',
          'margin-bottom': 'initial'
        }
      }
    }
    window.onresize()
  }

}
</script>

<style lang="less" scoped>
.user-layout-login {
  label {
    font-size: 14px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .register {
      float: right;
    }
  }
}

.homepage-hero-module,
  .video-container {
    position: relative;
    height: 100vh;
    overflow: hidden;
  }

  .video-container .poster img,
  .video-container video {
    z-index: 0;
    position: absolute;
  }

  .video-container .filter {
    z-index: 1;
    position: absolute;
    background: rgba(0, 0, 0, 0.4);
  }

  .container-wrapper {
    z-index: 10;
    position: absolute;
  }
</style>
