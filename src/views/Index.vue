<template>
  <div class="g-music-wrap">
    <div class="m-player">
        <div class="g-player-container">
            <div class="m-player-volume">
                <div class="m-control-volume" @click="handleMuted"><svg-icon :icon-class="muted?'volume-off':'volume'" className="icon-volume" /></div>
                <div class="g-volumeProgress-bar">
                    <m-progress :progress="volume*100" @changeProgress="changeVolumeProgress"></m-progress> 
                </div>
            </div>
            <div class="m-player-panel">
                <div class="music-cover" :style="{ background: `url(${currentMusic.poster})` }"></div>
            </div>
            <div class="m-player-progress g-player-progress">
                <div class="g-playProgress-bar">
                    <m-progress :progress="progress" @changeProgress="changePlayProgress"></m-progress>
                </div>
               <div class="m-progress-time">
                    <div class="m-current">{{progressTime|MillisecondToDate}}</div>
                    <div class="m-duration">{{durationTime|MillisecondToDate}}</div>
               </div>
            </div>
            <div class="m-music-display">
                <div class="display-inner">
                    <div class="music-title">{{currentMusic.title}}</div>
                    <div class="music-artist">{{currentMusic.artist}}</div>
                </div>
            </div>
            
        </div>
        <div class="m-player-control g-player-control">
                <div class="j-control-button">
                    <svg-icon icon-class="cc" />
                </div>
                <div class="j-control-button"  @click="handlePrev">
                    <svg-icon icon-class="prev"/>
                </div>
                <div class="j-control-button" @click="handlePlay">
                    <svg-icon :icon-class="getStatus" />
                </div>
                <div class="j-control-button" @click="handleNext">
                    <svg-icon icon-class="next" />
                </div>
                <div class="j-control-button" @click="showExtra = !showExtra" :class="{'s-current':showExtra}">
                    <svg-icon icon-class="menu" />
                </div>
            </div>
    </div>
    <div class="m-extra" v-if="showExtra">
        <div class="m-playlibrary">
            <!-- <div class="g-music-search-btn">
                 <svg-icon icon-class="search" className="m-music-search-btn"/>
            </div> -->
            <!-- <div class="m-music-search g-music-search">
                <input type="text" class="m-input" placeholder="搜索音乐">
                <div class="m-search-btn">
                     <svg-icon icon-class="search" className="icon-volume"/>
                </div>
            </div> -->
            <div class="g-music-list">
                <ul class="m-music-list">
                    <li v-for="(item,i) in musicList" @click="handlePlayOne(item)" :key="i" :class="{'s-current':item===currentMusic}">
                        <span>{{item.title}}</span> 
                        <span class="music-artist">{{item.artist}}</span>
                        <span><svg-icon icon-class="current" className="icon-current" v-if="item===currentMusic"/></span>
                    
                    </li>
                </ul>
            </div>
        </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import '~@/styles/player.scss';
</style>
<script>
import AudioPlayList from '@/utils/AudioPlayList.class'
import mProgress from '@/components/Progress/Progress'
export default {
  data() {
    return {
      playStatus: 'loadstart',
      progress: 0,
      progressTime: 0,
      durationTime: 0,
      volume: 0,
      muted: false,
      currentMusic: {},
      showExtra: false,
      musicList: [
        {
          src: 'http://vip.baidu190.com/uploads/2017/20170212650e93758f9c207b7a9b53e4e483b2.mp3',
          title: 'MV BINGBIAN病变 (女声版)',
          artist: '鞠文娴',
          poster: 'https://y.gtimg.cn/music/photo_new/T002R300x300M000000zFECL2iqwch.jpg?max_age=2592000'
        },
        {
          src: 'http://vip.baidu190.com/uploads/2017/20171133dacf25a88aef90216aa7cdfb6e3777.mp3',
          title: '9420',
          artist: '麦小兜',
          poster: 'https://y.gtimg.cn/music/photo_new/T002R300x300M000002DbpNa1zRNqa.jpg?max_age=2592000'
        },
        {
          src: 'http://vip.baidu190.com/uploads/2017/201605473de844d870a72b8c6384d71fc794dd.mp3',
          title: '你不纯洁',
          artist: '张危险',
          poster: 'https://y.gtimg.cn/music/photo_new/T002R300x300M0000047c4tV3jATDj.jpg?max_age=2592000'
        }
      ]
    }
  },
  components: {
    mProgress
  },
  created() {
    if (!this.audioPlayer) {
      this.AudioPlayList = new AudioPlayList(this.musicList)
      this.AudioPlayList.events.on('changeMusic', (currentMusic) => {
        this.currentMusic = currentMusic
      })
      this.audioPlayer = this.AudioPlayList.AudioPlayer
      this.audioPlayer.on('changeStatus', (status) => {
        this.playStatus = status
      })
      this.audioPlayer.on('progress', (progress) => {
        this.progressTime = progress
        this.progress = progress / this.audioPlayer.get('duration') * 100
      })
      this.audioPlayer.on('canplay', () => {
        this.durationTime = this.audioPlayer.get('duration')
        this.volume = this.audioPlayer.get('volume')
        this.muted = this.audioPlayer.get('muted')
      })

      this.AudioPlayList.init()
    }
  },
  computed: {
    getStatus() {
      const statusIcon = {
        'playing': 'pause',
        'pause': 'play',
        'loadstart': 'loading'
      }
      return statusIcon[this.playStatus]
    }
  },
  methods: {
    handlePlay() {
      this.audioPlayer.togglePlay()
    },
    handleNext() {
      this.AudioPlayList.next()
    },
    handlePrev() {
      this.AudioPlayList.prev()
    },
    handleMuted() {
      this.muted = !this.muted
      this.audioPlayer.set('muted', this.muted)
    },
    changePlayProgress(progress) {
      this.audioPlayer.play(this.durationTime * progress)
    },
    changeVolumeProgress(progress) {
      this.volume = progress
      this.audioPlayer.volume(progress)
    },
    handlePlayOne(audio) {
      let isInPlayList = false
      let _index = 0
      this.musicList.forEach((item, index) => {
        if (audio === item) {
          isInPlayList = true
          _index = index
          return false
        }
      })
      if (isInPlayList) {
        this.AudioPlayList.playIndex(_index)
      } else {
        this.AudioPlayList.addAudio(audio).play('last')
      }
    }
  },
  filters: {
    MillisecondToDate(msd) {
      var time = parseFloat(msd)
      function parseD(num) {
        num = '' + (num || 0)
        return num.length === 1 ? ('0' + num) : num
      }

      function parseTime(duration) {
        duration = duration - 0
        var mit = Math.floor(duration / 60)
        var sec = Math.ceil(duration - mit * 60)
        if (sec >= 60) {
          mit += 1
          sec -= 60
        }
        return parseD(mit) + ':' + parseD(sec)
      }

      return parseTime(time)
    }
  }
}
</script>
