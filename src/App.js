import React, { useContext } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import PokeList from './components/PokeList/PokeList';
import PokeFavorite from './components/PokeFavorite/PokeFavorite';
import AuthPage from './components/AuthPage/AuthPage';
import Logout from './components/Logout/Logout';
import Layout from './hoc/Layout';
import RootStore from './store/rootStore';

const App = () => {

  const { store, auth } = useContext(RootStore);

  auth.autoLogin();
  store.setUid(auth.uid);
  let isAuthenticated = !!auth.token;

  let routes = (
    <Switch>
      <Route path="/login" exact component={AuthPage}/>
      <Route path="/" exact component={PokeList}/>
      <Redirect to={'/'}/>
    </Switch>
  );

  if (isAuthenticated) {
    routes = (
      <Switch>
        <Route path="/favorite" exact component={PokeFavorite}/>
        <Route path="/logout" exact component={Logout}/>
        <Route path="/" exact component={PokeList}/>
        <Redirect to={'/'}/>
      </Switch>
    );
  }

  return (
    <Layout token={isAuthenticated}>
      {routes}
    </Layout>
  );
};

export default withRouter(observer(App));
