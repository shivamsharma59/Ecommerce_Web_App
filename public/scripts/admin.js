document.addEventListener('DOMContentLoaded', () => {
    const addProductForm = document.getElementById('add-product-form');
    const productListContainer = document.getElementById('product-list-container');

    // Handle adding product
    addProductForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(addProductForm);

        try {
            const response = await fetch('/auth/admin/products/add', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                alert('Product added successfully!');
                location.reload(); // Reload to update the product list
            } else {
                alert('Error adding product: ' + (data.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    // Handle delete product
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
