import React from "react";
import { Bar } from "react-chartjs-2/es";
import moment from "moment";
import "../index.css";
const ThreeDayForecast = props => {
  let degrees = [];
  let humidity = [];
  let times = [];
  props.info.map(item => {
    degrees.push(Math.ceil(item.temp));
    humidity.push(item.humidity);
    times.push(moment(item.time).format("dddd"));
  });
  times.pop();
  const tempData = {
    labels: times,
    datasets: [
      {
        label: "Temperature in Farenheit",
        backgroundColor: "rgba(255,99,132,0.2)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(255,99,132,0.4)",
        hoverBorderColor: "rgba(255,99,132,1)",
        data: degrees
      }
    ]
  };
  const humidityData = {
    labels: times,
    datasets: [
      {
        label: "Humidity percentage",
        backgroundColor: "rgba(198, 198, 198,0.2)",
        borderColor: "rgba(198, 198, 198,1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(198, 198, 198,0.4)",
        hoverBorderColor: "rgba(198, 198, 198,1)",
        data: humidity
      }
    ]
  };
  let totalTemp = degrees.reduce((acc, item) => (acc += item), 0);
  let totalHumidity = humidity.reduce((acc, item) => (acc += item), 0);
  let avgHumidity = totalHumidity / humidity.length;
  let avgTemp = totalTemp / degrees.length;

  return (
    <div
      className="weatherFadeInUp2 "
      style={{ border: "solid 3px white", padding: "3%", marginTop: "2%" }}
    >
      <div>
        <Bar
          data={tempData}
          width={500}
          height={200}
          options={{
            maintainAspectRatio: false
          }}
        />
      </div>
      <div>
        <Bar
          data={humidityData}
          width={500}
          height={200}
          options={{
            maintainAspectRatio: false
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          color: "white",
          fontWeight: "bold"
        }}
      >
        <h4 style={{ alignSelf: "center" }}>{props.city}</h4>
        <h4
          style={{ alignSelf: "center" }}
        >{`The average temperature over the next 5 days is ${avgTemp.toFixed(
          1
        )} degrees`}</h4>
        <h4
          style={{ alignSelf: "center" }}
        >{`The average humidity percentage over the next 5 days is ${avgHumidity.toFixed(
          1
        )}%`}</h4>
        <button
          className="form-control btn-danger"
          onClick={() => props.delete(props.index)}
          style={{ fontFamily: "monospace", fontWeight: "bold" }}
        >
          REMOVE
        </button>
      </div>
    </div>
  );
};
export default ThreeDayForecast;
