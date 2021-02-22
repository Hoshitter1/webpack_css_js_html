import "components/alert";

const btnClicked = () => {
  window.location.href = "page1.html";
};
document.querySelector(".btn").addEventListener("click", btnClicked);
