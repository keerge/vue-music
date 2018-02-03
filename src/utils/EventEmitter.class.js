class EventEmitter {
  constructor() {
    this.list = {}
  }
  on(event, linstener) {
    this.list[event] = this.list[event] || []
    this.list[event].push(linstener)
  }
  off(event, linstener) {
    this.list[event].forEach((evLinstener, index) => {
      if (linstener === evLinstener) {
        this.list[event].splice(index, 1)
        return false
      }
    })
  }
  emit(event) {
    const args = [].slice.call(arguments, 1)
    if (this.list[event]) {
      this.list[event].forEach(linstener => linstener.apply(null, args))
    } else {
      console.log(event + ' undefined')
    }
  }
}
export default EventEmitter
