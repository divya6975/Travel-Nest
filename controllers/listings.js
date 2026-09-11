const Listing = require("../models/listing.js");

 module.exports.index = async (req, res)=>{
    const {category}=req.query;
    let allListings;

    if (category)
        {allListings= await Listing.find({category})
    }else{
        allListings=await Listing.find({});
    }
    res.render("listings/index.ejs",{ allListings });
};

module.exports.searchListings = async (req, res) => {
    const { q } = req.query;

    const allListings = await Listing.find({
        $or: [
            { title: { $regex: q, $options: "i" } },
            { location: { $regex: q, $options: "i" } },
            { country: { $regex: q, $options: "i" } },
            { category: { $regex: q, $options: "i" } }
        ]
    });

    res.render("listings/index.ejs", { allListings });
};

module.exports.createNewForm=(req, res)=>{
    res.render("listings/new.ejs");
}

module.exports.showListing = async(req, res)=>{
    let{id} = req.params;
   const listing = await Listing.findById(id)
   .populate({path:"reviews", populate:{ path:"author"},}).populate("owner");
   if(!listing){
         req.flash("error", "Listing you requested for does not exist!");
         res.redirect("/listings");
    }
    console.log(listing);
   res.render("listings/show.ejs", {listing});
};

module.exports.createListing=async(req,res, next)=>{
        let url = req.file.path;
        let filename = req.file.filename;
        const newListing = new Listing(req.body.listing);
        newListing.owner= req.user._id;
        newListing.image= {url, filename};
        const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            newListing.location + ", " + newListing.country
        )}`,
        {
            headers: {
                "User-Agent": "StayNest-Portfolio-Project"
            }
        });
        const data = await response.json();

        if (data.length > 0) {
            newListing.geometry = {
            type: "Point",
            coordinates: [
                parseFloat(data[0].lon),
                parseFloat(data[0].lat)
            ]};
        }
        await newListing.save();
        req.flash("success", "New Listing Created!"); 
        res.redirect("/listings")
};

 module.exports.renderEditForm =async(req,res)=>{
    let{id} = req.params; 
   const listing = await Listing.findById(id);
   if(!listing){
         req.flash("error", "Listing you requested for does not exist!");
         res.redirect("/listings");
    }
    let orignalImageUrl=listing.image.url ;
    orignalImageUrl = orignalImageUrl.replace("/upload", "/upload/h_270,w_250");
   res.render("listings/edit.ejs", {listing, orignalImageUrl});
}

module.exports.updateListing=async (req,res)=>{
    let{id} = req.params; 
    let listing=await Listing.findByIdAndUpdate(id, {...req.body.listing});

    if(typeof req.file !=="undefined"){
         let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }
    req.flash("success", "Listing updated!");
    res.redirect( `/listings/${id}`);
};

module.exports.destroyListing=async(req, res)=>{
    let{id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
     req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}