import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { openModal, closeModal } from '../../actions/modal_actions';

import { handleReserve } from '../../actions/reservation_actions';
import { times, timeVals } from '../../util/time_vars';

class ReservationModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      seltime: ''
    };
  }

  update(type) {
    return e => this.setState({
      [type]: e.currentTarget.value
    });
  }

  render() {
    return (
      <div>

        <select
          value={this.state.seltime}
          onChange={this.update('seltime')}
          className="select-time">
          <option hidden value={null}>Pickup Time</option>
          {timeVals.map((tv, idx) => {
            return <option key={idx}
              value={tv}>{times[idx]}</option>;
          })}
        </select>


        <button
          className={this.state.seltime === '' ?
            "reserve-btn time-not-selected" : "reserve-btn time-selected"}
          onClick={() => handleReserve(this.props, this.state)}
          id={`reserve-button`}
          disabled={this.state.seltime === ''}>
          RESERVE NOW
        </button>


      </div>
    );
  }
}

const msp = (state, ownProps) => {
  return {
    treat: ownProps.treat,
    shop: ownProps.shop,
    currentUser: state.entities.users[state.session.id],
    resToday: state.ui.filters.restoday
  };
};

const mdp = (dispatch) => {
  return {
    openConfirmModal: () => dispatch(openModal('confirm')),
    closeModal: () => dispatch(closeModal())
  };
};

export default withRouter(connect(msp, mdp)(ReservationModal));