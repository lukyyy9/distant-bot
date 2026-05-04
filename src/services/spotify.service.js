const axios = require('axios');
let spotifyAccessToken = null;

async function getSpotifyAccessToken(clientId, clientSecret) {
  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      'grant_type=client_credentials',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching Spotify access token:', error);
    return null;
  }
}

async function spotifyTokenInit() {
    try {
        spotifyAccessToken = await getSpotifyAccessToken(process.env.SPOTIFY_CLIENT_ID, process.env.SPOTIFY_CLIENT_SECRET);
        console.log("Spotify token successfully fetched");
    } catch (error) {
        console.error("Failed to fetch Spotify token", error);
    }
}

async function getTrackDetailsFromSpotify(url) {
  const trackId = url.split('track/')[1].split('?')[0];
  const response = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
    headers: { 'Authorization': `Bearer ${spotifyAccessToken}` },
  });
  return {
    artist: response.data.artists[0].name,
    title: response.data.name,
    album: response.data.album.name
  };
}

async function searchOnSpotify(trackDetails) {
  const response = await axios.get('https://api.spotify.com/v1/search', {
    headers: { 'Authorization': `Bearer ${spotifyAccessToken}` },
    params: {
      q: `${trackDetails.artist} ${trackDetails.title}`,
      type: 'track',
      limit: 1,
    },
  });
  if (response.data.tracks.items.length > 0) {
    return `https://open.spotify.com/track/${response.data.tracks.items[0].id}`;
  }
  return null;
}

module.exports = { spotifyTokenInit, getTrackDetailsFromSpotify, searchOnSpotify };