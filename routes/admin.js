const path = require('path');
const { body } = require('express-validator/check');

const express = require('express');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

const productValidations = [
  body('title')
    .isAlphanumeric()
    .withMessage('Title should contain only text and numbers.')
    .isLength({ min: 2 })
    .withMessage('Title should have at least two characters.'),
  body('price').isNumeric().withMessage('Price should be a number.'),
];

//admin/add-product GET
router.get('/add-product', isAuth, adminController.getAddProduct);

// /admin/products GET
router.get('/products', isAuth, adminController.getProducts);

// /admin/add-product POST
router.post(
  '/add-product',
  isAuth,
  productValidations,
  adminController.postAddProduct
);

// // /add-edit GET
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post(
  '/edit-product/',
  isAuth,
  productValidations,
  adminController.postEditProduct
);

router.delete('/product/:productId', isAuth, adminController.deleteProduct);

module.exports = router;
