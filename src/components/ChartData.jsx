import { Line } from 'react-chartjs-2';
import dayjs from 'dayjs';
import groupByTime from 'group-by-time';
import Loader from './Loader';
import normalizer from '../helpers/normalizer';
import React from 'react';

export default function ChartData(props) {
  const { episodeData, label } = props;
  const dataToMap = episodeData[normalizer(label)];
  let data, options, grouped, finalGroupedData;

  if (dataToMap) {
    // Docs: https://github.com/Techwraith/group-by-time
    // Note: This package is using an outdated lodash method....
    // Warning: npm WARN deprecated lodash.createcallback@2.4.4: This package is discontinued. Use lodash.iteratee@^4.0.0.

    // This is where we'll start our chart data.
    const startDate = dayjs(new Date(2018, 8, 1));

    // Let's get all the dates from our episodesData.
    const dates = dataToMap.map(episode => episode.publishedAt);

    // Let's create an array w/the dates from after our cutoff.
    // Format it with the 'ts' key for our date grouper.
    const datesForChart = dates.filter(
      date => dayjs(date).isAfter(startDate)
    ).map(date => ({ ts: date }));

    // The date grouper will build an array of grouped objects.
    grouped = groupByTime(datesForChart, 'ts', 'week');

    // Now we'll build our final data array, formatted for Chart.js.
    finalGroupedData = Object.keys(grouped).map(key => {
      const lastIdxInSequence = grouped[key].length - 1;
      const totalUploadsForWeek = grouped[key].length;
      const firstDate = grouped[key][lastIdxInSequence].ts;
      return {
        x: dayjs(firstDate).format('MM/DD/YYYY'),
        y: totalUploadsForWeek
      };
    }).reverse();

    // Chart.js docs: https://www.chartjs.org/docs/latest/axes/cartesian/time.html
    data = {
      labels: finalGroupedData.map(weekObj => weekObj.x),
      datasets: [
        {
          label: `${label}'s weekly uploads (since fall 2018)`,
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: '#007bff',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: '#007bff',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: finalGroupedData
        }
      ]
    };
    options = {
      scales: {
        yAxes: [{
          ticks: {
            min: 3,
            max: 0
          }
        }]
      }
    };
  }

  return !dataToMap ?
    <Loader /> :
    <Line data={data} options={options} />;
}
