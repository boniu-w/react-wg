import Home from "./mypage/home/Home.jsx"
import "./App.css"
import React from "react"
import SearchCommon from "./component/search/SearchCommon.jsx"
import List from "./component/search/search-result/List.jsx"

export default class App extends React.Component {
    // return (
    //     <div className="App">
    //         <Home />
    //     </div>
    // );


    render() {
        return (
            <div className="App">
                <SearchCommon/>
                <List/>
            </div>
        );
    }
}
