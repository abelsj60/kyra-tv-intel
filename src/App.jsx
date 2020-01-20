import constants from './helpers/constants';
import ChartData from './components/ChartData.jsx';
import DesktopNavigationColumn from './components/DesktopNavigationColumn';
import EpisodeList from './components/EpisodeList';
import Loader from './components/Loader';
import ModeSelect from './components/ModeSelect';
import normalizer from './helpers/normalizer';
import fetch from 'node-fetch';
import React, { Fragment, useEffect, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import MobileNavigationButton from './components/MobileNavigationButton';

// Sticky footer: https://stackoverflow.com/a/47341369

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0px;
  }

  #app {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: ivory;
  }
`;
const Header = styled.header`
  margin: 8px;
  display: flex;
  justify-content: space-between;
`;
const PlainText = styled.p`
margin: 0px;
font-size: 1rem;
`;
const ErrorText = styled.p`
  font-weight: bold;
  margin-left: 15px;
`;
const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-top: 15px;
  margin-bottom: 15px;
  margin-left: 8px;
  margin-right: 8px;
  // Required for silly flexbox browser bug.
  min-height: 0; 

  @media (min-width: 690px) {
    display: flex;
    flex-direction: row;
  }
`;
const NavigationContainer = styled.div`
  display: flex;
  flex-direction: ${p => p.row ? 'row' : 'column'};
  margin-left: ${p => p.left && p.left};
  margin-bottom: ${p => p.bottom && p.bottom};
  
  @media (min-width: 690px) {
    ${p => !p.disableResponsiveness && 'margin-bottom: 0px'};
  }
`;
const LeftContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;
const SmallHed = styled.h2`
  font-size: 1.2rem;
  font-weight: normal;
  margin-bottom: 10px;
  margin-left: ${p => p.left ? p.left : '7px'};
  margin-top: ${p => p.top ? p.top : '0px'};

  @media (min-width: 690px) {
    margin-bottom: 10px;
    margin-top: 0px;
  }
`;
const ContentHolder = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
`;
const Stage = styled.div`
  flex: 1;
  margin-left: 7px;
  margin-right: 7px;
`;
const Footer = styled.footer`
  margin: 8px;
  display: flex;
  justify-content: flex-end;
`;

export default function App() {
  const {
    blurb,
    company,
    loadingError,
    modeTypes,
    showData,
    techSupport
  } = constants;

  // Convenience functions for show data.
  const getShowName = idx => showData[idx].name;
  const getShowChannelId = idx => showData[idx].channelId;

  // State elements w/sensible defaults. Akin to 'this.state' in a class Component.
  const [ hideShowMenu, toggleShowMenu ] = useState(true);
  const [ showLabel, setShowLabel ] = useState(showData[0].name); // 'PAQ'
  const [ modeLabel, setModeLabel ] = useState(modeTypes[0]); // 'Data'
  const [ episodeData, setEpisodeData ] = useState({
    [normalizer(getShowName(0))]: []
  }); // 'PAQ'
  const [ isLoading, setIsLoading ] = useState(false);
  const [ isError, setIsError ] = useState(false);
  const [ compData, setCompData ] = useState([]);

  // Load data, now and later!
  useEffect(() => {
    // The hook can't be async b/c promises are not allowed to be returned from it.
    // Let's create an async function inside the hook's scope to handle the fetch.
    // Note: We're actually calling Express, which, in turn, calls YouTube. Why?
    // So we don't have to share our API key w/the WORLD!
    const callYouTubeForData = async () => {
      const showIdx = showData.map(show => show.name).indexOf(showLabel);
      const showName = normalizer(getShowName(showIdx));

      // Let's manage the hook's use. Only fetch data when we have none.
      // At present, no data means:
      //  -a. The show's name isn't in the episodeData object.
      //  -b. The show's name is in the episodeData object, but its array is empty.
      //  -Note: Could a show be on YouTube w/no videos? Worry for another day...
      if (!episodeData[showName] || episodeData[showName].length < 1) {
        try {
          // Let's create a utility function to request YouTube data from our API.
          // Why? So we can use it twice: now and later via setInterval.
          const fetchDataAndSetState = async () => {
            const response = await fetch(`/api/all-channel-videos/${getShowChannelId(showIdx)}`);
            const parsedResponse = await response.json();
            setEpisodeData(Object.assign(episodeData, { [showName]: parsedResponse }));
          };

          setIsError(false);
          setIsLoading(true);
          await fetchDataAndSetState();
          setIsLoading(false);

          // Let's set an interval of 60 seconds to check for more videos. Here's how:
          //  -a. Call /vid-volume w/channelID and the number of eps for this show.
          //  -b. The /vid-volume endpoint will call YouTube and check the channel's total videos.
          //  -c. The /vid-volume endpoint will return 304 for no new videos and 200 for new videos.
          //  -d. If a 200, response.ok will be true and we'll call /all-channel-videos to get them.

          // ! DISABLE THE FOLLOWING SETINTERVAL IF YOU WANT TO SAVE YOUTUBE QUOTA ITEMS!!!!

          setInterval(async () => {
            try {
              const response = await fetch(
                `/api/vid-volume/${getShowChannelId(showIdx)}/${episodeData[showName].length}`
              );

              if (response.ok) {
                await fetchDataAndSetState();
              }
            } catch (error) {
              console.error('Error checking for new videos:', error);
            }
          }, 60000);
        } catch (error) {
          setIsError(true);
          console.error('Error getting YouTube data:', error);
        }
      }
    };

    callYouTubeForData();
  }, [ showLabel ]);

  // Let users add an episode to the comp list.
  const addToComps = comp => {
    // Filter to ensure the episode isn't already in the list.
    if (compData.filter(c => c.resourceId.videoId === comp.resourceId.videoId).length < 1) {
      setCompData(compData.concat([comp]));
    }
  };

  // Let users remove an episode from the comp list.
  // Mechanism --> use .filter to exclude the episode id selected for removal.
  const removeFromComps = comp => setCompData(compData.filter(c => c.resourceId.videoId !== comp.resourceId.videoId));

  // Curry twice, so we don't need an anonymous function in onClicks.
  //  1. Create a closure around the data and custom setState function.
  //  2. Create a closure around the index.
  const handleShowLabel = idx => () => {
    if (!hideShowMenu) {
      toggleShowMenu(true); // Close the menu if open
    }

    setShowLabel(getShowName(idx));
  };
  const handleModeLabel = idx => () => setModeLabel(modeTypes[idx]);
  const isEpisodeMode = modeLabel === 'Episodes';

  return (
    <Fragment>
      <GlobalStyle />
      <Header>
        <PlainText>{company}</PlainText>
        <PlainText>{blurb}</PlainText>
      </Header>
      <Main>
        <NavigationContainer bottom="15px">
          <SmallHed>Shows</SmallHed>
          <DesktopNavigationColumn
            getLabel={getShowName}
            labelData={showData}
            label={showLabel}
            left="7px"
            right="7px"
            setLabel={handleShowLabel}
            top="0px"
          />
          <MobileNavigationButton
            labelData={showData}
            getLabel={getShowName}
            hideLabels={hideShowMenu}
            label={showLabel}
            left="7px"
            right="7px"
            setHiddenStatus={toggleShowMenu}
            setLabel={handleShowLabel}
          />
        </NavigationContainer>
        <LeftContainer>
          <NavigationContainer bottom="12px" disableResponsiveness={true} left="7px" row={true}>
            <ModeSelect handleModeLabel={handleModeLabel} modeLabel={modeLabel} modeTypes={modeTypes} />
          </NavigationContainer>
          <ContentHolder>
            <Stage>
              {isEpisodeMode && isError && <ErrorText>{loadingError}</ErrorText>}
              {isEpisodeMode && isLoading && <Loader />}
              {isEpisodeMode && !isLoading && (
                <EpisodeList
                  episodeData={episodeData}
                  addToComps={addToComps}
                  compData={compData}
                  removeFromComps={removeFromComps}
                  label={showLabel}
                />
              )}
              {modeLabel === 'Comps' && (
                <EpisodeList
                  isComps={true}
                  compData={compData}
                  removeFromComps={removeFromComps}
                />
              )}
              {modeLabel === 'Data' && (
                <ChartData episodeData={episodeData} label={showLabel} />
              )}
            </Stage>
          </ContentHolder>
        </LeftContainer>
      </Main>
      <Footer>
        <PlainText>{techSupport}</PlainText>
      </Footer>
    </Fragment>
  );
}
