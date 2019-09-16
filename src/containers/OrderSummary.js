import React, { Component } from "react";
import {
  Button,
  Container,
  Header,
  Icon,
  Label,
  Menu,
  Table,
  Message
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import { authAxios } from "../utils";
import { orderSummaryURL } from "../constants";
class OrderSummary extends Component {
  state = {
    loading: false,
    error: null,
    data: null
  };
  componentDidMount() {
    this.handleFetchOrder();
  }
  handleFetchOrder = () => {
    this.setState({ loading: true });
    authAxios
      .get(orderSummaryURL)
      .then(res => {
        this.setState({ data: res.data, loading: false });
      })
      .catch(err => {
        if (err.response.status === 404) {
          this.setState({
            error: "you currently dont have any order",
            loading: false
          });
        } else {
          this.setState({ error: err, loading: false });
        }
      });
  };
  render() {
    const { data, error, loading } = this.state;
    console.log(data);
    return (
      <Container>
        <Header as="h1" textAlign="center">
          Order Summary
        </Header>
        {error && (
          <Message
            error
            header="There was an error"
            content={JSON.stringify(error)}
          />
        )}
        {data && (
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Item #</Table.HeaderCell>
                <Table.HeaderCell>Item Name</Table.HeaderCell>
                <Table.HeaderCell>Item Price</Table.HeaderCell>
                <Table.HeaderCell>Item Quantity</Table.HeaderCell>
                <Table.HeaderCell>Total Item Price </Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {data.order_items.map((order_item, i) => {
                return (
                  <Table.Row key={order_item.id}>
                    <Table.Cell>
                      <Label circular color="blue">
                        {i + 1}
                      </Label>
                    </Table.Cell>
                    <Table.Cell>{order_item.item}</Table.Cell>
                    <Table.Cell>{order_item.item_obj.price}</Table.Cell>
                    <Table.Cell>{order_item.quantity}</Table.Cell>
                    <Table.Cell>
                      {order_item.item_obj.discount_price && (
                        <Label color="green" ribbon>
                          ON DISCOUNT
                        </Label>
                      )}
                      ₹{order_item.final_price}
                    </Table.Cell>
                  </Table.Row>
                );
              })}
              <Table.Row>
                <Table.Cell />
                <Table.Cell />
                <Table.Cell />
                <Table.Cell colSpan="4" textAlign="right">
                  Order Total :₹ {data.total}
                </Table.Cell>
              </Table.Row>
            </Table.Body>

            <Table.Footer>
              <Table.Row>
                <Table.HeaderCell colSpan="5">
                  <Link to="/checkout">
                    <Button color="yellow" floated="right" textAlign="right">
                      Check This OUT
                    </Button>
                  </Link>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          </Table>
        )}
        {/* <Button color="green" floated="right">
          Check This OUT
        </Button> */}
      </Container>
    );
  }
}

export default OrderSummary;
