import React from "react";
import axios from "axios";
import {
  Button,
  Container,
  Icon,
  Image,
  Item,
  Label,
  Segment,
  Dimmer,
  Loader,
  Message
} from "semantic-ui-react";
import { productListURL, addToCartURL } from "../constants";
import { authAxios } from "../utils";

//TO DISPLAY LIST OF PRODUCTS
class ProductList extends React.Component {
  state = {
    loading: false,
    error: null,
    data: []
  };
  // THIS WILL FETCH DATA AND PROVIDE ERROR (IF ANY) OTHERWISE WILL SETSTATE WITH THE VALUES IT IS GETTING FROM API
  componentDidMount() {
    this.setState({ loading: true });
    axios
      .get(productListURL) //this will fetch data from the api
      .then(res => {
        //console.log(res.data);
        this.setState({
          data: res.data,
          loading: false
        });
      })
      .catch(err => {
        this.setState({ error: err, loading: false });
      });
  }

  //THIS WILL SEND A MESSAGE TO API THAT WE HAVE ADDED THAT PARTICULAR ITEM IN OUR CART
  handleAddToCart = slug => {
    this.setState({ loading: true });
    authAxios
      .post(addToCartURL, { slug }) //this will send data to the api
      .then(res => {
        console.log(res.data);
        this.setState({
          loading: false
        });
      })
      .catch(err => {
        this.setState({ error: err, loading: false });
      });
  };

  render() {
    const { error, data, loading } = this.state; //OBJECT DESTRUCTURING
    return (
      <Container>
        {/* TO DISPLAY ERROR MESSAGE */}
        {error && (
          <Message
            error
            header="There was some errors with your submission"
            content={JSON.stringify(error)}
          />
        )}
        {/* TO DISPLAY LOADER WHILE AXIOS FETCHS DATA */}
        {loading && (
          <Segment>
            <Dimmer active inverted>
              <Loader inverted content="Loading" />
            </Dimmer>

            <Image src="/images/wireframe/short-paragraph.png" />
          </Segment>
        )}
        {/* RENDERING LIST ITEMS  */}
        <Item.Group divided>
          {data.map(item => {
            // MAPPING THE ENTIRE LIST TO  ITEM (KINDA RUNNIN FOR LOOP )
            return (
              <Item key={item.id}>
                <Item.Image src={item.image} />

                <Item.Content>
                  <Item.Header as="a">{item.title}</Item.Header>
                  <Item.Meta>
                    <span className="cinema">{item.category}</span>
                  </Item.Meta>
                  <Item.Description>{item.description}</Item.Description>
                  <Item.Extra>
                    <Button
                      primary
                      floated="right"
                      icon
                      labelPosition="right"
                      onClick={() => this.handleAddToCart(item.slug)}
                    >
                      Add To Cart
                      <Icon name="add to cart" />
                    </Button>
                    {item.discount_price && ( //IF ITEM HAS A DISCOUNT PRICE THEN IT WILL DISPLAY LABELS
                      <Label
                        color={
                          item.label === "danger"
                            ? "red"
                            : item.label === "secondary"
                            ? "blue"
                            : "pink"
                        }
                      >
                        {item.discount_price}
                      </Label>
                    )}
                  </Item.Extra>
                </Item.Content>
              </Item>
            );
          })}
        </Item.Group>
      </Container>
    );
  }
}

export default ProductList;
