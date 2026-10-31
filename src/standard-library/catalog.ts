export type StandardValueType = "string" | "number" | "boolean";
export type StandardIntrinsic =
  | "stringContains"
  | "stringStartsWith"
  | "stringEndsWith"
  | "stringGraphemeLength"
  | "stringConcat"
  | "stringTrim"
  | "stringLowercase"
  | "stringUppercase"
  | "stringReplaceAll";

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
  {
    module: "kwechiri:eriri",
    publicName: "ogologoEriri",
    arity: 1,
    parameterTypes: ["string"],
    returnType: "number",
    mutation: "none",
    intrinsic: "stringGraphemeLength",
  },
  {
    module: "kwechiri:eriri",
    publicName: "jikọọEriri",
    arity: 2,
    parameterTypes: ["string", "string"],
    returnType: "string",
    mutation: "none",
    intrinsic: "stringConcat",
  },
  {
    module: "kwechiri:eriri",
    publicName: "wepuOghere",
    arity: 1,
    parameterTypes: ["string"],
    returnType: "string",
    mutation: "none",
    intrinsic: "stringTrim",
  },
  {
    module: "kwechiri:eriri",
    publicName: "okwuNta",
    arity: 1,
    parameterTypes: ["string"],
    returnType: "string",
    mutation: "none",
    intrinsic: "stringLowercase",
  },
  {
    module: "kwechiri:eriri",
    publicName: "okwuNnukwu",
    arity: 1,
    parameterTypes: ["string"],
    returnType: "string",
    mutation: "none",
    intrinsic: "stringUppercase",
  },
  {
    module: "kwechiri:eriri",
    publicName: "dochieEriri",
    arity: 3,
    parameterTypes: ["string", "string", "string"],
    returnType: "string",
    mutation: "none",
    intrinsic: "stringReplaceAll",
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
