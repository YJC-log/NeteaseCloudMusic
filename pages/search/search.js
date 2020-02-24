// pages/search/search.js
const baseUrl = 'http://neteasecloudmusicapi.zhaoboy.com'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotSearch: [],
    query: '',
    songCount: 0,
    songs: [],
    showsuggest: false,
    page: 0,
    showLoading: false,
    SearchHistory: []
  },

  // 获取热门搜索
  getHotSearch () {
    let that = this
    wx.request({
      url: baseUrl + '/search/hot/detail',
      success (res) {
        if (res.data.code === 200) {
          // console.log(res.data.result.hots)
          that.setData({
            hotSearch: res.data.result.hots
          })
          wx.hideLoading()
        }
      }
    })
  },
  // 获取搜索建议
  getSuggest (query) {
    let that = this
    that.setData({
      page: 0,
      showLoading: true
    })
    wx.request({
      url: baseUrl + '/search',
      data: {
        keywords: query
      },
      success (res) {
        if (res.data.code === 200) {
          // console.log(res.data.result.songCount)
          // console.log(res.data.result.songs)
          that.setData({
            songCount: res.data.result.songCount,
            songs: res.data.result.songs,
            showLoading: false
          })
        }
      }
    })
  },
  // 滚动到底部加载
  scrollLower () {
    let page = this.data.page + 1
    this.setData({
      page: page,
      showLoading: true
    })
    this.getMoreSuggest (this.data.query)
  },
  // 上拉加载更多
  getMoreSuggest (query) {
    let that = this
    if (that.data.songs.length === that.data.songCount) {
      that.setData({
        showLoading: false
      })
      return
    }
    wx.request({
      url: baseUrl + '/search',
      data: {
        keywords: query,
        offset: that.data.page * 30
      },
      success (res) {
        // console.log(res.data.result.songs)
        if (res.data.code === 200) {
          let moreSongs = that.data.songs
          let loadSongs = res.data.result.songs
          moreSongs = [...moreSongs, ...loadSongs]
          that.setData({
            songs: moreSongs,
            showLoading: false
          })
        }
      }
    })
  },
  // 搜索事件
  onChange (e) {
    console.log(e)
    let that = this
    if(e.detail == '') {
      that.setData({
        showsuggest: false,
        query: ''
      })
      return
    }
    if (e.detail) {
      that.setData({
        query: e.detail
      })
    }
    that.setData({
      showsuggest: true
    })
    that.getSuggest(that.data.query)
  },
  // 存储搜索历史
  saveSearchHistory(name, id) {
    let history = {
      name: name,
      id: id
    }
    let currentHistory = wx.getStorageSync('SearchHistory')
    for (let item of currentHistory) {
      if (item.id === history.id) {
        return
      }
    }
    currentHistory = [...new Set([history, ...currentHistory])]
    wx.setStorageSync('SearchHistory', currentHistory)
    // console.log(this.data.SearchHistory)
    this.setData({
      SearchHistory: currentHistory
    })
  },
  // 去播放音乐界面
  play (e) {
    this.saveSearchHistory(e.currentTarget.dataset.name, e.currentTarget.dataset.id)
    let songs = [...new Set(this.data.songs)]
    let currentSong = songs.splice(e.currentTarget.dataset.index, 1)[0]
    songs = [currentSong, ...songs]
    wx.setStorageSync('playList', songs)
    // console.log(wx.getStorageSync('playList'))
    wx.navigateTo({
      url: '../play/play'
    })
  },
  // 点击热门搜索或者搜索历史
  onSearchBox (e) {
    console.log(e.currentTarget.dataset.name)
    let that = this
    that.setData({
      showsuggest: true
    })
    let obj = {}
    obj.detail = e.currentTarget.dataset.name
    that.onChange(obj)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中'
    })
    this.getHotSearch ()
    let currentHistory = wx.getStorageSync('SearchHistory')
    this.setData({
      SearchHistory: currentHistory
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})