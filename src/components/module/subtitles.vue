<template>
  <div class="wrapper">
    <div class="leftWrapper">
      <div id="father" >
        <div class="player">
          <video class='video' ref='video' @play='play' @pause='pause' @canplay="canplay" @playing='playing' @timeupdate='timeupdate' webkit-playsinline='true' playsinline='playsinline'  preload='preload' src="http://gslb.miaopai.com/stream/HMY1teYONIsjTUqxQZ~VAjSAbZhuqMufbm1L~g__.mp4?vend=miaopai&ssig=44f4923cba4c242c3adfd96f0e43d6a2&time_stamp=1559105822449&mpflag=32"></video>
        </div>
        <div class="target" @mousedown="move" @dblclick="modify" v-for="(item,index) in coord" :key="index" v-if="item.show" :data-index="index" :style="{'left': item.x+'px', 'top': item.y+'px', fontSize: item.size+'px', color: item.color, background: item.background, fontFamily: item.fontFamily, fontWeight: item.bold?'bold':'normal', fontStyle: item.oblique?'oblique':'normal', textDecoration: item.decoration?'underline':'inherit'}" v-html="filtertxt(item.val)"></div>
        <!-- <div class="target" @mousedown="drag" v-for="(item,index) in coord" :data-index="index" :style="{'left': 30+'px', 'top': 40+'px'}">第三方决胜巅峰第</div> -->
      </div>

      <div class="vidControl">
        <div class="conWrapper">
          <div class="icon" :class="[playIcon === 1 ? 'play' : 'pause']" @click="playBtn"></div>
          <div class="timerWrapper">
            {{TimeTranslate(currentTime)}} / {{TimeTranslate(duration)}}
          </div>
        </div>
        <div class="progressWrapper">
          <progress-bar :clipStartLength="clipStartLength" :clipEndLength="clipEndLength" :percent='percent' :progressPreload='progressPreload' @pbar-drag="setProgress" @pbar-seek="setProgress"></progress-bar>
        </div>
      </div>

    </div>
    

    <div class="controls">
      <button @click="add">添加字幕</button>
      <button @click="preview">预览</button>
      <div class="showAll clearfix">
        <div class="card clearfix" :class="[parseInt(showAllIndex)===index?'on':'']" @dblclick="modify" v-for="(item,index) in coord" :data-index="index" :key="index">{{item.val}}</div>
      </div>
      <div class="info" v-if="showCoord">
        <label for="val">字幕：</label><textarea type="text" placeholder="输入字幕..." v-model="showCoord.val" id='val'></textarea>
        <!-- 坐标 -->
        <div class="line"></div>
        <label for="x">x值(px)：</label><input type="number" v-model="showCoord.x" id='x'>
        <label for="y">y值(px)：</label><input type="number" v-model="showCoord.y" id='y'>
        <div class="line"></div>
        <label for="time">停留时间(s)：</label><input type="number" v-model="showCoord.time" id='time'>
        <label for="vidCurrentTime">添加时间(s)：</label><input type="number" disabled v-model="showCoord.vidCurrentTime" id='vidCurrentTime'>

        <!-- 字体 -->
        <div class="line"></div>
        <label for="select">字体样式：</label>
        <select id="select" v-model="showCoord.fontFamily">
          <option value="STFangsong">华文宋体</option>
          <option value="HYYuanLongHei-35J">汉仪元隆黑-35J</option>
          <option value="HYXiZhongYuanJ">汉仪细中圆简</option>
          <option value="HYXiYuanJ">汉仪细圆简</option>
          <option value="HYWenHei-85J">汉仪文黑-85J</option>
          <option value="HYWenHei-45J">汉仪文黑-45J</option>
          <option value="HYTieXianHei-85J">汉仪铁线黑-85J</option>
          <option value="HYTieXianHei-55J">汉仪铁线黑-55J</option>
          <option value="HYRunYuan-75J">汉仪润圆-75J</option>
          <option value="HYRunYuan-35J">汉仪润圆-35J</option>
          <option value="HYQiHei-105J">汉仪旗黑-105J</option>
          <option value="HYQiHei-60J">汉仪旗黑-60J</option>
          <option value="HYQiHei-40J">汉仪旗黑-40J</option>
        </select>   

        <label for="color">字体颜色：</label><input id="color" type="color" v-model='showCoord.color'><input type="text" v-model="showCoord.color">
        <div class="line"></div>
        <label for="size">字体大小(px)：</label><input id="zise" type="number" v-model="showCoord.size">
        <label class='checkbox' for="bold">加粗</label><input id="bold" class='checkbox' type="checkbox" v-model="showCoord.bold">
        <label class='checkbox' for="oblique">斜体</label><input id="oblique" class='checkbox' type="checkbox" v-model="showCoord.oblique">
        <label class='checkbox' for="decoration">下划线</label><input id="decoration" class='checkbox' type="checkbox" v-model="showCoord.decoration">

        <!-- 背景 -->
        <div class="line"></div>
        <label for="size">背景颜色：</label><input id="color" type="color" v-model='showCoord.background'><input type="text" v-model="showCoord.background">
        
        <!-- 按钮 -->
        <div class="line"></div>
        <!-- <button @click="sure">确定</button> -->
        <button @click="del">删除</button>
        <button @click="delAll">删除全部</button>
      </div>
      
      <div class="info clip">
        <h3>剪辑工具</h3>
        <div class="box">
          <button @click="setStartTime">设置开头时间</button>
          <label for="clipStartTime">片头开始时间(s)：</label><input id="clipStartTime" type="number" v-model='clipStartTime'>
        </div>
        <div class="box">
          <button @click="setEndTime">设置结束时间</button>
          <label for="clipEndTime">片头开始时间(s)：</label><input id="clipEndTime" type="number" v-model='clipEndTime'>
        </div>
      </div>
       
    </div>


   
    
    
  </div>
</template>

<script>
// import common from "../../assets/js/common"
import progressbar from "./progressbar"
export default {
  name: 'drag',
  data () {
    return {
      // 播放按钮1：play 2：pause
      playIcon: 1,
      duration : 0,
      currentTime: 0,
      vidCurrentTime: 0,
      showCoord: '',
      // 当前显示字幕下标
      showAllIndex: -1,
      // 共几条字幕
      showAllTotal: 0,
      clipStartTime: 0,
      clipStartLength: '0%',
      clipEndTime: 10000,
      clipEndLength: '0%',
      coord:[],
      // 预加载进度条
      progressPreload: '0',
      // 播放进度
      percent: 0,
      // 预加载
      preload: '0',
      defaultXY: {
        x: 30,
        y: 30
      } 
    }
  },
  components: {
    'progress-bar': progressbar
  },
  methods: {
    
    setProgress (percent) {
      // 根据子组件传过来的百分比设置播放进度
      this.$refs.video.currentTime = this.$refs.video.duration * percent/100
    },
    play (){
      // console.log('play');
      this.playIcon = 2
    },
    pause () {
      // console.log('pause');
      this.playIcon = 1
    },
    canplay () {
      this.duration = this.$refs.video.duration
    },
    playBtn () {
      if (this.playIcon === 1) {
        this.$refs.video.play()
      } else {
        this.$refs.video.pause()
      }
    },
    playing (){
      // console.log('playing');
      
    },
    preloadFn () {
      let end = 0
      try {
        end = this.$refs.video.buffered.end(0) || 0
      } catch (e) {
      }
      return end
    },
    timeupdate (){
      const video = this.$refs.video
      let vidCurrentTime = parseFloat(this.$refs.video.currentTime)
      let coord = this.coord
      
      if ( this.clipStartTime > 0 && video.currentTime < this.clipStartTime) {
        video.currentTime = this.clipStartTime
      }
      if ( video.currentTime > this.clipEndTime) {
        video.currentTime = this.clipEndTime
        video.pause()
      }
      for (let i = 0,len = coord.length; i < len; i++) {
        if (vidCurrentTime >= coord[i].vidCurrentTime && vidCurrentTime <= coord[i].vidCurrentTime + parseFloat(coord[i].time)) {
          coord[i].show = true
        } else {
          coord[i].show = false
        }
      }
      this.percent = video.currentTime / video.duration * 100 || 0
      this.currentTime = video.currentTime
    },
    add () {
      this.$refs.video.pause()
      this.showAllTotal++
      this.showAllIndex = this.showAllTotal - 1
      
      this.showCoord = {
        val: '',
        x: this.defaultXY.x,
        y: this.defaultXY.y,
        size: 24,
        color: '#00000',
        background: 'rgba(0,0,0,0)',
        fontFamily: 'STFangsong',
        time: 3,
        vidCurrentTime: this.$refs.video.currentTime,
        bold: false,
        oblique: false,
        decoration: false,
        show: true
      }
      this.coord.push(this.showCoord)
      this.defaultXY.x += 10
      this.defaultXY.y += 10
      
      // console.log('add'+this.$refs.video.currentTime);
      // this.$refs.video.currentTime = Math.ceil(this.$refs.video.currentTime)


    },
    modify (e) {
     let odiv = e.target;        //获取目标元素

      while (!odiv.hasAttribute('data-index')) {
        if (odiv.nodeName.toLowerCase() === 'body') {
            return
        }
        odiv = odiv.parentNode
      }
      // console.log(odiv);
      let index = odiv.dataset.index
      this.showCoord = this.coord[index]
      this.showAllIndex = index
      this.$refs.video.currentTime = this.coord[index].vidCurrentTime
    },
    preview () {
      const vid = this.$refs.video
      vid.currentTime = 0
      vid.play()
      console.log(JSON.stringify(this.coord))
    },
    setStartTime () {
      const video = this.$refs.video
      video.pause()
      this.clipStartTime = video.currentTime
      this.clipStartLength = (video.currentTime / video.duration) * 100 + '%'
      
    },
    setEndTime () {
      const video = this.$refs.video
      video.pause()
      this.clipEndTime = video.currentTime

      this.clipEndLength = ((video.duration -video.currentTime) / video.duration) * 100 + '%'
    },
    select (e) {
      let odiv = e.target;        //获取目标元素

       while (!odiv.hasAttribute('data-index')) {
          if (odiv.nodeName.toLowerCase() === 'body') {
              return
          }
          odiv = odiv.parentNode
      }
      // console.log(odiv);
      let index = odiv.dataset.index
      this.showCoord = this.coord[index]
    },
    sure () {
      for (let i = 0,len = this.coord.length; i < len; i++) {
        this.coord[i].show = false
      }
      this.showCoord = ''
    },
    del () {
      if (confirm('确定要去删除这条字幕吗？')) {
        this.coord.splice(this.showAllIndex,1)
        this.showAllTotal--
        this.showAllIndex = -1
        this.showCoord = ''
      }
    },
    delAll () {
      if (confirm('确定要去删除全部字幕吗？')) {
        this.coord =[]
        this.showAllTotal = -1
        this.showCoord = ''
      }
      
    },
    filtertxt (val) {
      return val.replace(/\n/g,'<br />')
    },
    move(e){
      let odiv = e.target;        //获取目标元素
      let obox = document.querySelector('#father')
      
       while (!odiv.hasAttribute('data-index')) {
          if (odiv.nodeName.toLowerCase() === 'body') {
              return
          }
          odiv = odiv.parentNode
      }
      let index = odiv.dataset.index
      //算出鼠标相对元素的位置
      let disX = e.clientX - odiv.offsetLeft;
      let disY = e.clientY - odiv.offsetTop;
      document.onmousemove = (e)=>{       //鼠标按下并移动的事件
          //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
          let left = e.clientX - disX;    
          let top = e.clientY - disY;
          let boxW = obox.offsetWidth;
          let boxH = obox.offsetHeight;
          let divW = odiv.offsetWidth; //div的宽；
          let divH = odiv.offsetHeight;
          if (left < 0) {
            left = 0
          }
          if (top < 0) {
            top = 0
          }
          if (left > boxW - divW) {
            left = boxW - divW;
          }
          if (top > boxH - divH) {
            top = boxH - divH;
          }
          // console.log(left+'--'+top)
          //绑定元素位置到positionX和positionY上面
          this.coord[index].y = top;
          this.coord[index].x = left;
          
          //移动当前元素
          odiv.style.left = left + 'px';
          odiv.style.top = top + 'px';
      };
      document.onmouseup = (e) => {
          document.onmousemove = null;
          document.onmouseup = null;
      };
        
    },
    getEnd() {
      var end = 0;
      try {
        end = this.$refs.video.buffered.end(0) || 0;
      } catch (e) {}
      return end;
    },
    //预加载进度条加载
    progressPreloadLoad () {
      var length, timerPreload;

      // 获取预加载加载进度条
      timerPreload = setInterval(() => {
        if (this.getEnd() <= this.$refs.video.duration) {
          length = Math.round((this.getEnd() / this.$refs.video.duration) * 100) + "%";
          //进度条
          this.progressPreload = length;

          if (this.getEnd() == this.$refs.video.duration) {
            clearInterval(timerPreload);
          }
        }
      }, 500);
    },
    TimeTranslate (time) {
      var timeformat="",h,m,s;
      switch(true){
        case (time>=3600):
          h = parseInt(time/3600);
          m = parseInt((time-h*3600)/60)>=10?parseInt((time-h*3600)/60):"0"+parseInt((time-h*3600)/60);
          s = parseInt(time%60)>=10?parseInt(time%60):"0"+parseInt(time%60);
          timeformat = h+":"+m+":"+s;
        break
        case (time>=60||time<3600):
          m = parseInt(time/60)>=10?parseInt(time/60):"0"+parseInt(time/60);
          s =  parseInt(time%60)>=10?parseInt(time%60):"0"+parseInt(time%60);
          timeformat = m+":"+s;
        break
        case (time<60):
          s =  parseInt(time%60)>=10?parseInt(time%60):"0"+parseInt(time%60);
          timeformat = "00:"+s;
        break
      }
      return timeformat;
    }
  },
  created () {
    // this.init()cnpm
    this.progressPreloadLoad()
  }
}
</script>

<style lang="scss">
@import "../../assets/scss/reset.css";
@import "../../assets/scss/font.css";
.wrapper{
  font-family: PingFangSC-regular;
  width: 1350px;
  margin: 0 auto;
  .leftWrapper{
    width: 600px;
    float: left;
    position: relative;
    background: #000;
    #father{
      // float: left;
      position: absolute;
      top: 65px;
      display: block;
      left: 50%;
      transform: translateX(-50%); 
      // display: inline-block;
      .player{
        // width: 600px;
        // max-height: 400px;
        video{
          max-width: 600px;
          // max-height: 600px;
          // height: 100%;
          display: block;
        }
      }
      .target{
        // width: auto;
        // height: auto;
        // position: relative;
        // display: table;
          padding: 10px;
          position: absolute;
          left: 50%;
          cursor: pointer;
          user-select: none;
          // top: 30px;
          // left: 30px;
          // font-size: 30px;
          // overflow: hidden;
          // background: orange;
          border-radius: 5px;
      
      }
    }

    .vidControl{
      width: 100%;
      height: 60px;
      // background: linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,.8));
      background: #000;
      padding-top: 5px;
      
      .conWrapper{
        width: 90%;
        height: 30px;
        margin: 0 auto;
        .icon{
          width: 30px;
          height: 100%;
          float: left;
          &.play{
            background: url(../../assets/image/play.png) no-repeat;
            background-size: auto 20px;
            background-position: 0 center;
          }
          &.pause{
            background: url(../../assets/image/pause.png) no-repeat;
            background-size: auto 18px;
            background-position: 0 center;
          }
        }
        .timerWrapper{
          float: left;
          color: #fff;
          line-height: 30px;
        }
      }
      .progressWrapper{
        padding-top: 5px;
        width: 90%;
        height: 20px;
        margin: 0 auto;
        position: relative;
      }
      
    }

    
  }
  

  .controls{
    float: right;
    width: 700px;
    // clear: both;
    h3{
      font-weight: bold;
      padding: 0 0 10px 20px;
      border-bottom: 1px solid #eee;
      margin-bottom: 20px;
    }
    .info{
      width: 100%;
      border: 1px solid #eee;
      margin: 10px;
      padding: 20px 0 20px 0;
      border-radius: 5px;
      clear: both;
      // background: #fbefd45c;
      label{
        width: 110px;
        height: 30px;
        display: inline-block;
        line-height: 30px;
        text-align: right;
        &.checkbox{
          width: 50px;
        }
      }
      textarea{
        width: 200px;
        height: 30px;
        border: 1px solid #eee;
        display: inline-block;
        vertical-align: middle;
        resize: auto;
        font-size: 14px;
        line-height: 30px;
      }
      input{
        width: 100px;
        height: 30px;
        border: 1px solid #eee;
        &.checkbox{
          width: 30px;
        }
        &:disabled{
          border: none;
        }
      }
    }
    .clip{
      label{
        width: 120px;
      }
      button{
        // width: 90px;
        height: 30px;
        margin: 10px 20px;
        font-size: 14px;
        border-radius: 4px;
      }
    }
    .line{
      width: 100%;
      height: 10px;
    }
    button{
      width: 100px;
      height: 40px;
      background: #55a7d8;
      display: inline-block;
      margin: 20px;
      color: #fff;
      font-size: 18px;
      border-radius: 6px;
    }
    select{
      width: 100px;
      height: 30px;
    }
    input{
      width: 100px;
      height: 30px;
      border: 1px solid #eee;
      vertical-align: middle;
    }
  }

  .showAll{
      width: 100%;
      // float: right;
      .card{
        min-width: 70px;
        min-height: 30px;
        border-radius: 5px;
        float: left;
        background: #eee;
        margin: 0px 0 10px 20px;
        text-align: center;
        line-height: 30px;
        padding: 10px 10px;
        user-select: none;
        &.on{
          background: #ff8354;
          color: #fff;
        }
      }
    }

}
@-webkit-keyframes hide {
  0%{
    display: block
  }
  100%{
    display: none
  }
}
@keyframes hide {
  0%{
    display: block
  }
  100%{
    display: none
  }
}

</style>
