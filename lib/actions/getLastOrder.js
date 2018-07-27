class GetLastOrder {
  constructor(vueStorefrontApi) {
    this.vueStorefrontApi = vueStorefrontApi
  }

  async call(user) {
    const history = await this.vueStorefrontApi.getHistory(user)
    let lastOrder = this._getLastOrder(history)
    if (lastOrder == null) {
      return null
    }

    return {
      created_at: lastOrder.created_at,
      products: this._getProducts(lastOrder),
      shippingAddress: this._getShippingAddress(lastOrder),
      billingAddress: lastOrder.billing_address
    }
  }

  _getShippingAddress(lastOrder) {
    return lastOrder.extension_attributes.shipping_assignments["0"].shipping.address
  }

  _getProducts(lastOrder) {
    return lastOrder.items.map((item) => {
      return {
        qty: item.qty_ordered,
        sku: item.sku,
        name: item.name,
        price: 1
      }
    })
  }

  _getLastOrder(history) {
    const sortedItems = history.items.sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at)
    })
    return sortedItems[0]
  }
}

export { GetLastOrder }
