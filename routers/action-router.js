const express = require( "express" );

const Actions = require( "../data/helpers/actionModel" );

const router = express.Router();

const sendError = ( e, res ) => {
    res.status( e.status || 500 ).
        json( { message: e.errorMessage || "Server error." } );
};

const error = ( status, errorMessage = "Error retrieving the post/s", ) => ( {
    status,
    errorMessage
} );

// this only runs if the url has /actions
router.get( "/", async ( req, res ) => {
    try
    {
        let results = await Actions.get()
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
        let results = await Actions.get(id);
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
        let action = req.body;
        if(!action.project_id || !action.description || !action.notes){
            throw error(400, "Please include the project id the description and the notes in your request body.");
        }
        let result = await Actions.insert(action);
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
        let result = await  Actions.remove(id)
        if (!result){
            throw error(404, `We did not find a action with the id of ${id}`);
        }
        
        res.status(200).json({message: "The action was removed successfully"});
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
        let action = req.body;
        
        let results = await Actions.update(id, action );
        if (!results){
            throw error(404, `There was no action found with the id of ${id}`);
        }
        
        res.status(200).json(results);
    }catch (err) {
        sendError(err, res);
    }
} );

module.exports = router;
