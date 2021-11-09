import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadUser } from '../../actions/auth';


//this is line

const Dashboard = ({ auth }) => {
    const dashboard =(<>
        {auth.user==null? 'Loading...' : (<section class="container">
          <h1 class="large text-primary">
            Dashboard
          </h1>
          <p class="lead"><i class="fas fa-user"></i> Welcome Back {auth.user.name}</p>
        </section>) 
        }
        </>
    )
    return (
        <div>
            {auth.user==null? 'Loading...' : dashboard}
        </div>
    )
}

Dashboard.propTypes = {
    auth: PropTypes.object.isRequired,
}

const mapStateToProps= state=>({
    auth:state.auth
})

export default connect(mapStateToProps, {loadUser})(Dashboard)