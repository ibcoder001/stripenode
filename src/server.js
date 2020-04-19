if(process.env.NODE_ENV!=='production') {
    require('dotenv').config({path: "./../.env"});
}

const stripeSecret=process.env.STRIPE_SECRET_KEY;
const stripePublic=process.env.STRIPE_PUBLIC_KEY;

const express=require('express');
const app=express();

app.route('/charge',function() {
    console.log('charge');
});

app.listen(3000);

console.log(`Server started at port: http://localhost:3000/`);