const destination =require('../destinations.json')
var fs = require('fs');

const object={}

destination.forEach(dest=>{
    object[dest.id]=dest;
})


fs.writeFile("output.json", JSON.stringify(object), function(err) {
    if (err) {
        console.log(err);
    }
});