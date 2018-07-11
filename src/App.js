import React, { Component } from 'react';
import '../node_modules/spectre.css/dist/spectre.min.css';
import './App.css';
import MyMenu from "./my-menu"
import "./my-menu.css";
import sampleData from "./sampleData.json"



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

  render() {
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

    // console.log(allData);
    return (
      <div className="container">
        <div className="columns">
          <div className="col-md-9 centered">
          <form className="container">
          <h3>Chaldhal menu search</h3>            
            <MyMenu tree={allData} />
          </form>
            
          </div>
        </div>
      </div>
    );    
  }


}

export default App;
