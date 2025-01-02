const pool = require('../../config/database');

const searchProduct = async (search, visibleCount) => {
    const client = await pool.connect();
    
    try {
        // Query to get the sum of products in the database
        const resultSum = await client.query(`
            SELECT COUNT(*)
            FROM public.product
            WHERE productname ILIKE $1
            `, [`%${search}%`])

        // Query to get data from database
        const result = await client.query(`
            SELECT *
            FROM public.product
            WHERE productname ILIKE $1
            LIMIT $2
        `, [`%${search}%`, visibleCount]);
        return {
            totalProducts: resultSum.rows[0].count,
            dataSearchProduct: result.rows
        };
    } catch (error) {
        console.error('Lỗi truy vấn!', error);
        res.status(500).json({ error: 'Có lỗi xảy ra khi lấy dữ liệu.' });
    } finally {
        client.release();
    }
};

const checkGroupByProduct = async (productid) => {
    const client = await pool.connect();
    try {
        const result = await client.query(`
            SELECT *
            FROM public.product
            WHERE productid = $1 And type = 2
        `, [productid]);
        return result.rows.length > 0;
    } catch (error) {
        console.error('Error querying!', error);
        res.status(500).json({ error: 'Error fetching data.' });
    } finally {
        client.release();
    }
};

module.exports = {
    searchProduct,
    checkGroupByProduct
};