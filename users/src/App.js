import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
      getUsers()
  }, [])

  const getUsers = () => {
      axios.get(`http://localhost:3000/api/users`)
      .then(res => {
          console.log('getData success::',res);
          setUsers(res.data);
      })
      .catch(err => {
        console.error('error::', err);
      });
  };

  const deleteUser = (id) => {
    axios.delete(`http://localhost:3000/api/users/${id}`)
    .then(res => {
      console.log('deleteData success::',res);
      setUsers(res.data);
      getUsers();
    })
    .catch(err => {
      console.error('error::', err);
    });
  }

  return (
    <div>
      <h1>node api1 project</h1>
      <div className='container'>
   
        {users.length ?
        users.map((user, index) => {
          const id = index + 1
          return(
            <div key={user.id} className='card'>
              <section className='section'>
                <span>{`00${id}`}</span> 
                <p>{user.name}</p>
                <p>{user.bio}</p>
              </section>
             
              <button className='button' onClick={() => deleteUser(user.id)}>Delete</button>
             
            </div>
          )
        }) : null
      }
      </div>
    </div>
      
  );
};

export default App;
