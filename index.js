const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path'); 

const app = express();
const port = 3000;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Meghraj@505',
    database: 'Product'
});

connection.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL ');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.get('/',(req,res)=>{
        res.send("<h1>Welcome to  Product Management System</h1>For Category go to http://localhost:3000/Category.html & for Product please visit http://localhost:3000/product.html ");
        
        
}); 



app.get('/categories', (req, res) => {
    connection.query('SELECT * FROM categories', (err, results) => {
        if (err) {
            console.error('Error fetching categories: ' + err);
            res.status(500).send('Error fetching categories');
            return;
        }
        res.json(results);
    });
});


app.post('/categories', (req, res) => {
    const { name } = req.body;
    connection.query('INSERT INTO categories (name) VALUES (?)', [name], (err, results) => {
        if (err) {
            console.error('Error adding category: ' + err);
            res.status(500).send('Error adding category');
            return;
        }
        res.send('Category added successfully');
    });
});


app.get('/products', (req, res) => {
    const { page = 1, pageSize = 10 } = req.query;
    const offset = (page - 1) * pageSize;
    const query = `
        SELECT products.id AS ProductId, products.name AS ProductName, categories.name AS CategoryName, products.category_id AS CategoryId
        FROM products
        INNER JOIN categories ON products.category_id = categories.id
        LIMIT ?, ?
    `;
    connection.query(query, [offset, parseInt(pageSize)], (err, results) => {
        if (err) {
            console.error('Error fetching products: ' + err);
            res.status(500).send('Error fetching products');
            return;
        }
        res.json(results);
    });
});




app.post('/products', (req, res) => {
    const { name, categoryId } = req.body;
    connection.query('INSERT INTO products (name, category_id) VALUES (?, ?)', [name, categoryId], (err, results) => {
        if (err) {
            console.error('Error adding product: ' + err);
            res.status(500).send('Error adding product');
            return;
        }
        res.send('Product added successfully');
    });
});




app.delete('/categories/:categoryId', (req, res) => {
    const categoryId = req.params.categoryId;
    connection.query('DELETE FROM products WHERE category_id = ?', [categoryId], (err, results) => {
        if (err) {
            console.error('Error deleting products associated with category: ' + err);
            res.status(500).send('Error deleting products associated with category');
            return;
        }
        connection.query('DELETE FROM categories WHERE id = ?', [categoryId], (err, results) => {
            if (err) {
                console.error('Error deleting category: ' + err);
                res.status(500).send('Error deleting category');
                return;
            }
            connection.query('SET @counter = 0;');
        connection.query('UPDATE categories SET id = @counter := @counter + 1;');
        connection.query('ALTER TABLE categories AUTO_INCREMENT = 1;');
            res.send('Category and associated products deleted successfully');
        });
    });
});


app.delete('/products/:productId', (req, res) => {
    const productId = req.params.productId;
    connection.query('DELETE FROM products WHERE id = ?', [productId], (err, results) => {
        if (err) {
            console.error('Error deleting product: ' + err);
            res.status(500).send('Error deleting product');
            return;
        }
        connection.query('SET @counter = 0;');
        connection.query('UPDATE products SET id = @counter := @counter + 1;');
        connection.query('ALTER TABLE products AUTO_INCREMENT = 1;');
        res.send('Product deleted successfully');
    });
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});