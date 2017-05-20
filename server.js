/**
 * Created by hackbansu on 10/5/17.
 */
const express = require('express');
const db = require('./database/JS/database')
const path = require('path');
const bodyParser = require('body-parser')

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.get('/', function (req, res) {
    res.send('working chemist');
})

//req.query = {p_name}
app.get('/getProductDetails', function (req, res) {
    let p_name = req.query.p_name;
    if(!p_name){
        res.send('invalid p_name!');
        return;
    }

    db.productsTable.getProductsDetails({p_name: p_name}, ['*'], function (result, fields) {
        // console.log(result);
        res.send(result);
    })
});

//req.query = {name}
app.get('/searchProducts', function (req, res) {
    let name = req.query.name;
    if(!name){
        res.send('invalid name!');
        return;
    }

    db.productsTable.searchProducts({p_name: name.split(' ')}, ['*'], function (result, fields) {
        // console.log(result);
        res.send(result);
    })
});


//req.query = {p_name}
app.get('/addProductToCart', function (req, res) {
    let p_name = req.query.p_name;
    if(!p_name){
        res.send('invalid p_name!');
        return;
    }

    db.productsTable.decrementProductsQuantity({p_name: p_name}, function (result, fields) {
        // console.log(result);
        if(result.changedRows === 1){
            db.productsTable.getProductsDetails({p_name: p_name}, ['*'], function (result, fields) {
                // console.log(result);
                res.send(result);
            })
        }
        else{
            res.json("error")
        }
    })
});

//req.query = {p_name, quantity}
app.get('/removeProductFromCart', function (req, res) {
    let p_name = req.query.p_name;
    let quantity = parseInt(req.query.quantity);
    if(!p_name || !quantity){
        res.send('invalid p_name!');
        return;
    }

    db.productsTable.incrementProductsQuantity({p_name: p_name, quantity: quantity}, function (result, fields) {
        // console.log(result);
        if(result.changedRows === 1){
            res.json(true);
        }
        else{
            res.json(false);
        }
    })
})

//req.body={}
app.post('/checkout', function (req, res) {
    res.send('proceding to payment...');
})

app.use('/getImage', express.static(path.join(__dirname, '/database/images/')));
app.use('/getDescription', express.static(path.join(__dirname, '/database/descriptions/')));


app.listen(4100, function () {
    console.log("server successfully started at 4100");
})