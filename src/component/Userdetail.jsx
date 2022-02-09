import React, { Component } from 'react';
import { Form, Input, InputNumber, Button } from 'antd';
import { Modal } from 'antd';
import { Table } from 'antd';

import '../App.css';


class Userdetail extends Component {
  constructor() {
    super()
    this.state = {
      act: 0,
      idx: '',
      UserDetail: [
        {
          id: '1',
          firstname: 'John',
          lastname: 'cina',
          email: 'jaydeepc721@gmail.com',
          phoneno: '7974478965'
        },
        {
          id: '2',
          firstname: 'Jimmy',
          lastname: 'rajput',
          email: 'jimmyraj@123',
          phoneno: '7974478965'
        },
        {
          id: '3',
          firstname: 'John',
          lastname: 'cina',
          email: 'jhon@123',
          phoneno: '7974478965'
        },
        {
          id: '4',
          firstname: 'Johnny',
          lastname: 'sharma',
          email: 'jonny@123',
          phoneno: '7974478965'
        },
        {
          id: '5',
          firstname: 'rocky',
          lastname: 'verma',
          email: 'rockyverma@123',
          phoneno: '7974478965'
        },
        {
          id: '6',
          firstname: 'shami',
          lastname: 'patidar',
          email: 'shami@123',
          phoneno: '7974478965'
        },
      ],

    }
  }
  componentDidMount() {
    if (localStorage.getItem('user-Info')) {

      let name = JSON.parse(localStorage.getItem('user-Info'))
      this.setState({ name: name[0].name })
    }
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  };
  handleCancel = () => {
    this.setState({ visible: false });
  };
  CancelModel = () => {
    this.setState({ visible1: false });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    let UserDetail = this.state.UserDetail;
    let firstname = this.refs.txtName.value;
    let lastname = this.refs.txtLname.value;
    let email = this.refs.txtEmail.value;
    let phoneno = this.refs.txtPhone.value;

    if (this.state.act === 0) {
      let data = {
        "firstname": firstname,
        "lastname": lastname,
        "email": email,
        "phoneno": phoneno
      }
      UserDetail.push(data);
    }
    else {
      let index = this.state.idx;
      UserDetail[index].firstname = firstname;
      UserDetail[index].lastname = lastname;
      UserDetail[index].email = email;
      UserDetail[index].phoneno = phoneno;

    }

    this.setState({
      UserDetail: UserDetail,
      act: 0,
      visible: false
    })
    this.refs.myForm.reset();
    this.refs.txtName.focus();
  }

  handleDelete = (index) => {
    let UserDetail = this.state.UserDetail;
    UserDetail.splice(index, 1);
    this.setState({
      UserDetail: UserDetail
    })
    this.refs.txtName.focus();
  }

  handleEdit = (index) => {
    let data = this.state.UserDetail[index];
    this.refs.txtName.value = data.firstname;
    this.refs.txtLname.value = data.lastname;
    this.refs.txtEmail.value = data.email;
    this.refs.txtPhone.value = data.phoneno;

    this.setState({
      act: 1,
      idx: index,
      visible: true
    })
  }


  logout = () => {

    localStorage.clear();
    window.location.reload();
    this.props.history.push('/')
  }


  render() {
    const { getValueByID } = this.state
    return (<div >
      <br />
      <h2 style={{ marginLeft: '70%' }}>{this.state.name} <span onClick={this.logout} style={{ marginLeft: '10%', cursor: 'pointer' }}>logout</span></h2>
      <br />
      <Button type="primary" onClick={this.showModal}>
        ADD USER
      </Button>
      <Modal
        visible={this.state.visible}
        title="Title"
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        footer={[

        ]}
      >
        <form ref="myForm" className="myForm">
          <label>FirstName</label>
          <input type="text" ref="txtName" placeholder="firstName" className="formField" /><br /><br />
          <label>LastName</label>
          <input type="text" ref="txtLname" placeholder="lastName" className="formField" /><br /><br />
          <label>Email :   </label>
          <input type="text" ref="txtEmail" placeholder="Email" className="formField" /><br /><br />
          <label>Phone-No</label>
          <input type="text" ref="txtPhone" placeholder="Phone-no" className="formField" /><br /><br />
          <button onClick={e => this.handleSubmit(e)} className="myButton"> Save</button>
        </form>
      </Modal>

      <br />
      <br />
      <br />

      <div >
        {this.state.UserDetail ?
          <table style={{ width: '90%', marginLeft: '5%' }}>
            <tbody>

              <tr>
                <th>FirstName</th>
                <th>LastName</th>
                <th>Email</th>
                <th>Phone-NO</th>


              </tr>
              {this.state.UserDetail.map((data, index) =>
                <tr key={index}>
                  <td>{data.firstname}</td>
                  <td>{data.lastname}</td>
                  <td>{data.email}</td>
                  <td>{data.phoneno}</td>
                  <td><button onClick={e => this.handleEdit(index)} className="myListButton">Edit</button></td>
                  <td><button onClick={e => this.handleDelete(index)} className="myListButton">Delete</button></td>

                </tr>

              )
              }
            </tbody>
          </table>
          :
          <p>please wait</p>
        }
      </div>

    </div>);
  }
}

export default Userdetail;