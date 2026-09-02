require("dotenv").config();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const MONGO_URL = 'mongodb://127.0.0.1:27017/StayNest';


async function main() {
    await mongoose.connect(MONGO_URL);

    const listings = await Listing.find({
        geometry: { $exists: false }
    });

    console.log(`Found ${listings.length} listings without coordinates.`);

    for (const listing of listings) {
        const query = `${listing.location}, ${listing.country}`;

        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`,
            {
                headers: {
                    "User-Agent": "StayNest-Portfolio-Project"
                }
            }
        );

        const data = await response.json();

        if (data.length === 0) {
            console.log(`Could not find: ${query}`);
            continue;
        }

        listing.geometry = {
            type: "Point",
            coordinates: [
                parseFloat(data[0].lon),
                parseFloat(data[0].lat)
            ]
        };

        await listing.save();

        console.log(`${query}`);
        
        // Nominatim asks clients to keep requests to about 1 per second.
        await new Promise(resolve => setTimeout(resolve, 1100));
    }

    await mongoose.connection.close();
    console.log("Finished!");
}

main().catch(err => {
    console.error(err);
    mongoose.connection.close();
});