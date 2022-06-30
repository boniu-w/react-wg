import { Layout } from 'antd';
import React from "react"

const { Header, Footer, Sider, Content } = Layout;

export default class Home extends React.Component{

    render() {
        return (
            <Layout>
                <Header>Header</Header>
                <Content>Content</Content>
                <Footer>Footer</Footer>
            </Layout>
        )
    }

}
