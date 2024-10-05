// URL of the NASA data
const url = 'https://data.nasa.gov/resource/b67r-rgxc.json';

// Fetch the data from the API
fetch(url)
  .then(response => {
    // Check if the response is successful (status code 200)
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json(); // Parse the response as JSON
  })
  .then(data => {
    // Log the fetched data to the console
    console.log(data);
    
    // You can now use the data to display it or manipulate it
  })
  .catch(error => {
    // Log any errors that occur during the fetch
    console.error('There was a problem with the fetch operation:', error);
  });
