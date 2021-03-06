import React, { Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag.macro";
import SubscriptionHelper from "helpers/subscriptionHelper";
import Interfaces from "./interfaces";

const fragment = gql`
  fragment InterfaceConfigData on Interface {
    id
    name
    deviceType {
      id
      name
      width
      height
      isLandscape
    }
    components
    connections
    config
    values
  }
`;

const QUERY = gql`
  query Interfaces {
    interfaces {
      ...InterfaceConfigData
    }
    interfaceDevices {
      id
      name
      width
      height
      isLandscape
    }
  }
  ${fragment}
`;
const SUBSCRIPTION = gql`
  subscription InterfaceUpdate {
    interfaceUpdate {
      ...InterfaceConfigData
    }
  }
  ${fragment}
`;

class InterfacesData extends Component {
  state = {};
  render() {
    return (
      <Query query={QUERY}>
        {({ loading, data, subscribeToMore }) => {
          const { interfaces, interfaceDevices } = data;
          if (loading || !interfaces) return null;
          return (
            <SubscriptionHelper
              subscribe={() =>
                subscribeToMore({
                  document: SUBSCRIPTION,
                  updateQuery: (previousResult, { subscriptionData }) => {
                    return Object.assign({}, previousResult, {
                      interfaces: subscriptionData.data.interfaceUpdate
                    });
                  }
                })
              }
            >
              <Interfaces
                {...this.props}
                interfaces={interfaces}
                interfaceDevices={interfaceDevices}
              />
            </SubscriptionHelper>
          );
        }}
      </Query>
    );
  }
}

export default InterfacesData;
