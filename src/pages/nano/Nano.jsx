import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import "../nano/nano.scss";

const Nano = () => {
  const [data, setData] = useState([]);
  const [selectedOption, setSelectedOption] = useState("temperature");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      var url;
      try {
        if(startDate == null) {
          url = `http://localhost:4000/sensor/getNanoGraph?graphName=${selectedOption}`;
        } else {
          url = `http://localhost:4000/sensor/getNanoGraph?graphName=${selectedOption}&startDate=${startDate}&endDate=${endDate}`;
        }
        console.log("url: ", url);
        const response = await fetch(url);
        const datafetch = await response.json();
        setData(datafetch);
      } catch (error) {
        console.log(error);
      }
    };
    const interval = setInterval(() => {
      fetchData();
    }, 2000);
    return () => {
      clearInterval(interval);
    };
  }, [selectedOption, startDate, endDate]);

  console.log(selectedOption);

  var chartData = data.length > 0 ? data[0].data : [];
  var timeEpo = data.length > 0 ? data[0].timestamp : [];
  var time = [];

  for (let i = 0; i < timeEpo.length; i++) {
    var temp = timeEpo[i];
    var date = new Date(temp * 1000);
    var year = date.getFullYear();
    var month = String(date.getMonth() + 1).padStart(2, "0");
    var day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    var formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;
    time.push(formattedDate);
  }

  const chart_data = [...chartData].reverse();
  const time_data = [...time].reverse();

  // const chartOptions1 = {
  //   grid: {
  //     show: false,
  //   },
  //   series: [
  //     {
  //       name: "value",
  //       data: chart_data,
  //       stroke: {
  //         curve: "smooth",
  //         dashArray: [5, 5],
  //       },
  //     },
  //   ],
  //   chart: {
  //     height: 500,
  //     type: "line",
  //   },
  //   dataLabels: {
  //     enabled: false,
  //   },
  //   xaxis: {
  //     categories: time_data,
  //     labels: {
  //       style: {
  //         colors: "#ffffff",
  //       },
  //     },
  //   },
  //   yaxis: {
  //     labels: {
  //       style: {
  //         colors: "#ffffff",
  //       },
  //     },
  //   },
  // };
  const chartOptions1 = {
    grid: {
      show: false,
    },
    series: [
      {
        name: "value",
        data: chart_data,
        stroke: {
          curve: "smooth",
          dashArray: [5, 5],
        },
      },
    ],
    chart: {
      height: 500,
      type: "line",
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: time_data,
      labels: {
        style: {
          colors: "#ffffff",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#ffffff",
        },
      },
    },
    tooltip: {
      theme: "dark", // Set the theme to dark
      style: {
        background: "#000000", // Set the background color to black
        color: "#ffffff", // Set the text color to white
      },
      y: {
        title: {
          formatter: function(seriesName) {
            return 'Value: ';
          },
        },
        formatter: function(value) {
          return value;
        },
      },
      marker: {
        show: true,
      },
    },
  };  
  

  console.log(startDate, endDate);

  const options = ["temperature", "battery", "sound-rms", "humidity", "flux-rms", "speed"];

  const handleOptionChange = (event) => {
    let value = event.target.value;
    setSelectedOption(value);
  };

  const handleOptionStartDate = (event) => {
    let value = event.target.value;
    const dateObject = new Date(value);
    let epochTimestamp = dateObject;
    let epochTimeSeconds = Math.floor(epochTimestamp / 1000);
    setStartDate(epochTimeSeconds);
  };

  const handleOptionEndDate = (event) => {
    let value = event.target.value;
    const dateObjectTime = new Date(value);
    let epochTimestamp = dateObjectTime;
    let epochTimeSeconds = Math.floor(epochTimestamp / 1000);
    setEndDate(epochTimeSeconds);
  };

  return (
    <div className="nano">
      <div className="box">
        <div className="select_value">
          <label htmlFor="dropdown">Select</label>
          <select className="value"
            id="dropdown"
            onChange={handleOptionChange}
            value={selectedOption || ""}
          >
            {options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="time">
          <div className="start">
            <label>TimeFrom</label>
            <input
              type="date"
              id="timeFrom"
              name="timeFrom"
              onChange={handleOptionStartDate}
            />
          </div>
          <div className="end">
            <label>TimeTo</label>
            <input
              type="date"
              id="timeTo"
              name="timeTo"
              onChange={handleOptionEndDate}
            />
          </div>
        </div>
        <div className="last_value">
          <span>Last Value</span>
          <p>{chartData[0]}</p>
        </div>
        <div className="last">
          <span>Last Time</span>
          <p>{time[0]}</p>
        </div>
      </div>

      <div className="graph">
        <ReactApexChart
          options={chartOptions1}
          series={chartOptions1.series}
          type="line"
          height={770}
        />
      </div>
    </div>
  );
};

export default Nano;
