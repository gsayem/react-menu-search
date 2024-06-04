import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import MyMenu from "./my-menu";
import "./my-menu.css";
import sampleData from "./sampleData.json";
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


class App extends Component {

  populateChildData(parentNode) {
    let allChildDB = sampleData.filter(p => p.ParentCategoryId === parentNode.dbID);
    if (allChildDB.length > 0) {
      parentNode.children = [];
      let i = 0;
      for (let aChild of allChildDB) {
        let node = {};
        node.id = i;
        node.dbID = aChild.Id;
        node.name = aChild.Name;
        node.isOpen = false;
        parentNode.children.push(node);
        ++i;
      }

      for (let aChild of parentNode.children) {
        this.populateChildData(aChild);
      }
    }
    return parentNode;
  }

  onNodeMouseClick(event, tree, node, currLevel, keyPath) {
    this.setState({
      tree: tree
    });
  }
  onLeafMouseClick(event, leaf) {
    //return  NotificationManager.success(leaf.name, 'Menu Click');
    return NotificationManager.info(leaf.name);
  }

  componentWillMount() {
    let allParent = sampleData.filter(p => p.ParentCategoryId === 0);
    let allData = [];
    let i = 0;
    for (let aParent of allParent) {
      let newParent = {};
      newParent.id = i;
      newParent.dbID = aParent.Id;
      newParent.name = aParent.Name;
      newParent.isOpen = false;
      newParent.children = [];
      newParent = this.populateChildData(newParent);
      newParent.isTopParent = true;
      allData.push(newParent);
      ++i;
    }
    this.setState({
      tree: allData
    });
  }

  render() {


    // console.log(allData);
    return (

      <Container>
        <Row>
          <Col md={{ span: 6, offset: 3 }}>
            <form className="container">
              <h3 className="h3-title">Menu using ReactJS</h3>
              <MyMenu tree={this.state.tree}
                onNodeMouseClick={this.onNodeMouseClick.bind(this)}
                onLeafMouseClick={this.onLeafMouseClick}
              />
            </form>
            <div className="copyright">{(new Date().getFullYear())} &#169; Sayem</div>
            <NotificationContainer />
          </Col>
        </Row>
      </Container>
    );
  }


}

export default App;
