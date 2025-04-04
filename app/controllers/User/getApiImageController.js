const { getImagesFromDirectory } = require("../../models/User/apiImage.js");

class GetApiImageController {
  // Phương thức để xử lý API lấy ảnh từ thư mục
  async createApi(req, res) {
    const id = req.query.id; // Lấy đường dẫn từ query parameter

    const directory = `public/${id}`;
    
    console.log('duong dan:',directory);

    // Nếu không có tham số directory, trả về lỗi
    if (!directory) {
      return res.status(400).json({ error: "Directory path is required" });
    }

    try {
      const images = await getImagesFromDirectory(directory); // Gọi module lấy ảnh
      res.json(images); // Trả về danh sách ảnh
    } catch (error) {
      console.error("Error fetching images:", error);
      res.status(500).json({ error: "Failed to retrieve images" });
    }
  }
  async createApiForDetail(req, res) {
    const id = req.query.id; // Lấy đường dẫn từ query parameter

    const directory = `public/image/${id}`;
    
    console.log('duong dan:',directory);

    // Nếu không có tham số directory, trả về lỗi
    if (!directory) {
      return res.status(400).json({ error: "Directory path is required" });
    }

    try {
      const images = await getImagesFromDirectory(directory); // Gọi module lấy ảnh
      res.json(images); // Trả về danh sách ảnh
    } catch (error) {
      console.error("Error fetching images:", error);
      res.status(500).json({ error: "Failed to retrieve images" });
    }
  }
}

module.exports = new GetApiImageController();
