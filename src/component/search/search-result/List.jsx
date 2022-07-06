import React from "react"
import PubSub from "pubsub-js"

export default class List extends React.Component {


    state = {
        users: [],
        isFirst: true,
        isLoading: false,
        errorMessage: ""
    }

    componentDidMount() {
        // 订阅消息
        PubSub.subscribe("searchGitHub", (_, data)=>{
            console.log("searchGitHub", data)
        })
    }

    render() {
        return (
            <div>

            </div>
        )
    }
}
