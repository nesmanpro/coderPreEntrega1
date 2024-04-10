const express = require('express');
const router = express.Router();

// Service / controller
const ViewsController = require('../controller/viewsController.js');
const viewsController = new ViewsController();


// Endpoint landing
router.get("/", viewsController.landing);
// Endpoint para el formulario de registro
router.get('/register', viewsController.register)
// Endpoint para el formulario de login
router.get("/login", viewsController.login);
// Endpoint para la vista de productos
router.get('/products', viewsController.getProducts);
// Endpoint para vista de perfil
router.get('/profile', viewsController.profile)
// Endpoint para gestionar error 404
router.get('/error', viewsController.error404)
// Endpoint para la vista productDetail.handlebars
router.get('/products/:prodId', viewsController.getProductById)
// Endpoint chat
router.get('/chat', viewsController.chat)
// Endpoint carrito ID
router.get("/carts/:cid", viewsController.getCartById);
// Endpoint realtimeprod
router.get("/realtime", viewsController.realTimeProducts);


module.exports = router;