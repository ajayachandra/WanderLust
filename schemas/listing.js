const Joi = require("joi");

const listingSchema = Joi.object({
    listing : Joi.object({
       title : Joi.string().required(),
       description : Joi.string().required(),
       image : Joi.object({
          filename : Joi.string().required(),
          url : Joi.string().allow("",null)
       }),
       price :Joi.number().required().min(0),
       location : Joi.string().required(),
       country : Joi.string().required(),
       category: Joi.string()
    .valid(
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
    )
    .allow("", null),
    }).required()
});

module.exports=listingSchema;