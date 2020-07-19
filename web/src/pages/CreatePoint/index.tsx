import React, { useEffect, useState, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import './styles.css';
import logo from '../../assets/logo.svg';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import api from '../../services/api';
import axios from 'axios';
import { LeafletMouseEvent } from 'leaflet';

interface Item {
  id: number,
  title: string,
  image_url: string
}
interface IBGE_UFResponse {
  id: number,
  nome: string,
  sigla: string 
}
interface IBGE_CityResponse {
  id: number,
  nome: string,
}
const CreatePoint = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [ufs, setUFs ] = useState<IBGE_UFResponse[]>([]);
  const [cities, setCities] = useState<IBGE_CityResponse[]>([]);
  const [selectedUf, setSelectUf] = useState('0');
  const [selectedCity, setSelectCity] = useState('0');
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);
  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    api.get('items').then(response => {
      setItems(response.data);
    })
  }, []);

  useEffect(() => {
    axios.get<IBGE_UFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
    .then(response => {
      setUFs(response.data);
    });
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      setInitialPosition([latitude, longitude]);
    })
  }, [])

  useEffect(() => {
    if(selectedUf === '0')
      return;

      axios.get<IBGE_CityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
      .then(response => {
        setCities(response.data);
      });
    
  },[selectedUf])


  function handleSelectedUf(event: ChangeEvent<HTMLSelectElement>){
    const uf = event.target.value;
    setSelectUf(uf);
  }
  function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>){
    const city = event.target.value;
    setSelectCity(city);
  }
  function handleMapClick(event: LeafletMouseEvent){
    setSelectedPosition([
      event.latlng.lat,
      event.latlng.lng
    ]);
  }

  return (
    <div id="page-create-point">
      <header>
        <img src={ logo } alt="Ecoleta"/>
        <Link to="/">
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>
      <form>
        <h1>Cadastro do ponto de coleta</h1>
        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>
          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input 
              type="text"
              name="name"
              id="name"
            />
          </div>
        </fieldset>
        <fieldset>
          <legend>
            <h2>Endereços</h2>
          </legend>
          <div id="field-group">
          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input 
              type="email"
              name="email"
              id="email"
            />
          </div>
          </div>
          <div className="field">
            <label htmlFor="whatsapp">Whatsapp</label>
            <input 
              type="text"
              name="whatsapp"
              id="whatsapp"
            />
          </div>
        </fieldset>
        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={selectedPosition} />
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado</label>
              <select 
                id="uf"
                name="uf" 
                onChange={handleSelectedUf} 
                value={selectedUf} 
              >
                <option value="0">Selecione um estado</option>
                {ufs.map( uf =>(
                  <option key={uf.id} value={uf.sigla}>{uf.nome}</option>
                 ) )}
              </select>
            </div>

            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select 
                id="city"
                name="city"
                onChange={handleSelectedCity}
                value={selectedCity} 
              >
                <option value="0">Selecione uma cidade</option>
                {cities.map( city =>(
                  <option key={city.id} value={city.id}>{city.nome}</option>
                 ) )}
              </select>
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>
            <h2>Ítens de coleta</h2>
            <span>Selecione um ou mais ítens abaixo</span>
          </legend>
          <ul className="items-grid">
            {items.map(item => (
              <li key={item.id}>
              <img src={item.image_url} alt={item.title}/>
              <span>{item.title}</span>
            </li>
            ))}
          </ul>
        </fieldset>
        <button type="submit">
          Cadastrar ponto de coleta
        </button>
      </form>
    </div>
  )
}

export default CreatePoint;

//Sempre que a gente cria um estado para um array ou para um objeto
//precisamos, manualmente, informar o tipo da varíavel que está dentro