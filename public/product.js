document.addEventListener('DOMContentLoaded', function() {
    const addProductForm = document.getElementById('addProductForm');
    const productList = document.getElementById('productList');
    const categoryIdSelect = document.getElementById('categoryId');

    function fetchProducts() {
        fetch('/products')
            .then(response => response.json())
            .then(products => {
                productList.innerHTML = ''; 
                products.forEach(product => {
                    const li = document.createElement('li');
                    li.textContent = `${product.id}: ${product.productName} - ${product.categoryName} (Category ID: ${product.categoryId})`;
                    productList.appendChild(li);
                });
            })
            .catch(error => console.error('Error fetching products:', error));
    }

    function populateCategoriesDropdown() {
        fetch('/categories')
            .then(response => response.json())
            .then(categories => {
                categories.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.id;
                    option.textContent = category.name;
                    categoryIdSelect.appendChild(option);
                });
            })
            .catch(error => console.error('Error fetching categories:', error));
    }

    addProductForm.addEventListener('submit', function(event) {
        event.preventDefault(); 
        const productName = addProductForm.productName.value;
        const categoryId = addProductForm.categoryId.value;

        fetch('/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: productName, categoryId: categoryId })
        })
        .then(response => {
            if (response.ok) {
                fetchProducts(); 
                addProductForm.reset(); 
            } else {
                console.error('Error adding product:', response.statusText);
            }
        })
        .catch(error => console.error('Error adding product:', error));
    });

    const deleteProductForm = document.getElementById('deleteProductForm');

    deleteProductForm.addEventListener('submit', function(event) {
        event.preventDefault(); 
        const productIdToDelete = deleteProductForm.productIdToDelete.value;

        fetch(`/products/${productIdToDelete}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                fetchProducts(); 
                deleteProductForm.reset(); 
            } else {
                console.error('Error deleting product:', response.statusText);
            }
        })
        .catch(error => console.error('Error deleting product:', error));
    });

    

function fetchProducts(pageNumber = 1, pageSize = 10) {
    fetch(`/products?page=${pageNumber}&pageSize=${pageSize}`)
        .then(response => response.json())
        .then(products => {
            productList.innerHTML = ''; 
            products.forEach(product => {
                const li = document.createElement('li');
                li.textContent = `ProductId: ${product.ProductId}, ProductName: ${product.ProductName}, CategoryName: ${product.CategoryName}, CategoryId: ${product.CategoryId}`;
                productList.appendChild(li);
            });
        })
        .catch(error => console.error('Error fetching products:', error));
}


fetchProducts(1,10);



    fetchProducts();
    populateCategoriesDropdown();
});
