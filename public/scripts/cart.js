function updateQuantity(productId, change) {
    const quantityInput = document.querySelector(`input[data-product-id="${productId}"]`);
    if (!quantityInput) {
        console.error('Quantity input not found');
        return;
    }

    let currentQuantity = parseInt(quantityInput.value, 10);
    if (isNaN(currentQuantity)) {
        console.error('Current quantity is not a number');
        return;
    }

    currentQuantity += change;
    if (currentQuantity < 1) currentQuantity = 1;

    quantityInput.value = currentQuantity;

    // Make an AJAX request to update the quantity in the cart
    fetch('/auth/cart/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId, quantity: currentQuantity })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Optionally, update the total price here
            const cartItem = document.querySelector(`.cart-item[data-product-id="${productId}"]`);
            if (!cartItem) {
                console.error('Cart item not found');
                return;
            }

            const itemTotal = cartItem.querySelector('.cart-item-total');
            const priceElement = cartItem.querySelector('.cart-item-price');
            if (!itemTotal || !priceElement) {
                console.error('Item total or price element not found');
                return;
            }

            // Extract and clean the price
            const priceText = priceElement.textContent.trim().replace('$', '');
            const price = parseFloat(priceText);
            if (isNaN(price)) {
                console.error('Price is not a number');
                return;
            }

            // Update the item total
            itemTotal.textContent = `Total: $${(price * currentQuantity).toFixed(2)}`;
            
            // Update bottom cart total
            updateCartTotal();
        } else {
            alert('Failed to update quantity');
        }
    })
    .catch(error => {
        console.error('Error updating quantity:', error);
    });
}


function deleteItem(productId) {
    // Make an AJAX request to remove the item from the cart
    fetch('/auth/cart/delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Remove the item from the DOM
            document.querySelector(`.cart-item[data-product-id="${productId}"]`).remove();
            // Update bottom cart total
            updateCartTotal();
        } else {
            alert('Failed to remove item');
        }
    });
}

function updateCartTotal() {
    let total = 0;
    document.querySelectorAll('.cart-item').forEach(item => {
        const price = parseFloat(item.querySelector('.cart-item-price').textContent.replace('$', ''));
        const quantity = parseInt(item.querySelector('.quantity-input').value, 10);
        total += price * quantity;
    });
    document.getElementById('bottom-cart-total').textContent = `Total: $${total.toFixed(2)}`;
}
