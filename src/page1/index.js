// JS
import "components/js/alert";

// CSS
import "components/css/common.css";
import "./style.css";

const goTopClicked = () => {
  window.location.href = "index.html";
};
document.querySelector("#go-top").addEventListener("click", goTopClicked);
