console.log(JSON.stringify( {
  id: "http://api.clearlydefined.io/schemas/curation",
  $schema: "http://json-schema.org/draft-06/schema#",
  title: "curation",
  required: ["package"],
  type: "object",
  properties: {
    package: { $ref: "#/definitions/package" },
    described: { $ref: "#/definitions/described" },
    licensed: { $ref: "#/definitions/licensed" }
  },
  definitions: {
    package: {
      required: ["type", "provider", "namespace", "name", "revision"],
      properties: {
        type: { enum: ["npm", "git"] },
        provider: { enum: ["npmjs", "github"] },
        namespace: { type: "string" },
        name: { type: "string" },
        revision: { type: "string" }
      }
    },
    described: {
      properties: {
        dimensions: {
          properties: {
            test: { $ref: "#/definitions/dimension" },
            data: { $ref: "#/definitions/dimension" }
          }
        },
        sourceLocation: { $ref: "#/definitions/sourceLocation" },
        projectWebsite: { type: "string" },
        issueTracker: { type: "string" }
      }
    },
    licensed: {
      properties: {
      }
    },
    sourceLocation: {
      type: "object",
      properties: {
        type: { enum: ["npm", "git"] },
        provider: { enum: ["npmjs", "github"] },
        url: { type: "string" },
        revision: { type: "string" },
        path: { type: "string" }
      }
    },
    dimension: {
      type: "array",
      items: {
        type: "string"
      }
    }
  }
}, null, 2))