const nodemailer = require('nodemailer');
const sendEmail = async (options) => {
    //1)-create transporter like gmail or mailtrap that will send the email 
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        host: 'smtp.gmail.com',
        port: 465, //if secure true port:465 if secure falseport:587
        secure: true,
        
        
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },

    })

    //2)-define email options (from,to ,subject.body)
    const mailOptions = {
        from: `Ecommerce app <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message
    }
    //3)-send email
    await transporter.sendMail(mailOptions);

}


module.exports = sendEmail;