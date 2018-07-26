import { VueStorefrontApi } from "../../lib/api/vueStorefront"
import { ConnectionError } from "../../lib/api/errors"
import axios from "axios"
import sinon from "sinon"
import chai from "chai"
import { expect } from "chai"
import chaiAsPromised from "chai-as-promised"

chai.use(chaiAsPromised)

describe("VueStorefrontApi", () => {

  const axiosStub = sinon.stub()
  const axiosStubPost = sinon.stub()

  beforeEach(() => {
    sinon.stub(axios, "get").callsFake(axiosStub)
    sinon.stub(axios, "post").callsFake(axiosStubPost)
  })

  afterEach(() => {
    axiosStub.reset()
    axiosStubPost.reset()
    axios.get.restore()
    axios.post.restore()
  })

  describe("getUserId", () => {
    it("throws on error", () => {
      axiosStub.returns(Promise.reject("Timeout"))
      let vueStorefrontApi = new VueStorefrontApi({ endpoint: "https://test" })
      expect(vueStorefrontApi.getUserId({ apiToken: "test" })).to.be.rejectedWith(ConnectionError)
    })

    it("makes correct request", () => {
      axiosStub.returns(Promise.resolve({ data: { result: { id: 1 } } }))
      let vueStorefrontApi = new VueStorefrontApi({ endpoint: "https://test" })
      vueStorefrontApi.getUserId({ apiToken: "test" })
      expect(axiosStub.calledWith("https://test/api/user/me?token=test")).to.be.ok
    })

    it("returns userId", () => {
      axiosStub.returns(Promise.resolve({ data: { result: { id: 1 } } }))
      let vueStorefrontApi = new VueStorefrontApi({ endpoint: "https://test" })
      expect(vueStorefrontApi.getUserId({ apiToken: "test" })).to.eventually.equal(1)
    })
  })


  describe("getHistory", () => {
    it("throws on error", () => {
      axiosStub.returns(Promise.reject("Timeout"))
      let vueStorefrontApi = new VueStorefrontApi({ endpoint: "https://test" })
      expect(vueStorefrontApi.getHistory({ apiToken: "test" })).to.be.rejectedWith(ConnectionError)
    })

    it("makes correct request", () => {
      axiosStub.returns(Promise.resolve({ data: { result: { id: 1 } } }))
      let vueStorefrontApi = new VueStorefrontApi({ endpoint: "https://test" })
      vueStorefrontApi.getHistory({ apiToken: "test" })
      expect(axiosStub.calledWith("https://test/api/user/order-history?token=test")).to.be.ok
    })

    it("returns history", () => {
      axiosStub.returns(Promise.resolve({ data: { result: { product: "Awesome product" } } }))
      let vueStorefrontApi = new VueStorefrontApi({ endpoint: "https://test" })
      expect(vueStorefrontApi.getHistory({ apiToken: "test" })).to.eventually.equal({ product: "Awesome product" })
    })
  })

  describe("makeOrder", () => {
    it("throws on error", () => {
      axiosStubPost.returns(Promise.reject("Timeout"))
      let vueStorefrontApi = new VueStorefrontApi({ endpoint: "https://test" })
      expect(vueStorefrontApi.makeOrder({ apiToken: "test" })).to.be.rejectedWith(ConnectionError)
    })

    it("makes correct request", () => {
      axiosStubPost.returns(Promise.resolve())
      let vueStorefrontApi = new VueStorefrontApi({ endpoint: "https://test" })
      vueStorefrontApi.makeOrder({ apiToken: "test" }, { order: "order" })
      const [address, data] = axiosStubPost.firstCall.args
      expect(address).to.eql("https://test/api/order?token=test")
      expect(data).to.eql({ order: "order" })
    })
  })

})
