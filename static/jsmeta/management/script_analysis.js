const todayNameContent = Array.from(document.querySelectorAll('.today_name li'))
const today_name = todayNameContent.map(itemText => itemText.firstChild.data)
const todayCountContent = Array.from(document.querySelectorAll('.today_count li'))
const today_count = todayCountContent.map(itemText => itemText.firstChild.data)

var chartArea = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(chartArea, {
    type: 'pie',
    data: {
        labels: today_name,
        datasets: [{
            label: '# of Votes',
            data: today_count,
            backgroundColor: ['rgb(54, 162, 235)', 'rgb(255, 159, 64)', 'rgb(192, 192, 192)', 'rgb(255, 205, 86)',],
            borderColor: '#ffffff',
            borderWidth: 1
        }]
    },
    options: {
      //responsive: false,
      maintainAspectRatio :false,
      scales: {
          y: {
              beginAtZero: true
          }
      },
      plugins: {
          datalabels: {
            formatter: (value) => {
              return value + '%';
            }
          }
      }
    }
});

const weekNameContent = Array.from(document.querySelectorAll('.week_name li'))
const week_name = weekNameContent.map(itemText => itemText.firstChild.data)
const weekCountContent = Array.from(document.querySelectorAll('.week_count li'))
const week_count = weekCountContent.map(itemText => itemText.firstChild.data)

var chartArea2 = document.getElementById('myChart2').getContext('2d');
var myChart = new Chart(chartArea2, {
    type: 'pie',
    data: {
        labels: week_name,
        datasets: [{
            label: '# of Votes',
            data: week_count,
            backgroundColor: ['rgb(54, 162, 235)', 'rgb(255, 159, 64)', 'rgb(192, 192, 192)', 'rgb(255, 205, 86)',],
            borderColor: '#ffffff',
            borderWidth: 1
        }]
    },
    options: {
      //responsive: false,
      maintainAspectRatio :false,
      scales: {
          y: {
              beginAtZero: true
          }
      },
    }
});

var chartArea3 = document.getElementById('myChart3').getContext('2d');

const priceContent = Array.from(document.querySelectorAll('.price li'))
const price = priceContent.map(itemText => itemText.firstChild.data)

var myChart3 = new Chart(chartArea3, {
    type: 'doughnut',
      data: {
        labels: ["주문", "취소"],
        datasets: [{
          data: price,      
          backgroundColor: [
            '#9DCEFF',
            '#F2F3F6'
          ],
          borderWidth: 0,
          scaleBeginAtZero: true,
        }
      ]
    },
    options: {
      maintainAspectRatio :false,
        plugins: {
          datalabels: {
            display: true,
            backgroundColor: '#ccc',
            borderRadius: 3,
            font: {
              color: 'red',
              weight: 'bold',
            }
          },
          doughnutlabel: {
            labels: [{
              text: '550',
              font: {
                size: 20,
                weight: 'bold'
              }
            }, {
              text: 'total'
            }]
          }
        }
    }
  });

const monthContent = Array.from(document.querySelectorAll('.month li'))
const month = monthContent.map(itemText => itemText.firstChild.data)

const numbersContent = Array.from(document.querySelectorAll('.numbers li'))
const numbers = numbersContent.map(itemText => itemText.firstChild.data)

var chartArea1 = document.getElementById('mixedChart').getContext('2d');
var mylineChart = new Chart(chartArea1, {
    type: 'line',
    data: {
        labels: month,
        datasets: [{
            label: '건수',
            data: numbers,
            backgroundColor: ['rgb(192, 192, 192)'],
            borderColor: '#ff4040',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

