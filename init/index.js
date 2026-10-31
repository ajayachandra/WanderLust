const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
let { data } = require("./data.js");


async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderLust');
}

main()
.then(()=>{
  console.log("connected successfully");
}).catch((err)=>{
    console.log(err);
});


const initDB = async () => {
    await Listing.deleteMany({});
    data = data.map((obj)=>({...obj, owner: '6ac8788449d5d3367b380f2b'}));
    await Listing.insertMany(data); 
    console.log("data was initialized");
};

initDB();

