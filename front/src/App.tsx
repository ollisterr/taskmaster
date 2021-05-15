import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import AdminPage from './pages/AdminPage';
import CreatePage from './pages/CreatePage';
import PromptPage from './pages/PromptPage';

const App = () => {
  return (
    <div className="App">
      <Router>
      <Switch>
          <Route path="/create">
            <CreatePage />
          </Route>

          <Route path="/admin/:room">
            <AdminPage />
          </Route>

          <Route path="/">
            <PromptPage />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
