import Home from "./mypage/home/Home.jsx"
import "./App.css"
import React from "react"
import SearchCommon from "./component/search/SearchCommon.jsx"
import List from "./component/search/search-result/List.jsx"
import List1 from "./component/search/search-result/List1";

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
                <List1></List1>
            </div>
        );
    }
}
