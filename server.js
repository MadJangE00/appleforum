const express = require('express');
const app = express()

app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs')

const { MongoClient } = require('mongodb');

let db;
const url = 'mongodb+srv://admin:qwer1234@forum.toudssh.mongodb.net/?retryWrites=true&w=majority';
new MongoClient(url).connect().then((client)=>{
    console.log('DB연결 성공')
    db = client.db('forum')
    app.listen(8080, () => {
        console.log('http://localhost:8080 에서 서버 실행 중')
    })
}).catch((err)=>{
    console.log(err)
})


app.get('/news', (요청, 응답) => {
    응답.send('오늘 비옴')
})

app.get('/shop', (요청, 응답) => {
    응답.send('쇼핑 페이지임')
})

app.get('/', (요청, 응답) => {
    응답.sendFile(__dirname + '/index.html')
})

app.get('/list', async (요청, 응답) => {
    let result = await db.collection('post').find().toArray()
    응답.render('list.ejs', { post : result })
})

const time = new Date()
app.get('/time', (요청, 응답) => {
    응답.render('time.ejs', {serverTime : time})
})
