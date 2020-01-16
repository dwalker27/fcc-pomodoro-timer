import React from 'react';
import './App.css';

class TimerPanel extends React.Component {
  constructor(props) {
    super(props);
  }    
  timeFormat(timeLeft) {
    let seconds = (timeLeft % 60 < 10) ? "0" + timeLeft % 60 : timeLeft % 60;
    let minutes = (timeLeft / 60 < 10) ? "0" + Math.floor(timeLeft / 60) : Math.floor(timeLeft / 60);
    return (minutes + ":" + seconds);
  }
  render() {
    return (
      <div id="timer-panel">
        <div id="timer-label">
          {
            this.props.breakMode ? "Break" : "Session"
          }
        </div>
        <div id="time-left">
          {this.timeFormat(this.props.timeLeft)}
        </div>
      </div>
    );
  }
}

class BreakPanel extends React.Component {
  constructor(props) {
    super(props);
  }  
  render() {
    return (
      <div id="break-label">
        Break Length
        <button id="break-decrement" onClick={this.props.decBreakLength}>Down</button>
        <button id="break-increment" onClick={this.props.incBreakLength}>Up</button>
        <div id="break-length">{this.props.break}</div>
      </div>
    );
  }
}

class SessionPanel extends React.Component {
  constructor(props) {
    super(props);
  }  
  render() {
    return (
      <div id="session-label">
        Session Length
        <button id="session-decrement" onClick={this.props.decSessionLength}>Down</button>
        <button id="session-increment" onClick={this.props.incSessionLength}>Up</button>
        <div id="session-length">{this.props.session}</div>
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      session: 25,
      break: 5,
      timeLeft: 1500,
      breakMode: false,
      countDown: false
    }
    let intervalID;
    this.incSessionLength = this.incSessionLength.bind(this);
    this.decSessionLength = this.decSessionLength.bind(this);
    this.incBreakLength = this.incBreakLength.bind(this);
    this.decBreakLength = this.decBreakLength.bind(this);
    this.reset = this.reset.bind(this);
    this.startStop = this.startStop.bind(this);
    this.tick = this.tick.bind(this);
  }
  
  tick() {
    let curTimeLeft = this.state.timeLeft;
    let curSession = this.state.session;
    let curBreak = this.state.break;
    let curBreakMode = this.state.breakMode;
    this.setState({
      timeLeft: curTimeLeft - 1
    });
    
    if (curTimeLeft <= 0) {
      let aBeep = document.getElementById("beep");
      aBeep.play();
      if (curBreakMode) {
        this.setState({
          timeLeft: curSession * 60,
          breakMode: false
        });
      } else {
        this.setState({
          timeLeft: curBreak * 60,
          breakMode: true
        });
      }
    }
  }
  
  reset(event) {
    this.setState({
      session: 25,
      break: 5,
      timeLeft: 1500,
      breakMode: false,
      countDown: false
    });
    clearInterval(this.intervalID);
    let aBeep = document.getElementById("beep");
    aBeep.pause();
    aBeep.currentTime = 0;
  }
  
  startStop(event) {
    if (!this.state.countDown) {
      this.setState({
        countDown: true
      });
      this.intervalID = setInterval(this.tick, 1000);
    } else {
      this.setState({
        countDown: false
      }); 
      clearInterval(this.intervalID);
    }
  }
  
  incSessionLength(event) {
    let curSession = this.state.session;
    if (curSession < 60) {
      this.setState({
        session: curSession + 1,
        timeLeft: (curSession + 1) * 60,
        breakMode: false,
        countDown: false
      });
    }
  }
  
  decSessionLength(event) {
    let curSession = this.state.session;
    if (curSession > 1) {
      this.setState({
        session: curSession - 1,
        timeLeft: (curSession - 1) * 60,
        breakMode: false,
        countDown: false
      });
    }
  }
  
   incBreakLength(event) {
    let curBreak = this.state.break;
    if (curBreak < 60) {
      this.setState({
        break: curBreak + 1,
        countDown: false
      });
    }
  }
  
  decBreakLength(event) {
    let curSession = this.state.break;
    if (curSession > 1) {
      this.setState({
        break: curSession - 1,
        countDown: false
      });
    }
  }
  
  render() {
    return (
      <div id="app">
        <SessionPanel session={this.state.session} 
          incSessionLength={this.incSessionLength} 
          decSessionLength={this.decSessionLength} />
        
        <BreakPanel break={this.state.break} 
          incBreakLength={this.incBreakLength}
          decBreakLength={this.decBreakLength} />
        
        <TimerPanel timeLeft={this.state.timeLeft}
          breakMode={this.state.breakMode} />
        
        <button id="start_stop" onClick={this.startStop}>{this.state.countDown ? "Stop" : "Start"}</button>
        <button id="reset" onClick={this.reset}>Reset</button>
        <audio id="beep" src="https://goo.gl/65cBl1"></audio>
      </div>
    );
  }
}

export default App;
