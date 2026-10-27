export type StandardValueType = "string" | "boolean";
export type StandardIntrinsic = "stringContains" | "stringStartsWith" | "stringEndsWith";

export interface StandardExportDefinition {
  readonly module: string;
  readonly publicName: string;
  readonly arity: number;
  readonly parameterTypes: readonly StandardValueType[];
  readonly returnType: StandardValueType;
  readonly mutation: "none";
  readonly intrinsic: StandardIntrinsic;
}

export interface StandardModuleDefinition {
  readonly specifier: string;
  readonly exports: ReadonlyMap<string, StandardExportDefinition>;
}

const stringModuleExports: readonly StandardExportDefinition[] = [
  {
    module: "kwechiri:eriri",
    publicName: "nwereEriri",
    arity: 2,
    parameterTypes: ["string", "string"],
    returnType: "boolean",
    mutation: "none",
    intrinsic: "stringContains",
  },
  {
    module: "kwechiri:eriri",
    publicName: "maliteNa",
    arity: 2,
    parameterTypes: ["string", "string"],
    returnType: "boolean",
    mutation: "none",
    intrinsic: "stringStartsWith",
  },
  {
    module: "kwechiri:eriri",
    publicName: "kwụsịNa",
    arity: 2,
    parameterTypes: ["string", "string"],
    returnType: "boolean",
    mutation: "none",
    intrinsic: "stringEndsWith",
  },
];

const standardModules = new Map<string, StandardModuleDefinition>([
  [
    "kwechiri:eriri",
    {
      specifier: "kwechiri:eriri",
      exports: new Map(stringModuleExports.map((definition) => [definition.publicName, definition])),
    },
  ],
]);

export const standardModule = (specifier: string): StandardModuleDefinition | undefined => standardModules.get(specifier);
