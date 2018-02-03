import EventEmitter from './EventEmitter.class'
class AudioPlayer {
  constructor(options) {
    this.DEFAULTS = {
      src: 'http://dl.stream.qqmusic.qq.com/C400000TOO4v0AF3Bs.m4a?vkey=13BC9F4B431B274F287887D54DA012796E0D450177B5A77892A157E0249346F25846DC768231FF8760C680BD68D88CF5F8B59650D7FDA0D4&guid=4538299824&uin=879911816&fromtag=66',
      autoplay: true
    }
    this.conf = Object.assign({}, this.DEFAULTS, options)
    this.audioEvents = new EventEmitter()
    this.init()
  }
  _created() {
    const audioObj = document.createElement('audio')
    audioObj.setAttribute('src', this.conf.src)
    if (this.conf.autoplay) {
      audioObj.setAttribute('autoplay', '')
      this.status = 'playing'
    }
    // document.body.appendChild(audioObj)
    this.audio = audioObj
  }
  _initEvents() {
    this.on('playing', () => {
      this.status = 'playing'
      this.audioEvents.emit('changeStatus', 'playing')
    })
    this.on('pause', () => {
      this.status = 'pause'
      this.audioEvents.emit('changeStatus', 'pause')
    })
    this.on('loadstart', () => {
      this.status = 'loadstart'
      this.audioEvents.emit('changeStatus', 'loadstart')
    })
    this.on('timeupdate', () => {
      this.audioEvents.emit('progress', this.audio.currentTime)
    })
  }
  togglePlay() {
    if (this.status === 'playing') {
      this.audio.pause()
    } else {
      this.audio.play()
    }
  }
  play(time) {
    if (time) {
      this.audio.currentTime = time
    }
    this.audio.play()
  }
  volume(progress) {
    this.audio.volume = progress
  }
  getStatus() {
    return this.status
  }
  on(name, fn) {
    const audioDefaultEvents = [
      'onplaying',
      'onplay',
      'oncanplay',
      'onpause',
      'onloadstart',
      'ontimeupdate',
      'onended'
    ]
    if (audioDefaultEvents.indexOf('on' + name) === -1) {
      this.audioEvents.on(name, fn)
    } else {
      this.audioEvents.on('on' + name, fn)
      if (!this.audio['on' + name]) {
        this.audio['on' + name] = () => {
          this.audioEvents.emit('on' + name)
        }
      }
    }
  }
  get(attribute) {
    return this.audio[attribute]
  }
  set(attribute, value) {
    this.audio[attribute] = value
    return this
  }
  init() {
    this._created()
    this._initEvents()
  }
}

export default AudioPlayer
