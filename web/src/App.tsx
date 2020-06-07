import React from 'react';
import './App.css';
import Routes from './routes';

function App() {
  return (
    <Routes />
  );
}

export default App;


//JSX: Sintaxe de XML dentro do JavaScript
//TSX: É o Typescript com JSX
//Estados são informações mantidas pelo próprio componente
/* useState(valorInicial) -> [valor do estado, função pra atualizar o valor do estado]
** Não é possível alterar o valor do estado sem a função. É feito dessa forma porque 
** assim o react consegue garantir certa performance através da imutabilidade.
*/