import { decorate, observable } from 'mobx'
import axios from '../axios/axios-poke'
import {ListTypes} from '../config/config'

export class Store {
  state = "done"
  filter = ""
  typesActive = false
  uid = null
  pokeList = []
  favData = []
  listActive = ListTypes()
  listTypesActive = []
  pagination = {
    activePage: 1,
    allPage: 1,
    limit: 10,
    offset: 0
  }

  onNavigate = event => {
    if (this.pagination.activePage === event) {
      return
    }
    this.pagination.activePage = +event
    this.pagination.offset = 
        (this.pagination.limit * this.pagination.activePage) - this.pagination.limit
    this.fetchPokeList()
  }

  onChangeLimit = event => {
    this.pagination.limit = +event.target.value
    this.pagination.offset = 0
    this.pagination.activePage = 1
    if (!(this.pokeList.length < 9) && this.pagination.activePage === 1) {
      this.fetchPokeList()
    }
  }

  onFilter = value => {
    if (this.filter !== value) {
      this.filter = value
      this.resetPagination()
      this.fetchPokeList()
    }
  }

  fetchPokeList = async () => {
    this.state = "pending"
    this.pokeList = []
    this.pagination.allPage = 1
    if (this.uid) {
      this.favData = this.favData.length ? this.favData : await this.getFavData(this.uid)
    }
   
    try {
      if (this.listTypesActive.length) {
        let tempList = []
        for (const type of this.listTypesActive) {
          const response = await axios.get(`type/${type}`)
          tempList.push(...response.data.pokemon.map(item => item.pokemon))
        }
        if (this.filter !== "") {
          tempList = tempList.filter(poke => {
            return poke.name.toLowerCase().includes(this.filter)
          })
        }
        this.pagination.allPage = Math.ceil(tempList.length / this.pagination.limit)
        for (let item of tempList.slice(this.pagination.offset, this.pagination.offset + this.pagination.limit)) {
          this.pokeList.push(this.checkFavorite(await this.loadPokeItem(item.name), 'star'))
        }
      } else {
        if (this.filter !== "") {
          const response = await axios.get(`pokemon/`, { params:{limit: 1000}})
          if (response.data.results) {
            const tempList = response.data.results.filter(poke => {
                return poke.name.toLowerCase().includes(this.filter)
              })
            this.pagination.allPage = Math.ceil(tempList.length / this.pagination.limit)
            for (let item of tempList.slice(this.pagination.offset, this.pagination.offset + this.pagination.limit)) {
              this.pokeList.push(this.checkFavorite(await this.loadPokeItem(item.name), 'star'))
            }
          }
        } else {
          const response = await axios.get(`pokemon/`, {
            params: {
              limit: this.pagination.limit,
              offset: this.pagination.offset
            }})
          if (response.data.results) {
            this.pagination.allPage = Math.ceil(response.data.count / this.pagination.limit)
            for (let item of response.data.results) {
              this.pokeList.push(this.checkFavorite(await this.loadPokeItem(item.name), 'star'))
            }
            
          }
        }
      }
      this.state = this.pokeList.length ? 'done' : 'empty'
    } catch (error) {
      this.state = "error"
      this.showMessage('red', error.response.data)
    }
  }

  fetchPokeFavorite = async () => {
    this.state = 'pending'
    this.pokeList = []
    this.favData = this.favData.length ? this.favData : await this.getFavData(this.uid)
    if (this.favData) {
      for (let data of this.favData) {
        this.pokeList.push({...await this.loadPokeItem(data), ...{fav: false, class: 'delete'}})
      }
    }
    this.state = this.pokeList.length ? 'done' : 'empty'
  }

  toggleToFavorite = async (id) => {
    try {
      if (this.favData.includes(id)) {
        const response = await axios.get(`https://pokedemo-react.firebaseio.com/users/${this.uid}/favorite.json/?orderBy="id"&startAt=${id}&endAt=${id}`)
        const key = Object.keys(response.data)[0]
        await axios.delete(`https://pokedemo-react.firebaseio.com/users/${this.uid}/favorite/${key}.json`)
        this.pokeList = this.pokeList.filter(item => {return item.id !== id})
        this.showMessage('teal', 'Item removed from favorite')
        return true
      } else {
        await axios.post(`https://pokedemo-react.firebaseio.com/users/${this.uid}/favorite.json`, { id: id })
        let poke = ''
        this.favData.push(id)
        this.pokeList = this.pokeList.map(item => {
          if (item.id === id) {
            item.fav = true
            poke = item.name.toUpperCase()
          }
          return item
        })
        this.showMessage('teal', `${poke} added to favorite`)
        return true
      }
    } catch (error) {
      this.state = "error"
      this.showMessage('red', error.response.data.error)
      return false
    }
	}

  checkFavorite = (data, _class) => {
    if (this.uid) {
      if (this.favData.includes(data.id)) {
        data.fav = true
      } else {
        data.fav = false
      }
      data.class = _class
    }
    return data
  }

  getFavData = async auth => {
    if (auth) {
      const response = await axios.get(`https://pokedemo-react.firebaseio.com/users/${auth}/favorite.json/`)
      const result = []
      if (response.data) {
        Object.keys(response.data).forEach(key => {
          if (key) {
            result.push(response.data[key].id)
          }
        })
      }
      return result
    }
  }

  loadPokeItem = async name => {
    try {
      const response = await axios.get(`pokemon/${name}`)
      if (response.data) {
        return response.data
      }
    } catch (error) {
      this.state = "error"
      this.showMessage('red', error.message)
    }
  }

  triggerActiveTypes = type => {
    if (this.listTypesActive.includes(type)) {
      this.listTypesActive = this.listTypesActive.filter(item => item !== type)
    } else {
      this.listTypesActive.push(type)
    }
    if (!this.listTypesActive.length && this.typesActive) {
      this.typesActive = false
      this.resetPagination()
      this.fetchPokeList()
    }
  }

  showMessage = (type, message) => {
    window.M.toast({ 
      classes: type,
      html: message
     })
  }

  resetPagination = () => {
    this.pagination.offset = 0
    this.pagination.activePage = 1
  }

  setUid = uid => {
    this.uid = uid
  }
}

decorate(Store, {
  pagination: observable,
  pokeList: observable,
  listTypesActive: observable,
  state: observable
})

export default Store
