const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const controllerPath = path.resolve(
  __dirname,
  "..",
  "src",
  "controllers",
  "planoEstablecimiento.controller.js"
);
const modelsPath = path.resolve(__dirname, "..", "src", "models", "index.js");

const createRes = () => {
  const res = {
    statusCode: 200,
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    }
  };

  return res;
};

const loadController = (mockModels) => {
  delete require.cache[controllerPath];
  require.cache[modelsPath] = {
    id: modelsPath,
    filename: modelsPath,
    loaded: true,
    exports: mockModels
  };

  return require(controllerPath);
};

test("POST create permite multiples planos para un mismo establecimiento", async () => {
  const created = [];
  let nextId = 1;

  const controller = loadController({
    Establecimiento: {
      findOne: async ({ where }) =>
        where.id === 15 && where.user_id === 7 ? { id: 15, user_id: 7 } : null
    },
    PlanoEstablecimiento: {
      findOne: async () => {
        throw new Error("No debe validarse unicidad por establecimiento");
      },
      create: async (payload) => {
        const plano = { id: nextId++, ...payload };
        created.push(plano);
        return plano;
      },
      findByPk: async (id) => ({
        ...created.find((plano) => plano.id === id),
        elementos: []
      })
    },
    PlanoElemento: {}
  });

  const reqBase = {
    user: { id: 7 }
  };

  const res1 = createRes();
  await controller.create(
    {
      ...reqBase,
      body: {
        establecimiento_id: 15,
        nombre: "Salon principal",
        ancho: 12,
        alto: 8
      }
    },
    res1
  );

  const res2 = createRes();
  await controller.create(
    {
      ...reqBase,
      body: {
        establecimiento_id: 15,
        nombre: "Terraza",
        ancho: 10,
        alto: 6
      }
    },
    res2
  );

  assert.equal(res1.statusCode, 201);
  assert.equal(res2.statusCode, 201);
  assert.equal(created.length, 2);
  assert.deepEqual(
    created.map((plano) => plano.nombre),
    ["Salon principal", "Terraza"]
  );
});

test("GET by establecimiento devuelve una lista de planos del establecimiento", async () => {
  const planos = [
    {
      id: 3,
      establecimiento_id: 15,
      nombre: "Salon principal",
      ancho: 12,
      alto: 8,
      elementos: [{ id: 101, plano_id: 3, nombre: "Mesa 1" }]
    },
    {
      id: 4,
      establecimiento_id: 15,
      nombre: "Terraza",
      ancho: 10,
      alto: 6,
      elementos: []
    }
  ];

  const controller = loadController({
    Establecimiento: {
      findOne: async ({ where }) =>
        where.id === "15" && where.user_id === 7 ? { id: 15, user_id: 7 } : null
    },
    PlanoEstablecimiento: {
      findAll: async ({ where }) =>
        where.establecimiento_id === "15" ? planos : []
    },
    PlanoElemento: {}
  });

  const res = createRes();
  await controller.getByEstablecimiento(
    {
      params: { establecimientoId: "15" },
      user: { id: 7 }
    },
    res
  );

  assert.equal(res.statusCode, 200);
  assert.ok(Array.isArray(res.body));
  assert.equal(res.body.length, 2);
  assert.equal(res.body[0].id, 3);
  assert.equal(res.body[1].id, 4);
});

test("GET by id devuelve un plano individual con sus elementos", async () => {
  const plano = {
    id: 3,
    establecimiento_id: 15,
    nombre: "Salon principal",
    ancho: 12,
    alto: 8,
    elementos: [
      { id: 101, plano_id: 3, nombre: "Mesa 1" },
      { id: 102, plano_id: 3, nombre: "Mesa 2" }
    ]
  };

  const controller = loadController({
    Establecimiento: {},
    PlanoEstablecimiento: {
      findOne: async ({ where }) => (where.id === "3" ? plano : null)
    },
    PlanoElemento: {}
  });

  const res = createRes();
  await controller.getById(
    {
      params: { id: "3" },
      user: { id: 7 }
    },
    res
  );

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.id, 3);
  assert.equal(res.body.elementos.length, 2);
});

test("PUT actualiza solo el plano indicado sin afectar otros", async () => {
  const planos = new Map([
    [
      "3",
      {
        id: 3,
        nombre: "Salon principal",
        ancho: 12,
        alto: 8,
        elementos: [],
        async update(payload) {
          Object.assign(this, payload);
        }
      }
    ],
    [
      "4",
      {
        id: 4,
        nombre: "Terraza",
        ancho: 10,
        alto: 6,
        elementos: [],
        async update(payload) {
          Object.assign(this, payload);
        }
      }
    ]
  ]);

  const controller = loadController({
    Establecimiento: {},
    PlanoEstablecimiento: {
      findOne: async ({ where }) => planos.get(String(where.id)) || null
    },
    PlanoElemento: {}
  });

  const res = createRes();
  await controller.update(
    {
      params: { id: "3" },
      user: { id: 7 },
      body: {
        nombre: "Salon principal remodelado",
        ancho: 14
      }
    },
    res
  );

  assert.equal(res.statusCode, 200);
  assert.equal(planos.get("3").nombre, "Salon principal remodelado");
  assert.equal(planos.get("3").ancho, 14);
  assert.equal(planos.get("4").nombre, "Terraza");
  assert.equal(planos.get("4").ancho, 10);
});
