<template>
  <div :class="[{ active: swch }]" class="container">
    <nav-top
      @swch="handleSwch"
      @review="handleSwitchMap"
      @loadMap="handleLoadMap"
      @trackCar="handleTrackCar"
      @checkedChange="handleCheckedChange"
    />
    <div
      :style="{
        position: 'relative',
        height: setMapHeight()
      }"
    >
      <div style="width: 100%" id="map" ref="rootMap" class="map"></div>
    </div>
    <div id="geo-marker"></div>
  </div>
</template>

<script>
import NavTop from "@/views/exam/components/navtop";
import "ol/ol.css";
import { downLoadCarType } from "@/api/param/configuration";
import { Base64 } from "js-base64";
import { getMap } from "./map";
import { Car, carSocket } from "./car";
document.title = "电子地图";
const carTypeObj = {};
let carQueue = {};
let schoolIdQueue = {};
let map, tiled, context, socket, trackKey;

export default {
  name: "Map",
  components: { NavTop },
  data() {
    return {
      swch: false,
      kcxh: "",
      carType: {},
      examRoom: [],
      examCarType: []
    };
  },

  methods: {
    handleSwch(v) {
      console.log("v", v);
      this.swch = v;
    },

    setMapHeight() {
      return `${document.body.offsetHeight - 120}px`;
    },

    handleSwitchMap(index, length) {
      this.clearMapCar();
      schoolIdQueue = {};
      new Array(length).fill().forEach((item, index) => {
        tiled[index].setVisible(false);
      });
      tiled[index].setVisible(true);
    },

    handleLoadMap(value) {
      getMap(value).then(({ T, M }) => {
        map = M;
        tiled = T;
        map.on("postcompose", (event) => {
          if (context) return;
          context = event;
          this.handleCarSocketMessage(map, context);
        });
      });
    },

    clearMapCar() {
      Object.keys(carQueue).forEach((car) => {
        carQueue[car]?.carvector && map.removeLayer(carQueue[car].carvector);
      });
      carQueue = {};
    },

    handleCheckedChange(rows) {
      const { room, checkList } = rows;
      this.clearMapCar();
      this.kcxh = room;
      checkList.map(({ kcbh, ksdd, kskm, kscx, clpp }) => {
        this.carType[kscx] = true;
        carQueue[Number(kcbh)] = null;
        schoolIdQueue[ksdd + kskm] = null;
        if (!carTypeObj[kscx]) {
          downLoadCarType({ xzwjlx: "5", kscx, kcxh: room, clpp }).then(
            (res) => {
              carTypeObj[kscx] = {
                geoJson: JSON.parse(Base64.decode(res.data))
              };
            }
          );
        }
      });
    },

    handleTrackCar(v) {
      trackKey = Number(v);
      map.getView().setCenter([0, 0]);
    },

    parsProtocol(str) {
      const header = decodeURIComponent(str).split("$header,");
      const carObj = {};
      for (let i = 1; i < header.length; i++) {
        const cot = header[i].split(",");
        const cotObj = {
          cotArr: [[cot[7], cot[8], cot[10]]],
          name: cot[2], // 姓名
          carNo: Number(cot[1]), //车号
          fraction: cot[3], // 分数
          status: cot[5], // 状态
          carType: cot[0], //车型
          kc: cot[cot.length - 3].split("+")[1] + cot[cot.length - 2] //考场序号
        };
        if (carObj[cotObj.carNo])
          carObj[cotObj.carNo].cotArr = carObj[cotObj.carNo].cotArr.concat(
            cotObj.cotArr
          );
        else carObj[cotObj.carNo] = cotObj;
      }

      return carObj;
    },

    handleCarSocketMessage(map, context) {
      if (socket)
        socket.onmessage = ({ data }) => {
          const cotObj = this.parsProtocol(data);
          Object.keys(cotObj).forEach((key) => {
            const { cotArr, name, carNo, kc, carType, fraction, status } =
              cotObj[key];
            // 过滤选中车
            if (schoolIdQueue[kc] === null && this.carType[carType]) {
              if (carQueue[carNo] === null) {
                if (carTypeObj[carType])
                  carQueue[carNo] = new Car({
                    geoJson: carTypeObj[carType].geoJson,
                    map,
                    carNo,
                    context,
                    name,
                    fraction,
                    status
                  });
              }
              if (carQueue[carNo]) {
                //  考车换人后更新姓名
                carQueue[carNo].name = name;
                carQueue[carNo].status = status;
                carQueue[carNo].setLinePoint(cotArr);
              }
            }
            if (carQueue[carNo]) {
              carQueue[carNo].isTrack = carNo === trackKey;
            }
          });
        };
    }
  },
  mounted() {
    carSocket().then((res) => {
      socket = res;
    });
  }
};
</script>
<style lang="scss" scoped>
.map {
  height: 100%;
}

.container {
  margin-bottom: 0;
  transition: all 0.2s;
}

.active {
  transform: translateY(-150px);
}

/deep/.ol-attribution {
  display: none;
}

.form {
  width: 280px;
  font-size: 12px;
  margin-left: 15px;
}

.btn {
  width: 100%;
  color: white;
  border-radius: 20px;
  background-color: #1e9fff;
  text-align: center;
  padding: 3px 0;
  cursor: pointer;
  margin: 10px auto;
  display: block;
}
</style>
