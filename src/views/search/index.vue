<template>
  <div>
   <form action="">
      <van-search
      v-model="searchText"
      placeholder="请输入搜索关键词"
      show-action
      @search='handleSearch(searchText)'
    />
  </form>
  <!-- 联想记忆表 -->
  <van-cell-group v-if='searchText'>
    <van-cell v-for='item in suggestions' :key='item' :value="item" @click='handleSearch(item)'>
     <div slot="title" v-html="heightlight(item, searchText)"></div>
     </van-cell>
  </van-cell-group>
  <!-- 历史记录 -->
  <van-cell-group v-else>
    <van-cell title='历史记录'>
      <van-icon v-show='isDeleteShow' name='delete' slot='right-icon' style='line-height: inherit;' @click='isDeleteShow=false'/>
      <div v-show='!isDeleteShow'>
        <span style='margin-right: 10px;' @click='searchHistories = []'>全部删除</span>
        <span @click='isDeleteShow=true'>完成</span>
      </div>
    </van-cell>
    <van-cell v-for='(item, index) in searchHistories' :title='item' :key='item'>
        <van-icon name='close' slot='right-icon' style='line-height:inherit' @click='searchHistories.splice(index,1)'></van-icon>
    </van-cell>
  </van-cell-group>
  </div>
</template>
<script>
import { getSuggestion } from '@/api/search'
import { debounce } from 'lodash'
export default {
  data () {
    return {
      searchText: '',
      suggestions: [],
      clearSearch: null,
      searchHistories: JSON.parse(window.localStorage.getItem('search-histories')),
      isDeleteShow: true
    }
  },
  watch: {
    searchText: debounce(async function (newVal) {
      newVal = newVal.trim()
      if (!newVal) {
        return
      }
      const data = await getSuggestion(newVal)
      this.suggestions = data.options
    }, 500),
    searchHistories: {
      handler () {
        window.localStorage.setItem('search-histories',JSON.stringify([...new Set(this.searchHistories)]))
      },
      deep: true
    }
  },
  created () {
    console.log(this.searchHistories)
  },
  methods: {
    heightlight (item, searchText) {
      return item.toLowerCase().split(searchText).join(`<span style="color:red;">${searchText}</span>`)
    },
    handleSearch (q) {
      if (!q.trim().length) {
        return
      }
      this.searchHistories.unshift(q)
      // window.localStorage.setItem('search-histories', JSON.stringify([...new Set(this.searchHistories)]))
      this.$router.push({
        name: 'search-result',
        params: {
          q
        }
      })
    }
  }
}
</script>
<style scoped>
.van-search {
  background-color: #1989fa !important;
}
</style>
