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
            :key="articleItem.art_id.toString()"
            :title="articleItem.title"
            @click='$router.push({name: "article", params: {articleId: articleItem.art_id}})'
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
              <van-icon name="close" class='close' @click.stop='handleMoreAction(articleItem)'/>
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
  closeOnClickOverlay
  :before-close='handleMoreActionClose'
>
  <van-cell-group v-if='!toggleRubbish'>
    <van-cell title="不感兴趣" @click='handleDislick' />
    <van-cell title="反馈垃圾内容" is-link @click="toggleRubbish = true"/>
    <van-cell title='拉黑作者' @click='addBlackList'></van-cell>
  </van-cell-group>
    <van-cell-group v-if='toggleRubbish'>
    <van-cell icon="arrow-left" @click="toggleRubbish = false" />
    <van-cell v-for='item in repoTypes' :title="item.label" :key='item.value' @click='handleReportArticle(item.value)'/>
  </van-cell-group>
</van-dialog>
  </div>
</template>
<script>
import { getUserChannel } from '@/api/channel'
import { getArticles, dislikesArticle, reportArticle } from '@/api/article'
import { addBlackList } from '@/api/user'
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
      toggleRubbish: false,
      currentArticle: null,
      repoTypes: [
        { label: '标题夸张', value: 1 },
        { label: '低俗色情', value: 2 },
        { label: '错别字多', value: 3 },
        { label: '旧文重复', value: 4 },
        { label: '广告软文', value: 5 },
        { label: '内容不实', value: 6 },
        { label: '涉嫌违法犯罪', value: 7 },
        { label: '侵权', value: 8 },
        { label: '其他问题', value: 9 }
      ]
    }
  },
  computed: {
    activeChannel () {
      return this.channels[this.activeChannelIndex]
    }
  },
  // watch: {
  //   async '$store.state.user' () {
  //     console.log(999,'user改变了')
  //     await this.loadChannels()
  //     this.activeChannel.upPullLoading = true
  //     this.onLoad()
  //   }
  // },
    watch: {
    async '$store.state.user' () {
      console.log('user 改变了')
      await this.loadChannels()
      this.activeChannel.upLoading = true
      this.onLoad()
    }
  },
  async created () {
    await this.loadChannels()
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
        throw err
      }
    },
    handleMoreAction (item) {
      this.currentArticle = item
      this.dialogShow = true
    },
    async handleDislick () {
      const article = this.currentArticle.art_id.toString()
      await dislikesArticle(article)
      this.dialogShow = false
      const articles = this.activeChannel.articles
      const delIndex = articles.findIndex(item => item.art_id.toString() === article)
      articles.splice(delIndex, 1)
      this.$toast('操作成功')
    },
    async addBlackList () {
      await addBlackList(this.currentArticle.aut_id)
      this.dialogShow = false
      this.$toast('操作成功')
    },
    handleMoreActionClose (action, done) {
      done()
      setTimeout(() => {
        this.toggleRubbish = false
      },400)
    },
    async handleReportArticle (type) {
      try {
        await reportArticle({ target: this.currentArticle.art_id.toString(), type, remark: '' })
        this.$toast('举报文章成功')
      } catch (err) {
        console.log(err)
        if (err.response.status === 409) {
          this.$toast('该文章已被举报')
        }
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
.van-tabs /deep/ .wap-nav {
  font-size: 60px;
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
