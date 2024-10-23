const express = require('express');

const router = express.Router()

const userSignUpController = require("../controller/userSignUp");
const userSignInController = require('../controller/userSignIn');
const userDetailsController = require('../controller/userDetails');
const authToken = require('../middleware/authToken');
const userLogout = require('../controller/userLogout');
const allUsers = require('../controller/allUsers');
const updateUser = require('../controller/updateUser');
const UploadProductController = require('../controller/uploadProduct');
const getProductController = require('../controller/getProduct');
const updateProductController = require('../controller/updateProduct');
const getCategoryProduct = require('../controller/getCategoryProductOne');
const getCategoryWiseProduct = require('../controller/getCategoryWiseProduct');
const getProductDetails = require('../controller/getProductDetails');
const addToCartController = require('../controller/addToCartController');
const countAddToCartProduct = require('../controller/countAddToCartProduct');
const addToCartViewProduct = require('../controller/addToCartViewProduct');
const updateAddToCartProduct = require('../controller/updateAddToCartProduct');
const deleteAddToCartProduct = require('../controller/deleteAddToCartProduct');
const searchProduct = require('../controller/searchProduct');
const filterProductController = require('../controller/filterProduct');
const paymentController = require('../controller/order/paymentController');
const webhooks = require('../controller/order/webhook');
const orderController = require('../controller/order/order.controller');
const allOrderController = require('../controller/order/allOrder.controller');

router.post("/signup",userSignUpController)
router.post("/signin",userSignInController)
router.get("/user-details",authToken,userDetailsController)
router.get("/userLogout",userLogout)

//admin panel
router.get("/all-user",authToken,allUsers)
router.post("/update-user",authToken,updateUser)


//product
router.post("/upload-product",authToken,UploadProductController)
router.get("/get-product",getProductController)

router.post("/update-product",authToken,updateProductController)
router.get("/get-categoryProduct",getCategoryProduct)

router.post("/category-product",getCategoryWiseProduct)
router.post("/product-details",getProductDetails)

router.get("/search",searchProduct)
router.post("/filter-product",filterProductController)


//user add to cart
router.post("/addtocart",authToken,addToCartController)
router.get("/countAddToCartProduct",authToken,countAddToCartProduct)

router.get("/view-card-product",authToken,addToCartViewProduct)
router.post("/update-cart-product",authToken,updateAddToCartProduct)
router.post("/delete-cart-product",authToken,deleteAddToCartProduct)


//payment and order
router.post("/checkout",authToken,paymentController)
router.post("/webhook",webhooks)    // /api/webhook

router.get("/order-list",authToken,orderController)
router.get("/all-order",authToken,allOrderController)

module.exports = router