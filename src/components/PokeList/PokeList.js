import React, { useEffect, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Row, Col, Preloader } from 'react-materialize';
import PaginationComponent from '../Pagination/Pagination';
import TagsContainer from '../TagsContainer/TagsContainer';
import PokeCard from '../PokeCard/PokeCard';
import RootStore from '../../store/rootStore';
import Select from '../Select/Select';
import Filter from '../Filter/Filter';
import classes from './PokeList.css';

const PokeList = () => {

  const { store } = useContext(RootStore);

  useEffect(() => {
    store.fetchPokeList();
  }, []);

  return (
    <Row>
      <Col s={12} m={10}>
        <h3>Poke-Show</h3>
        <Row>
          <Col s={12} m={3}>
            <Select onChange={store.onChangeLimit} limit={store.pagination.limit} />
          </Col>
          <Col s={12} m={5}>
            <Filter onChange={store.onFilter} />
          </Col>
        </Row>
        <Row>
          {store.pokeList ? store.pokeList.map((poke, index) => {
            return (<PokeCard pokemon={poke} url={poke.url} index={index} key={poke.name + '' + index} />);
          }) : null
          }
          {store.state === 'pending'
            ? <Col s={12}>
              <div className={classes.cardContainer}>
                <Preloader size="big" flashing />
              </div>
            </Col>
            : null
          }
          {store.state === 'empty'
            ? <div className={classes.cardContainer}>
              <h3>Nothing to show</h3>
            </div>
            : null
          }
        </Row>
        <Row>
          <PaginationComponent onSelect={store.onNavigate} pagination={store.pagination} />
        </Row>
      </Col>
      <Col s={12} m={2}>
        <TagsContainer />
      </Col>
    </Row>
  );
};

export default observer(PokeList);
