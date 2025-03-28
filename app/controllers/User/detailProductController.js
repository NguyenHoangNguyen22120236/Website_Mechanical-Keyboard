const fs = require("fs");
const path = require("path");
const { _isDomSupported } = require("chart.js/helpers");
const { getProduct,getSameProduct,deleteForm,getSameProductGB } = require("../../models/User/get_product.js");
const insert = require("../../models/User/insertReviewModel.js");
const getReview = require("../../models/User/getReviewModel.js");

const controller = {};

// Render Kit Phim
controller.showDetailProduct = async (req, res) => {
  idProduct = req.params.id || 1;

  const user = req.session.user;
  try {
    // Lấy dữ liệu từ model
    const data = await getProduct(idProduct);

    // Render view với dữ liệu
    res.render("User/detail-product", {
      layout: "layoutUser",
      title: "DetailProduct",
      customHead: `
                <link rel="stylesheet" href="/User/DetailProduct/detail-product.css">
                <script defer src="/User/DetailProduct/product.js"></script>
                <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
            `,
      user: user,
      idProduct: idProduct,
      data: JSON.stringify(data),
    });
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).send("Error fetching data: " + error.message);
  }
};

controller.showDetailProductVer2 = async (req, res) => {
  const user = req.session.user;
  const id = req.params.id || 1; // Lấy ID sản phẩm từ route hoặc mặc định là 1

  try {
    // Lấy dữ liệu sản phẩm từ model
    const productData = await getProduct(id); // Dữ liệu trả về dạng { dataProduct: [...] }
    const product = productData.dataProduct[0]; // Chỉ lấy sản phẩm đầu tiên trong mảng

    if (!product) {
      return res.status(404).send("Product not found");
    }

    // Đường dẫn tới folder ảnh dựa trên `imagepath`
    const folderPath = path.join(
      __dirname,
      "../../../public",
      product.imagepath
    );

    try {
      // Đọc danh sách file ảnh trong thư mục
      const imageFiles = fs
        .readdirSync(folderPath) // Lấy danh sách file trong folder
        .filter((file) => /\.(jpg|jpeg|png|gif|webp)$/i.test(file)) // Chỉ lấy file ảnh
        .map((file) => `${product.imagepath}/${file}`); // Tạo URL đầy đủ cho từng ảnh

      product.imagepath = imageFiles; // Gán mảng ảnh vào `imagepath`
    } catch (err) {
      console.error(`Lỗi đọc folder ảnh ${folderPath}:`, err);
      product.imagepath = []; // Nếu lỗi, gán mảng rỗng
    }

    // Render view với dữ liệu sản phẩm
    res.render("User/detail-product-ver2", {
      layout: "layoutUser",
      title: "DetailGroupby",
      customHead: `
        <link rel="stylesheet" href="/User/DetailProduct/detail-product-ver2.css">
        <script defer src="/User/DetailProduct/product-ver2.js"></script>
      `,
      user: user,
      idProduct: id,
      data: JSON.stringify(product), // Chuyển dữ liệu sang JSON để Vue.js sử dụng
    });
  } catch (error) {
    console.error("Error fetching product data:", error.message);
    res.status(500).send("Error fetching product data: " + error.message);
  }
};

controller.getImageProduct = async (req, res) => {
  const id = req.params.id || 1; // Lấy ID sản phẩm từ route hoặc mặc định là 1

  try {
    // Lấy dữ liệu sản phẩm từ model
    const productData = await getProduct(id); // Dữ liệu trả về dạng { dataProduct: [...] }
    const product = productData.dataProduct[0]; // Chỉ lấy sản phẩm đầu tiên trong mảng

    if (!product) {
      return res.status(404).send("Product not found");
    }

    // Đường dẫn tới folder ảnh dựa trên `imagepath`
    const folderPath = path.join(
      __dirname,
      "../../../public",
      product.imagepath
    );

    try {
      // Đọc danh sách file ảnh trong thư mục
      const imageFiles = fs
        .readdirSync(folderPath) // Lấy danh sách file trong folder
        .filter((file) => /\.(jpg|jpeg|png|gif|webp)$/i.test(file)) // Chỉ lấy file ảnh
        .map((file) => `${product.imagepath}/${file}`); // Tạo URL đầy đủ cho từng ảnh

      product.imagepath = imageFiles; // Gán mảng ảnh vào `imagepath`
    } catch (err) {
      console.error(`Lỗi đọc folder ảnh ${folderPath}:`, err);
      product.imagepath = []; // Nếu lỗi, gán mảng rỗng
    }

    return res.json(product.imagepath);

  } catch (error) {
    console.error("Error fetching product data:", error.message);
    res.status(500).send("Error fetching product data: " + error.message);
  }
};

controller.insertReview = async (req, res) => {
  try {
    const { productid, email, reviewdate, comment, stars } = req.body;

    const result = await insert(productid, email, reviewdate, comment, stars);

    if (result.success) {
      // Trả về productid nếu thành công
      res.status(201).json({
        success: true,
        message: "Review created successfully!",
        productid: result.productid,
      });
    } else {
      // Nếu không thành công, trả về thông báo lỗi
      res.status(500).json({
        success: false,
        message: "Failed to create GroupBy.",
        error: result.error,
      });
    }
  } catch (error) {
    console.error("Lỗi khi tạo Review:", error);
    res.status(500).json({ message: "An unexpected error occurred." });
  }
};
controller.getReview = async (req, res) => {
  const id = req.query.id || 1;
  try {
    const result = await getReview(id);

    if (result.success) {
      const formattedReviews = result.reviews.map((review) => ({
        ...review,
        reviewdate: new Date(review.reviewdate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
      }));

      res.status(201).json({
        success: true,
        message: "Review created successfully!",
        reviews: formattedReviews,
      });
    } else {
      // Nếu không thành công, trả về thông báo lỗi
      res.status(500).json({
        success: false,
        message: "Failed to create GroupBy.",
        error: result.error,
      });
    }
  } catch (error) {
    console.error("Lỗi khi tạo Review:", error);
    res.status(500).json({ message: "An unexpected error occurred." });
  }
};
controller.getSameProduct = async (req, res) => {
  const user = req.session.user;
  const categoryId = req.params.category || 1; // Lấy ID sản phẩm từ route hoặc mặc định là 1
  const quantity = req.query.quantity||3;

  try {
    // Lấy dữ liệu sản phẩm từ model
    const products = await getSameProduct(categoryId,quantity); // Dữ liệu trả về dạng { dataProduct: [...] }

    if (!products || products.listProducts.length === 0) {
      return res.status(404).send("No products found");
    }

    // Xử lý từng sản phẩm trong mảng
    products.listProducts.forEach((item) => {
      // Xử lý imagepath thành mảng các ảnh
      const folderPath = path.join(
        __dirname,
        "../../../public",
        item.imagepath
      ); // Đường dẫn tới folder ảnh
      try {
        const imageFiles = fs
          .readdirSync(folderPath) // Lấy danh sách file trong folder
          .filter((file) => /\.(jpg|jpeg|png|gif|webp)$/i.test(file)) // Chỉ lấy file ảnh
          .map((file) => `${item.imagepath}/${file}`); // Tạo URL đầy đủ cho từng ảnh

        item.imagepath = imageFiles; // Gán mảng ảnh vào trường imagepath
      } catch (err) {
        console.error(`Lỗi đọc folder ảnh ${folderPath}:`, err);
        item.imagepath = []; // Nếu lỗi, gán mảng rỗng
      }
    });

    // Trả về dữ liệu đã xử lý
    res.json({
      success: true,
      data: products.listProducts, // Trả về mảng sản phẩm đã xử lý
    });
  } catch (error) {
    console.error("Error fetching product data:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching product data: " + error.message,
    });
  }
};

controller.getSameProductGB = async (req, res) => {
  const user = req.session.user;
  const categoryId = req.params.category || 1; // Lấy ID sản phẩm từ route hoặc mặc định là 1
  const quantity = req.query.quantity||3;

  console.log('loai san phẩm :', categoryId);

  try {
    // Lấy dữ liệu sản phẩm từ model
    const products = await getSameProductGB(categoryId,quantity); // Dữ liệu trả về dạng { dataProduct: [...] }

    if (!products || products.listProducts.length === 0) {
      return res.status(404).send("No products found");
    }

    // Xử lý từng sản phẩm trong mảng
    products.listProducts.forEach((item) => {
      // Xử lý imagepath thành mảng các ảnh
      const folderPath = path.join(
        __dirname,
        "../../../public",
        item.imagepath
      ); // Đường dẫn tới folder ảnh
      try {
        const imageFiles = fs
          .readdirSync(folderPath) // Lấy danh sách file trong folder
          .filter((file) => /\.(jpg|jpeg|png|gif|webp)$/i.test(file)) // Chỉ lấy file ảnh
          .map((file) => `${item.imagepath}/${file}`); // Tạo URL đầy đủ cho từng ảnh

        item.imagepath = imageFiles; // Gán mảng ảnh vào trường imagepath
      } catch (err) {
        console.error(`Lỗi đọc folder ảnh ${folderPath}:`, err);
        item.imagepath = []; // Nếu lỗi, gán mảng rỗng
      }
    });

    // Trả về dữ liệu đã xử lý
    res.json({
      success: true,
      data: products.listProducts, // Trả về mảng sản phẩm đã xử lý
    });
  } catch (error) {
    console.error("Error fetching product data:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching product data: " + error.message,
    });
  }
};
controller.deleteForm = async (req, res) => {
  const user = req.session.user; // Lấy thông tin người dùng từ session
  const { id } = req.params; // Lấy id từ URL params

  // Kiểm tra người dùng
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: User not logged in.",
    });
  }

  try {
    // Xóa sản phẩm trong cơ sở dữ liệu (giả sử sử dụng ORM hoặc query)
    const result = await deleteForm(id); // Gọi hàm deleteForm để xóa sản phẩm

    if (!result) {
      return res.status(404).json({
        success: false,
        message: `Product with ID ${id} not found.`,
      });
    }

    // Trả về phản hồi thành công
    res.status(200).json({
      success: true,
      message: `Product with ID ${id} has been deleted successfully.`,
    });

  } catch (error) {
    // Ghi lỗi và trả về phản hồi lỗi
    console.error("Error deleting product:", error.message);
    console.error("Error stack:", error.stack); // Thêm chi tiết lỗi để debug
    res.status(500).json({
      success: false,
      message: "Error deleting product: " + error.message,
    });
  }
};




module.exports = controller;
