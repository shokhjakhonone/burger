import { cardItems } from "./render.js";

const tabBtn = document.querySelectorAll(".tab__btn");
const cardTitle = document.querySelector(".card__title");

tabBtn.forEach((item) => {

    item.addEventListener("click", async (event) => {
        let target = event.target;


        tabBtn.forEach((item) => {
            item.classList.remove("btn-active");
        })

        target.classList.add("btn-active");
        cardTitle.textContent = target.innerText;

        cardItems.forEach((item) => {
            item.classList.remove("card-active")

            if (item.id === target.dataset.itemBtn) {
                item.classList.add("card-active");
            }
        })
    });


});