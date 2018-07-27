import { Reorder } from "../../lib/actions/reorder"
import { VueStorefrontApi } from "../../lib/api/vueStorefront"
import { GetLastOrder } from "../../lib/actions/getLastOrder"
import sinon from "sinon"
import { expect } from "chai"

describe("Reorder", () => {
  it("gets last order", async () => {
    let vueStorefrontApi = new VueStorefrontApi({ endpoint: "https://test" })

    let lastOrder = {
      products: ["Awesome product"],
      shippingAddress: { city: "Neverland" },
      billingAddress: { city: "Narnia" }
    }
    let orderStub = sinon.stub()
    sinon.stub(vueStorefrontApi, "getUserId").returns(1)
    sinon.stub(vueStorefrontApi, "makeOrder").callsFake(orderStub)
    sinon.stub(vueStorefrontApi, "createCart").returns("cartid")
    sinon.stub(GetLastOrder.prototype, "call").returns(lastOrder)

    let reorderCmd = new Reorder(vueStorefrontApi)

    await reorderCmd.call({ apiToken: "test" })

    let reorderDetails = orderStub.firstCall.args[1]

    expect(reorderDetails.user_id).to.eql("1")
    expect(reorderDetails.products).to.eql(["Awesome product"])
    expect(reorderDetails.addressInformation.shippingAddress).to.eql({ city: "Neverland" })
    expect(reorderDetails.addressInformation.billingAddress).to.eql({ city: "Narnia" })


    vueStorefrontApi.getUserId.restore()
    vueStorefrontApi.createCart.restore()
    vueStorefrontApi.makeOrder.restore()
    GetLastOrder.prototype.call.restore()
  })
})
