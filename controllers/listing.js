const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');

let mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
     
module.exports.index = async (req, res) => {
    const { category, search } = req.query;

    let filter = {};

    if (category) {
        filter.category = category;
    }

    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: "i" } },
            { location: { $regex: search, $options: "i" } },
            { country: { $regex: search, $options: "i" } }
        ];
    }

    const allListings = await Listing.find(filter);

    res.render("listings/index.ejs", { allListings, category});
};


module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.createListing = async (req,res,next)=>{
    let response = await geocodingClient.forwardGeocode({
                           query: req.body.listing.location,
                           limit: 1
                   })
                    .send();

    let newListing = new Listing(req.body.listing);

    newListing.image.url = req.file.path;
    newListing.image.filename = req.file.filename;

    newListing.owner = req.user._id;

    newListing.geometry = response.body.features[0].geometry;

    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
};

module.exports.showListing = async (req,res)=>{
    const { id } =  req.params;
    const listing= await Listing.findById(id)
    .populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    })
    .populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
};

module.exports.renderEditForm = async (req,res)=>{
    const { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/image/upload","/image/upload/w_300");
    res.render("listings/edit.ejs",{listing ,originalImageUrl});
};


module.exports.updateListing = async (req, res) => {
    const { id } = req.params;

    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    }).send();

    let updatedListing = await Listing.findById(id);

    Object.assign(updatedListing, req.body.listing);

    if (response.body.features.length > 0) {
        updatedListing.geometry = response.body.features[0].geometry;
    }

    if (req.file) {
        updatedListing.image = {
            filename: req.file.filename,
            url: req.file.path
        };
    }

    await updatedListing.save();

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};


module.exports.destroyListing = async (req,res)=>{
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
};