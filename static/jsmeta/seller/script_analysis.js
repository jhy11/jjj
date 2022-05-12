
var dataset = {
    label: "육류 판매량",
    backgroundColor: ['#ffd950', '#02bc77', '#28c3d7', '#FF6384'],//라벨별 컬러설정 
    borderColor: '#22252B',
    data: [50, 45, 75, 40]
}
var labels = ['돼지고기', '소고기', '닭고기', '양고기'];
var datasets = { datasets: [dataset], labels: labels }

var config = {
    type: 'pie',
    data: datasets, //데이터 셋 
    options: {
        responsive: true,
        maintainAspectRatio: false, //true 하게 되면 캔버스 width,height에 따라 리사이징된다. 
        legend: {
            position: 'top',
            fontColor: 'black',
            align: 'center',
            display: true,
            fullWidth: true,
            labels: {
                fontColor: 'rgb(0, 0, 0)'
            }
        },
        plugins: {
            labels: {//두번째 script태그를 설정하면 각 항목에다가 원하는 데이터 라벨링을 할 수 있다. 
                render: 'value',
                fontColor: 'black',
                fontSize: 15,
                precision: 2
            }
        }
    }
}
var canvas = document.getElementById('pieChart');
var pieChart = new Chart(canvas, config);


var chartArea1 = document.getElementById('barChart').getContext('2d');
// 차트를 생성한다. 
var myChart1 = new Chart(chartArea1, {
    // ①차트의 종류(String)
    type: 'bar',
    // ②차트의 데이터(Object)
    data: {
        // ③x축에 들어갈 이름들(Array)
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        // ④실제 차트에 표시할 데이터들(Array), dataset객체들을 담고 있다.
        datasets: [{
            // ⑤dataset의 이름(String)
            label: '# of Votes',
            // ⑥dataset값(Array)
            data: [12, 19, 3, 5, 2, 3],
            // ⑦dataset의 배경색(rgba값을 String으로 표현)
            backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)', 'rgb(153, 102, 255)', 'rgb(255, 159, 64)',],
            // ⑧dataset의 선 색(rgba값을 String으로 표현)
            borderColor: '#00ff0000',
            // ⑨dataset의 선 두께(Number)
            borderWidth: 1
        }]
    },
    // ⑩차트의 설정(Object)
    options: {
        // ⑪축에 관한 설정(Object)
        scales: {
            // ⑫y축에 대한 설정(Object)
            y: {
                // ⑬시작을 0부터 하게끔 설정(최소값이 0보다 크더라도)(boolean)
                beginAtZero: true
            }
        }
    }
});

/*

var chartArea = document.getElementById('myChart').getContext('2d');
// 차트를 생성한다. 
var myChart = new Chart(chartArea, {
    // ①차트의 종류(String)
    type: 'pie',
    // ②차트의 데이터(Object)
    data: {
        // ③x축에 들어갈 이름들(Array)
        labels: ['Void', 'Surface', 'Corona', 'Noise'],
        // ④실제 차트에 표시할 데이터들(Array), dataset객체들을 담고 있다.
        datasets: [{
            // ⑤dataset의 이름(String)
            label: '# of Votes',
            // ⑥dataset값(Array)
            data: [12, 19, 3, 3],
            // ⑦dataset의 배경색(rgba값을 String으로 표현)
            //backgroundColor: 'rgba(255, 99, 132, 0.2)',
            backgroundColor: ['rgb(54, 162, 235)', 'rgb(255, 159, 64)', 'rgb(192, 192, 192)', 'rgb(255, 205, 86)',],
            // ⑧dataset의 선 색(rgba값을 String으로 표현)
            borderColor: '#ffffff',
            // ⑨dataset의 선 두께(Number)
            borderWidth: 1
        }]
    },
    // ⑩차트의 설정(Object)
    options: {
        // ⑪축에 관한 설정(Object)
        scales: {
            // ⑫y축에 대한 설정(Object)
            y: {
                // ⑬시작을 0부터 하게끔 설정(최소값이 0보다 크더라도)(boolean)
                beginAtZero: true
            }
        }
    }
});

var chartArea = document.getElementById('myChart2').getContext('2d');
// 차트를 생성한다. 
var myChart = new Chart(chartArea, {
    // ①차트의 종류(String)
    type: 'pie',
    // ②차트의 데이터(Object)
    data: {
        // ③x축에 들어갈 이름들(Array)
        labels: ['Void', 'Surface', 'Corona', 'Noise'],
        // ④실제 차트에 표시할 데이터들(Array), dataset객체들을 담고 있다.
        datasets: [{
            // ⑤dataset의 이름(String)
            label: '# of Votes',
            // ⑥dataset값(Array)
            data: [12, 19, 3, 3],
            // ⑦dataset의 배경색(rgba값을 String으로 표현)
            //backgroundColor: 'rgba(255, 99, 132, 0.2)',
            backgroundColor: ['rgb(54, 162, 235)', 'rgb(255, 159, 64)', 'rgb(192, 192, 192)', 'rgb(255, 205, 86)',],
            // ⑧dataset의 선 색(rgba값을 String으로 표현)
            borderColor: '#ffffff',
            // ⑨dataset의 선 두께(Number)
            borderWidth: 1
        }]
    },
    // ⑩차트의 설정(Object)
    options: {
        // ⑪축에 관한 설정(Object)
        scales: {
            // ⑫y축에 대한 설정(Object)
            y: {
                // ⑬시작을 0부터 하게끔 설정(최소값이 0보다 크더라도)(boolean)
                beginAtZero: true
            }
        }
    }
});

*/


