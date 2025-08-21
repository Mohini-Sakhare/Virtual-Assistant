
import { createRoot } from 'react-dom/client'
import './index.css'
import {BrowserRouter} from 'react-router-dom';
import App from './App.jsx';
import UserContext from './context/UserContext.jsx';
import 'react-toastify/dist/ReactToastify.css';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <UserContext>
        <App/>
    </UserContext>
  </BrowserRouter>
   
)
