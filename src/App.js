import './App.css';
import 'antd/dist/antd.css';
import Login from './component/Login';
import { Route, Switch } from 'react-router-dom';
import Userdetail from './component/Userdetail';
import Protected from './component/Protected';


function App() {
  return (
    <>
      <Switch>
        <Route exact path="/" component={Login}></Route>

        <Route path="/Userdetail">
          <Protected cmp={Userdetail} />
        </Route>
      </Switch>
    </>
  );
}

export default App;
