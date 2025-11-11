import App from "./App";
import React from "react";
import "./styles/global.css";
import ReactDOM from "react-dom/client";
import "slick-carousel/slick/slick.css";
import { BrowserRouter } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import "slick-carousel/slick/slick-theme.css";
import "bootstrap-icons/font/bootstrap-icons.css";
// import ProductProvider from "./contexts/ProductContext";
import { Provider } from "react-redux";
import store from "./redux/store";

// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <ProductProvider>
//         <App />
//       </ProductProvider>
//     </BrowserRouter>
//   </React.StrictMode>
// );

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
