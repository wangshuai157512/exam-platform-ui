import { sysConfigInfo } from "@/api/exam/parameter/setting";

export async function getMap(mapList) {
  const URL = await sysConfigInfo("GeoServerURL");
  const ANGLE = await sysConfigInfo("GeoServerANGLE");

  return new Promise(function (resolve) {
    const tiled = mapList.map((map) => {
      return new ol.layer.Tile({
        source: new ol.source.TileWMS({
          url: `${URL.data.configValue}/jaya${map.value}/wms`,
          params: {
            REQUEST: "GetMap",
            FORMAT: "image/jpeg",
            tiled: true,
            VERSION: "1.1.1",
            SERVICE: "WMS",
            STYLES: "",
            LAYERS: `jaya${map.value}:jaya${map.value}`,
            exceptions: "application/vnd.ogc.se_inimage"
          }
        }),
        visible: false
      });
    });

    const rotationInDegrees = Number(ANGLE.data.configValue);
    const rotation = (rotationInDegrees * Math.PI) / 180;

    const map = new ol.Map({
      layers: tiled,
      target: "map",
      view: new ol.View({
        rotation,
        projection: "EPSG:3857"
      }),
      interactions: ol.interaction.defaults({
        doubleClickZoom: false // 取消双击放大功能交互
        // mouseWheelZoom: false, // 取消滚动鼠标中间的滑轮交互
        // shiftDragZoom: false // 取消shift+wheel左键拖动交互
      })
    });

    // map.on("dblclick", function (e) {
    //   console.log(e)
    //   const feature = map.forEachFeatureAtPixel(e.pixel, (feature) => feature);

    //   // console.log(map.getLayersBy("name", "7777"));
    //   console.log(feature)
    //   // if (feature) {
    //   //   console.log(feature.getGeometry().getCoordinates());
    //   // }
    // });

    // 侧边滑块
    map.addControl(new ol.control.ZoomSlider());

    // 地图自适应位置
    map
      .getView()
      .fit(
        [
          -63.69411368624017, -59.36999658123186, 56.52581531956897,
          83.53006868957185
        ],
        map.getSize()
      );

    resolve({ T: tiled, M: map });
  });
}
