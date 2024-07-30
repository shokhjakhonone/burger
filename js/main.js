
// кнопки для добавление товаров в корзину

export const basketItems = document.querySelector(".basket__items");
const basketCurrent = document.querySelector(".basket__current");

// добавление товара в корзину
document.addEventListener("click", function (event) {

    if (event.target.hasAttribute("data-card")) {
        let card = event.target.closest(".card__item");

        // собираем данные для шаблона
        let productInfo = {
            id: card.dataset.id,
            imgSrc: card.querySelector(".card__img").getAttribute("src"),
            price: card.querySelector(".card__price").innerText,
            name: card.querySelector(".card__name").innerText,
            weight: card.querySelector(".card__weight").innerText
        }

        // проверка товара в корзине
        const itemInBasket = basketItems.querySelector(`[data-id="${productInfo.id}"]`);

        if (itemInBasket) {
            const counterElement = itemInBasket.querySelector(`[data-counter]`);
            counterElement.innerText = parseInt(counterElement.innerText) + 1;

            totalPrice();
            currentCounter();

        } else {

            // добавление шаблона для корзины
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
                <span class="basket__item-current" data-counter>1</span>
                <button class="basket__button" data-action="add">+</button>
            </div>
         </div> `

            basketItems.insertAdjacentHTML("beforeend", cardItemHTML);

            totalPrice();
            currentCounter();
        }
    }


    basketStatus();


})

// увеличить или уменьшить количество товаров в корзине 

basketItems.addEventListener("click", function (event) {

    if (!event.target.closest(".basket__button")) return;

    const basketButtons = event.target.closest(".basket__item-buttons");
    const counter = basketButtons.querySelector("[data-counter]");


    if (event.target.dataset.action == "add") {

        counter.innerText = ++counter.innerText;
        totalPrice();
    }

    if (event.target.dataset.action == "remove") {

        counter.innerText = --counter.innerText;
        totalPrice();

        if (counter.innerText < 1) {
            let counterParent = counter.closest("[data-id]");
            counterParent.remove();
        }
    }

    currentCounter();
})

// Удаляем текст корзина пусто и показываем форму;

export function basketStatus() {

    const empty = document.querySelector(".basket__empty");
    const basketForm = document.querySelector(".basket__form");

    if (basketItems.children.length > 1) {
        empty.classList.add("disabled");
        basketForm.classList.add("active");

    } else {
        empty.classList.remove("disabled");
        basketForm.classList.remove("active");
    }
}

// добавляем отображение (счетчик) количество товаров в корзине
export function currentCounter() {

    let counterAll = document.querySelectorAll("[data-counter]");
    let count = 0;

    counterAll.forEach((item) => {
        count = count + parseInt(item.innerText);
    })

    basketCurrent.innerText = count;
}

// Итоговая сумма товаров в корзине

export function totalPrice() {
    let itemAll = document.querySelectorAll(".basket__item");

    let sum = 0;

    itemAll.forEach((item) => {
        let priceItem = item.querySelector(".basket__item-price").innerText;
        let currentItem = item.querySelector(".basket__item-current").innerText;

        sum = sum + parseInt(priceItem) * parseInt(currentItem);
    })
    let total = document.querySelector(".total__price");

    total.innerText = `${sum} ₽`

}


