import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import AdminPage from './pages/AdminPage';
import FrontPage from './pages/FrontPage';
import PromptPage from './pages/PromptPage';

const App = () => {
  return (
    <div className="App">
      <Router>
      <Switch>
          <Route path="/admin/:room">
            <AdminPage />
          </Route>

          <Route path="/:room">
            <PromptPage />
          </Route>

          <Route path="/">
            <FrontPage />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
