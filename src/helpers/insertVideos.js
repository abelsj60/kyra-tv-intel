module.exports = (playlistData, videoArray) => {
  for (let i = 0; i < playlistData.data.items.length; i++) {
    videoArray.push(playlistData.data.items[i].snippet);
  }
};
