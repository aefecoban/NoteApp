import { ChakraProvider } from "@chakra-ui/react";
import App from "./App";
import UserContextProvider from "./context/UserContext";
import { BrowserRouter } from "react-router-dom";

export default function Boot(){
    return <ChakraProvider>
        <BrowserRouter>
            <UserContextProvider>
                <App />
            </UserContextProvider>
        </BrowserRouter>
    </ChakraProvider>
}