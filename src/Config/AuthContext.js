import React, { useEffect, useState } from "react";
import {auth} from "./firestore";
import Cargando from '../Components/Atoms/Cargando'

export const Auth = React.createContext();

export const AuthContext = ({ children }) => {
    const [usuario, setUsuario] = useState(null);
    const [showChild, setShowChild] = useState(false);

    useEffect(() => {
        auth.onAuthStateChanged(function(user) {
            setUsuario(user);
            setShowChild(true);
        });
    }, []);

    if (!showChild) {
        return <Cargando/>;
    } else {
        return (
            <Auth.Provider
                value={{
                    usuario
                }}
            >
                {children}
            </Auth.Provider>
        );
    }
};
