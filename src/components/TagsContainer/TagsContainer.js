import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Checkbox, Button } from 'react-materialize';
import RootStore from '../../store/rootStore';
import classes from './TagsContainer.css';

const TagsContainer = () => {
  const { store } = useContext(RootStore);
  const listTypes = store.listActive;

  const addActiveTypes = (event) => {
    listTypes.forEach((item) => {
      if (item.type === event.target.value) {
        store.triggerActiveTypes(item.type);
        item.checked = !(item.checked);
      }
      return item;
    });
  };

  const searchByType = () => {
    store.typesActive = true;
    store.fetchPokeList();
    store.resetPagination();
  };
  return (
    <div className={classes.tagContainer}>
      <form onSubmit={(event) => {
        event.preventDefault();
      }}
      >
        {listTypes
          ? listTypes.map((item, index) => (
            <p className={item.type} key={index}>
              <Checkbox
                value={item.type}
                label={item.type}
                checked={item.checked}
                onChange={event => addActiveTypes(event)}
              />
            </p>
          ))
          : null
        }
        <p>
          <Button
            waves="light"
            disabled={
              (store.state === 'pending'
                || (store.state !== 'done' && store.state !== 'empty'))
                || !(store.listTypesActive.length)
            }
            onClick={searchByType}
          >
						Search
          </Button>
        </p>
      </form>
    </div>
  );
};

export default observer(TagsContainer);
