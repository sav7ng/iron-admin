<template>

  <div class="container-wrapper">
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
      rememberMe: true
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
    }

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
</style>
