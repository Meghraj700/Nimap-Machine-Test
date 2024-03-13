document.addEventListener('DOMContentLoaded', function() {
    const addCategoryForm = document.getElementById('addCategoryForm');
    const categoryList = document.getElementById('categoryList');

    function fetchCategories() {
        fetch('/categories')
            .then(response => response.json())
            .then(categories => {
                categoryList.innerHTML = ''; 
                categories.forEach(category => {
                    const li = document.createElement('li');
                    li.textContent = `${category.id}: ${category.name}`;
                    categoryList.appendChild(li);
                });
            })
            .catch(error => console.error('Error fetching categories:', error));
    }

    addCategoryForm.addEventListener('submit', function(event) {
        event.preventDefault(); 
        const categoryName = addCategoryForm.categoryName.value;

        fetch('/categories', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: categoryName })
        })
        .then(response => {
            if (response.ok) {
                fetchCategories(); 
                addCategoryForm.reset(); 
            } else {
                console.error('Error adding category:', response.statusText);
            }
        })
        .catch(error => console.error('Error adding category:', error));
    });

    fetchCategories();

    const deleteCategoryForm = document.getElementById('deleteCategoryForm');

    deleteCategoryForm.addEventListener('submit', function(event) {
        event.preventDefault(); 
        const categoryIdToDelete = deleteCategoryForm.categoryIdToDelete.value;

        fetch(`/categories/${categoryIdToDelete}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                fetchCategories(); 
                deleteCategoryForm.reset(); 
            } else {
                console.error('Error deleting category:', response.statusText);
            }
        })
        .catch(error => console.error('Error deleting category:', error));
    });

});
