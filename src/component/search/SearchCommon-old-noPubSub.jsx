import React from "react"
import axios from "axios";

export default class SearchCommon extends React.Component {

    render() {
        return (
            <div>
                <input ref={c => this.searchTextElement = c} type="text" placeholder='输入'/> &nbsp;
                <button onClick={this.search}>搜索</button>
            </div>
        )
    }

    search = () => {
        // let {searchTextElement: {value}} = this;
        // let searchText = value
        //
        // console.log(searchText)

        this.props.updateAppState({
            isFirst: false,
            isLoading: true
        });

        let {searchTextElement: {value: searchText}} = this;

        console.log(searchText)

        let githubUrl = `https://api.github.com/search/users?q=${searchText}`

        axios.get(githubUrl).then(
            (response) => {
                console.log('success', response);

                this.props.updateAppState({
                    isLoading: false,
                    data: response.data
                });
            },
            (error) => {
                console.log('error', error)

                this.props.updateAppState({
                    isLoading: false,
                    errorMessage: error.message
                })
            }
        )

    }
}
