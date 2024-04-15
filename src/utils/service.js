import axios from "axios";

const service = async function (type, callback) {
  var VUE_APP;
  if (sessionStorage.getItem("API")) {
    VUE_APP = JSON.parse(sessionStorage.getItem("API"));
  } else {
    VUE_APP = await axios.get("/config/index.json");
    sessionStorage.setItem("API", JSON.stringify(VUE_APP));
  }
  const { VUE_APP_BASE_API, VUE_APP_AUTH_BASE_API } = VUE_APP;

  return callback(type === "auth" ? VUE_APP_AUTH_BASE_API : VUE_APP_BASE_API);
};

export default service;
