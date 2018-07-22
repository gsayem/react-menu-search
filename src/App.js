import React, { Component } from 'react';
import '../node_modules/spectre.css/dist/spectre.min.css';
import './App.css';
import MyMenu from "./my-menu"
import "./my-menu.css";
import sampleData from "./sampleData.json"
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';

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

  // onLeafMouseUp(event, leaf) {
  //   console.log(leaf.id); // Prints the leaf id
  //   console.log(leaf.name); // Prints the leaf name
  // }

  // onLeafMouseDown(event, leaf) {
  //   console.log(leaf.id); // Prints the leaf id
  //   console.log(leaf.name); // Prints the leaf name
  // }
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
      <div className="container">
        <div className="columns">
          <div className="col-md-9 centered">
            <form className="container">
              <h3>Chaldal menu search</h3>
              <MyMenu tree={this.state.tree}
                onNodeMouseClick={this.onNodeMouseClick.bind(this)}
                onLeafMouseClick={this.onLeafMouseClick}
              />
            </form>
            <NotificationContainer />
          </div>
        </div>
      </div>
      // <div>
      //   <button className='btn btn-info'
      //     onClick={this.onLeafMouseClick()}>Info
      //   </button>
      //   <hr/>
      //   <button className='btn btn-success'
      //     onClick={this.createNotification('success')}>Success
      //   </button>
      //   <hr/>
      //   <button className='btn btn-warning'
      //     onClick={this.createNotification('warning')}>Warning
      //   </button>
      //   <hr/>
      //   <button className='btn btn-danger'
      //     onClick={this.createNotification('error')}>Error
      //   </button>

      //   <NotificationContainer/>
      // </div>
    );
  }


}

export default App;
