<template>
  <div class='search-result'>
    <van-nav-bar
    title="搜索结果"
    left-text="返回"
    left-arrow
    fixed
    @click-left='$router.back()'
    />
    <van-list
  class="article-list"
  v-model="loading"
  :finished="finished"
  finished-text="没有更多了"
  @load="onLoad"
  >
      <van-cell
        v-for="item in articles"
        :key="item.art_id.toString()"
        :title="item.title"
      />
    </van-list>
  </div>
</template>
<script>
import { getSearch } from '@/api/search'
export default {
  name: 'SearchResult',
  data () {
    return {
      finished: false,
      loading: false,
      page: 1,
      perPage: 10,
      articles: []
    }
  },
  computed: {
    q () {
      return this.$route.params.q
    }
  },
  watch: {
    '$route' (to, from) {
      console.log('路由变化了')
    }
  },
  activated () {
    // this.loading = true
    // this.onLoad()
  },
  deactivated () {
    // this.articles = []
    // this.page = 1
    this.$destroy()
  },
  async created () {
    const data = await getSearch({ q: this.$route.params.q, page: 1 })
    console.log(data)
  },
  methods: {
    async onLoad () {
      await this.$sleep(500)
      const data = await this.getSearchResult()
      if (!data.results.length) {
        this.loading = false
        this.finished = true
        return
      }
      this.articles.push(...data.results)
      this.page++
      this.loading = false
    },
    getSearchResult () {
      return getSearch({
        page: this.page,
        perPage: this.perPage,
        q: this.q
      })
    }
  }
}
</script>
<style lang='less' scoped>
.search-result {
  .article-list {
    margin-top: 92px;
  }
}
</style>
