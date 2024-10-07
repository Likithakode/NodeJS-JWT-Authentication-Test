const express = require('express');
const path = require('path')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const {expressjwt: exjwt } = require('express-jwt');
const app = express()

const PORT = 4000;

const secretKey = 'My super Secret Key';

const jwtMW = exjwt({
    secret: secretKey,
    algorithms: ['HS256']
});

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','http://localhost:4000');
    res.header('Access-Control-Allow-Headers','Origin,X-Requested-With,Content-Type,Accept,Authorization');
    next();
})
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

let users = [
    {
        id:1,
        name: 'John',
        password: '123'
    },
    {
        id:2,
        name: 'Jane',
        password: '456'
    }
]


app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'index.html'))
})

app.use(function(err,req,res,next){
    if(err.name == 'UnauthorizedError'){
        res.status(401).json({
            success: false,
            officialError: err,
            err: 'Username or password is incorrect 2'
        })
    }
    else{
        next(err);
    }
}
)

app.post('/api/login',(req,res)=>{
    const {username, password } = req.body;
    for(let user of users){
        if(user.name === username && user.password === password){
            let token = jwt.sign({
                id:user.id,username: user.username
            }, secretKey, {expiresIn: '3m'});
            res.json({
                success: true,
                err: null,
                token
            });
            break;
        }
        else{
            res.status(401).json({
                success: false,
                token: null,
                err: 'Incorrect username or password'
            })
        }
    }
})


app.get('/api/dasboard',jwtMW, (req,res)=>{
    res.json({
        success: true,
        myContent: 'Secret content that only logged persons can see!!!'
    })
})

app.get('/api/settings',jwtMW, (req,res)=>{
    res.json({
        success: true,
        myContent: 'Hello Welcome to settings...Secret content that only logged persons can see these!!!'
    })
})
app.listen(PORT);
