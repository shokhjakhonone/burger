
import { basketItems } from "./main.js";
import { totalPrice } from "./main.js";
import { basketStatus } from "./main.js";
import { currentCounter } from "./main.js";

const modal = document.querySelector(".modal");
const modalMain = document.querySelector(".modal__main");


renderProductInfo()

async function renderProductInfo() {

    const response = await fetch("./js/products.json");
    const data = await response.json();
    openModal(data);

    return data;

}

// открываем модальное окно и добавляем туда данные
function openModal(data) {

    document.addEventListener("click", (event) => {

        let target = event.target;

        if (target.closest(".card__add")) return;

        if (target.closest(".card__item")) {

            let cardItem = target.closest(".card__item");

            // Создаем объект для шаблона
            let modalInfo = {
                id: cardItem.dataset.id,
                title: cardItem.querySelector(".card__name").innerText,
                imgSrc: cardItem.querySelector(".card__img").getAttribute("src"),
                price: cardItem.querySelector(".card__price").innerText,
                weight: cardItem.querySelector(".card__weight").innerText
            }

            // перебираем data и извлекаем и неё необходимую инфу
            data.forEach((productItem) => {

                productItem.forEach((item) => {

                    if (modalInfo.id == item.id) {
                        modalInfo.composition = item.composition.replace(/\n,/g, '\n');
                    }

                    if (modalInfo.id == item.id) {
                        modalInfo.description = item.description;
                    }
                })

            })

            // верстка шаблона
            let modalHTML = `<article class="detail" data-id="${modalInfo.id}">
                <h2 class="detail__title">${modalInfo.title}</h2>

                <div class="detail__descr">
                    <img class="detail__img" src="${modalInfo.imgSrc}" alt="burger">

                    <div class="detail__info">
                        <p class="info__text">${modalInfo.description}
                        </p>
                        <div class="info__composition">
                            <h3 class="composition__title">Состав:</h3>
                            <ul class="composition__list">
                             <li class="comosition__item">${modalInfo.composition.replace(/,/g, '<li class="comosition__item">')}</li>
                            </ul>

                            <div class="composition__weight">${modalInfo.weight}</div>
                        </div>
                    </div>
                </div>

                <div class="detail__form">
                    <div class="detail__operations">
                        <button class="detal__add-button">Добавить</button>

                        <div class="detail__form-buttons btn__manage">
                            <button class="detail__form-btn" data-detail-action="remove">-</button>
                            <span class="detail__item-current" data-product-counter>1</span>
                            <button class="detail__form-btn" data-detail-action="add">+</button>
                        </div>
                    </div>

                    <p class="detail__price" data-price="${modalInfo.price}">${modalInfo.price}</p>
                </div>
            </article>`

            // вставка шаблона в HTML
            modalMain.insertAdjacentHTML("afterbegin", modalHTML);
            modal.classList.add("modal-active");
        }

    })

    
}

// увеличить или уменьшить количество товаров  и подсчём общую сумму
document.addEventListener("click", (event) => {

    let sum = 0;

    // увеличиваем количество товара
    if (event.target.dataset.detailAction === "add") {

        let detail = event.target.closest(".detail");

        // Берём counter и price
        let productCountElement = detail.querySelector("[data-product-counter]");
        let productTotalElement = detail.querySelector(".detail__price");

        // переобразуем их в число
        let productCount = parseInt(productCountElement.innerText);
        let productPrice = parseInt(productTotalElement.dataset.price);

        // увеличиваем count (счётчик) 
        productCount += 1;
        productCountElement.innerText = productCount;

        // вычисляем общую стоимость
        sum = productPrice * productCount;
        productTotalElement.innerText = `${sum}₽`;
    }

    // уменьшаем количество товара
    if (event.target.dataset.detailAction === "remove") {

        let detail = event.target.closest(".detail");

        // Берём counter и price из detail который является родителем 
        let productCountElement = detail.querySelector("[data-product-counter]");
        let productTotalElement = detail.querySelector(".detail__price");

        // переобразуем их в число
        let productCount = parseInt(productCountElement.innerText);
        let productPrice = parseInt(productTotalElement.dataset.price);


        if (productCount > 1) {

            console.log(productCount);

            productCount = productCount - 1;
            productCountElement.innerText = productCount;

            // вычисляем общую стоимость
            sum = productPrice * productCount;
            productTotalElement.innerText = `${sum}₽`;
        } else {

            // Закрываем модальное окно если количество продукта равна 0
            modal.classList.remove("modal-active");
            modalMain.firstElementChild.remove();
        }

    }

    // Работаем с кнопкой добавить
    if (event.target.closest(".detal__add-button")) {

        let detail = event.target.closest(".detail");
        let currentPrice = detail.querySelector(".detail__price");


        let productInfo = {
            id: detail.dataset.id,
            imgSrc: detail.querySelector(".detail__img").getAttribute("src"),
            price: currentPrice.dataset.price,
            name: detail.querySelector(".detail__title").innerText,
            weight: detail.querySelector(".composition__weight").innerText,
            count: detail.querySelector("[data-product-counter]").innerText,
        }


        // проверка товара в корзине
        const itemInBasket = basketItems.querySelector(`[data-id="${productInfo.id}"]`);

        // если есть товар в корзине то увеличиваем счётчик корзины
        if (itemInBasket) {
            const counterElement = itemInBasket.querySelector(`[data-counter]`);
            counterElement.innerText = parseInt(counterElement.innerText) + parseInt(productInfo.count);

            currentCounter();
            totalPrice();
            modal.classList.remove("modal-active");
            modalMain.firstElementChild.remove();


            // если нет, то добавляем товар в корзину
        } else {

            // Шаблон для корзины
            let cardItemHTML = `<div class="basket__item" data-id=${productInfo.id}>
            <div class="basket__item-info">
                <img class="basket__item-img" src="${productInfo.imgSrc}"
                    alt="burger">
                <div>
                    <p class="basket__item-name">${productInfo.name}</p>
                    <p class="basket__item-gram">${productInfo.weight}</p>
                    <p class="basket__item-price">${productInfo.price}</p>
                </div>
            </div>

            <div class="basket__item-buttons btn__manage">
                <button class="basket__button" data-action="remove">-</button>
                <span class="basket__item-current" data-counter>${productInfo.count}</span>
                <button class="basket__button" data-action="add">+</button>
            </div>
         </div> `

            
            basketItems.insertAdjacentHTML("beforeend", cardItemHTML);

            currentCounter();
            totalPrice();
            modal.classList.remove("modal-active");
            modalMain.firstElementChild.remove();
        }


    }

    basketStatus();

});



// закрываем модальное окно
modal.addEventListener("click", (event) => {

    // let target = event.target;

    // if (target.closest(".detail")) return;

    // modal.classList.remove("modal-active");
    // modalMain.firstElementChild.remove();

    // if (target.closest(".modal__close")) {

    //     modal.classList.remove("modal-active");
    //     if (modalMain.firstElementChild.closest(".detail")) {
    //         modalMain.firstElementChild.remove();
    //     }

    // }
})



