const schedule = require('node-schedule');
const send_message = require("./send_message")
const mongoose = require("mongoose")
const scrape_data =require('./scrape')
const Product = require("./schema/product")


function calculate_discount(original_price,selling_price){
    const differnce = original_price - selling_price;
    const div = differnce / original_price;
    const discount_percent = div * 100 
    return Math.floor(discount_percent);
}

async function check_products(){
    var item_list= await Product.find({});
    if(item_list.length>0){
        for(var i in item_list){
            scrape_data(item_list[i].product_link).then(async (data)=>{
                console.log(data.price);
                console.log(item_list[i].initial_price)
                console.log("---------------------")
                if(data.price <item_list[i].initial_price){
                    console.log("item price has reduced")
                    var dis_percentage = calculate_discount(item_list[i].initial_price,data.price).toString()+"%";
                    var alert_message  = "🚨🚨*Discount Alert* 🚨🚨 \n"+item_list[i].product_name+"\n"+"has dropeed from " +item_list[i].product_currency+item_list[i].initial_price.toLocaleString()+" to "+item_list[i].product_currency+data.price.toLocaleString() + "("+dis_percentage+") discount"+"\n \n"+item_list[i].product_link
                    send_message(alert_message,item_list[i].user_contact)
                    Product.deleteOne({user_contact:item_list[i].user_contact}).then(function(){
                        console.log('item remove')
                    }).catch(function(error){
                        console.log("an error occured");
                    })
                }else{
                    console.log("item price did not change")
                }
            }).catch((error)=>{
                console.log(error)
                send_message(error.toString(),"whatsapp:+2348143648991")
                // Product.deleteOne({user_contact:item_list[i].user_contact}).then(function(){
                //     console.log('item remove')
                // }).catch(function(error){
                //     console.log("an error occured");
                // })
            });
       }
    }
}
    

module.exports = check_products;
