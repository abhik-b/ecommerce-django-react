import React, { Component } from "react";
import { CardElement, injectStripe } from "react-stripe-elements";
import { Elements, StripeProvider } from "react-stripe-elements";
import {
  Container,
  Button,
  Message,
  Item,
  Divider,
  Header,
  Label
} from "semantic-ui-react";
import { authAxios } from "../utils";
import { checkoutURL } from "../constants";
import { orderSummaryURL } from "../constants";

class OrderPreview extends Component {
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
      <Item.Group>
        {data && (
          <div>
            {data.order_items.map((order_item, i) => {
              return (
                <Item>
                  <Item.Content key={order_item.id}>
                    <Item.Header as="h4">
                      {order_item.quantity} x {order_item.item}
                    </Item.Header>
                    <Item.Meta>
                      Final Price : ₹{order_item.final_price}
                      {order_item.item_obj.discount_price && (
                        <Label color="green" tag>
                          ON DISCOUNT
                        </Label>
                      )}
                    </Item.Meta>

                    <Divider />
                  </Item.Content>
                </Item>
              );
            })}
            <Header>Order Total :₹ {data.total}</Header>
          </div>
        )}
      </Item.Group>
    );
  }
}

// export default OrderPreview;

class Checkout extends Component {
  state = {
    loading: false,
    error: null,
    success: false
  };
  //USER CLICKED SUBMIT
  submit = ev => {
    ev.preventDefault();
    if (this.props.stripe) {
      this.props.stripe.createToken().then(result => {
        if (result.error) {
          this.setState({ error: result.error.message, loading: false });
        } else {
          authAxios
            .post(checkoutURL, { stripeToken: result.token.id })
            .then(res => {
              this.setState({ loading: false, success: true });
            })
            .catch(err => {
              this.setState({ loading: false, error: err });
            });
        }
      });
    } else {
      console.log("stripe isnt loaded");
    }
  };

  render() {
    const { error, loading, success } = this.state;
    return (
      <div>
        {error && (
          <Message negative>
            <Message.Header>We're sorry error occured</Message.Header>
            <p>{JSON.stringify(error)}</p>
          </Message>
        )}
        {success && (
          <Message positive>
            <Message.Header>Successfull</Message.Header>
          </Message>
        )}
        <OrderPreview />
        <Divider />
        <Header>Would you like to complete the purchase?</Header>
        <CardElement />
        <Button
          loading={loading}
          disabled={loading}
          color="red"
          fluid
          onClick={this.submit}
          style={{ marginTop: "19px" }}
        >
          S U B M I T
        </Button>
      </div>
    );
  }
}
const InjectedForm = injectStripe(Checkout);
const WrappedForm = () => (
  <Container text>
    <StripeProvider apiKey="pk_test_bG6o2zxnPwOLqoqx7bBxa7WJ00XMb9wBi8">
      <div>
        <h1>Complete Your Order</h1>
        <Elements>
          <InjectedForm />
        </Elements>
      </div>
    </StripeProvider>
  </Container>
);

export default WrappedForm;
