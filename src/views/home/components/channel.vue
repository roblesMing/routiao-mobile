<template>
  <van-popup
  :value="value"
  position='bottom'
  @input="$emit('input',$event)"
  get-container="body"
  :style='{ height: "95%" }'
  >
  <div class="channels">
    <div class="heade">
      <div>
        <span class='title'>我的频道</span>
        <span class='desc'>点击进入频道</span>
      </div>
      <div>
        <van-button type="info" size='mini' plain @click='isEdit=!isEdit'>{{ isEdit ? '完成' : '编辑'}}</van-button>
      </div>
    </div>
    <div class="content">
      <van-grid>
        <van-grid-item
        v-for="(item,index) in channels"
        :key="item.id"
        @click='removeChannel(item,index)'
        >
          <van-icon class='close-icon channel-icon' v-show='isEdit' name='close'></van-icon>
          <span class='text'  :class='{active: index === activeIndex && !isEdit}'>{{item.name}}</span>
        </van-grid-item>
      </van-grid>
    </div>
  </div>

  <div class="channels">
    <div class="heade">
      <div>
        <span class='title'>我的频道</span>
        <span class='desc'>点击进入频道</span>
      </div>
      <!-- <div>
        <van-button type="info" size='mini' plain>编辑</van-button>
      </div> -->
    </div>
    <div class="content">
      <van-grid>
        <van-grid-item
        v-for="item in recommendChannels"
        :key="item.id"
        @click='addchannel(item)'
        >
          <van-icon class='add-icon channel-icon' name='add-o'></van-icon>
          <span  class='text'>{{item.name}}</span>
        </van-grid-item>
      </van-grid>
    </div>
  </div>
  </van-popup>
</template>
<script>
import { getAllChannels, deleteUserChannel, updateUserChannel } from '@/api/channel.js'
export default {
  props: {
    value: {
      type: Boolean,
      defualt: false
    },
    channels: {
      type: Array,
      defualt: () => []
    },
    activeIndex: {
      type: Number,
      defautl: 0
    }
  },
  data () {
    return {
      allChannels: [],
      isEdit: false
    }
  },
  computed: {
    recommendChannels () {
      const filterId = this.channels.map(item => item.id)
      return this.allChannels.filter(item => !filterId.includes(item.id))
    }
  },
  created () {
    this.loadAllChannels()
  },
  methods: {
    async loadAllChannels () {
      try {
        const data = await getAllChannels()
        data.channels.forEach(item => {
          item.articles = [] // 频道的文章
          item.timestamp = Date.now() // 用于下一页频道数据的时间戳
          item.finished = false // 控制该频道上拉加载是否已加载完毕
          item.upLoading = false // 控制该频道的下拉刷新 loading
          item.pullRefreshLoading = false // 控制频道列表的下拉刷新状态
          item.pullSuccessText = '' // 控制频道列表的下拉刷新成功提示文字
          item.downPullLoading = false
        })
        this.allChannels = data.channels
      } catch (err) {
        console.log(err)
      }
    },
    async addchannel (item) {
      const temporaryChannels = this.channels.slice(0)
      temporaryChannels.push(item)
      this.$emit('update:channels', temporaryChannels)
      const { user } = this.$store.state
      if (user) {
        await updateUserChannel([{
          id: item.id,
          seq: temporaryChannels.length - 1
        }])
      } else {
        window.localStorage.setItem('channels', JSON.stringify(temporaryChannels))
      }
    },
    async removeChannel (item, index) {
      if (!this.isEdit) {
        this.$emit('update:activeIndex', index)
        this.$emit('input', false)
        return
      }
      const temporaryChannels = this.channels.slice(0)
      temporaryChannels.splice(index, 1)
      this.$emit('update:channels', temporaryChannels)
      const { user } = this.$store.state
      if (user) {
        await deleteUserChannel(item.id)
      } else {
        window.localStorage.setItem('channels', JSON.stringify(temporaryChannels))
      }
    }
  }
}
</script>
<style lang='less' scoped>
.channels {
  .heade {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 10px;
    .title {
      font-size: 30px;
      margin-right: 5px;
    }
    .desc {
      font-size: 12px;
    }
  }
  .content {
    .text {
      font-size: 24px;
  }
    .active {
      color: red
  }
    .close-icon {
      position: absolute;
      font-size: 40px;
      right: -4px;
      top: -4px;
      z-index: 999;
      background: #fff;
  }
   .add-icon {
     font-size: 40px;
   }
  }
}
</style>
