<template>
  <div class='login-warp'>
    <van-nav-bar
      title="登录"
    />
    <form>
      <van-cell-group>
        <van-field
          required
          v-model="user.mobile"
          clearable
          label="手机号"
          placeholder="请输入手机号"
          @focus='error.Mobile=""'
          :error-message='error.Mobile'
        />
        <van-field
          required
          v-model="user.code"
          type="password"
          label="密码"
          placeholder="请输入密码"
           @focus='error.Code=""'
          :error-message="error.Code"
        />
      </van-cell-group>
      <div class="login-button">
        <van-button type="info"
        :loading='loginLoading'
        loading-type="spinner"
        loading-text="登录中..."
        @click='handleLogin'
        >确认登录</van-button>
      </div>
    </form>
  </div>
</template>
<script>
import { login } from '@/api/user'
export default {
  name: 'loginIndex',
  data () {
    return {
      loginLoading: false,
      user: {
        mobile: null,
        code: null
      },
      error: {
        Mobile: '',
        Code: ''
      }
    }
  },
  methods: {
    async handleLogin () {
      try {
        if (!this.user.mobile.length) {
          this.error.Mobile = '手机号码不能为空'
          return
        } else if (!(/^\d{11}$/.test(this.user.mobile))) {
          this.error.Mobile = '手机号码格式不正确'
          return
        }
        if (!this.user.code.length) {
          this.error.Code = '密码不能为空'
          return
        } else if (!(/\w{6,13}/.test(this.user.code))) {
          this.error.Code = '密码格式错误'
          return
        }
        this.loginLoading = true
        const res = await login(this.user)
        this.$store.commit('setUser', res)
        this.$router.push({ name: 'home' })
      } catch (err) {
        console.log(err)
      }
      this.loginLoading = false
    }
  }
}
</script>
<style lang='less' scope>
  .login-warp {
    .van-nav-bar {
      background-color: #1989fa;
      .van-nav-bar__title {
        color: white;
      }
    }
    .login-button {
      padding: 20px;
      .van-button {
        width: 100%;
      }
    }
  }
</style>
