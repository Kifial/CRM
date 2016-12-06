import React from 'react';
import { Link } from 'react-router';

class CompanyItem extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <Link
          to={`company/${this.props.title}`}
          onClick={() => this.props.handleLink()}
        >{this.props.title}</Link>
      </div>
    );
  }
}

export default CompanyItem;