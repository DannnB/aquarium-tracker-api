const express = require('express');
const router = express.Router();
const multer = require('multer');

const checkAuth = require('../middleware/check-auth');

const ProductsController = require('../controllers/products');

const storage = multer.diskStorage({
   destination: function(req, file, cb){
       cb(null, './uploads'); // call back
   },
   filename: function(req, file, cb){
       cb(null, new Date().toISOString() + file.originalname);
   }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if(file.mimetype === 'image/jpeg' || file.minetype === 'image/png'){
    cb(null, true); // stores file
  }
  // other files, not save
  cb(null, false); // ignore and don't store file 
  // logic here to sort out the file if its wrong mime type
  
};

const upload = multer({
    storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 5// 5MB Max
    },
    fileFilter: fileFilter
});// store all uploaded files in this place

// impliment a route to parse all requets to /uploads and look up the image and return
// or make uploads publically avalible

// /products is already set, this jjust adds to the url so /products/products if it was set in here eg '/id' = /products/id
router.get('/', ProductsController.products_get_all);

router.post('/', checkAuth, upload.single('productImage'), ProductsController.products_create_product);

router.get('/:productId', ProductsController.products_get_product);

router.patch('/:productId', checkAuth, ProductsController.products_edit_product);

router.delete('/:productId', checkAuth, ProductsController.products_delete_product);

module.exports = router;