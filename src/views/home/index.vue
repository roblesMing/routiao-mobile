<template>
  <div>
    <van-nav-bar
      title="首页"
      fixed
    />
    <van-tabs v-model="activeChannelIndex">
    <div slot='nav-right' class='wap-nav' @click='show=true'>
      <van-icon name="wap-nav" />
    </div>
    <van-tab v-for='channelItem  in channels' :title="channelItem .name" :key='channelItem .id'>
      <van-pull-refresh v-model="channelItem.downPullLoading" @refresh="onRefresh" :success-text='channelItem.downPullSuccessText' :success-duration='1000'>
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
          >
          <van-grid :border="false" :column-num="3">
          <van-grid-item v-for="(img, index) in articleItem.cover.images" :key="index">
            <van-image :src="img" lazy-load />
          </van-grid-item>
        </van-grid>
  <!-- <van-icon name="wap-nav" /> -->
          <!-- <template>
          <lazy-component v-if='articleItem.cover.type'>
          <img v-for="(img,index) in articleItem.cover.images"  v-lazy='img' :key='index' style='width: 100px'>
        </lazy-component>
        </template> -->
            <p slot='label'>
              <span>{{articleItem.aut_name}}</span>
              &nbsp;
              <span>{{articleItem.comm_count}}评论</span>
              <span>{{ articleItem.pubdate | relativeTime }}</span>
              <van-icon name="close" class='close' @click='handleMoreAction(articleItem)'/>
            </p>
          </van-cell>
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
    <home-channel v-model='show' :channels.sync='channels' :active-index.sync='activeChannelIndex'></home-channel>
  <van-dialog
  v-model="dialogShow"
  :showConfirmButton='false'
>
  <van-cell-group v-if='!toggleRubbish'>
    <van-cell title="不敢兴趣"/>
    <van-cell title="反馈垃圾内容" is-link @click="toggleRubbish = true"/>
  </van-cell-group>
    <van-cell-group v-if='toggleRubbish'>
    <van-cell icon="arrow-left" @click="toggleRubbish = false" />
    <van-cell title="标题夸张"/>
    <van-cell title="低俗色情"/>
    <van-cell title="错别字多"/>
    <van-cell title="旧闻重复"/>
  </van-cell-group>
</van-dialog>
  </div>
</template>
<script>
import { getUserChannel } from '@/api/channel'
import { getArticles, dislikesArticle } from '@/api/article'
import HomeChannel from '@/views/home/components/channel.vue'
export default {
  name: 'homeIndex',
  components: {
    HomeChannel
  },
  data () {
    return {
      activeChannelIndex: 0,
      list: [],
      loading: false,
      finished: false,
      pullRefreshLoading: false,
      pageActive: 0,
      channels: [],
      show: false,
      dialogShow: false,
      toggleRubbish: false
    }
  },
  computed: {
    activeChannel () {
      return this.channels[this.activeChannelIndex]
    }
  },
  watch: {
    async '$store.state.user' () {
      console.log('user改变了')
      await this.loadChannels()
      this.activeChannel.upPullLoading = true
      this.onload()
    }
  },
  created () {
    this.loadChannels()
  },
  methods: {
    async onLoad () {
      // 异步更新数据
      await this.$sleep(800)
      let data = []
      data = await this.loadArticles()
      // console.log(data)
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
    async onRefresh () {
      const { activeChannel } = this
      const timestamp = activeChannel.timestamp
      activeChannel.timestamp = Date.now()
      // activeChannel.timestamp = Date.now()
      // console.log(11, activeChannel, Date.now())
      const data = await this.loadArticles()
      if (data.results.length) {
        activeChannel.articles = data.results
        activeChannel.timestamp = data.pre_timestamp
        activeChannel.downPullSuccessText = '更新成功'
        this.onLoad()
      } else {
        activeChannel.downPullSuccessText = '已是最新数据'
        activeChannel.timestamp = timestamp
      }
      activeChannel.downPullLoading = false
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
      console.log('000', this.channels)
    },
    async loadArticles () {
      try {
        const { id: channelId, timestamp } = this.activeChannel
        const data = await getArticles({
          channelId,
          timestamp,
          withTop: 1
        })
        return data
      } catch (err) {
        console.log(err)
      }
    },
    async handleMoreAction(item) {
      this.dialogShow = true
      console.log(item)
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
.van-tabs /deep/ .wap-nav {
  position: sticky;
  right: 0;
  display: flex;
  align-items: center;
  background-color: #fff;
  opacity: .6;
}
.close {
  float:right;
}
</style>
