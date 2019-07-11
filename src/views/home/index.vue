<template>
  <div>
    <van-nav-bar
      title="首页"
      fixed
    />
    <van-tabs v-model="activeChannelIndex">
    <van-tab v-for='channelItem  in channels' :title="channelItem .name" :key='channelItem .id'>
      <van-pull-refresh v-model="pullRefreshLoading" @refresh="onRefresh">
        <van-list
          v-model="channelItem.upPullLoading"
          :finished="channelItem.upPullFinished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <van-cell
            v-for="articleItem in channelItem.articles"
            :key="articleItem.art_id"
            :title="articleItem.title"
          />
        </van-list>
      </van-pull-refresh>
    </van-tab>
    </van-tabs>
    <van-tabbar v-model="pageActive" route>
      <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="search" to="/qa">问答</van-tabbar-item>
      <van-tabbar-item icon="friends-o" to="/video">视频</van-tabbar-item>
      <van-tabbar-item icon="setting-o" to="my">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
import { getUserChannel } from '@/api/channel'
import { getArticles } from '@/api/article'
export default {
  name: 'homeIndex',
  data () {
    return {
      activeChannelIndex: 0,
      list: [],
      loading: false,
      finished: false,
      pullRefreshLoading: false,
      pageActive: 0,
      channels: []
    }
  },
  computed: {
    activeChannel () {
      console.log(this.activeChannelIndex)
      return this.channels[this.activeChannelIndex]
    }
  },
  created () {
    this.loadChannels()
  },
  methods: {
    async onLoad () {
      console.log('onload')
      // 异步更新数据
      await this.$sleep(800)
      let data = []
      data = await this.loadArticles()
      if (!data.pre_timestamp && !data.results.length) {
        this.activeChannel.upPullFinished = false
        this.activeChannel.upPullLoading = true
        return
      }
      if (data.pre_timestamp && !data.results.length) {
        this.activeChannel.timestamp = data.pre_timestamp
        data = await this.loadArticles()
      }
      this.activeChannel.timestamp = data.pre_timestamp
      this.activeChannel.articles.push(...data.results)
      this.activeChannel.upPullLoading = false
    },
    onRefresh () {
      setTimeout(() => {
        this.pullRefreshLoading = false
      }, 500)
    },
    async loadChannels () {
      const { user } = this.$store.state
      let channels = []
      if (user) {
        const data = await getUserChannel()
        channels = data.channels
      } else {
        const localChannel = JSON.parse(window.localStorage.getItem('channels'))
        if (localChannel) {
          channels = localChannel
        } else {
          channels = (await getUserChannel()).channels
        }
      }
      channels.forEach(item => {
        item.articles = []
        item.timestamp = Date.now()
        item.downPullLoading = false
        item.upPullLoading = false
        item.upPullFinished = false
      })
      this.channels = channels
      console.log(this.channels)
      // try {
      //   const localChannel = window.localStorage.getItem('channels')
      //   if (localChannel) {
      //     this.channels = localChannel
      //   } else {
      //     this.channels = (await getUserChannel()).channels
      //   }
      //   console.log(this.channels)
      // } catch (err) {
      //   console.log(err)
      // }
    },
    async loadArticles () {
      try {
        const { id: channelId, timestamp } = this.activeChannel
        const data = await getArticles({
          channelId,
          timestamp,
          withTop: 1
        })
        console.log(data)
        return data
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>
<style lang='less' scoped>
  .van-nav-bar {
    background-color: #1989fa;
    .van-nav-bar__title {
      color: white;
    }
  }
  .van-tabs {
    margin-bottom: 100px;
  }
  .van-tabs /deep/ .van-tabs__wrap{
    position: fixed;
    top: 92px;
  }
 .van-tabs /deep/ .van-tabs__content {
  margin-top: 92px;
}
</style>
