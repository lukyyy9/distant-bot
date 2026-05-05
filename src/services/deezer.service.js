const axios = require('axios');

async function getTrackDetailsFromDeezer(url) {
  let trackId = '';
  if (url.includes('deezer.page.link') || url.includes('link.deezer.com') || url.includes('deezer.com/fr/track') || url.includes('deezer.com/track') || url.includes('deezer.com/')) {
      if (url.includes('deezer.page.link') || url.includes('link.deezer.com')) {
          const fullPage = await axios.get(url);
          const urlExtractRegex = /https:\/\/www\.deezer\.com(?:\/\w+)?\/track\/(\d+)/;
          const finalUrl = (fullPage.request && fullPage.request.res && fullPage.request.res.responseUrl) || '';
          const match = finalUrl.match(urlExtractRegex) || (typeof fullPage.data === 'string' ? fullPage.data.match(urlExtractRegex) : null);
          if(match) trackId = match[1];
      } else {
          trackId = url.split('track/')[1].split('?')[0];
      }
  }
  
  if(!trackId) throw new Error('Cannot extract Deezer Track ID');

  const response = await axios.get(`https://api.deezer.com/track/${trackId}`);
  return {
    artist: response.data.artist.name,
    title: response.data.title,
    album: response.data.album.title
  };
}

async function searchOnDeezer(trackDetails) {
  const query = `artist:"${trackDetails.artist}" album:"${trackDetails.album}" track:"${trackDetails.title}"`;
  const response = await axios.get('https://api.deezer.com/search', {
    params: { q: query },
  });
  if (response.data.data && response.data.data.length > 0) {
    return `https://www.deezer.com/track/${response.data.data[0].id}`;
  }
  return null;
}

module.exports = { getTrackDetailsFromDeezer, searchOnDeezer };