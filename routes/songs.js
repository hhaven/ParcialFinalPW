var express = require('express');
var router = express.Router();
var songController = require('../controllers/SongController')

/* GET songs listing. */
router.get('/:songname', songController.getOne);
router.get('/', songController.getAll);

router.post('/',songController.register);
router.put('/:songname', songController.update);
router.delete('/:songname',songController.delete);

module.exports = router;
