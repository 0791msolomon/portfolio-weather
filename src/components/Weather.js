import React from "react";
import * as weatherServices from "./WeatherServices";
import moment from "moment";
import "./index.css";
import { Bar, HorizontalBar } from "react-chartjs-2/es";
import ThreeDayForecast from "./ThreeDayForecast";
import InvalidZip from "./InvalidZip";
import classnames from "classnames";
class Weather extends React.Component {
  state = {
    zip: "",
    unit: "imperial",
    displayGraph: false,
    sixHourInterval: [],
    arr: [],
    overFlow: [],
    notFound: false,
    city: [],
    fahrenheit: true,
    barGraph: true,
    searching: false,
    activeCount: [],
    modalItem: null,
    barGraph: true,
    cityName: "",
    fahrenheit: true,
    avgHumidity: 0,
    times: [],
    degrees: [],
    avgTemp: 0,
    humidity: []
  };
  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  getForecast = async e => {
    e.preventDefault();
    await this.setState({ searching: true });
    let units;
    this.state.fahrenheit ? (units = "imperial") : (units = "metric");
    await this.setState({ notFound: false });
    try {
      let response = await weatherServices.forecast(this.state.zip, units);

      let sixHourInterval = [];
      for (let i = 0; i < response.data.forecastInfo.list.length; i++) {
        if (
          !sixHourInterval.includes(
            moment(response.data.forecastInfo.list[i].dt_txt).format("dddd")
          )
        ) {
          sixHourInterval.push(
            response.data.forecastInfo.list[i],
            moment(response.data.forecastInfo.list[i].dt_txt).format("dddd")
          );
        }
      }
      let arr = [];
      sixHourInterval.map(item => {
        if (typeof item === "object") {
          arr.push({
            temp: item.main.temp,
            humidity: item.main.humidity,
            time: moment(item.dt_txt).format("lll"),
            fahrenheit: this.state.fahrenheit,
            barGraph: this.state.barGraph,
            city: response.data.forecastInfo.city.name
          });
        }
      });
      let town = response.data.forecastInfo.city.name;
      let cities = this.state.city.concat(town);
      let newArr = this.state.arr.concat({ arr });
      await this.setState({
        displayGraph: true,
        sixHourInterval: arr,
        arr: newArr,
        zip: "",
        city: cities,
        searching: false
      });
    } catch (err) {
      console.log(err);
      this.setState({
        displayGraph: false,
        notFound: true,
        zip: "",
        searching: false
      });
    }
  };
  deleteGraph = id => {
    let arr = this.state.arr;
    let cities = this.state.city;
    let filteredCities = cities.filter((item, i) => i !== id);
    let filtered = arr.filter((item, i) => i !== id);
    this.setState({ arr: filtered, city: filteredCities });
  };
  clearAll = () => {
    this.setState({
      arr: [],
      displayGraph: false,
      notFound: false,
      activeCount: []
    });
  };
  renderForecast = () => {
    return this.state.arr.map((item, i) => {
      if (i < 3) {
        return (
          <ThreeDayForecast
            key={i}
            info={Object.values(item)[0]}
            index={i}
            delete={id => this.deleteGraph(id)}
            city={Object.values(item)[0][0].city}
            units={Object.values(item)[0][0].fahrenheit}
            graph={Object.values(item)[0][0].barGraph}
          />
        );
      }
    });
  };
  renderOverflow = () => {
    return this.state.arr.map((item, i) => {
      if (i > 2) {
        console.log(item);
        return (
          <div
            className="col-lg-2 col-md-4 col-sm-12 fadeUp "
            key={i}
            // onClick={() => this.setState({ modalItem: item })}
            onClick={() => this.adjustModalInfo(item)}
            data-toggle="modal"
            data-target="#exampleModalCenter"
          >
            <button className="overFlow form-control">
              {Object.values(item)[0][0].city}
            </button>
          </div>
        );
      }
    });
  };
  adjustModalInfo = item => {
    let answer = Object.values(item)[0][0];
    let degrees = [];
    let humidity = [];
    let times = [];
    Object.values(item)[0].map(item => {
      degrees.push(Math.ceil(item.temp));
      humidity.push(item.humidity);
      times.push(moment(item.time).format("dddd"));
    });

    times.pop();
    let totalTemp = degrees.reduce((acc, item) => (acc += item), 0);
    let totalHumidity = humidity.reduce((acc, item) => (acc += item), 0);
    let avgHumidity = totalHumidity / humidity.length;
    let avgTemp = totalTemp / degrees.length;
    this.setState({
      barGraph: answer.barGraph,
      cityName: answer.city,
      fahrenheit: answer.fahrenheit,
      avgHumidity: avgHumidity.toFixed(1),
      times,
      avgTemp: avgTemp.toFixed(1),
      degrees,
      humidity
    });
  };

  render() {
    let {
      avgHumidity,
      avgTemp,
      times,
      barGraph,
      degrees,
      humidity
    } = this.state;
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

    return (
      <div
        className=" weatherForecast  "
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}
      >
        <h1
          className="display-3 lead weatherDisplayFallDown"
          style={{
            color: "red",
            alignSelf: "center",
            fontFamily: '"Times New Roman", Times, serif'
          }}
        >
          Weather Forecast
        </h1>
        <h4 className="weatherFadeInUp" style={gameRules}>
          - Results will give data on the temperature and humidity levels over
          the next 5 days
        </h4>
        <h4 className="weatherFadeInUp" style={gameRules}>
          - Results also display temperature and humidity averages over the
          course of the 5 day period.
        </h4>
        <h4 className="weatherFadeInUp" style={gameRules}>
          - Submit button will only be enabled once 5 digit zip code is entered
        </h4>
        <h4 className="weatherFadeInUp" style={gameRules}>
          - If entered zip code does not return any data you will be notified.
        </h4>
        <div className="  text-center weatherFadeInUp" style={gameRules}>
          <h1> Enter in the 5 digit zip code for any area you'd like to see</h1>
        </div>
        <h4 className="weatherFadeInUp" style={gameRules}>
          - The first three will be displayed on the screen
        </h4>
        <h4 className="weatherFadeInUp" style={gameRules}>
          - Any following will display as buttons to be selected on the bottom
          of the screen
        </h4>
        <div
          style={{
            margin: "5%",
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-evenly"
          }}
        >
          <div
            className="fadeInRight"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center"
            }}
          >
            <h4 style={{ alignSelf: "center", color: "red" }}>
              Unit Preference:
            </h4>
            <div className="form-check" style={{ alignSelf: "center" }}>
              <input
                className="form-check-input"
                type="radio"
                checked={this.state.fahrenheit}
                onChange={() => this.setState({ fahrenheit: true })}
              />
              <label className="form-check-label" style={{ color: "white" }}>
                Fahrenheit
              </label>
            </div>
            <div className="form-check" style={{ alignSelf: "center" }}>
              <input
                className="form-check-input"
                type="radio"
                checked={!this.state.fahrenheit}
                onChange={() => this.setState({ fahrenheit: false })}
              />
              <label className="form-check-label" style={{ color: "white" }}>
                Celsius
              </label>
            </div>
          </div>
          <div
            className="fadeInLeft"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              marginBottom: "3%",
              marginTop: "3%"
            }}
          >
            <h4 style={{ alignSelf: "center", color: "red" }}>
              Display Preference:
            </h4>
            <div className="form-check" style={{ alignSelf: "center" }}>
              <input
                className="form-check-input"
                type="radio"
                checked={this.state.barGraph}
                onChange={() => this.setState({ barGraph: true })}
              />
              <label className="form-check-label" style={{ color: "white" }}>
                Vertical Graph
              </label>
            </div>
            <div className="form-check" style={{ alignSelf: "center" }}>
              <input
                className="form-check-input"
                type="radio"
                checked={!this.state.barGraph}
                onChange={() => this.setState({ barGraph: false })}
              />
              <label className="form-check-label" style={{ color: "white" }}>
                Horizontal Graph
              </label>
            </div>
          </div>
        </div>
        <div
          style={{ alignSelf: "center" }}
          className="weatherFadeInUp col-lg-6 col-sm-12"
        >
          <form onSubmit={this.getForecast}>
            <input
              type="number"
              value={this.state.zip}
              style={{ textAlign: "center" }}
              name="zip"
              onChange={this.onChange}
              placeholder={`ZIP`}
              className="form-control weatherFadeInUp3 "
            />
            <br />
            <button
              disabled={this.state.zip.length < 5}
              className={
                this.state.zip.length === 5
                  ? "form-control weatherFadeInUp4 btn-info"
                  : "form-control weatherFadeInUp4 btn-default"
              }
              onClick={this.getForecast}
            >
              <span>
                Find <i className="fa fa-search" />
              </span>
            </button>
          </form>
          <button
            style={{ marginTop: "2%" }}
            className="btn btn-danger form-control  "
            onClick={this.clearAll}
          >
            <span>
              Clear <i className="fa fa-remove" />
            </span>
          </button>
          <br />
          <br />
        </div>
        <div
          className="col-12 container"
          style={{
            justifyContent: "center",
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap"
          }}
        >
          {this.state.searching ? (
            <div
              style={{ alignSelf: "center" }}
              className="spinner-border text-danger"
              role="status"
            >
              <span className="sr-only">Loading...</span>
            </div>
          ) : this.state.displayGraph && !this.state.searching ? (
            <div
              className="col-12"
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                flexWrap: "wrap"
              }}
            >
              {this.renderForecast()}
            </div>
          ) : this.state.notFound && !this.state.searching ? (
            <InvalidZip />
          ) : (
            <div
              className="weatherFadeInUp"
              style={{
                color: "white",
                fontWeight: "bold",
                marginTop: "5%",
                textAlign: "center"
              }}
            >
              <h3>No search history</h3>
            </div>
          )}
        </div>
        {this.state.arr.length > 3 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center"
            }}
          >
            {!this.state.searching && (
              <div
                className="weatherFadeInUp "
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "space-around",
                  marginTop: "3%"
                }}
              >
                {this.renderOverflow()}
              </div>
            )}
          </div>
        )}

        <div
          class="modal fade  "
          id="exampleModalCenter"
          role="dialog"
          aria-labelledby="exampleModalCenterTitle"
          aria-hidden="true"
        >
          <div
            class="modal-dialog"
            role="document"
            style={{ border: "solid 1px white" }}
          >
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" style={{ textAlign: "center" }}>
                  {this.state.cityName.toUpperCase()}
                </h5>
                <button
                  type="button"
                  class="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div
                className="modal-body col-12"
                style={{ backgroundColor: "black" }}
              >
                <div
                  className="weatherFadeInUp2"
                  style={{
                    padding: "1%",
                    margin: "1%"
                  }}
                >
                  {barGraph ? (
                    <Bar
                      data={tempData}
                      width={500}
                      height={300}
                      options={{
                        maintainAspectRatio: true
                      }}
                    />
                  ) : (
                    <HorizontalBar
                      data={tempData}
                      width={500}
                      height={300}
                      options={{
                        maintainAspectRatio: true
                      }}
                    />
                  )}
                  {barGraph ? (
                    <Bar
                      data={humidityData}
                      width={500}
                      height={300}
                      options={{
                        maintainAspectRatio: true
                      }}
                    />
                  ) : (
                    <HorizontalBar
                      data={humidityData}
                      width={500}
                      height={300}
                      options={{
                        maintainAspectRatio: true
                      }}
                    />
                  )}
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
                        textAlign: "center"
                      }}
                    >{`The average temperature over the next 5 days is ${avgTemp} degrees ${
                      this.state.fahrenheit ? "Fahrenheit" : "Celsius"
                    }`}</h6>
                    <h6
                      style={{ textAlign: "center" }}
                    >{`The average humidity percentage over the next 5 days is ${avgHumidity}%`}</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const overFlow = {
  border: "solid 1px white",
  display: "flex",
  justifyContent: "center",
  alignContent: "center",
  alignItems: "center",
  color: "white",
  fontWeight: "bold",
  margin: "1%"
};
const popWhite = {
  color: "white",
  fontWeight: "bold"
};
const center = {
  alignSelf: "center"
};
const gameRules = {
  color: "white",
  fontWeight: "bold",
  alignSelf: "center",
  textAlign: "center",
  fontFamily: '"Times New Roman", Times, serif'
};
export default Weather;
