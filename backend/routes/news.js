const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/newsController');

router.get('/',                          ctrl.getNews);
router.get('/:id',                       ctrl.getNewsById);
router.post('/',                         ctrl.createNews);
router.put('/:id',                       ctrl.updateNews);
router.delete('/:id',                    ctrl.deleteNews);
router.post('/:id/comments',             ctrl.addComment);
router.delete('/:id/comments/:commentId', ctrl.deleteComment);

module.exports = router;
