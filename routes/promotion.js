const express = require('express');
const router = express.Router();

const PromotionController = require('../controllers/promotion.js');

router.route('/')
.get(PromotionController.getAllPromotions)
.post(PromotionController.createPromotion);

router.get('/id/:id', PromotionController.getPromotionById);

router.get('/service', PromotionController.getPromotionsForServices);
router.get('/service/:id', PromotionController.getPromotionByServiceId);

router.get('/product', PromotionController.getPromotionsForProducts);
router.get('/product/:id', PromotionController.getPromotionByProductId);

router.get('/delete/:id', PromotionController.deletePromotion); 

router.put('/:id', PromotionController.updatePromotion);

module.exports = router;