import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import "../styles/App.css";
import Layout from "./Layout";
import CreateNewTask from "./pages/CreateNewTask";
import CreateQuestion from "./pages/CreateQuestion";
import Hello from "./pages/Hello";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Quiz from "./pages/Quiz";
import Result from "./pages/Result";
import ResultsFT from "./pages/ResultsForTeacher";
import Signup from "./pages/Signup";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Switch>
            <Route exact path="/" component={Hello} />
            <PrivateRoute exact path="/home" component={Home} />
            <PrivateRoute
              exact
              path="/createQuestions"
              component={CreateQuestion}
            />
            <PrivateRoute exact path="/resforteacher" component={ResultsFT} />
            <PublicRoute exact path="/signup" component={Signup} />
            <PublicRoute exact path="/login" component={Login} />
            <PrivateRoute exact path="/quiz/:id" component={Quiz} />
            <PrivateRoute exact path="/result/:id" component={Result} />
            <PrivateRoute exact path="/creatent" component={CreateNewTask} />
          </Switch>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;
