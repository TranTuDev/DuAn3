// var express = require('express');
// var router = express.Router();
// const multer = require("multer");
// const tradeRouter = require('./chucnang/trade');
// const tradejournalRouter = require('./chucnang/tradingjournal');
// const { ensureAuth, isAdmin } = require('./authMiddleware');



var express = require('express');
var router = express.Router();
const multer = require('multer');

const tradeRouter = require('./chucnang/trade');
const tradejournalRouter = require('./chucnang/tradingjournal');
const { ensureAuth, isAdmin } = require('./authMiddleware');

// Mount các route con đúng cách
router.use('/users/trade', tradeRouter);
router.use('/users/tradingjournal', tradejournalRouter);





/* GET index page. */
router.get('/index', (req, res) => {
  res.render('index');
});

/* GET admin page. */
router.get('/admin', ensureAuth, isAdmin, (req, res) => {
  res.render('admin', { user: req.session.user });
});

/* GET users page. */
router.get('/users', ensureAuth, (req, res) => {
  res.render('users', { user: req.session.user });
});

/* GET login and register page. */
router.get('/login', (req, res) => {
  if (req.session.user) {
    if (req.session.user.role === 'admin') return res.redirect('/admin');
    return res.redirect('/users');
  }
  res.render('login', { page: 'login' }); // file ejs chứa 2 form login + register
});


// Mount tradeRouter vào đường dẫn /users/trade
router.use('/users/trade', ensureAuth, tradeRouter);
router.use('/users/tradingjournal', ensureAuth, tradejournalRouter);

// router.get('/login', (req, res) => {
//   if (req.session.user) {
//     return res.redirect(req.session.user.role === 'admin' ? '/admin' : '/users');
//   }
//   res.render('login', { page: 'login' }); // truyền page để JS/CSS xử lý mặc định hiển thị form login
// });

// router.get('/register', (req, res) => {
//   if (req.session.user) {
//     return res.redirect(req.session.user.role === 'admin' ? '/admin' : '/users');
//   }
//   res.render('login', { page: 'register' }); // dùng chung file login.ejs, nhưng hiển thị form register
// });








/* GET xem page. */
router.get('/xem', async function (req, res, next) {
  try {
    const data = await contactModel.find({}); // find({}: đọc tất cả dữ liệu
    res.render('xem', { title: 'Xem dữ liệu', dulieu: data });
  }
  catch {
    res.status(500).send("Lỗi máy chủ");
  }
});

// Cấu hình multer để lưu file ảnh
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "image/"), // Thư mục lưu ảnh
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});

const upload = multer({ storage });









/* GET thêm page. */
router.get('/them', function (req, res, next) {
  res.render('them', { title: 'thêm dữ liệu' });
});



/* POST Thêm page. */
router.post('/them', upload.single("image"), async function (req, res, next) {
  try {
    // Kiểm tra nếu không có file
    if (!req.file) {
      return res.status(400).json({ message: "Vui lòng tải lên một hình ảnh" });
    }
    // bước 1: lấy dữ liệu
    var phantu = {
      'name': req.body.name,
      'tel': req.body.tel,
      'image': req.file.path
    }
    // bước 2: tạo đối tượng mới
    var data = new contactModel(phantu);
    // bước 3: lưu vào dữ liệu
    await data.save();
    res.redirect('/xem');
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});



// tim kiem
router.get('/timkiem', async function (req, res, next) {
  let keyword = req.query.q;


  try {
    const data = await contactModel.find({
      $or: [
        { name: new RegExp(keyword, 'i') },
        { tel: new RegExp(keyword, 'i') },
      ]
    });

    res.render('xem', { dulieu: data, title: 'Kết quả tìm kiếm' });
  } catch (err) {
    res.status(500).send('Lỗi tìm kiếm');
  }
});


//sua du lieu
router.get('/sua/:idcansua', async function (req, res, next) {
  try {
    var id = req.params.idcansua; // Lấy id cần sửa

    // Tìm dữ liệu theo ID, dùng `exec()` để tránh lỗi callback
    let data = await contactModel.find({ _id: id }).exec();

    if (!data) {
      return res.status(404).send("Không tìm thấy dữ liệu");
    }

    res.render('sua', { dulieu: data }); // Chuyển hướng đến trang sửa
  }
  catch {
    res.status(500).send("Lỗi máy chủ");
  }
});


//post để sửa thông tin

router.post('/sua/:idcansua', async function (req, res, next) {
  try {
    var id = req.params.idcansua; // Lấy ID cần sửa

    // Kiểm tra xem ID có hợp lệ không
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).send("ID không hợp lệ");
    }

    // Cập nhật dữ liệu
    const result = await contactModel.updateOne(
      { _id: id }, // Tìm theo ID
      { name: req.body.name, tel: req.body.tel } // Lấy dữ liệu từ form
    );

    // Kiểm tra xem có tài liệu nào được cập nhật không
    if (result.modifiedCount === 0) {
      return res.status(404).send("Không tìm thấy dữ liệu để cập nhật");
    }

    res.redirect('/xem'); // Chuyển hướng sau khi cập nhật thành công
  }
  catch {
    res.status(500).send("Lỗi máy chủ");
  }
});


//GET xoa mẫu tin

router.get('/xoa/:idcanxoa', async function (req, res, next) {
  try {
    var id = req.params.idcanxoa; // Lấy id cần xóa

    // Kiểm tra xem id có hợp lệ không (tránh lỗi khi không phải ObjectId)
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).send("ID không hợp lệ");
    }

    // Thực hiện xóa và kiểm tra kết quả
    const result = await contactModel.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).send("Không tìm thấy dữ liệu để xóa");
    }

    res.redirect('/xem'); // Chuyển hướng sau khi xóa
  }
  catch {
    res.status(500).send("Lỗi máy chủ");
  }
});





module.exports = router;





