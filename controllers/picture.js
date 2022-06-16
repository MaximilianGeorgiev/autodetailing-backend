const PICTURE_HOST = "http://192.168.1.8:8080/";

exports.addPicture = (request, response) => {
    let paths = [];
    
    // file paths are sent so they can be used and inserted into "EntityPicture" table
    for (let i = 0; i < request.files.length; i++)
        paths.push(PICTURE_HOST + request.files[i].path);

    response.status(200).json({ status: "success", paths: paths });
};