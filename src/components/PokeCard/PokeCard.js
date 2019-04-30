import React from 'react';
import { Col, Card, Collection, CollectionItem, Badge } from 'react-materialize';
import classes from './PokeCard.css';
import FavoriteIcon from '../FavoriteIcon/FavoriteIcon';

export default function PokeCard({ pokemon }) {
  return (
    <Col xl={4} m={6} s={12}>
      <Card
        header={
          <div className={classes.imageBlock}>
            <img src={`https://img.pokemondb.net/artwork/${pokemon.name}.jpg`} alt={pokemon.name}/>
          </div>
        }
        title={pokemon.name}
        reveal={
          <Collection>
            {pokemon.stats.map((item, index) => {
              return (
                <CollectionItem key={index}>
                  {item.stat.name.replace('-', ' ')}
                  <Badge className="teal white-text">{item.base_stat}</Badge>
                </CollectionItem>
              );
            })}
          </Collection>
        }
        className="poke-card hoverable z-depth-1"
      >
        <blockquote>
					Type: {pokemon.types.map((item, index) => {
            return (
              <Badge
                className={item.type.name}
                key={index}
              >
                {item.type.name}
              </Badge>
            );
          })}
        </blockquote>
        {pokemon.hasOwnProperty('fav')
          ? <FavoriteIcon id={pokemon.id} fav={pokemon.fav} cls={pokemon.class}/>
          : null}
      </Card>
    </Col>
  );
}
