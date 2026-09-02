const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { string, required } = require("joi");

const ListingSchema = new Schema({
    title:{
        type: String,
        required: true,
    },
    description: String,
    image:{
       url:String, 
       filename:String,
    },
    price:Number,
    category:{
        type:String,
        enum:["Trending", "Rooms","Iconic City", "Mountains","Castle","Amazing Pool","Camping","Farms","Arctic"]
    },
    location: String,
    country: String,
    geometry:{
        type:{
            type:String,
            enum:["Point"],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        }
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        },
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
});
 
ListingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in: listing.reviews}});
    }
});
const Listing = mongoose.model("Listing", ListingSchema);
module.exports = Listing;