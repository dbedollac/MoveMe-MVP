import React, { useEffect, useState } from "react";
import {auth} from "./firestore";

export const Auth = React.createContext();

export const AuthContext = ({ children }) => {
    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        auth.onAuthStateChanged(function(user) {
            setUsuario(user);
        });
    }, []);

        return (
            <Auth.Provider
                value={{
                    usuario
                }}
            >
                {children}
            </Auth.Provider>
        );

};
