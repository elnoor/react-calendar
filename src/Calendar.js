import React from "react";
import moment from "moment";
import "./Calendar.css";

/*
<Calendar
  onDatesSelect={this.onDateSelected} // will pass list of selected dates as param(s) in js date object format
  selectedDates={[this.state.dates]}  // array of js date objects
  multiDaySelect={true}               // default only 1 day is allowed
  disabledDates=[date, date2]         // js date
  minYear={1992}                      // default 2015
  maxYear={2025}                      // default now+5 years
/>
*/
export default class Calendar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentCalendarDate: moment(),
      selectedDates: [] // JS date objects
    };

    this.now = moment();
    this.weekdaysShort = moment.weekdaysShort();
    this.months = moment.months();
    this.years = this.getYears();
    this.minYear = this.years[0];
    this.maxYear = this.years[this.years.length - 1];

    this.onMonthOrYearChange = this.onMonthOrYearChange.bind(this);
    this.onMonthOrYearSelect = this.onMonthOrYearSelect.bind(this);
    this.onDaySelect = this.onDaySelect.bind(this);
    this.onDone = this.onDone.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedDates !== this.props.selectedDates) {
      const state = { selectedDates: [] };
      if (this.props.selectedDates) {
        state.selectedDates = this.props.selectedDates;
        if (this.props.selectedDates[0]) {
          state.currentCalendarDate = moment(this.props.selectedDates[0]); // show month of first selected date in calendar
        }
      }
      this.setState(state);
    }
  }

  getYears() {
    let start = this.props.minYear ? parseInt(this.props.minYear) : 2015;
    const end = this.props.maxYear
      ? parseInt(this.props.maxYear)
      : this.now.year() + 5;
    let result = [];
    while (start <= end) result.push(start++);
    return result;
  }

  onMonthOrYearChange(type, next) {
    let currentCalendarDate = moment({ ...this.state.currentCalendarDate });
    if (next) {
      currentCalendarDate.add(1, type);
    } else {
      currentCalendarDate.subtract(1, type);
    }
    this.setState({ currentCalendarDate });
  }

  onMonthOrYearSelect(e, type) {
    let currentCalendarDate = moment({ ...this.state.currentCalendarDate });
    currentCalendarDate.set(type, e.target.value);
    this.setState({ currentCalendarDate });
  }

  onDaySelect(day) {
    let date = null;
    let currentCalendarDate = moment({ ...this.state.currentCalendarDate });
    currentCalendarDate.set("date", day);
    let selectedDates = [...this.state.selectedDates];
    const index = selectedDates.findIndex(
      d => d.toDateString() === currentCalendarDate.toDate().toDateString()
    );
    if (index > -1) {
      selectedDates.splice(index, 1);
    } else {
      date = currentCalendarDate.toDate();
      if (this.props.multiDaySelect) {
        selectedDates.push(date);
      } else {
        selectedDates = [date];
      }
    }

    this.setState({ currentCalendarDate, selectedDates });

    if (!this.props.multiDaySelect && this.props.onDatesSelect) {
      this.props.onDatesSelect([date]);
    }
  }

  onDone() {
    if (this.props.onDatesSelect) {
      this.props.onDatesSelect([...this.state.selectedDates]);
    }
  }

  isToday(day) {
    let date = moment({ ...this.state.currentCalendarDate });
    date.set("date", day);
    return this.now.toDate().toDateString() === date.toDate().toDateString();
  }

  isSelected(day) {
    let date = moment({ ...this.state.currentCalendarDate });
    date.set("date", day);
    return this.state.selectedDates.some(
      d => d.toDateString() === date.toDate().toDateString()
    );
  }

  isDisabled(day) {
    let date = moment({ ...this.state.currentCalendarDate });
    date.set("date", day);
    return (
      this.props.disabledDates &&
      this.props.disabledDates.some(
        d => d.toDateString() === date.toDate().toDateString()
      )
    );
  }

  render() {
    const { currentCalendarDate } = this.state;

    let daysFromPrevMonth = [];
    for (
      let i = 0;
      i <
      moment(currentCalendarDate)
        .startOf("month")
        .format("d");
      i++
    ) {
      daysFromPrevMonth.push(<td key={"p-" + i} className="muted" />);
    }

    let daysInMonth = [];
    for (let d = 1; d <= currentCalendarDate.daysInMonth(); d++) {
      const isDisabled = this.isDisabled(d);
      daysInMonth.push(
        <td
          key={"m-" + d}
          onClick={() => {
            !isDisabled && this.onDaySelect(d);
          }}
          className={
            (isDisabled ? "disabled" : "") +
            (this.isSelected(d) ? " selected" : "") +
            (this.isToday(d) ? " today" : "")
          }
        >
          {d}
        </td>
      );
    }

    var allSlots = [...daysFromPrevMonth, ...daysInMonth];
    let weeks = [];
    let days = [];
    allSlots.forEach((row, i) => {
      if (i % 7 !== 0) {
        days.push(row);
      } else {
        weeks.push(days);
        days = [];
        days.push(row);
      }
      if (i === allSlots.length - 1) {
        weeks.push(days);
      }
    });

    return (
      <div className="calendar">
        <div className="header">
          <div className="month">
            <button
              className="prev"
              disabled={
                this.minYear === currentCalendarDate.year() &&
                currentCalendarDate.month() === 0
              }
              onClick={() => this.onMonthOrYearChange("month", false)}
            >
              &nbsp;
            </button>
            <select
              value={currentCalendarDate.month()}
              onChange={e => this.onMonthOrYearSelect(e, "month")}
            >
              {this.months.map((m, i) => (
                <option key={i} value={i}>
                  {m}
                </option>
              ))}
            </select>
            <button
              className="next"
              disabled={
                this.maxYear === currentCalendarDate.year() &&
                currentCalendarDate.month() === 11
              }
              onClick={() => this.onMonthOrYearChange("month", true)}
            >
              &nbsp;
            </button>
          </div>
          <div className="year">
            <button
              className="prev"
              disabled={this.minYear === currentCalendarDate.year()}
              onClick={() => this.onMonthOrYearChange("year", false)}
            >
              &nbsp;
            </button>
            <select
              value={currentCalendarDate.year()}
              onChange={e => this.onMonthOrYearSelect(e, "year")}
            >
              {this.years.map((y, i) => (
                <option key={i} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <button
              className="next"
              disabled={this.maxYear === currentCalendarDate.year()}
              onClick={() => this.onMonthOrYearChange("year", true)}
            >
              &nbsp;
            </button>
          </div>
          <div className="today">
            <button
              onClick={() => {
                this.setState({ currentCalendarDate: moment() });
              }}
            >
              Today
            </button>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              {this.weekdaysShort.map((wd, i) => (
                <th key={i}>{wd}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((d, i) => {
              return <tr key={i}>{d}</tr>;
            })}
          </tbody>
        </table>

        {this.props.multiDaySelect && this.state.selectedDates.length > 0 && (
          <div className="footer">
            <button className="done" onClick={() => this.onDone()}>
              Done
            </button>
            <button onClick={() => this.setState({ selectedDates: [] })}>
              Cancel
            </button>
          </div>
        )}
      </div>
    );
  }
}
