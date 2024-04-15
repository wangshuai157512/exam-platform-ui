import { getWaringInfo, handleWaing } from "@/api/exam/invigilate";
import { getToken } from "./auth";

function render(data) {
  let target;
  const container = document.querySelector(".g-container");
  target = container.querySelector("#g-waring");
  if (data.length) {
    if (!target) container.append((target = document.createElement("div")));
    target.setAttribute("id", "g-waring");
    target.setAttribute("class", "g-waring");

    target.innerHTML = `${data.reduce((a, { yjxx, id }) => {
      return (
        a +
        `<div class="item-waring">
          <div>${yjxx}</div>
          <button  onclick="waringRead(${Date.now()})">已读</button>
        </div>`
      );
    }, "<div class='title'>预警消息</div>")}`;
    setTimeout(() => {
      target.classList.add("g-waring-actv");
    }, 0);
    handleEvent();
  } else {
    if (target) {
      target.parentNode.removeChild(target);
      window.waringRead = null;
    }
  }
}

function handleEvent() {
  if (!window.waringRead) {
    window.waringRead = function (id) {
      handleWaing({ id }).then(() => {
        getWaring();
      });
    };
  }
}

function getWaring() {
  getToken() &&
    getWaringInfo("").then((res) => {
      const data = [
        {
          yjxx: "1111"
        },
        {
          yjxx: "2222"
        },
        {
          yjxx: "3333"
        },
        {
          yjxx: "4444"
        }
      ];
      render(data);
    });
}

export default function handleWaring() {
  setInterval(getWaring, 5000);
}
