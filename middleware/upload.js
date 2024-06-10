// import path from "path";
// import multer from "multer";

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     const ext = path.extname(file.originalname);
//     cb(null, Date.now() + ext);
//   },
// }); 

// const upload1 = multer({
//   storage: storage,
//   fileFilter: function (req, file, callback) {
//     if (file.mimetype === "image/png" || file.mimetype === "image/jpg") {
//       callback(null, true);
//     } else {
//       console.log("Only jpg and png file can be uploaded");
//       callback(null, false);
//     }
//   },
//   limits: {
//     fileSize: 1024 * 1024 * 2,
//   },
// });

// export default upload1;