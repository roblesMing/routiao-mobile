<template>
  <div class="auto-info">
    <div class="base-info">
      <img class='avatar' :src="article.aut_photo" alt="">
      <div>
        <p>{{article.aut_name}}</p>
        <p>{{article.pubdate | relativeTime}}</p>
      </div>
    </div>
    <div>
      <van-button
        :type='article.is_followed?"default":"danger"'
        @click='handleFollow'
        :loading='isFollowLoading'
        :disabled='article.aut_id?false:true'
      >
        {{article.is_followed?"已关注":"关注"}}
      </van-button>
    </div>
  </div>
</template>
<script>
import { followUser, unFollowUser } from '@/api/user'
export default {
  name: 'AuthInfo',
  props: {
    article: {
      type: Object,
      defualt: () => {}
    }
  },
  data () {
    return {
      isFollowLoading: false
    }
  },
  created () {
    console.log(this.$route)
  },
  mounted () {
    console.log('成功挂载')
  },
  methods: {
    async handleFollow () {
      if (!this.$checkLogin()) {
        return
      }
      this.isFollowLoading = true
      try {
        const authId = this.article.aut_id
        console.log(this.article)
        console.log(authId)
        if (this.article.is_followed) {
          await unFollowUser(authId)
          this.article.is_followed = false
        } else {
          await followUser(authId)
          this.article.is_followed = true
        }
      } catch (err) {
        throw err
      }
      this.isFollowLoading = false
    }
  }
}
</script>
<style lang='less' scoped>
  .auto-info {
    position: sticky;
    z-index: 99;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 26px;
    .base-info {
      display: flex;
      align-items: center;
    }
    .avatar {
      margin-right: 10px;
      width: 100px;
      height: 100px;
      border-radius: 100%;
    }
  }
</style>
