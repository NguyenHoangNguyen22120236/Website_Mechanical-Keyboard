const nodemailer = require('nodemailer'); // Thư viện gửi email
const accountModel = require('../../models/User/accountModel')

// Cấu hình transporter cho nodemailer để gửi email qua Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Email người gửi
        pass: process.env.EMAIL_PASS, // Mật khẩu ứng dụng
    },
});

class ConfirmPassController {

    // [GET] /confirm-mail
    index(req, res) {
        res.render('User/confirm-mail', {
            layout: 'layoutUser', title: 'Confirm Mail',
            customHead: `
            <link rel="stylesheet" href="User/LoginStyle.css">
            <script defer type="module" src="User/Login/app.js"></script>
            `
        });
    }
    
    // [POST] /confirm-mail/send-code/api
    async sendCode(req, res){

        if (req.body.status){ // status: true --> lấy từ input
            req.session.email = req.body.email.toString(); // Lấy email từ yêu cầu
        }

        const rs = await accountModel.findAccountByEmailTypeEmail(req.session.email);
        if (!rs){
            return res.status(200).json({ success: false, message: 'Không có tài khoản ứng với email này (Email).' });
        }


        req.session.code = Math.floor(100000 + Math.random() * 900000); // Tạo mã xác thực ngẫu nhiên

        // Gửi mã xác thực qua email
        transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: req.session.email,
            subject: 'Mã xác thực của bạn',
            text: `Mã xác thực của bạn là: ${req.session.code}`,
        }, (error, info) => {
            if (error) {
                return res.status(500).send({ message: 'Gửi email thất bại' });
            }
            res.status(200).json({ success: true, message: 'Gửi mã thành công' });
        });
    };

}

module.exports = new ConfirmPassController;