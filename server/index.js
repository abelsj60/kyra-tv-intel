require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const { google } = require('googleapis');
const insertVideos = require('../src/helpers/insertVideos');
const path = require('path');
const PORT = process.env.PORT;
const volleyball = require('volleyball');

app.use(volleyball);
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../dist')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/all-channel-videos/:channelId', async (req, res, next) => {
  try {
    const channelId = req.params.channelId;
    const videos = [];

    // Connect to YouTube
    // Docs: https://github.com/googleapis/google-api-nodejs-client
    const youTube = await google.youtube({
      version: process.env.YOUTUBE_API_VERSION,
      auth: process.env.YOUTUBE_API_KEY
    });

    // Get uploads playlist ID
    // Docs: https://developers.google.com/youtube/v3/docs/channels
    const channelData = await youTube.channels.list({ id: channelId, part: 'contentDetails' });
    const playlistOptions = {
      part: 'snippet',
      playlistId: channelData.data.items[0].contentDetails.relatedPlaylists.uploads,
      maxResults: 50 // YT's max
    };

    // Get items from the 'uploads' playlist.
    // Docs: https://developers.google.com/youtube/v3/docs/playlistItems
    let playlistData = await youTube.playlistItems.list(playlistOptions);

    // Loop over the snippets to add individual video objects to our array.
    insertVideos(playlistData, videos);

    // Now, loop through the rest of the pages for the rest of the data!
    while (playlistData.data.nextPageToken) {
      Object.assign(playlistOptions, { pageToken: playlistData.data.nextPageToken });
      playlistData = await youTube.playlistItems.list(playlistOptions);

      // Loop over snippets again to get all the individual video objects.
      insertVideos(playlistData, videos);
    }

    res.json(videos); // Let Express JSON-ify before resonding.
  } catch (error) {
    next(error);
  }
});

app.get('/api/vid-volume/:channelId/:currentNumOfVideos', async (req, res, next) => {
  try {
    const channelId = req.params.channelId;
    const currentNumOfVideos = req.params.currentNumOfVideos;

    // Connect to YouTube
    // Docs: https://github.com/googleapis/google-api-nodejs-client
    const youTube = await google.youtube({
      version: process.env.YOUTUBE_API_VERSION,
      auth: process.env.YOUTUBE_API_KEY
    });

    // Get uploads playlist ID
    // Docs: https://developers.google.com/youtube/v3/docs/channels
    const channelData = await youTube.channels.list({ id: channelId, part: 'contentDetails' });
    const playlistOptions = {
      part: 'snippet',
      playlistId: channelData.data.items[0].contentDetails.relatedPlaylists.uploads,
      maxResults: 50 // YT's max
    };

    // Get items from the 'uploads' playlist.
    // Docs: https://developers.google.com/youtube/v3/docs/playlistItems
    const playlistData = await youTube.playlistItems.list(playlistOptions);

    // Test if the new number matches the old number. If the new number is bigger, send a 200, otherwise a 304.
    // If the React app gets a 200, it will ask the API to get the new list of videos.
    // Note: This can/should be refactored to either limit what's requested from YouTube (didn't seem possible)
    // or to store the result, say in a database, so as not to make a duplicative call...
    res.status(playlistData.data.pageInfo.totalResults > currentNumOfVideos ? 200 : 304).end();
  } catch (error) {
    next(error);
  }
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Turn off eslint on next line, all four params makes it an error handler.
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error(err);
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || 'Internal server error.');
});

app.listen(PORT, () => {
  console.log('Heyo?');
  console.log(`Heyo! We're running on port ${PORT} today.`);
});

module.exports = app;
