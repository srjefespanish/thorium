import React, { Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag.macro";
import SubscriptionHelper from "helpers/subscriptionHelper";
import InterfaceCard from "./interface";
import "./style.scss";

const fragment = gql`
  fragment InterfaceData on Interface {
    id
    name
  }
`;

const QUERY = gql`
  query Interface($simulatorId: ID!) {
    interfaces(simulatorId: $simulatorId) {
      ...InterfaceData
    }
  }
  ${fragment}
`;
const SUBSCRIPTION = gql`
  subscription InterfaceUpdate($simulatorId: ID!) {
    interfaceUpdate(simulatorId: $simulatorId) {
      ...InterfaceData
    }
  }
  ${fragment}
`;

class InterfaceData extends Component {
  state = {};
  render() {
    const { interfaceId } = this.props;
    return (
      <Query query={QUERY} variables={{ simulatorId: this.props.simulator.id }}>
        {({ loading, data, subscribeToMore }) => {
          const { interfaces } = data;
          if (loading || !interfaces) return null;
          if (!interfaces[0]) return <div>No Interface</div>;
          return (
            <SubscriptionHelper
              subscribe={() =>
                subscribeToMore({
                  document: SUBSCRIPTION,
                  variables: { simulatorId: this.props.simulator.id },
                  updateQuery: (previousResult, { subscriptionData }) => {
                    return Object.assign({}, previousResult, {
                      interface: subscriptionData.data.interfaceUpdate
                    });
                  }
                })
              }
            >
              <InterfaceCard
                {...this.props}
                {...interfaces.find(i => i.id === interfaceId)}
              />
            </SubscriptionHelper>
          );
        }}
      </Query>
    );
  }
}
export default InterfaceData;
