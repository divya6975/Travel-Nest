const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, validateListing ,isOwner} = require("../views/middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudCofig.js");
const upload = multer({storage});

router.route("/")
.get(wrapAsync(listingController.index)) //getting all listing index
.post(isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingController.createListing)); //creating new route post req.

router.get("/search", wrapAsync(listingController.searchListings));

//create new route
router.get("/new", isLoggedIn, listingController.createNewForm);

router.route("/:id")
.put(isLoggedIn, isOwner,  upload.single("listing[image]"), validateListing, 
wrapAsync(listingController.updateListing))  //update route
.get(wrapAsync(listingController.showListing)) //show route
.delete(isLoggedIn, wrapAsync(listingController.destroyListing)); //delete route

//edit route
router.get("/:id/edit", isLoggedIn,wrapAsync(listingController.renderEditForm));

module.exports = router;   