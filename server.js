const express = require('express');
const app = express()

app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs')

app.use(express.json())
app.use(express.urlencoded({extended:true}))

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


app.get('/write', (요청, 응답) => {
    응답.render('write.ejs')
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

app.post('/add', async (요청, 응답) => {
    if (요청.body.title =='') {
        응답.send('제목 안 적었는데..')
    } else {
        await db.collection('post').insertOne({title: 요청.body.title, content: 요청.body.content})
        응답.redirect('/list')
    }
})
app.get('/join', (요청, 응답) =>{
    응답.render('join.ejs')
})

app.post('/in', async (요청, 응답) =>{
    if (요청.body.name == '') {
        응답.send('너 누구세요?')
    } else {
        await db.collection('user').insertOne({name: 요청.body.name, pw: 요청.body.password})
        응답.redirect('/list')
    }
})

