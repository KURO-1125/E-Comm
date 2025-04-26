const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://ydeepu1125:VqrNafpXkcjetq1c@mernstackpractice.iqtujwo.mongodb.net/Ecom-Express')
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });