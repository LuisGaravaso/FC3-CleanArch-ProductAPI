import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import Address from "../../../domain/customer/value-object/address";
import Customer from "../../../domain/customer/entity/customer";
import ListCustomerUseCase from "./list.customer.usecase";

describe("Integration tests for list customers use case", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
    sequelize = new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false,
        sync: { force: true },
    });

    await sequelize.addModels([CustomerModel]);
    await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should list customers", async () => {
        // Arrange
        const customerRepository = new CustomerRepository();
        const usecase = new ListCustomerUseCase(customerRepository);
        const customer1 = new Customer("123", "Customer 1");
        const address1 = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer1.changeAddress(address1);
        await customerRepository.create(customer1);

        const customer2 = new Customer("124", "Customer 2");
        const address2 = new Address("Street 2", 2, "Zipcode 2", "City 2");
        customer2.changeAddress(address2);
        await customerRepository.create(customer2);

        // Act
        const expectedOutput = {
            customers: [
            {
                id: "123",
                name: "Customer 1",
                address: {
                    street: "Street 1",
                    city: "City 1",
                    number: 1,
                    zip: "Zipcode 1",
                },
            },
            {
                id: "124",
                name: "Customer 2",
                address: {
                    street: "Street 2",
                    city: "City 2",
                    number: 2,
                    zip: "Zipcode 2",
                },
            },
        ]};

        const output = await usecase.execute({});

        // Assert
        expect(output).toEqual(expectedOutput);
    });

    it("should list customers with empty list", async () => {
        // Arrange
        const customerRepository = new CustomerRepository();
        const usecase = new ListCustomerUseCase(customerRepository);

        // Act
        const expectedOutput: { 
            customers: { 
                id: string; 
                name: string; 
                address: { street: string; city: string; number: number; zip: string; }; 
            }[]} = {
            customers: [],
        };

        const output = await usecase.execute({});

        // Assert
        expect(output).toEqual(expectedOutput);
    });

});