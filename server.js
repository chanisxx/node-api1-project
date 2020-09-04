const express = require('express');
const shortid = require('shortid');
var cors = require('cors');
const server = express();

let users = [
    {
        id: "example",
        name: "Jane Doe",
        bio: "Not Tarzan's Wife, another Jane"
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
    
    const changes = req.body;

    changes.id = id;

    let index = users.findIndex(user => user.id === id);

    if(index !== -1) {
        if(changes.name && changes.bio) {
            users[index] = changes;
            if(findUser(id) === changes) {
                res.status(200).json(users[index]);
            } else {
                res.status(500).json({errorMessage: "The user information could not be modified."});
            }
        } else {
            res.status(400).json({errorMessage: "Please provide name and bio for the user."});
        }
    } else {
        res.status(404).json({ message: "The user with the specified ID does not exist." });
    }
})

//----------------------------------------------------------//

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`listening on port ${PORT}...`);
});