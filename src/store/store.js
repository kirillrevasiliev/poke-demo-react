import { decorate, observable } from 'mobx';
import axios from '../axios/axios-poke';
import ListTypes from '../config/config';

class Store {
  state = 'done';

  filter = '';

  typesActive = false;

  uid = null;

  pokeList = [];

  favData = [];

  listActive = ListTypes();

  listTypesActive = [];

  pagination = {
    activePage: 1,
    allPage: 1,
    limit: 10,
    offset: 0
  };

  onNavigate = (event) => {
    if (this.pagination.activePage === event) {
      return;
    }
    this.pagination.activePage = +event;
    this.pagination.offset = (this.pagination.limit * this.pagination.activePage)
      - this.pagination.limit;
    this.fetchPokeList();
  }

  onChangeLimit = (event) => {
    this.pagination.limit = +event.target.value;
    this.pagination.offset = 0;
    this.pagination.activePage = 1;
    if (!(this.pokeList.length < 9) && this.pagination.activePage === 1) {
      this.fetchPokeList();
    }
  }

  onFilter = (value) => {
    if (this.filter !== value) {
      this.filter = value;
      this.resetPagination();
      this.fetchPokeList();
    }
  }

  fetchPokeList = async () => {
    this.state = 'pending';
    this.pokeList = [];
    this.pagination.allPage = 1;
    const offset = this.pagination.offset;
    const limit = this.pagination.offset + this.pagination.limit;
    if (this.uid) {
      this.favData = this.favData.length ? this.favData : await this.getFavData(this.uid);
    }

    try {
      if (this.listTypesActive.length) {
        let tempList = [];
        for (const type of this.listTypesActive) {
          const response = await axios.get(`type/${type}`);
          tempList.push(...response.data.pokemon.map(item => item.pokemon));
        }
        if (this.filter !== '') {
          tempList = tempList.filter(poke => poke.name.toLowerCase().includes(this.filter));
        }
        this.pagination.allPage = Math.ceil(tempList.length / this.pagination.limit);
        for (const item of tempList.slice(offset, limit)) {
          this.pokeList.push(this.checkFavorite(await this.loadPokeItem(item.name), 'star'));
        }
      } else if (this.filter !== '') {
        await this.fetchFilteringList(offset, limit);
      } else {
        const response = await axios.get('pokemon/', {
          params: {
            limit: this.pagination.limit,
            offset: this.pagination.offset
          }
        });
        if (response.data.results) {
          this.pagination.allPage = Math.ceil(response.data.count / this.pagination.limit);
          for (const item of response.data.results) {
            this.pokeList.push(this.checkFavorite(await this.loadPokeItem(item.name), 'star'));
          }
        }
      }
      this.state = this.pokeList.length ? 'done' : 'empty';
    } catch (error) {
      this.state = 'error';
      this.showMessage('red', error.response.data);
    }
  }

  fetchFilteringList = async (offset, limit) => {
    const response = await axios.get('pokemon/', { params: { limit: 1000 } });
    if (response.data.results) {
      const tempList = response.data.results.filter(poke => poke.name.toLowerCase().includes(this.filter));
      this.pagination.allPage = Math.ceil(tempList.length / this.pagination.limit);
      for (const item of tempList.slice(offset, limit)) {
        this.pokeList.push(this.checkFavorite(await this.loadPokeItem(item.name), 'star'));
      }
    }
  }

  fetchPokeFavorite = async () => {
    this.state = 'pending';
    this.pokeList = [];
    this.favData = this.favData.length ? this.favData : await this.getFavData(this.uid);
    if (this.favData) {
      for (const data of this.favData) {
        this.pokeList.push({ ...await this.loadPokeItem(data), ...{ fav: false, class: 'delete' } });
      }
    }
    this.state = this.pokeList.length ? 'done' : 'empty';
  }

  toggleToFavorite = async (id) => {
    try {
      if (this.favData.includes(id)) {
        const response = await axios.get(`https://pokedemo-react.firebaseio.com/users/${this.uid}/favorite.json/?orderBy="id"&startAt=${id}&endAt=${id}`);
        const key = Object.keys(response.data)[0];
        await axios.delete(`https://pokedemo-react.firebaseio.com/users/${this.uid}/favorite/${key}.json`);
        this.pokeList = this.pokeList.filter(item => item.id !== id);
        this.showMessage('teal', 'Item removed from favorite');
        return true;
      }
      await axios.post(`https://pokedemo-react.firebaseio.com/users/${this.uid}/favorite.json`, { id });
      let poke = '';
      this.favData.push(id);
      this.pokeList = this.pokeList.map((item) => {
        if (item.id === id) {
          item.fav = true;
          poke = item.name.toUpperCase();
        }
        return item;
      });
      this.showMessage('teal', `${poke} added to favorite`);
      return true;
    } catch (error) {
      this.state = 'error';
      this.showMessage('red', error.response.data.error);
      return false;
    }
  }

  checkFavorite = (_data, _class) => {
    const data = _data;
    if (this.uid) {
      data.fav = this.favData.includes(data.id);
      data.class = _class;
    }
    return data;
  }

  getFavData = async (auth) => {
    if (auth) {
      const response = await axios.get(`https://pokedemo-react.firebaseio.com/users/${auth}/favorite.json/`);
      const result = [];
      if (response.data) {
        Object.keys(response.data).forEach((key) => {
          if (key) {
            result.push(response.data[key].id);
          }
        });
      }
      return result;
    }
  }

  loadPokeItem = async (name) => {
    try {
      const response = await axios.get(`pokemon/${name}`);
      if (response.data) {
        return response.data;
      }
    } catch (error) {
      this.state = 'error';
      this.showMessage('red', error.message);
    }
  }

  triggerActiveTypes = (type) => {
    this.listTypesActive.includes(type)
      ? this.listTypesActive = this.listTypesActive.filter(item => item !== type)
      : this.listTypesActive.push(type);
    if (!this.listTypesActive.length && this.typesActive) {
      this.typesActive = false;
      this.resetPagination();
      this.fetchPokeList();
    }
  }

  showMessage = (type, message) => {
    window.M.toast({
      classes: type,
      html: message
    });
  }

  resetPagination = () => {
    this.pagination.offset = 0;
    this.pagination.activePage = 1;
  }

  setUid = (uid) => {
    this.uid = uid;
  }
}

decorate(Store, {
  pagination: observable,
  pokeList: observable,
  listTypesActive: observable,
  state: observable
});

export { Store };
