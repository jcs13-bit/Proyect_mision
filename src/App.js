import logo from './logo.svg';
import './App.css';
import Usuarios from './componentes/Usuarios';
import Ventas from './componentes/Ventas';
import Productos from './componentes/Productos';
import firebase from './firebase';
import "bootstrap/dist/css/bootstrap.min.css";
import { LoginButton } from "./componentes/Login";
import { LogoutButton } from "./componentes/Logout";
import { Profile } from "./componentes/Profile";
import { useAuth0 } from "@auth0/auth0-react";


function App() {
  const { isAuthenticated } = useAuth0();
  return (
   <>
   <div>
   {isAuthenticated ? (
          <>
            <Profile />
            <LogoutButton />
          </>
        ) : (
          <LoginButton />
        )}
   </div>   
   <Usuarios></Usuarios>
    <Ventas></Ventas>
    <Productos></Productos>
  </>
  );
}

export default App;
