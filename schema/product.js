const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    user_name : {
        type : String,
        require : true
    },
    product_name  : {
        type : String,
        require : true
    },
    product_link: {
        type : String,
        require : true
    },
    product_currency: String,
    user_contact:{
        type : String,
        require : true
    },
    initial_price : {
        type : Number,
        require : true
    }
})


module.exports = mongoose.model("product",schema);