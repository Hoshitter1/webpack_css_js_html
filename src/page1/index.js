import "components/alert";

const goTopClicked = () => {
  window.location.href = "index.html";
};
document.querySelector("#go-top").addEventListener("click", goTopClicked);
