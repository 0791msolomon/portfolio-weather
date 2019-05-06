import React from "react";
import * as weatherServices from "./WeatherServices";
import moment from "moment";
import "./index.css";
import ThreeDayForecast from "./ThreeDayForecast";
import InvalidZip from "./InvalidZip";
import classnames from "classnames";
import CityButton from "./CityButton";
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
    modal: false
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
            city={this.state.city[i]}
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
        return (
          <div className="col-lg-2 col-md-4 col-sm-12 fadeUp " key={i}>
            <CityButton
              city={Object.values(item)[0][0].city}
              activeBtn={(activated, info, index) =>
                this.activateBtn(activated, info, index)
              }
              info={item}
              index={i}
            />
          </div>
        );
      }
    });
  };
  activateBtn = async (activated, info, index) => {
    console.log(info);
    this.setState({ modal: true });
  };

  render() {
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
          style={{ color: "#0AA7F6", alignSelf: "center" }}
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
            <h4 style={{ alignSelf: "center", color: "white" }}>
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
            <h4 style={{ alignSelf: "center", color: "white" }}>
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
            {/* <div
              className="col-lg-6 col-sm-12"
              style={{ alignSelf: "center", marginTop: "3%" }}
            >
              <button className="form-control btn-info">View Selections</button>
            </div> */}
          </div>
        )}
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
