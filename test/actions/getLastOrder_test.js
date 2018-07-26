import { VueStorefrontApi } from "../../lib/api/vueStorefront"
import { GetLastOrder } from "../../lib/actions/getLastOrder"
import sinon from "sinon"
import { expect } from "chai"


describe("GetLastOrder", () => {

  describe("call", () => {
    let history = {
      items: [
        {
          created_at: "2018-07-13 13:19:06",
          quote_id: 357162,
          items: [
            {
              name: "Erika Running Short-28-Green",
              price: 45,
              product_id: 2030,
              product_type: "simple",
              qty_ordered: 1,
              sku: "WSH12-28-Green"
            },
            {
              name: "Erika Running Short-28-Green",
              price: 45,
              product_id: 2030,
              product_type: "simple",
              qty_ordered: 1,
              sku: "WSH12-28-Green"
            }],
          extension_attributes: {
            shipping_assignments: [
              {
                shipping: {
                  address:
                  {
                    address_type: "shipping",
                    city: "Neverland",
                    company: "NA",
                    country_id: "PL",
                    email: "peter.pan@fun.io",
                    entity_id: 2614,
                    firstname: "Peter",
                    lastname: "Pan",
                    parent_id: 1369,
                    postcode: "12-345",
                    street: ["Pirate Bay 15", "15"],
                    telephone: "000000000"
                  }
                }
              }
            ]
          },
          billing_address: {
            address_type: "billing",
            city: "Pirate Bay",
            company: "NA",
            country_id: "PL",
            email: "peter.pan@fun.io",
            entity_id: 2614,
            firstname: "Peter",
            lastname: "Pan",
            parent_id: 1369,
            postcode: "12-345",
            street: ["Pirate Bay 15", "15"],
            telephone: "000000000"
          }
        },
        {
          created_at: "2018-07-11 12:02:28",
          quote_id: 353128
        }
      ]
    }

    it("returns last order", async () => {
      let vueStorefrontApi = new VueStorefrontApi({ endpoint: "https://test" })
      sinon.stub(vueStorefrontApi, "getHistory").returns(history)
      let getLastOrderCmd = new GetLastOrder(vueStorefrontApi)
      let result = await getLastOrderCmd.call({ apiToken: "test" })
      expect(result.created_at).to.equal("2018-07-13 13:19:06")

      vueStorefrontApi.getHistory.restore()
    })

    it("returns correct format", async () => {
      let vueStorefrontApi = new VueStorefrontApi({ endpoint: "https://test" })
      sinon.stub(vueStorefrontApi, "getHistory").returns(history)
      let getLastOrderCmd = new GetLastOrder(vueStorefrontApi)
      let result = await getLastOrderCmd.call({ apiToken: "test" })
      expect(result.products.length).to.equal(2)
      expect(result.shippingAddress.city).to.equal("Neverland")
      expect(result.billingAddress.city).to.equal("Pirate Bay")

      vueStorefrontApi.getHistory.restore()
    })

  })
})
