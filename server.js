const express = require('express');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());

const users = JSON.parse(fs.readFileSync(path.join(__dirname,'data','users.json')));
const orders = JSON.parse(fs.readFileSync(path.join(__dirname,'data','orders.json')));

// --- Authentication ---
app.post('/login', (req,res)=>{
    const { userId } = req.body;
    const user = users.find(u => u.id === Number(userId));
    if(!user){
        return res.status(401).json({error: 'Invalid userId'});
    }
    const token = jwt.sign({ userId: user.id }, 'secret', { expiresIn: '1h' });
    res.json({ token });
});

// --- Auth middleware ---
function auth(req,res,next){
    const header = req.headers.authorization || '';
    const token = header.split(' ')[1];
    if(!token){
        return res.status(401).json({error: 'Missing token'});
    }
    try{
        const payload = jwt.verify(token, 'secret');
        req.userId = payload.userId;
        next();
    }catch(e){
        res.status(401).json({error: 'Invalid token'});
    }
}

// All /api routes require auth
app.use('/api', auth);

// --- Vulnerable endpoints (no ownership checks) ---
app.get('/api/users/:id', (req,res)=>{
    const user = users.find(u => u.id === Number(req.params.id));
    if(!user){
        return res.status(404).json({error: 'User not found'});
    }
    res.json(user); // <-- IDOR here
});

app.get('/api/orders/:orderId', (req,res)=>{
    const order = orders.find(o => o.id === Number(req.params.orderId));
    if(!order){
        return res.status(404).json({error: 'Order not found'});
    }
    res.json(order); // <-- IDOR here
});

app.get('/api/files/:fileId/download', (req,res)=>{
    const filePath = path.join(__dirname,'data','files', `${req.params.fileId}.txt`);
    if(!fs.existsSync(filePath)){
        return res.status(404).json({error: 'File not found'});
    }
    res.download(filePath); // <-- IDOR here
});

// --- Start server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`IDOR lab listening on port ${PORT}`));