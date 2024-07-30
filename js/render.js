let cardInner = document.querySelector(".cards__inner");

// Массив для контента
let contentsTab = [];

// массив для карточек там хранится состав продуктов
let itemInfo = [];


getProducts();

async function getProducts() {
    const response = await fetch("./js/products.json");
    const data = await response.json();

    renderProducts(data);
    return data;
}


export function renderProducts(data) {

    // перебираем json
    data.forEach((item) => {

        let cardItems = document.createElement("div");

        cardItems.id = `${item[0].title}`

        cardItems.classList.add("card__items");
        if (cardItems.id == "burgers") {
            cardItems.classList.add("card-active")
        }

        cardInner.insertAdjacentElement("beforeend", cardItems);

        contentsTab.push(cardItems);

        item.forEach((card) => {

            let itemCard = document.createElement("div");
            itemCard.classList.add("card__item");
            itemCard.dataset.id = `${card.id}`;

            itemCard.innerHTML = `<img class="card__img" src="images/${card.imgSrc}" alt="${card.name}">
                                        <p class="card__price">${card.price}</p>
                                        <p class="card__name">${card.name}</p>
                                        <p class="card__weight">${card.weight}</p>
                                <button data-card class="card__add add-item">Добавить</button>`


            cardItems.insertAdjacentElement("beforeend", itemCard);

            itemInfo.push(card);

        })
    })

    return itemInfo;
}

export const cardItems = contentsTab; //отправка табов в файлов tabs.js
