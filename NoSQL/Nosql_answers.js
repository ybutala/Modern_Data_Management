//-- --------------------------
// Question 1 
//-- --------------------------

//65.8252° N - latitude, 144.0657° W - longitude are coordinates of artic circle
db = db.getSiblingDB("sample_geospatial");
db.shipwrecks.find({"latdec": {$gt: 65.8252 }}).count();

//-- --------------------------
// Question 2 
//-- --------------------------
db = db.getSiblingDB("sample_geospatial");
db.shipwrecks.aggregate([
    { $project: {"_id":1, "chart":1, "depth":1, "history":1, "watlev":1, "coordinates":1}},
    { $match: {"history": "Loaded with explosives" }}
]);


//-- --------------------------
// Question 3 
//-- --------------------------
db = db.getSiblingDB("sample_geospatial");
db.shipwrecks.aggregate([
    { $match: {"feature_type": "Wrecks - Visible", "watlev": "covers and uncovers", "coordinates.1": {$gte: 45, $lte: 60}}},
    { $project: {"_id":1, "Wreck Coordinates": "$coordinates", "Wreck Status":"$feature_type", "Water Level": "$watlev"}}
    
]);

//-- --------------------------
// Question 4 
//-- --------------------------

db = db.getSiblingDB("sample_airbnb");
db.listingsAndReviews.find();
db.listingsAndReviews.aggregate([
    { $match: {"address.market": "Sydney", "address.suburb": "Bondi Beach", "bedrooms": {$gte: 2}, "amenities": {"$all":["Kitchen", "Air conditioning"]}}},
    { $count: "Matches found"}
]);

//-- --------------------------
// Question 5 
//-- --------------------------

db = db.getSiblingDB("sample_airbnb");
db.listingsAndReviews.find();
db.listingsAndReviews.aggregate([
    { $match: {"address.market": "Sydney", "address.suburb": "Bondi Beach"}},
    { $sort: {"price": -1}},
    { $limit: 3},
    { $project: {"_id":0, "Listing URL": "$listing_url", "Listing name": "$name", "Nightly price": "$price", "Suburb":  "$address.suburb", "Airbnb market":"$address.market"}}
]);

//-- --------------------------
// Question 6  
//-- --------------------------

db = db.getSiblingDB("sample_airbnb");
db.listingsAndReviews.find();
db.listingsAndReviews.aggregate([
    { $match: {"address.market": {"$in" : ["Oahu", "Kauai", "Maui","The Big Island"]}}},
    { $group: { "_id" : "$address.market",  "Number Of Listings": {$count:{}}, "Lowest nightly listing price": {$min: "$price"}, "Average nightly listing price": {$avg: "$price"}, "Highest nightly listing price": {$max: "$price"}}},
    { $project: { "_id":0,"Hawaiian Market": "$_id", "Number Of Listings": 1, "Lowest nightly listing price": 1, "Average nightly listing price": 1, "Highest nightly listing price": 1}},
    { $sort: {"Number Of Listings": -1}}
]);

//-- --------------------------
// Question 7 
//-- --------------------------

db = db.getSiblingDB("sample_airbnb");
db.listingsAndReviews.find();

db.listingsAndReviews.aggregate([
    { $match: {"address.market": {"$in":["New York", "Istanbul", "Barcelona", "Hong Kong", "Porto", "Sydney"]}, "bedrooms": 1, "room_type" : "Entire home/apt", "amenities": {"$all":["Kitchen", "Wifi", "Coffee maker"]}, "review_scores.review_scores_rating": {"$gte": 95} }},
    { $group: {"_id": "$address.market", "Number Of Listings": {$count:{}}, "Average nightly price": {$avg:"$price"}}},
    { $project: {"_id":0,"City":"$_id", "Number Of Listings":1,"Average nightly price":1 }},
    { $sort: {"Number Of Listings":1}}
]);

//-- --------------------------
// Question 8 
//-- --------------------------

db = db.getSiblingDB("sample_mflix");
db.theaters.find();
db.theaters.aggregate([
    { $group:{ "_id": "$location.address.zipcode", "TotalTheaters": {$count:{}}}},
    { $project:{"_id":0,"Zip": "$_id", "TotalTheaters":1}},
    { $match:{"TotalTheaters": {"$gt" : 5}}},
    { $sort:{"TotalTheaters":-1}}
]);

//-- --------------------------
// Question 9 
//-- --------------------------

db = db.getSiblingDB("sample_mflix");
db.movies.find();
db.movies.aggregate([
    { $unwind: "$directors" },
    { $match:{ "year":{$gte:2003,$lte:2013},"directors":{"$in":["Martin Scorsese","Christopher Nolan","Tim Burton","Spike Lee", "Lucy Walker","Peter Jackson","Susanne Bier","Sang-soo Hong","Robert Rodriguez"]}}},
    { $group:{ "_id": "$directors", "TotalFilmsDirected": {$count:{}}}},
    { $project:{"_id":0,"Director": "$_id", "TotalFilmsDirected":1}},
    { $sort:{"TotalFilmsDirected":-1}}
]);

//--------------------------
// Question 10 
//-- --------------------------

db = db.getSiblingDB("sample_mflix");
db.movies.find();
db.movies.aggregate([
    { $unwind: "$cast" },
    { $match:{ "year":{$gte:2008,$lte:2016},"genres":{"$in":["Comedy"]}}},
    { $group:{ "_id": "$cast", "NumberOfComediesReleased": {$count: {} }, "AverageIMDBRating":{$avg:"$imdb.rating"}}},    
    { $match:{"NumberOfComediesReleased": {$gt : 10}}},
    { $project:{"_id": 0,"Actor": "$_id", "NumberOfComediesReleased":1, "AverageIMDBRating":1}},
    { $sort:{"AverageIMDBRating": -1}}
]);
