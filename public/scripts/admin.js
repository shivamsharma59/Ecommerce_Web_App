document.addEventListener('DOMContentLoaded', () => {
    const addProductForm = document.getElementById('add-product-form');
    const productListContainer = document.getElementById('product-list-container');


    // Handle adding product
    addProductForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(addProductForm);
        const data = {
            productName: formData.get('productName'),
            price: parseFloat(formData.get('price')),
            imageUrl: formData.get('imageUrl')
        };

        fetch('/auth/admin/products/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Product added successfully!');
                    location.reload(); // Reload to update the product list
                } else {
                    alert('Error adding product');
                }
            })
            .catch(error => console.error('Error:', error));
    });

    // handle delete product 
    window.deleteProduct = (productId) => {
        fetch(`/auth/admin/products/delete/${productId}`, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Product deleted successfully!');
                    let product = document.querySelector(`[data-id="${productId}"]`);
                    product.remove(); // Remove product from the page
                } else {
                    alert('Error deleting product');
                }
            })
            .catch(error => console.error('Error:', error));
    }
});