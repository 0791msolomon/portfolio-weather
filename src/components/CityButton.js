import React from "react";
import "./index.css";
import { Bar, HorizontalBar } from "react-chartjs-2/es";
import moment from "moment";
import classnames from "classnames";
class CityButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { active: false };
  }
  switchState = async e => {
    e.preventDefault();
    await this.setState({ active: !this.state.active });
    this.props.activeBtn(
      this.state.active,
      Object.values(this.props.info)[0],
      this.props.index
    );
  };
  render() {
    let degrees = [];
    let humidity = [];
    let times = [];
    console.log(this.props);
    Object.values(this.props.info)[0].map(item => {
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
      <div>
        <input
          data-toggle="modal"
          data-target="#exampleModalCenter"
          type="button"
          className={classnames("form-control overFlow", {
            "btn-default": !this.state.active,
            active: this.state.active
          })}
          value={this.props.city}
          onClick={this.switchState}
        />
        <div
          class="modal fade"
          id="exampleModalCenter"
          tabindex="-1"
          role="dialog"
          aria-labelledby="exampleModalCenterTitle"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content" style={{ backgroundColor: "black" }}>
              <div
                className="weatherFadeInUp2 col-lg-3 col-sm-12"
                style={{
                  border: "solid 3px white",
                  padding: "1%",
                  margin: "1%"
                }}
              >
                <div>
                  {this.props.graph ? (
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
                  {this.props.graph ? (
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
                    {this.props.city}
                  </h6>
                  <h6
                    style={{
                      textAlign: "center"
                    }}
                  >{`The average temperature over the next 5 days is ${avgTemp.toFixed(
                    1
                  )} degrees ${
                    this.props.units ? "Fahrenheit" : "Celsius"
                  }`}</h6>
                  <h6
                    style={{ textAlign: "center" }}
                  >{`The average humidity percentage over the next 5 days is ${avgHumidity.toFixed(
                    1
                  )}%`}</h6>
                  {this.props.delete && (
                    <button
                      className="form-control btn-danger"
                      onClick={() => this.props.delete(this.props.index)}
                      style={{ fontFamily: "monospace", fontWeight: "bold" }}
                    >
                      REMOVE
                    </button>
                  )}
                </div>
              </div>

              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default CityButton;
