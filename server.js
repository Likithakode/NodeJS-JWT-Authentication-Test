const express = require('express');
const path = require('path')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const exjwt = require('express-jwt');
const app = express()

const PORT = 4000;

const secretKey = 'My super Secret Key';

const jwtMW = exjwt({
    secret: secretKey,
    algorithms: ['HS256']
});

app.use(bodyParser.json());
app.user(bodyParser.urlencoder({extended: true}));
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','http://localhost:4000');
    res.header('Access-Control-Allow-Headers','Origin,X-Requested-With,Content-Type,Accept,Authorization');
})

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
            err
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
            }, secretKey, {expiresIn: '7d'});
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
app.listen(PORT);