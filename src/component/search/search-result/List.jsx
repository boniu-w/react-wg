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
            console.log("订阅searchGitHub", data)
        })
    }

    render() {
        return (
            <div>
                <table>
                    <thead>thead</thead>
                    <tr>
                        <td>1111</td>
                        <td>222222</td>
                        <td>3333</td>
                        <td>44444</td>
                    </tr>
                    <tr>
                        <td>ssss</td>
                        <td>aaaaa</td>
                        <td>dddddd</td>
                        <td>ccccc</td>
                    </tr>
                    <tfoot>tfoot</tfoot>
                </table>
            </div>
        )
    }
}
