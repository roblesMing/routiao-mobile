<template>
  <div>
    <van-nav-bar
      title="首页"
      fixed
    />
    <van-tabs v-model="active">
    <van-tab title="标签 1">
      <van-pull-refresh v-model="pullRefreshLoading" @refresh="onRefresh">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <van-cell
            v-for="item in list"
            :key="item"
            :title="item"
          />
        </van-list>
      </van-pull-refresh>
    </van-tab>
    <van-tab title="标签 2">内容 2</van-tab>
    <van-tab title="标签 3">内容 3</van-tab>
    <van-tab title="标签 4">内容 4</van-tab>
    <van-tab title="标签 3">内容 3</van-tab>
    <van-tab title="标签 4">内容 4</van-tab>
    <van-tab title="标签 3">内容 3</van-tab>
    <van-tab title="标签 4">内容 4</van-tab>  
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
export default {
  name: 'homeIndex',
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      active: 2,
      pullRefreshLoading: false,
      pageActive: 0
    }
  },
  methods: {
    onLoad () {
      console.log('onload')
      // 异步更新数据
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1)
        }
        // 加载状态结束
        this.loading = false
        // 数据全部加载完成
        if (this.list.length >= 40) {
          this.finished = true
        }
      }, 500)
    },
    onRefresh() {
      setTimeout(() => {
        this.pullRefreshLoading = false;
      }, 500)
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
