import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";
import Calendar from "./Calendar";

function App() {
  return (
    <div className="App">
      <div>
        <Calendar
          multiDaySelect={true}
          disabledDates={[
            new Date("2019-10-17"),
            new Date("2019-10-06"),
            new Date("2019-10-29")
          ]}
          onDatesSelect={params => console.log(params)}
        />
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
