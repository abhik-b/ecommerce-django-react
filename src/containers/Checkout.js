import React, { Component } from "react";
import { CardElement, injectStripe } from "react-stripe-elements";
import { Elements, StripeProvider } from "react-stripe-elements";
import { Container, Button, Message } from "semantic-ui-react";
import { authAxios } from "../utils";
import { checkoutURL } from "../constants";

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
        <p>Would you like to complete the purchase?</p>
        <CardElement />
        <Button
          loading={loading}
          disabled={loading}
          color="red"
          onClick={this.submit}
          style={{ marginTop: "19px" }}
        >
          Send
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
