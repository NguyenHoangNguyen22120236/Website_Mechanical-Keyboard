const { getGroupByProduct } = require('../../models/User/get_product_gb.js');
const controller = {};

// Render Kit Phim
controller.showDetailGroupby = async (req, res) => {
    try {
        // Lấy dữ liệu từ model
        const data = await getGroupByProduct(req, res);

        // Render view với dữ liệu
        res.render('detail-groupby', {
            layout: 'layout',
            title: 'DetailGroupby',
            customHead: `
                <link rel="stylesheet" href="User/DetailGroupBy/detail-groupby.css">
                <script defer src="User/DetailGroupBy/groupby.js"></script>
            `,
            data: JSON.stringify(data) // Chuyển dữ liệu sang JSON để Vue.js sử dụng
        });
    } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).send('Error fetching data: ' + error.message);
    }
};

module.exports = controller;
