import $ from 'jquery';

function displayCartCount() {
    let storedCartItems = localStorage.getItem('cartData');
    storedCartItems = JSON.parse(storedCartItems);
    let countStoredCartItems = 0;
    if (storedCartItems) {
        countStoredCartItems = storedCartItems.length;
    }
    const cartNumber = document.querySelector('.cart-number>span');
    cartNumber.textContent = countStoredCartItems;
}

function displayCartItems() {
    let output = ``;
    let totalPrice = 0;

    let storedCartItems = localStorage.getItem('cartData');
    storedCartItems = JSON.parse(storedCartItems);
    if (storedCartItems) {
        storedCartItems.forEach(cartItem => {
            output += `
                <tr>
                    <td class="border px-4 py-2 text-center flex justify-center items-center content-center">
                        <div class="flex justify-between items-center content-center w-100">
                            <img src="../${cartItem.src}" alt="" class="w-24 h-auto mr-4">
                            <p class="productPara">${cartItem.productName}</p>
                        </div>
                    </td>
                    <td class="border px-4 py-2 text-center">$${cartItem.price}</td>
                    <td class="border px-4 py-2 text-center">
                        <label>
                            <input type="number" name="quantity" min="0" max="4" step="1" value="1"
                                style="text-align: center;">
                        </label>
                    </td>
                    <td class="border px-4 py-2 text-center">
                        <button
                            class="btn_remove bg-red-400 hover:bg-red-600 px-6 py-2 cursor-pointer text-white rounded" data-id="${cartItem.id}">
                            Remove
                        </button>
                    </td>
                </tr>
            `;

            totalPrice += +cartItem.price;

        });
    }
    document.querySelector('#cartItemData').innerHTML = output;
    document.querySelector('.total_price_span').textContent = `$${totalPrice}`;
}

$(function () {
    displayCartCount();

    if (location.pathname.includes('cart.html')) {
        displayCartItems();
    }

    const btnCart = document.querySelectorAll('.btn_cart');
    btnCart.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            const productName = e.target.getAttribute('data-name');
            const price = e.target.getAttribute('data-price');
            const src = e.target.getAttribute('data-src');

            if (typeof (Storage) !== "undefined") {

                let data = {};
                let cartData = [];

                if (localStorage.getItem('cartData') && localStorage.getItem('cartData').length > 0) {
                    cartData = JSON.parse(localStorage.getItem('cartData'));
                }

                let idExists = false;
                cartData.find(cart => {
                    if (cart.id === id) {
                        idExists = true;
                    }
                });

                if (!idExists) {
                    data = { id, productName, price, src };
                    cartData.push(data);

                    const cartNumber = document.querySelector('.cart_number');

                    localStorage.setItem('cartData', JSON.stringify(cartData));
                } else {
                    alert('Product already added to the cart');
                }

                displayCartCount();

            } else {
                alert("Error: Localstorage not supported");
            }
        });
    });

    const btnRemove = document.querySelectorAll('.btn_remove');

    btnRemove.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const cartItemId = e.target.getAttribute('data-id');
            let storedCartItems = JSON.parse(localStorage.getItem('cartData'));
            let index = 0;
            let clickedItemIndex = 0;
            storedCartItems.find(cart => {
                index += 1;
                if (cart.id === cartItemId) {
                    clickedItemIndex = index;
                }

            });

            storedCartItems.splice(clickedItemIndex - 1, 1);
            localStorage.setItem('cartData', JSON.stringify(storedCartItems));
            location.reload();
            // displayCartCount();
            // displayCartItems();
        })

    });
});