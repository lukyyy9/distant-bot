const axios = require('axios');
async function test() {
  const fullPage = await axios.get('https://link.deezer.com/s/33bmdgv8unyixNXq3GGHy');
  console.log("Request URL:", fullPage.request.res ? fullPage.request.res.responseUrl : 'No responseUrl');
  let match = fullPage.data.match(/deezer\.com(?:\/\w+)?\/track\/(\d+)/);
  console.log("Regex match data:", match ? match[1] : 'No match');
}
test().catch(console.error);
