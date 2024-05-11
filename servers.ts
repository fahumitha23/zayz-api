import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
dotenv.config();

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get('/v1/health', async(req, res) => {
  res.json({ status: 'up' });
})

app.post('/v1/sndemail', async(req, res) => {
  const reqBody: EmailRequest =  req.body as EmailRequest;
  console.log('/sendEmail: ', process.env.PASS);
  try {
    await sendEmail(reqBody);
    res.send('ok');
  } catch (err) {
    console.log(err);
  }
});

async function sendEmail(body: EmailRequest) {

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "zayzeemed@gmail.com",
    pass: process.env.PASS,
  },
});
const msg = `${body.emailContent}\n Please contact this phone in case of need ${body.clientPhoneNumber}`;
const mailOptions = {
  from: body.clientEmailId,
  to: 'zayzeemed@gmail.com',
  subject: '',
  text: msg
};

transporter.sendMail(mailOptions, (error: any, info: any) => {
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Email sent:', info.response);
  }
});
}

interface EmailRequest {
 clientName: string;
 clientEmailId: string;
 clientPhoneNumber: string;
 emailContent: string;
}