import request from 'supertest'
import app from '../src/app.js'
import { jest } from "@jest/globals";
import { Product, ProductVariant, ProductImage, sequelize } from "../src/models";
import sinon from "sinon";

jest.mock("../src/models", () => ({
  Product: { create: jest.fn() },
  ProductVariant: { bulkCreate: jest.fn() },
  ProductImage: { bulkCreate: jest.fn() },
  sequelize: { transaction: () => ({ commit: jest.fn(), rollback: jest.fn() }) },
}));

describe("Product API Tests", () => {
  let transactionStub;

  beforeEach(() => {
    transactionStub = sinon.stub(sequelize, "transaction").returns({
      commit: jest.fn(),
      rollback: jest.fn(),
    });
  });

  afterEach(() => {
    transactionStub.restore();
  });

  it("should create a product successfully", async () => {
    Product.create.mockResolvedValue({ id: 1, title: "iPhone 15" });
    ProductVariant.bulkCreate.mockResolvedValue([{ id: 1, productId: 1 }]);
    ProductImage.bulkCreate.mockResolvedValue([{ id: 1, productId: 1 }]);

    const response = await request(app).post("/products").send({
      product: { title: "iPhone 15", description: "Latest iPhone model" },
      variants: [{ size: "128GB" }],
      images: ["image1.jpg"],
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Product Added Successfully");
  });

  it("should return 500 if product creation fails", async () => {
    Product.create.mockRejectedValue(new Error("DB error"));

    const response = await request(app).post("/products").send({
      product: { title: "iPhone 15", description: "Latest iPhone model" },
    });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("DB error");
  });
});