const express = require( "express" );

const Projects = require( "../data/helpers/projectModel" );

const router = express.Router();

const sendError = ( e, res ) => {
    res.status( e.status || 500 ).
        json( { message: e.errorMessage || "Server error." } );
};

const error = ( status, errorMessage = "Error retrieving the projects/s", ) => ( {
    status,
    errorMessage
} );

// this only runs if the url has /actions
router.get( "/", async ( req, res ) => {
    try
    {
        let results = await Projects.get()
        if (results){
            res.send(200, results);
        }
        
    }catch (err) {
        sendError(error(err.status, err.message), res);
    }
    
    
} );

router.get( "/:id", async ( req, res ) => {
    try {
        let id = req.params.id;
        let results = await Projects.get(id);
        if(!results){
            throw error(404,  `We did not find a action with the id of ${id}`);
        }
        
        res.status(200).json(results);
    }catch (err) {
        sendError(errres);
    }
} );

router.post( "/", async ( req, res ) => {
    try
    {
        let project = req.body;
        if(!project.description || !project.name){
            throw error(400, "Please include the project id the description and the notes in your request body.");
        }
        let result = await Projects.insert(project);
        res.status(201).json(result);
        
    }catch (err) {
        sendError(error(err.status, err.message), res);
    }
} );

router.delete( "/:id", async ( req, res ) => {
    try
    {
        let id = req.params.id;
        if (!id){
            throw error(400, "Please include a id in the params of your request.");
        }
        let result = await  Projects.remove(id)
        if (!result){
            throw error(404, `We did not find a project with the id of ${id}`);
        }
        
        res.status(200).json({message: "The project was removed successfully"});
    }catch (err) {
        sendError(err, res);
    }
} );

router.put( "/:id", async ( req, res ) => {
    try
    {
        let id = req.params.id;
        if (!id){
            throw error(400, "please include a id in the params of your request");
        }
        let project = req.body;
        
        let results = await Projects.update(id, project );
        if (!project){
            throw error(404, `There was no action found with the id of ${id}`);
        }
        
        res.status(200).json(project);
    }catch (err) {
        sendError(err, res);
    }
} );

module.exports = router;
