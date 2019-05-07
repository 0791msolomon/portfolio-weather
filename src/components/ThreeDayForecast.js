import React from "react";
import { Bar, HorizontalBar } from "react-chartjs-2/es";
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
      className="weatherFadeInUp2 col-lg-3 col-sm-12"
      style={{
        border: "solid 3px white",
        padding: "1%",
        margin: "1%"
      }}
    >
      <div>
        {props.graph ? (
          <Bar
            data={tempData}
            width={450}
            height={200}
            options={{
              maintainAspectRatio: false
            }}
          />
        ) : (
          <HorizontalBar
            data={tempData}
            width={500}
            height={200}
            options={{
              maintainAspectRatio: false
            }}
          />
        )}
      </div>
      <div>
        {props.graph ? (
          <Bar
            data={humidityData}
            width={500}
            height={200}
            options={{
              maintainAspectRatio: false
            }}
          />
        ) : (
          <HorizontalBar
            data={humidityData}
            width={500}
            height={200}
            options={{
              maintainAspectRatio: false
            }}
          />
        )}
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
        <h6
          style={{
            alignSelf: "center",
            alignContent: "center",
            alignItems: "center"
          }}
        >
          {props.city}
        </h6>
        <h6
          style={{
            textAlign: "center"
          }}
        >{`The average temperature over the next 5 days is ${avgTemp.toFixed(
          1
        )} degrees ${props.units ? "Fahrenheit" : "Celsius"}`}</h6>
        <h6
          style={{ textAlign: "center" }}
        >{`The average humidity percentage over the next 5 days is ${avgHumidity.toFixed(
          1
        )}%`}</h6>
        {props.delete && (
          <button
            className="form-control btn-danger"
            onClick={() => props.delete(props.index)}
            style={{ fontFamily: "monospace", fontWeight: "bold" }}
          >
            REMOVE
          </button>
        )}
      </div>
    </div>
  );
};
export default ThreeDayForecast;
