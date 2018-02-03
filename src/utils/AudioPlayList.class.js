import AudioPlayer from '@/utils/Audio.class'
import EventEmitter from './EventEmitter.class'

class AudioPlayList {
  constructor(list) {
    this.AudioPlayer = new AudioPlayer({
      autoplay: false
    })
    this.playList = list
    this.events = new EventEmitter()
    this.index = 0
  }
  prev() {
    this.index--
    if (this.index < 0) {
      this.index = this.playList.length - 1
    }
    this.play()
  }
  next() {
    this.index++
    if (this.index >= this.playList.length) {
      this.index = 0
    }
    this.play()
  }
  playIndex(playIndex) {
    this.index = playIndex
    this.play()
  }
  addAudio(audio) {
    this.playList.push(audio)
  }
  play(index) {
    if (index === 'last') {
      this.index = this.playList.length
    }
    this.AudioPlayer.set('src', this.playList[this.index].src).play()
    this.events.emit('changeMusic', this.playList[this.index])
  }
  init() {
    this.AudioPlayer.on('ended', () => {
      this.next()
    })
    this.play()
  }
}

export default AudioPlayList
