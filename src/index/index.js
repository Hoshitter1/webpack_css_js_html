// JS
import "components/js/alert";

// CSS
import "components/css/common.css";
import "./style.css";

// image
import "./img/twitter.jpg";

const btnClicked = () => {
  window.location.href = "page1.html";
};
document.querySelector(".btn").addEventListener("click", btnClicked);
