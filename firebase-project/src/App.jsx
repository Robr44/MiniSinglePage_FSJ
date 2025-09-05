
import { LoginComponent} from './views/login/LoginComponent'
import { RegisterComponent } from './views/login/RegisterComponent';
import { Products } from './views/products/Products'  
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LoginComponent />} />
        <Route path='/register' element={<RegisterComponent />} />
        <Route path='/products' element={<Products />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

