import { GetLastOrder } from "./getLastOrder"

class Reorder {
  constructor(api) {
    this.api = api
  }

  async call(user) {
    const userId = await this.api.getUserId(user)
    const getLastOrder = new GetLastOrder(this.api)

    const lastOrder = await getLastOrder.call(user)

    const cartId = await this.api.createCart()
    const newOrder = {
      user_id: `${userId}`,
      cart_id: `${cartId}`,
      products: lastOrder.products,
      addressInformation: {
        shippingAddress: lastOrder.shippingAddress,
        billingAddress: lastOrder.billingAddress,
        shipping_method_code: "flatrate",
        shipping_carrier_code: "flatrate",
        payment_method_code: "cashondelivery",
        payment_method_additional: {}
      },
      transmited: false
    }

    await this.api.makeOrder(user, newOrder)
  }
}

export { Reorder }
