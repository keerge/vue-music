<template>
  <div class="m-progress-bar" ref="progressBar" @click="changeProgress">
    <div class="progress-value" :style="{ width: progress+'%' }"></div>
</div>
</template>

<script>
export default {
  props: ['progress'],
  methods: {
    changeProgress(e) {
      const progressBar = this.$refs.progressBar
      const progress = (e.clientX - progressBar.getBoundingClientRect().left) / progressBar.clientWidth
      this.$emit('changeProgress', progress)
    }
  }
}
</script>
<style lang="scss" scoped>
.m-progress-bar{
    height: 3px;
    width: 100%;
    background-color: #601b19;
    cursor: pointer;
    .progress-value{
        width: 80%;
        height: 100%;
        background-color: #9c5150;
    }
}
</style>
