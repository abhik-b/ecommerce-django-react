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
  Label,
  Checkbox,
  Form,
  Segment,
  Dimmer,
  Loader,
  Image
} from "semantic-ui-react";
import { authAxios } from "../utils";
import { checkoutURL } from "../constants";
import { orderSummaryURL, addCouponURL } from "../constants";

const OrderPreview = props => {
  const { data } = props;
  console.log(data);
  return (
    <React.Fragment>
      {data && (
        <React.Fragment>
          <Item.Group relaxed>
            {data.order_items.map((order_item, i) => {
              return (
                <Item key={i}>
                  <Item.Image
                    size="tiny"
                    src={`http://127.0.0.1:8000${order_item.item_obj.image}`}
                  />
                  <Item.Content verticalAlign="middle">
                    <Item.Header as="a">
                      {order_item.quantity} x {order_item.item}
                    </Item.Header>
                    <Item.Extra>
                      <Label tag>₹{order_item.final_price}</Label>
                      {order_item.item_obj.discount_price && (
                        <Label color="pink">ON DISCOUNT</Label>
                      )}
                    </Item.Extra>
                  </Item.Content>
                </Item>
              );
            })}
          </Item.Group>

          <Item.Group>
            <Item>
              <Item.Content>
                <Item.Header>
                  <Label tag color="orange">
                    ORDER TOTAL:
                  </Label>
                  <Label color="blue">₹{data.total}</Label>
                  {data.coupon && (
                    <Label color="green">
                      Current coupon: {data.coupon.code} for ₹
                      {data.coupon.amount}
                    </Label>
                  )}
                </Item.Header>
              </Item.Content>
            </Item>
          </Item.Group>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

class CouponForm extends Component {
  state = {
    code: ""
  };

  handleChange = e => {
    this.setState({
      code: e.target.value
    });
  };
  handleSubmit = e => {
    const { code } = this.state;
    this.props.handleAddCouppon(e, code);
    this.setState({ code: "" });
  };
  render() {
    const { code } = this.state;
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <Header as="h4">Coupon Code</Header>
            <input
              placeholder="Enter a coupon if u have one ..... !"
              value={code}
              onChange={this.handleChange}
            />
          </Form.Field>
          {/* <Form.Field>
          <label>Last Name</label>
          <input placeholder="Last Name" />
        </Form.Field>
        <Form.Field>
          <Checkbox label="I agree to the Terms and Conditions" />
        </Form.Field> */}
          <Button color="violet" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    );
  }
}

class Checkout extends Component {
  state = {
    data: null,
    loading: false,
    error: null,
    success: false
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
  handleAddCouppon = (e, code) => {
    e.preventDefault();
    this.setState({ loading: true });
    authAxios
      .post(addCouponURL, { code })
      .then(res => {
        this.setState({ loading: false });
        this.handleFetchOrder();
      })
      .catch(err => {
        this.setState({ error: err, loading: false });
      });
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
    const { data, error, loading, success } = this.state;
    return (
      <div>
        {error && (
          <Message negative>
            <Message.Header>We're sorry error occured</Message.Header>
            <p>{JSON.stringify(error)}</p>
          </Message>
        )}

        {loading && (
          <Segment>
            <Dimmer active inverted>
              <Loader inverted content="Loading" />
            </Dimmer>

            <Image src="/images/wireframe/short-paragraph.png" />
          </Segment>
        )}
        {success && (
          <Message positive>
            <Message.Header>Successfull</Message.Header>
          </Message>
        )}
        <OrderPreview data={data} />
        <Divider />
        <CouponForm
          handleAddCouppon={(e, code) => this.handleAddCouppon(e, code)}
        />
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
