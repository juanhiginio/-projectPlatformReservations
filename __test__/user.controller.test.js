import { jest } from "@jest/globals";
import request from "supertest";

jest.unstable_mockModule("../models/User.js", () => ({
  default: {
    findById: jest.fn(),
  },
}));

jest.unstable_mockModule("../models/Service.js", () => ({
  default: {
    create: jest.fn(),
  },
}));

// Importa los módulos después de los mocks
const { default: User } = await import("../models/User.js");
const { default: Service } = await import("../models/Service.js");
const app = (await import("../server.js")).default;

describe("POST /api/services", () => {
  const mockUserId = "mock-user-id";
  const urlPostPath = "/api/services";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Debería manejar errores al crear un servicio", async () => {

    User.findById.mockResolvedValueOnce({
      _id: mockUserId,
      typeUser: "66e2360cc4e29e2f6762e241",
    });

    Service.create.mockRejectedValueOnce(new Error("Error en la base de datos"));

    const response = await request(app)
      .post(urlPostPath)
      .set("Authorization", "Bearer mock-token")
      .field("name", "Test Service")
      .field("price", 1000)
      .attach("serviceLogo", Buffer.from("mock image content"), "mock-logo.png");

    expect(response.statusCode).toBe(401);
    expect(response.body).toBe(
      "Para realizar esta acción debes estar registrado en el sistema"
    );
  });
});

