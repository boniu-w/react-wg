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
        PubSub.subscribe("searchGitHub", (_, arg) => {
            if (arg.data != null) {
                console.log("订阅searchGitHub", arg)
                console.log("data.items", arg.data.items)

                for (let item of arg.data.items) {
                    item.name = "1";
                    item.age = 1;
                    item.phoneNumber = 1;
                }
                this.setState({
                    users: arg.data.items,
                    isLoading: true
                })
            }
        })
    }

    render() {
        return (
            <div>
                <table>
                    <thead>
                    <tr>
                        <td>id</td>
                        <td>name</td>
                        <td>age</td>
                        <td>phoneNumber</td>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.users.map(user => {
                        return <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.age}</td>
                            <td>{user.phoneNumber}</td>
                        </tr>
                    })}
                    </tbody>
                </table>
            </div>
        )
    }
}
