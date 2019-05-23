<template>
  <div class="wrapper">
    <div id="father" >
      <div class="player">
        <video class='video' controls ref='video' @play='play' @playing='playing' @timeupdate='timeupdate' webkit-playsinline='true' playsinline='playsinline'  preload='preload' src="http://gslb.ins.miaopai.com/stream/ins_7YueafkIaYVS0oNwjBvvUmCLzv4D9ONt.mp4"></video>
      </div>
      <div class="target" @mousedown="move" @dblclick="modify" v-for="(item,index) in coord" v-if="item.show" :data-index="index" :style="{'left': item.x+'px', 'top': item.y+'px', fontSize: item.size+'px', color: item.color, background: item.background, fontFamily: item.fontFamily}" v-html="filtertxt(item.val)"></div>
      <!-- <div class="target" @mousedown="drag" v-for="(item,index) in coord" :data-index="index" :style="{'left': 30+'px', 'top': 40+'px'}">第三方决胜巅峰第</div> -->
    </div>

    <div class="showAll">
      <div class="card clearfix" v-for="(item,index) in coord" :key="index">{{item.val}}</div>
    </div>

    <div class="controls">
      <button @click="add">添加字幕</button>
      <button @click="preview">预览</button>
      <div class="info" v-if="showCoord">
        <label for="val">字幕：</label><textarea type="text" placeholder="输入字幕..." v-model="showCoord.val" id='val'></textarea>
        <!-- 坐标 -->
        <div class="line"></div>
        <label for="x">x值(px)：</label><input type="number" v-model="showCoord.x" id='x'>
        <label for="y">y值(px)：</label><input type="number" v-model="showCoord.y" id='y'>
        <label for="time">停留时间(s)：</label><input type="number" v-model="showCoord.time" id='time'>
        <label for="vidCurrentTime">添加时间(s)：</label><input type="number" disabled v-model="showCoord.vidCurrentTime" id='vidCurrentTime'>

        <!-- 字体 -->
        <div class="line"></div>
        <label for="select">字体：</label>
        <select id="select" v-model="showCoord.fontFamily">
          <option value="STFangsong">华文宋体</option>
          <option value="PingFangSc-regular">苹方</option>
        </select>   

        <label for="color">字体颜色：</label><input id="color" type="color" v-model='showCoord.color'><input type="text" v-model="showCoord.color">

        <label for="size">字体大小(px)：</label><input id="zise" type="number" v-model="showCoord.size">

        <!-- 背景 -->
        <div class="line"></div>
        <label for="size">背景颜色：</label><input id="color" type="color" v-model='showCoord.background'><input type="text" v-model="showCoord.background">

        <button @click="sure">确定</button>
      </div>
    </div>


    
  </div>
</template>

<script>
import common from "../../assets/js/common"
export default {
  name: 'drag',
  data () {
    return {
      vidCurrentTime: 0,
      showCoord: '',
      coord:[]     
    }
  },
  filters: {
    textarea (val) {
    }
  },
  methods: {
    play (){
      console.log('play');
      
    },
    playing (){
      console.log('playing');
      
    },
    timeupdate (){
      // console.log('timeupdate'+this.$refs.video.currentTime);
      let vidCurrentTime = parseFloat(this.$refs.video.currentTime)
      let coord = this.coord
      for (let i = 0,len = coord.length; i < len; i++) {
        // console.log(vidCurrentTime);
        console.log( vidCurrentTime < coord[i].vidCurrentTime + coord[i].time);
        
        if (vidCurrentTime > coord[i].vidCurrentTime && vidCurrentTime < coord[i].vidCurrentTime + coord[i].time) {
          coord[i].show = true
        } else {
          coord[i].show = false
        }
      }
    },
    add () {
      this.$refs.video.pause()
      this.showCoord = {
        val: '',
        x: 30,
        y: 30,
        size: 24,
        color: '#00000',
        background: '#ffa500',
        fontFamily: 'STFangsong',
        time: 3,
        vidCurrentTime: this.$refs.video.currentTime,
        show: true
      }
      this.coord.push(this.showCoord)
      console.log('add'+this.$refs.video.currentTime);
      // this.vidCurrentTime = this.$refs.video.currentTime


    },
    modify (e) {
      let odiv = e.target;        //获取目标元素

       while (!odiv.hasAttribute('data-index')) {
          if (odiv.nodeName.toLowerCase() === 'body') {
              return
          }
          odiv = odiv.parentNode
      }
      console.log(odiv);
      let index = odiv.dataset.index
      this.showCoord = this.coord[index]
    },
    preview () {
      const vid = this.$refs.video
      vid.currentTime = 0
      vid.play()
    },
    sure () {
      for (let i = 0,len = this.coord.length; i < len; i++) {
        this.coord[i].show = false
      }
    },
    filtertxt (val) {
      return val.replace(/\n/g,'<br />')
    },
    move(e){
      console.log(this.coord[0].val.replace('\n','<br />'));
      let odiv = e.target;        //获取目标元素
      let obox = document.querySelector('#father')
      console.log(obox);
      
       while (!odiv.hasAttribute('data-index')) {
          if (odiv.nodeName.toLowerCase() === 'body') {
              return
          }
          odiv = odiv.parentNode
      }
      let index = odiv.dataset.index
      console.log(index);
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
          console.log(left+'--'+top)
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
        
    }
  },
  created () {
    
  },
  watch:{
    coord (newVal,oldVal) {
      console.log(newVal);
      
    }
  }
}
</script>

<style lang="scss">
@import "../../assets/scss/reset.css";

.wrapper{
  #father{
    position: relative;
    display: inline-block;
    .player{
      width: 1000px;
      video{
        width: 100%;
        height: 100%;
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
        cursor: pointer;
        // top: 30px;
        // left: 30px;
        // font-size: 30px;
        // overflow: hidden;
        // background: orange;
        border-radius: 8px;
    
    }
  }

  .showAll{
    width: 100%;
    .card{
      min-width: 70px;
      height: 50px;
      border-radius: 5px;
      float: left;
      background: #eee;
      margin: 20px 0 0 20px;
      text-align: center;
      line-height: 50px;
      padding: 0 10px;
    }
  }

  .controls{
    width: 100%;
    clear: both;
    .info{
      width: 1000px;
      label{
        width: 100px;
        height: 30px;
        display: inline-block;
        line-height: 30px;
        text-align: right;
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
        border: 1px solid #eee
      }
    }
    .line{
      width: 1000px;
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
