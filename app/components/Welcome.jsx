import React from 'react';
import { Link } from 'react-router';
import { cyan500 } from 'material-ui/styles/colors';

const styles = {
  welcomeText: {
    color: cyan500,
    fontFamily: 'Roboto, sans-serif',
    fontSize: '22px',
    margin: '0 0 20px'
  },
  parentStyle: {
    padding: '20px 15px'
  }
};

class Welcome extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div style={styles.parentStyle}>
        <h2 style={styles.welcomeText}>Hello, my little friend!!!</h2>
      </div>
    );
  }
}

export default Welcome;