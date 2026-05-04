const axios = require('axios');

function getService(url) {
  try {
    const hostname = new URL(url).hostname.replace('www.', '').split('.')[0].toLowerCase();
    if (url.includes('spotify') && hostname === "open") return 'spotify';
    if (url.includes('tiktok') && hostname === "vm") return 'tiktok';
    if (url.includes('youtu.be') && hostname === 'youtu') return 'youtube';
    return hostname;
  } catch (e) {
    return 'unknown';
  }
}

async function getRidOfVmTiktok(url) {
    try {
        const response = await axios.get(url);
        const data = response.data;

        const usernameRegex = /"uniqueId":"([^"]*)"/;
        const usernameMatch = data.match(usernameRegex);
        const username = usernameMatch ? usernameMatch[1] : null;

        const videoIdRegex = /{"itemInfo":{"itemStruct":{"id":"([^"]*)"/;
        const videoIdMatch = data.match(videoIdRegex);
        const videoId = videoIdMatch ? videoIdMatch[1] : null;

        return `https://www.tiktok.com/@${username}/video/${videoId}`;
    } catch(e) {
        return url;
    }
}

module.exports = { getService, getRidOfVmTiktok };