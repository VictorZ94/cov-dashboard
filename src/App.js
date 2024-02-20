import './App.css';
import React, { useState, useEffect } from 'react';
import Select from "react-select";
import Card from "./SummaryCard";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";

function App() {
    const [activeLocation, setActiveLocation] = useState("can");
    const [lastUpdated, setlastUpdated] = useState("");
    const [summaryData, setSummaryData] = useState({});
    const [timeseriesData, setTimeseriesData] = useState({
        datasets: [],
      });

    const getSummaryData = async () => {
        let res;
        if (activeLocation === "can") {
            res = await fetch(`${baseUrl}/summary?geo=${activeLocation}`);
        } else {
            res = await fetch(`${baseUrl}/summary?loc=${activeLocation}`);
        }
        let resData = await res.json();
        console.log(resData)
        let summaryData = resData.data[0];
    
        console.log(summaryData)
        let formattedData = {};
     
        Object.keys(summaryData).map(
          (key) => (formattedData[key] = summaryData[key].toLocaleString())
        );
        console.log(formattedData)
        setSummaryData(formattedData);
      };

  const locationList = [
    { value: "AB", label: "Alberta" },
    { value: "BC", label: "British Columbia" },
    { value: "can", label: "Canada" },
    { value: "MB", label: "Manitoba" },
    { value: "NB", label: "New Brunswick" },
    { value: "NL", label: "Newfoundland and Labrador" },
    { value: "NT", label: "Northwest Territories" },
    { value: "NS", label: "Nova Scotia" },
    { value: "NU", label: "Nunavut" },
    { value: "ON", label: "Ontario" },
    { value: "PE", label: "Prince Edward Island" },
    { value: "QC", label: "Quebec" },
    { value: "SK", label: "Saskatchewan" },
    { value: "YT", label: "Yukon" },
  ];

  useEffect(() => {
    getSummaryData();
    getVersion();
  }, [activeLocation]);

  const baseUrl = "https://api.opencovid.ca";
  const getVersion = async () => {
    const res = await fetch(`${baseUrl}/version`);
    const data = await res.json();
    setlastUpdated(data.summary);
  };

  const timeseriesOptions = {
    responsive: true,
    normalized: true,
    plugins: {
      tooltip: {
        enabled: false,
      },
    },
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0,
      },
    },
  };

  return (
    <div className="App">
      <h1>COVID 19 Dashboard </h1>
      <div className="dashboard-container">
        <div className="dashboard-menu">
        <Select
            options={locationList}
            onChange={(selectedOption) =>
              setActiveLocation(selectedOption.value)
            }
            defaultValue={locationList.filter(
              (options) => options.value === activeLocation
            )}
            className="dashboard-select"
          />
          <p classNa me="update-date">
            Last Updated : {lastUpdated}
          </p>
        </div>
        <div className="dashboard-timeseries">
        <Line
            data={timeseriesData}
            options={timeseriesOptions}
            className="line-chart"
          />
        </div>
        <div className="dashboard-summary">
        <Card title="Total Cases" value={summaryData.cases} />
          <Card
            title="Total Recovered"
            value="not provided"
          />
          <Card title="Total Deaths" value={summaryData.deaths} />
          <Card
            title="Total Vaccinated"
            value={summaryData.vaccine_administration_total_doses}
          />
            
        </div>
      </div>
    </div>
  );
}

export default App;
