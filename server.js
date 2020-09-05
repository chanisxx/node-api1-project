const express = require('express');
const shortid = require('shortid');
var cors = require('cors');
const server = express();

let users = [
    {
        id: "example",
        name: "Jane Doe",
        bio: "Not Tarzan's Wife, another Jane"
    },
    {
        id: "example",
        name: "John Doe",
        bio: "Jane's Actual Husband"
    }
];

server.use(express.json());
server.use(cors(
//     { origin: 'http://localhost:3000' }
));

// server.use(function(req, res) {
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
// });

const findUser = (id) => {
    return users.find(user => user.id === id);
};
//this function doesnt like to work with post method.?

//----------------------------------------------------------//

server.post('/api/users', (req, res) => {
   const userInfo = req.body;
//    const found = users.find(user => user.id === userInfo.id);

    if(userInfo.name && userInfo.bio) {
        userInfo.id = shortid.generate();
        users.push(userInfo);
        if(users.find(user => user.id === userInfo.id)) {
            res.status(201).json(userInfo);
        } else {
            res.status(500).json({errorMessage: "There was an error while saving the user to the database" });
        };
    } else {
        res.status(400).json({errorMessage: "Please provide name and bio for the user."});
    };
});

//----------------------------------------------------------//

server.get('/api/users', (req, res) => {

    if(users.length){
        res.status(200).json(users);
    } else {
        res.status(500).json({errorMessage: "The users information could not be retrieved or there is nothing to retrieve." });
    };
});

//----------------------------------------------------------//

server.get('/api/users/:id', (req, res) => {
   const { id } = req.params;

   const selected = findUser(id);

   if(selected) {
       if(selected.name && selected.bio) {
            res.status(200).json(selected);
       } else {
            res.status(500).json({ errorMessage: "The user information could not be retrieved." });
       }
   } else {
       res.status(404).json({ message: "The user with the specified ID does not exist." });
   }
});

//----------------------------------------------------------//

server.delete(`/api/users/:id`, (req, res) => {
    const { id } = req.params;

    const found = findUser(id);

    if(found) {
        users = users.filter(user => user.id !== id);
        const saved = findUser(id);
        if(!saved){
            res.status(200).json(found);
        } else {
            res.status(500).json({ errorMessage: "The user could not be removed" })
        }
    } else {
        res.status(404).json({ message: "The user with the specified ID does not exist." });
    }
});

//----------------------------------------------------------//

server.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    
    const changes = req.body; // user inputs a change thru the body

    changes.id = id; // the body's id is being assigned to the id from the URL 

    let index = users.findIndex(user => user.id === id); 
    // finding the index of the user in the list of users with a specific id

    if(index !== -1) { // CASE 1 if the index variable returns with a user's index
        if(changes.name && changes.bio) {// CASE 2 if the user inputed a name and bio
            users[index] = changes;// setting the user with the found index to the changes which is the req.body
            if(findUser(id) === changes) { // CASE 3 if the user in the original array equals to the changes made
                res.status(200).json(users[index]); 
            } else { // CASE 3 if the user in the original array does not equal to the changes made
                res.status(500).json({errorMessage: "The user information could not be modified."});
            }
        } else {// CASE 2 if the user did not input a name or bio
            res.status(400).json({errorMessage: "Please provide name and bio for the user."});
        }
    } else { // CASE 1 if the variable index could not find the user's index by the id
        res.status(404).json({ message: "The user with the specified ID does not exist." });
    }
})

//----------------------------------------------------------//

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`listening on port ${PORT}...`);
});