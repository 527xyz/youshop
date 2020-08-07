<!--  -->
<template>
  <div class="home_welcome">
    <el-card>
      <div id="echarts_box"></div>
    </el-card>
  </div>
</template>
<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import { MP } from "../map";
export default {
  //import引入的组件需要注入到对象中才能使用
  components: {
    MP,
  },
  data() {
    //这里存放数据
    return {
      ak: "5Bt6EGsL3xL973iYK9FmwWDCmKdpLVqC",
    };
  },
  methods: {
    showEcharts: function () {
      var map = new BMapGL.Map("echarts_box"); // 创建Map实例
      map.centerAndZoom(new BMapGL.Point(116.307527,40.055577), 20); // 初始化地图,设置中心点坐标和地图级别
      map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
      map.setTilt(50);

    var keyFrames = [
      {
          center: new BMapGL.Point(116.307527,40.055577),
          zoom:20,
          tilt: 50,
          heading: 0,
          percentage: 0
      },
      {
          center: new BMapGL.Point(116.307631,40.055391),
          zoom: 21,
          tilt: 70,
          heading: 0,
          percentage: 0.1
      },
      {
          center: new BMapGL.Point(116.306858,40.057887),
          zoom:21,
          tilt: 70,
          heading: 0,
          percentage: 0.25
      },
      {
          center: new BMapGL.Point(116.306858,40.057887),
          zoom:21,
          tilt: 70,
          heading: -90,
          percentage: 0.35
      },
      {
          center: new BMapGL.Point(116.307904,40.058118),
          zoom: 21,
          tilt: 70,
          heading: -90,
          percentage: 0.45
      },
      {
          center: new BMapGL.Point(116.307904,40.058118),
          zoom: 21,
          tilt: 70,
          heading: -180,
          percentage: 0.55
      },
      {
          center: new BMapGL.Point(116.308902,40.055954),
          zoom:21,
          tilt: 70,
          heading: -180,
          percentage: 0.75
      },
      {
          center: new BMapGL.Point(116.308902,40.055954),
          zoom:21,
          tilt: 70,
          heading: -270,
          percentage: 0.85
      },
      {
          center: new BMapGL.Point(116.307779,40.055754),
          zoom:21,
          tilt: 70,
          heading: -360,
          percentage: 0.95
      },
      {
          center: new BMapGL.Point(116.307527,40.055577),
          zoom:20,
          tilt: 50,
          heading: -360,
          percentage: 1
      },
    ];

      var opts = {
        duration: 10000,
        delay: 3000,
        interation: 1,
      };

      // 声明动画对象
      var animation = new BMapGL.ViewAnimation(keyFrames, opts);
      // 开始播放动画
      setTimeout(()=>{
        map.startViewAnimation(animation)
      }, 100);
    },
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    var that = this;
    this.$nextTick(function () {
      let that = this;
      MP(that.ak).then((BMap) => {
        // 百度地图API功能
        this.showEcharts();
      });
    });
  },
};
</script>
<style  scoped>
.el-card{
  height: 100%;
  margin-top: 0;
}
#echarts_box {
  width: 100%;
  height: 70vh;
}
</style>