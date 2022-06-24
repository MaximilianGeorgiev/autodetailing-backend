const express = require('express');
const router = express.Router();

const PromotionController = require('../controllers/promotion.js');
const AuthUtils = require("../utils/auth.js");

router.get('/', PromotionController.getAllPromotions);
router.post('/', AuthUtils.validateToken, PromotionController.createPromotion);

router.get('/id/:id', PromotionController.getPromotionById);

router.get('/service', PromotionController.getPromotionsForServices);
router.get('/service/:id', PromotionController.getPromotionByServiceId);

router.get('/product', PromotionController.getPromotionsForProducts);
router.get('/product/:id', PromotionController.getPromotionByProductId);

router.get('/delete/:id', AuthUtils.validateToken, PromotionController.deletePromotion);
router.get('/delete/service/:id', AuthUtils.validateToken, PromotionController.deletePromotionsForService);
router.get('/delete/product/:id', AuthUtils.validateToken, PromotionController.deletePromotionsForProduct);

router.put('/:id', AuthUtils.validateToken, PromotionController.updatePromotion);

module.exports = router;