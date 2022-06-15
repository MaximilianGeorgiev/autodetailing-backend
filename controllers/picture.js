var path = require("path");

exports.addPicture = (request, response) => {
    let paths = [];
    
    // file paths are sent so they can be used and inserted into "EntityPicture" table
    for (let i = 0; i < request.files.length; i++)
        paths.push(path.resolve(request.files[i].path));

    response.status(200).json({ status: "success", paths: paths });
};