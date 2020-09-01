import React from "react";
import Form from "./components/CoronaForm.jsx";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";

export default function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/1">
            <Form value={1} />
          </Route>
          <Route path="/2">
            <Form value={2} />
          </Route>
          <Route path="/3">
            <Form value={3} />
          </Route>
          <Route path="/4">
            <Form value={4} />
          </Route>
          <Route path="/5">
            <Form value={5} />
          </Route>
          <Route path="/6">
            <Form value={6} />
          </Route>
          <Route path="/7">
            <Form value={7} />
          </Route>
          <Route path="/8">
            <Form value={8} />
          </Route>
          <Route path="/9">
            <Form value={9} />
          </Route>
          <Route path="/10">
            <Form value={10} />
          </Route>
          <Route path="/11">
            <Form value={11} />
          </Route>
          <Route path="/12">
            <Form value={12} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
