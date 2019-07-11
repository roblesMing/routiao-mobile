<template>
  <div class='login-warp'>
    <van-nav-bar
      title="登录"
    />
    <form>
      <van-cell-group>
        <van-field
          v-model="user.mobile"
          required
          clearable
          label="手机号"
          placeholder="请输入手机号"
          v-validate="'required'"
          name="mobile"
          :error-message="errors.first('mobile')"
        />
        <van-field
          v-model="user.code"
          current-password=""
          type="password"
          label="密码"
          placeholder="请输入密码"
          v-validate="'required'"
          name="code"
          :error-message="errors.first('code')"
        />
      </van-cell-group>
      <div class="login-button">
        <van-button type="info"
        :loading='loginLoading'
        loading-type="spinner"
        loading-text="登录中..."
        @click.prevent='handleLogin'
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
      myErrors: {
        mobile: '',
        code: ''
      }
    }
  },
  created () {
    this.configFormErrorMessages()
  },
  methods: {
    async handleLogin () {
      try {
        const valid = await this.$validator.validate()
        if (!valid) {
          return
        }
        this.loginLoading = true
        const data = await login(this.user)
        this.$store.commit('setUser', data)
        this.$router.push({ name: 'home' })
      } catch (err) {
        // console.log(111, err)
        this.$toast.fail('登录失败')
      }
      this.loginLoading = false
    },
    configFormErrorMessages () {
      const dict = {
        custom: {
          mobile: {
            required: '手机号不能为空'
          },
          code: {
            required: '密码不能为空'
          }
        }
      }

      this.$validator.localize('zh_CN', dict)
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
