import React from 'react';
import { Link } from 'react-router';
import { ListItem } from 'material-ui/List';
import { pinkA200 } from 'material-ui/styles/colors';

const styles = {
  companyTitle: {
    color: pinkA200,
    fontSize: '20px'
  }
};

class CompanyItem extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <ListItem disabled={true}>
        <Link
          to={`company/${this.props.title}`}
          onClick={() => this.props.handleLink()}
          style={styles.companyTitle}
        >{this.props.title}</Link>
      </ListItem>
    );
  }
}

export default CompanyItem;