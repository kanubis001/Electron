// import logo from '../logo.svg';
import '../style/App.css';
import '../style/main.css';

function App() {
  return (
    <div>
        <div id="wholeWrap">
          <div id="top" />
          <div id="middle">
            <div className="innerView" id="treeView">
              <div id="jstree">
                {/* in this example the tree is populated from inline HTML */}
                <ul>
                  <li>Root node 1
                    <ul>
                      <li id="child_node_1">Child node 1</li>
                      <li>Child node 2</li>
                    </ul>
                  </li>
                  <li>Root node 2</li>
                </ul>
              </div>
              {/* <button>demo button</button> */}
            </div>
            <div className="innerView" id="contView">
              <div>
                <button id="testlogin">login</button>
              </div>
            </div>
          </div>
        </div>
        <div className="wrapdiv" id="wrapper">
          <div className="maindiv" id={1}>1</div>
          <div className="maindiv" id={2}>2</div>
        </div>
        <div className="threatdiv">
          <table>
            <tbody><tr>
                <td>1</td>
                <td>2</td>
                <td>3</td>
              </tr>
            </tbody></table>
        </div>
      </div>
  );
}

export default App;
