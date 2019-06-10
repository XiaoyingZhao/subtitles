<template>
  <div class="progress-wrapper" :style="wrapStyle"  @mousedown.stop="mousedownHandler" @mouseover.stop="mouseoverHandler" @mousemove.stop="mousemoveHandler" @mouseup.stop="mouseupHandler" @mouseout.stop="mouseoutHandler">
    <div class="progress" :style="pBarStyle" >
      <div class="clipStartTime" :style="{width: clipStartLength}"></div>
      <div class="preload" :style="{width:progressPreload}"></div>
      <div class="left" :style="leftStyle" >
        <div class="ball" :style="ballStyle" ></div>
      </div>
      <div class="clipEndTime" :style="{width: clipEndLength}"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProgressBar",
  props: {
    leftBg: String,
    bgc: String,
    ballBgc: String,
    height: String,
    width: String,
    percent: {
      type: Number,
      default: 10
    },
    progressPreload: String,
    clipStartLength: {
      type: String,
      default: "0%"
    },
    clipEndLength: {
      type: String,
      default: "0%"
    }
  },
  data: function() {
    return {
      wrapStyle: {
        width: this.width
      },
      pBarStyle: {
        backgroundColor: this.bgc,
        height: this.height
      },
      leftStyle: {
        width: this.percent + "%",
        background: this.leftBg,
        height: this.height
      },
      ballStyle: {
        backgroundColor: this.ballBgc,
        height: this.height,
        width: this.height,
        borderRadius: parseInt(this.height) / 2 + "px",
        right: -parseInt(this.height) / 2 + "px"
      },
      // 标记是否按下鼠标
      isMouseDownOnBall: false,
      // 鼠标进body时是否是mousedown
      isMouseDownOnBody: false,
      // 鼠标离开进度条时的clientX
      outProgressClientX: 0,
      // 主要用于防止一个页面内有多个本组件，MouseMove时互相影响而设置的字段
      isCurrentProgress: false
    };
  },
  computed: {
    progressElement() {
      return this.$el.getElementsByClassName("progress")[0];
    }
  },
  methods: {
    
    mousedownHandler(e) {
      if (e.which === 1) {
        this.isMouseDownOnBall = true;
        this.isCurrentProgress = true;
      }
    },
    mousemoveHandler(e) {
      if (this.isMouseDownOnBall && this.isCurrentProgress) {
        let decimal =
          (e.clientX - this.progressElement.getBoundingClientRect().left) /
          this.progressElement.clientWidth;
        let percent = decimal * 100;
        this.leftStyle.width = percent + "%";
        this.$emit("pbar-drag", percent);
      }
    },
    mouseupHandler(e) {
      if (this.isMouseDownOnBall && this.isCurrentProgress) {
        let decimal =
          (e.clientX - this.progressElement.getBoundingClientRect().left) /
          this.progressElement.clientWidth;
        let percent = decimal * 100;
        this.leftStyle.width = percent + "%";
        this.$emit("pbar-seek", percent);

        this.isMouseDownOnBall = false;
        this.isCurrentProgress = false;
      }
    },
    mouseoverHandler(e) {
      // 没有按左键进入进度条
      if (e.which === 0) {
        this.isMouseDownOnBall = false;
      }
    },
    mouseoutHandler(e) {
      if (e.which === 1 && this.isCurrentProgress) {
        this.outProgressClientX = e.clientX;
        this.isMouseDownOnBody = true;
        this.bodyEventHandler();
      }
    },
    // body元素的事件监听器
    bodyEventHandler() {
      let body = document.getElementsByTagName("body")[0];
      body.addEventListener("mousemove", this.bodyMousemoveHandler);
      body.addEventListener("mouseup", e => {
        this.isMouseDownOnBall = false;
        this.isMouseDownOnBody = false;
        this.outProgressClientX = 0;
        this.isCurrentProgress = false;
        body.removeEventListener("mousemove", this.bodyMousemoveHandler);
      });
    },
    // body元素的mousemove事件监听器
    bodyMousemoveHandler(e) {
      e.preventDefault();
      if (e.which === 1 && this.isMouseDownOnBody === true) {
        let offsetX = e.clientX - this.outProgressClientX;
        // 右移了
        if (offsetX > 0) {
          // 在进度条右边界内
          if (
            e.clientX <
            this.progressElement.clientWidth +
              this.$el.getBoundingClientRect().left
          ) {
            let decimal =
              (e.clientX - this.$el.getBoundingClientRect().left) /
              this.progressElement.clientWidth;
            let percent = decimal * 100;
            this.leftStyle.width = percent + "%";
            this.$emit("pbar-drag", percent);
            // 超出右边界
          } else {
            this.leftStyle.width = "100%";
            this.$emit("pbar-drag", 100);
          }
          // 左移了
        } else if (offsetX < 0) {
          // 在进度条左边界内
          if (e.clientX > this.$el.getBoundingClientRect().left) {
            let decimal =
              (e.clientX - this.$el.getBoundingClientRect().left) /
              this.progressElement.clientWidth;
            let percent = decimal * 100;
            this.leftStyle.width = percent + "%";
            this.$emit("pbar-drag", percent);
            // 超出左边界
          } else {
            this.leftStyle.width = "0%";
            this.$emit("pbar-drag", 0);
          }
        }
      }
    }
  },
  watch: {
    percent(cur, old) {
      this.leftStyle.width = cur + "%";
    }
  }
};
</script>

<style scoped>
.progress-wrapper {
  width:100%;
  height: 100%;
  cursor: pointer;
}
.progress {
  display: block;
  width: 100%;
  height: 3px;
  position: absolute;
  margin: auto;
  top: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50px;
}
.preload {
  width: 70%;
  display: block;
  height: 3px;
  position: absolute;
  margin: auto;
  top: 0;
  bottom: 0;
  border-radius: 50px;
  background-color: rgba(255, 255, 255, 0.3);
}
.left {
  width: 0%;
  display: block;
  height: 3px;
  position: absolute;
  margin: auto;
  top: 0;
  bottom: 0;
  border-radius: 50px;
  background: #fff;
  /* background-color: #FF6880; */
}
.ball {
  /* left:0%; */
  right: -6px;
  display: block;
  position: absolute;
  margin: auto;
  top: 0;
  bottom: 0;
  width: 12px;
  height: 12px;
  border-radius: 100px;
  z-index: 9;
  background-color: #fff;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.1);
}
.clipStartTime{
  /* width: 10%; */
  height: 3px;
  background: #fd0047;
  position: absolute;
  left:0;
  z-index: 1;
}
.clipEndTime{
  /* width: 10%; */
  height: 3px;
  background: #fd0047;
  position: absolute;
  right: 0;
}
</style><template>
  <div class="progress-wrapper" :style="wrapStyle"  @mousedown.stop="mousedownHandler" @mouseover.stop="mouseoverHandler" @mousemove.stop="mousemoveHandler" @mouseup.stop="mouseupHandler" @mouseout.stop="mouseoutHandler">
    <div class="progress" :style="pBarStyle" >
      <div class="clipStartTime" :style="{width: clipStartLength}"></div>
      <div class="preload" :style="{width:progressPreload}"></div>
      <div class="left" :style="leftStyle" >
        <div class="ball" :style="ballStyle" ></div>
      </div>
      <div class="clipEndTime" :style="{width: clipEndLength}"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProgressBar",
  props: {
    leftBg: String,
    bgc: String,
    ballBgc: String,
    height: String,
    width: String,
    percent: {
      type: Number,
      default: 10
    },
    progressPreload: String,
    clipStartLength: {
      type: String,
      default: "0%"
    },
    clipEndLength: {
      type: String,
      default: "0%"
    }
  },
  data: function() {
    return {
      wrapStyle: {
        width: this.width
      },
      pBarStyle: {
        backgroundColor: this.bgc,
        height: this.height
      },
      leftStyle: {
        width: this.percent + "%",
        background: this.leftBg,
        height: this.height
      },
      ballStyle: {
        backgroundColor: this.ballBgc,
        height: this.height,
        width: this.height,
        borderRadius: parseInt(this.height) / 2 + "px",
        right: -parseInt(this.height) / 2 + "px"
      },
      // 标记是否按下鼠标
      isMouseDownOnBall: false,
      // 鼠标进body时是否是mousedown
      isMouseDownOnBody: false,
      // 鼠标离开进度条时的clientX
      outProgressClientX: 0,
      // 主要用于防止一个页面内有多个本组件，MouseMove时互相影响而设置的字段
      isCurrentProgress: false
    };
  },
  computed: {
    progressElement() {
      return this.$el.getElementsByClassName("progress")[0];
    }
  },
  methods: {
    
    mousedownHandler(e) {
      if (e.which === 1) {
        this.isMouseDownOnBall = true;
        this.isCurrentProgress = true;
      }
    },
    mousemoveHandler(e) {
      if (this.isMouseDownOnBall && this.isCurrentProgress) {
        let decimal =
          (e.clientX - this.progressElement.getBoundingClientRect().left) /
          this.progressElement.clientWidth;
        let percent = decimal * 100;
        this.leftStyle.width = percent + "%";
        this.$emit("pbar-drag", percent);
      }
    },
    mouseupHandler(e) {
      if (this.isMouseDownOnBall && this.isCurrentProgress) {
        let decimal =
          (e.clientX - this.progressElement.getBoundingClientRect().left) /
          this.progressElement.clientWidth;
        let percent = decimal * 100;
        this.leftStyle.width = percent + "%";
        this.$emit("pbar-seek", percent);

        this.isMouseDownOnBall = false;
        this.isCurrentProgress = false;
      }
    },
    mouseoverHandler(e) {
      // 没有按左键进入进度条
      if (e.which === 0) {
        this.isMouseDownOnBall = false;
      }
    },
    mouseoutHandler(e) {
      if (e.which === 1 && this.isCurrentProgress) {
        this.outProgressClientX = e.clientX;
        this.isMouseDownOnBody = true;
        this.bodyEventHandler();
      }
    },
    // body元素的事件监听器
    bodyEventHandler() {
      let body = document.getElementsByTagName("body")[0];
      body.addEventListener("mousemove", this.bodyMousemoveHandler);
      body.addEventListener("mouseup", e => {
        this.isMouseDownOnBall = false;
        this.isMouseDownOnBody = false;
        this.outProgressClientX = 0;
        this.isCurrentProgress = false;
        body.removeEventListener("mousemove", this.bodyMousemoveHandler);
      });
    },
    // body元素的mousemove事件监听器
    bodyMousemoveHandler(e) {
      e.preventDefault();
      if (e.which === 1 && this.isMouseDownOnBody === true) {
        let offsetX = e.clientX - this.outProgressClientX;
        // 右移了
        if (offsetX > 0) {
          // 在进度条右边界内
          if (
            e.clientX <
            this.progressElement.clientWidth +
              this.$el.getBoundingClientRect().left
          ) {
            let decimal =
              (e.clientX - this.$el.getBoundingClientRect().left) /
              this.progressElement.clientWidth;
            let percent = decimal * 100;
            this.leftStyle.width = percent + "%";
            this.$emit("pbar-drag", percent);
            // 超出右边界
          } else {
            this.leftStyle.width = "100%";
            this.$emit("pbar-drag", 100);
          }
          // 左移了
        } else if (offsetX < 0) {
          // 在进度条左边界内
          if (e.clientX > this.$el.getBoundingClientRect().left) {
            let decimal =
              (e.clientX - this.$el.getBoundingClientRect().left) /
              this.progressElement.clientWidth;
            let percent = decimal * 100;
            this.leftStyle.width = percent + "%";
            this.$emit("pbar-drag", percent);
            // 超出左边界
          } else {
            this.leftStyle.width = "0%";
            this.$emit("pbar-drag", 0);
          }
        }
      }
    }
  },
  watch: {
    percent(cur, old) {
      this.leftStyle.width = cur + "%";
    }
  }
};
</script>

<style scoped>
.progress-wrapper {
  width:100%;
  height: 100%;
  cursor: pointer;
}
.progress {
  display: block;
  width: 100%;
  height: 3px;
  position: absolute;
  margin: auto;
  top: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50px;
}
.preload {
  width: 70%;
  display: block;
  height: 3px;
  position: absolute;
  margin: auto;
  top: 0;
  bottom: 0;
  border-radius: 50px;
  background-color: rgba(255, 255, 255, 0.3);
}
.left {
  width: 0%;
  display: block;
  height: 3px;
  position: absolute;
  margin: auto;
  top: 0;
  bottom: 0;
  border-radius: 50px;
  background: #fff;
  /* background-color: #FF6880; */
}
.ball {
  /* left:0%; */
  right: -6px;
  display: block;
  position: absolute;
  margin: auto;
  top: 0;
  bottom: 0;
  width: 12px;
  height: 12px;
  border-radius: 100px;
  z-index: 9;
  background-color: #fff;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.1);
}
.clipStartTime{
  /* width: 10%; */
  height: 3px;
  background: #fd0047;
  position: absolute;
  left:0;
  z-index: 1;
}
.clipEndTime{
  /* width: 10%; */
  height: 3px;
  background: #fd0047;
  position: absolute;
  right: 0;
}
</style>