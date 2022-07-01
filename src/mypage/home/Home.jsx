import React from "react"
import MyHeader from "../../component/Header/MyHeader";
import MyBody from "../../component/Body/MyBody";
import MyFooter from "../../component/Footer/MyFooter";

export default class Home extends React.Component{

    render() {
        return (
            <div>
                <MyHeader/>
                <MyBody/>
                <MyFooter/>
            </div>
        )
    }

}
