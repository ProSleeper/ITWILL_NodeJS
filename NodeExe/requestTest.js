const fetch = require("node-fetch");

async function loadJson(url) {
  const response = null;
  try {
    response = await fetch(url)
  } catch (error) {
    throw new Error(response.status);
  }
   
    if (response.status == 200) {
      return response.json();
    } else {
      throw new Error(response.status);
    }
    
}

loadJson('no-such-user.json')
  .catch(console.log('alert')); // Error: 404