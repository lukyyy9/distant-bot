const axios = require('axios');

async function getTrackDetailsFromYouTube(url) {
  const videoId = new URL(url).searchParams.get('v');
  const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
    params: {
      part: 'snippet',
      id: videoId,
      key: process.env.YOUTUBE_API_KEY,
    },
  });
  return {
    artist: response.data.items[0].snippet.channelTitle,
    title: response.data.items[0].snippet.title,
    album: ''
  };
}

async function searchOnYouTube(trackDetails) {
  const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
    params: {
      part: 'snippet',
      q: `${trackDetails.artist} - ${trackDetails.title}`,
      key: process.env.YOUTUBE_API_KEY,
      type: 'video',
      maxResults: 1,
    },
  });
  if (response.data.items.length > 0) {
    return `https://www.youtube.com/watch?v=${response.data.items[0].id.videoId}`;
  }
  return null;
}

module.exports = { getTrackDetailsFromYouTube, searchOnYouTube };