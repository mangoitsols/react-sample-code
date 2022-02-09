import React, { Component } from 'react';
import login from '../db/db.json';
import { Form, Input, Button } from 'antd';


class Login extends Component {
  constructor() {
    super()
    this.state = {
      username: "",
      password: ""
    }
  }

  componentDidMount(){
    if(localStorage.getItem('user-Info')){
      this.props.history.push("/Userdetail")
    }
  }
  onFinish = (e) => {
    const loginDetail = login.login
    if (loginDetail[0].username === e.username && loginDetail[0].password == e.password) {
      localStorage.setItem('user-Info',JSON.stringify(loginDetail));
      this.props.history.push("/Userdetail");
      
    } else {
      alert("please enter correct login detail")
    }

  }
  render() {
    return (<div className='form'>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 4 }}
        initialValues={{ remember: true }}
        onFinish={this.onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 4 }}>
          <Button type="primary" htmlType="submit">
            login
          </Button>
        </Form.Item>
      </Form>

    </div>);
  }
}

export default Login;