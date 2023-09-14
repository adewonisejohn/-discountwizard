const express = require('express')
const app = express()
const bodyparser = require('body-parser')
require('dotenv').config()
const mongoose = require('mongoose')
const Product = require("./schema/product")
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())
const send_message = require("./send_message")
const scrape_data =require('./scrape')
const  check_products = require("./check_products")
const schedule = require('node-schedule');



async function startScheduler() {
    const rule = new schedule.RecurrenceRule();
    rule.hour = new schedule.Range(0, 23, 8); // This will execute every 8 hours (0, 8, 16)

    // Create a scheduled task
    const scheduledTask = schedule.scheduleJob(rule, function () {
        check_products();
        console.log('Scheduler runned');
    });

    // Handle any errors that might occur
    scheduledTask.on('error', (err) => {
        console.error('Error:', err);
    });
    console.log('Scheduler started');
}







mongoose.connect(process.env.MONGO_URL)
  .then(() =>{
    console.log("connected");
    startScheduler()
  })


// send_message("hello this is kayode testing")

app.get("/",function(req,res){
    res.send("Hello world")
})

app.post("/",async function(req,res){
    const message = req.body.Body;
    const user_name = req.body.ProfileName;
    const user_contact = req.body.From;
    
    var item_list= await Product.find({user_contact:user_contact});
    if(message.includes("jumia.com.ng/")){
        if(item_list.length==0){
            scrape_data(message).then(async (data)=>{
            console.log(data)
            try{
                const item = new Product({
                    user_name : user_name.toString(),
                    product_name : data.title,
                    product_link: message,
                    product_currency : data.currency,
                    user_contact : user_contact,
                    initial_price : data.price
                })
                const newItem = await item.save()
                console.log("item saved successfully")
                send_message("Created by Adewonise Kayode John! \nTwitter : twitter.com/adewonisejohn \nLinkedin :linkedin.com/in/adewonise-kayode \nGithub : github.com/adewonisejohn \nCheck out some of my other projects :adewonise -john.web.app/projects",user_contact)
                send_message("📣 Update 🛒" + " \n PRODUCT NAME : " + data.title +"\n 👀 Good news! We're currently tracking the item you're interested in. 📦 \n 👉 We'll keep an eye on it, and you'll be the first to know if the price changes. 🚀💰 \n Send \"/Stop\" to stop tracking item",user_contact)


            }catch(e){
                console.log(e)
            }
            
            }).catch((error)=>{
                console.log(error)
                send_message("⚠️ This is not a valid Jumia url ⚠️",user_contact)
            });
        }else{
            console.log("user already have a product alreadig tracking")
            send_message("📢 Tracking Limit \n 👋 Hello there, \n It appears that you're already tracking an item. If you'd like to stop tracking it, simply send \"/stop\" at any time, and we'll take care of the rest. 🛑",user_contact)
        }
    }else if(message.includes("/stop")){
        if(item_list.length != 0){
            Product.deleteOne({user_contact:user_contact}).then(function(){
                console.log('item remove')
                send_message("Item Successfully Removed",user_contact)

            }).catch(function(error){
                console.log("an error occured");
            })
        }else{
            send_message("You don't have any item currently being tracked",user_contact)
        }
        
    }else if(message.includes("/ping")){
        check_products();
    }
    else{
        send_message("⚠️ Invalid Url ⚠️",user_contact)
        console.log("this is not a jumia links")
    }

   res.end();

})





app.listen(process.env.PORT,()=>{
    console.log("server started on port : ",process.env.PORT)
})