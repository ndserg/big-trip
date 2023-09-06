import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import AbstractComponent from './abstract-component';
import { EVENT_TYPES } from '../const';
import { getEventSpentTime } from '../utils/common';

const getImage = (label) => {
  const img = new Image();
  img.src = `img/icons/${label.toLowerCase()}.png`;
  return img;
};

Chart.register(ChartDataLabels);

const createChart = (moneyCtx, dataStat, title, sign, signPosition) => {
  const statLabels = dataStat.map((item) => item[0].toUpperCase());
  const statDatas = dataStat.map((item) => item[1]);

  return new Chart(
    moneyCtx,
    {
      type: 'bar',
      plugins: [{
        afterDraw: (chart) => {
          chart.scales.y.ticks.forEach((tick, value) => {
            const img = getImage(tick.label);
            const y = chart.scales.y.getPixelForTick(value);
            img.onload = chart.ctx.drawImage(img, 100, y - 18, 34, 35);
          });
        },
      }],
      data: {
        labels: statLabels,
        datasets: [
          {
            data: statDatas,
            backgroundColor: '#ffffff',
            hoverBackgroundColor: '#c5c5c5',
            customSign: sign,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        elements: {
          bar: {
            borderWidth: 2,
          },
        },
        plugins: {
          datalabels: {
            anchor: 'end',
            align: 'left',
            font: {
              size: 16,
              weight: 'bold',
              textAlign: 'right',
            },
            formatter: (value, context) => {
              const dataString = signPosition === 'end' ? `${context.dataset.customSign} ${value}` : ` ${value} ${context.dataset.customSign}`;
              return dataString;
            },
          },
          legend: {
            display: false,
          },
          title: {
            display: true,
            position: 'left',
            padding: {
              top: 30,
              bottom: 70,
            },
            font: {
              size: 30,
              weight: 'bold',
            },
            text: title,
          },
          tooltip: {
            enabled: false,
          },
        },
        scales: {
          y: {
            grid: {
              display: false,
            },
            border: {
              display: false,
            },
            ticks: {
              color: '#000000',
              padding: 20,
              font: {
                size: 14,
                weight: 'bold',
              },
            },
          },
          x: {
            grid: {
              display: false,
            },
            border: {
              display: false,
            },
            ticks: {
              display: false,
            },
          },
        },
      },
    },
  );
};

const createStatisticsTemplate = () => {
  return (
    `<section class="statistics">
      <h2 class="visually-hidden">Trip statistics</h2>

      <div class="statistics__item statistics__item--money">
        <canvas class="statistics__chart statistics__chart--money" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--transport">
        <canvas class="statistics__chart statistics__chart--transport" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--time-spend">
        <canvas class="statistics__chart statistics__chart--time" width="900"></canvas>
      </div>
    </section>
    `);
};

export default class Statistics extends AbstractComponent {
  #moneyChart;

  #activityChart;

  #pointsModel;

  #timeSpentChart;

  constructor(pointsModel) {
    super();

    this.#moneyChart = null;

    this.#activityChart = null;

    this.#timeSpentChart = null;

    this.#pointsModel = pointsModel;
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  #renderCharts() {
    const statisticsContainer = this.getElement();

    const statistics = this.#getStatistics();
    const moneyCtx = statisticsContainer.querySelector('.statistics__chart--money');
    const transportCtx = statisticsContainer.querySelector('.statistics__chart--transport');
    const tripTimeCtx = statisticsContainer.querySelector('.statistics__chart--time');

    const multiplier = (data) => {
      return data < 3 ? 100 : 80;
    };

    if (statistics.money.length && statistics.money.length > 0) {
      moneyCtx.height = statistics.money.length * multiplier(statistics.money.length);
      this.#moneyChart = createChart(moneyCtx, statistics.money, 'MONEY', '€', 'end');
    }

    if (statistics.activity.length && statistics.activity.length > 0) {
      transportCtx.height = statistics.activity.length * multiplier(statistics.activity.length);
      this.#activityChart = createChart(transportCtx, statistics.activity, 'TRANSPORT', 'x', 'start');
    }

    if (statistics.time.length && statistics.time.length > 0) {
      tripTimeCtx.height = statistics.time.length * multiplier(statistics.time.length);
      this.#timeSpentChart = createChart(tripTimeCtx, statistics.time, 'TIME SPENT', 'H', 'end');
    }
  }

  #destroyCharts() {
    if (this.#moneyChart) {
      this.#moneyChart.destroy();
      this.#moneyChart = null;
    }

    if (this.#activityChart) {
      this.#activityChart.destroy();
      this.#activityChart = null;
    }

    if (this.#timeSpentChart) {
      this.#timeSpentChart.destroy();
      this.#timeSpentChart = null;
    }
  }

  show() {
    super.show();

    this.#renderCharts();
  }

  hide() {
    super.hide();

    this.#destroyCharts();
  }

  #getStatistics() {
    const points = this.#pointsModel.getFilteredPoints();

    const transportsStat = points.reduce((acc, cur) => {
      const isTransfer = EVENT_TYPES.transfer.includes(cur.type);

      if (isTransfer && acc[cur.type]) {
        acc[cur.type] += 1;
      } else if (isTransfer) {
        acc[cur.type] = 1;
      }

      return acc;
    }, {});

    const offersTotal = (offers) => offers.reduce((acc, offer) => {
      return acc + offer.price;
    }, 0);

    const moneyTotal = points.reduce((acc, cur) => {
      const offersSum = cur.offers.length > 0 ? offersTotal(cur.offers) : 0;

      if (acc[cur.type]) {
        acc[cur.type] += cur.base_price + offersSum;
      } else {
        acc[cur.type] = cur.base_price + offersSum;
      }

      return acc;
    }, {});

    const timeSpent = points.reduce((acc, cur) => {
      const isActivity = EVENT_TYPES.activity.includes(cur.type);

      if (isActivity && acc[cur.type]) {
        acc[cur.type] += getEventSpentTime(cur.date_from, cur.date_to);
      } else if (isActivity) {
        acc[cur.type] = getEventSpentTime(cur.date_from, cur.date_to);
      }

      return acc;
    }, {});

    return {
      money: Object.entries(moneyTotal).sort((a, b) => b[1] - a[1]),
      activity: Object.entries(transportsStat).sort((a, b) => b[1] - a[1]),
      time: Object.entries(timeSpent).sort((a, b) => b[1] - a[1]),
    };
  }
}
