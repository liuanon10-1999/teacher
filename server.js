const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const questions = [
    { question: "2 + 2 เท่ากับ?", answer: "4" },
    { question: "กรุงเทพเป็นเมืองหลวงของประเทศอะไร?", answer: "ไทย" },
    { question: "สีของใบไม้คืออะไร?", answer: "เขียว" },
    { question: "สัตว์ชนิดใดมีงวง?", answer: "ช้าง" },
    { question: "ทะเลที่ใหญ่ที่สุดในโลกคืออะไร?", answer: "แปซิฟิก" },
    { question: "วันแม่แห่งชาติในไทยตรงกับวันที่?", answer: "12 สิงหาคม" },
    { question: "ใครเป็นคนคิดค้นหลอดไฟ?", answer: "โทมัส เอดิสัน" },
    { question: "ทวีปที่มีขนาดเล็กที่สุดคือ?", answer: "ออสเตรเลีย" },
    { question: "ผลไม้ที่มีกลิ่นแรงมากในไทยคือ?", answer: "ทุเรียน" },
    { question: "กีฬาอะไรที่ใช้ลูกกลมและผู้เล่นต้องเตะ?", answer: "ฟุตบอล" }
];

let currentQuestionIndex = 0;
let answered = false;

app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {
    console.log('ผู้เล่นเชื่อมต่อแล้ว');

    socket.emit('newQuestion', questions[currentQuestionIndex].question);

    socket.on('answer', (data) => {
        if (!answered && data.toLowerCase() === questions[currentQuestionIndex].answer.toLowerCase()) {
            answered = true;
            io.emit('correctAnswer', `${socket.id} ตอบถูกต้อง!`);
            setTimeout(() => {
                currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
                answered = false;
                io.emit('newQuestion', questions[currentQuestionIndex].question);
            }, 2000);
        } else {
            socket.emit('wrongAnswer', 'ตอบผิด ลองอีกครั้ง!');
        }
    });

    socket.on('disconnect', () => {
        console.log('ผู้เล่นออกจากเกม');
    });
});

server.listen(3000, () => {
    console.log('เซิร์ฟเวอร์เริ่มทำงานที่พอร์ต 3000');
});
