import constants from '../helpers/constants';
import dayjs from 'dayjs';
import normalizer from '../helpers/normalizer';
import React from 'react';
import Selector from './Selector';
import styled from 'styled-components';
import {
  ListGroup,
  ListGroupItem
} from 'styled-bootstrap-components';

const RestyledListGroup = styled(ListGroup)`
  margin-top: 0px;
`;
const RestyledListGroupItem = styled(ListGroupItem)`
  display: flex;
  background-color: ${p => p.highlightItem && 'lightyellow'};
`;
const Image = styled.img`
  margin-bottom: auto;
  object-fit: contain;
`;
const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 15px;
  width: 100%;
`;
const Heading = styled.div`
  display: flex;
`;
const TextBox = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
`;
const PlainText = styled.p`
  margin-top: ${p => p.top ? p.top : '0px'};
  margin-bottom: 7px;
  margin-left: ${p => p.left && p.left};
  margin-right: ${p => p.right && p.right};
  font-size: ${p => p.small && '.9rem'};
  font-weight: ${p => p.bold ? 'bold' : 'normal'};
`;

export default function EpisodeList(props) {
  const { noCompsMessage } = constants;
  const {
    addToComps,
    compData,
    episodeData,
    isComps,
    label,
    removeFromComps
  } = props;
  // Select data type based on whether we're in comp or episode mode.
  const dataToMap = isComps ? compData : episodeData[normalizer(label)];

  return (
    !isComps || (isComps && dataToMap.length > 0) ? (
      <RestyledListGroup>
        {dataToMap && dataToMap.map((episode, idx) => {
          const isInCompArray = !isComps && typeof compData.find(
            c => c.resourceId.videoId === episode.resourceId.videoId
          ) !== 'undefined';
          const addOrRemoveLabel = isComps || isInCompArray ? 'Remove from' : 'Add to';
          const handleOnClick = comp => () => isComps || isInCompArray ? removeFromComps(comp) : addToComps(comp);

          return (
            <RestyledListGroupItem highlightItem={!isComps && isInCompArray} key={idx}>
              <Image src={episode.thumbnails.default.url} />
              <InnerContainer>
                <TextBox>
                  <Heading>
                    <PlainText right="5px" small={true}>{idx + 1}.</PlainText>
                    <PlainText small={true}>{episode.channelTitle}</PlainText>
                    <PlainText left="7px" small={true}>({dayjs(episode.publishedAt).format('MM/DD/YYYY')})</PlainText>
                  </Heading>
                  <PlainText bold={true} >{episode.title}</PlainText>
                </TextBox>
                <Selector
                  border={true}
                  checked={isInCompArray}
                  id={`${idx}b`}
                  onChange={handleOnClick(episode)}
                  smallText={true}
                  text={`${addOrRemoveLabel} comps`}
                  top="auto"
                  type="checkbox"
                />
              </InnerContainer>
            </RestyledListGroupItem>
          );
        })}
      </RestyledListGroup>
    ) : (
      <PlainText top="15px" left="15px">{noCompsMessage}</PlainText>
    )
  );
}
