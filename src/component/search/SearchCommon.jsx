import React from "react";
import axios from "axios";
import PubSub from "pubsub-js";

export default class SearchCommon extends React.Component {

    render() {
        return (
            <div>
                <input ref={el => this.searchTextElement = el} type="text" placeholder='输入'/> &nbsp;
                <button onClick={this.search}>搜索</button>
            </div>
        )
    }

    search = () => {
        // 发布消息
        PubSub.publish("searchGitHub", {
            isFirst: false,
            isLoading: true
        });

        // 连续解构
        let {searchTextElement: {value: searchText}} = this;
        console.log(searchText);

        let githubUrl = `https://api.github.com/search/users?q=${searchText}`;
        axios.get(githubUrl).then(
            (response) => {
                console.log('success', response);
                PubSub.publish("searchGitHub", {isLoading: false, data: response.data});
            },
            (error) => {
                console.log('error', error);
                PubSub.publish("searchGitHub", {isLoading: false, errorMessage: error.message});
            }
        )

    }

}
