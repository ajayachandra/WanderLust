const mongoose = require("mongoose");
const Review = require("./review.js");

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description:{
        type: String
    },
    image: {
        filename:{
           type: String
        },
        url:{
            type: String
        }
    },
    price: {
        type: Number,
    },
    location:{
       type: String
    },
    country: {
        type: String
    },

    reviews : [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Review"
        }
    ],

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    geometry: {
            type: {
                 type: String, 
                 enum: ['Point'], 
                 required: true
            },
               
           coordinates: {
                 type: [Number],
                 required: true
            }
    },

     category: {
        type: String,
        enum: [
            "Trending",
            "Rooms",
            "Iconic Cities",
            "Castles",
            "Mountains",
            "Amazing Pools",
            "Camping",
            "Farms",
            "Arctic",
            "Domes",
            "Boats"
        ],
        default: "Trending"
    }

});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
       await Review.deleteMany({_id: {$in : listing.reviews}});
    }
});

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;