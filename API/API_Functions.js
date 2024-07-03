// API Funktionen 
function delete_user(userId) {
    const apiUrl = `http://127.0.0.1:3000/api/users/${userId}`;
  
      fetch(apiUrl, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json'
          }
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          console.log('User deleted successfully');
      })
      .catch(error => {
          console.error('Error:', error);
      });
  }
  
  
  function create_user(name, password, score) {
      const apiUrl = 'http://127.0.0.1:3000/api/users';
  
      const userData = {
          name: name,
          password: password,
          score: score
      };
  
      fetch(apiUrl, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .then(data => {
          console.log('User created successfully:', data);
      })
      .catch(error => {
          console.error('Error:', error);
      });
  }
  
  
  function get_user(userId) {
         const apiUrl = `http://127.0.0.1:3000/api/users/${userId}`;
          fetch(apiUrl)
  
          .then(response => {
              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }
              return response.json();
          })
          .then(data => {
              // Process the fetched data
              console.log(data);
          })
          .catch(error => {
              // Handle any errors
              console.error('Error:', error);
          });
  }
  
  //Wird momentan über die Login.js gehandelt

//   function authenticate_user(usr,pwd) {
//       return fetch('http://localhost:3000/api/authenticate', {
//           method: 'POST',
//           headers: {
//               'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({ usr:usr , pwd:pwd})
//       })
//       .then(response => {
//           if (!response.ok) {
//               throw new Error('Login failed');
//           }
//           return response.json();
//       });
//  }
  
  module.exports = {
    delete_user,
    create_user,
    get_user,
    //authenticate_user
  };