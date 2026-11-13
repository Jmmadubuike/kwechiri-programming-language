import collections from "../generated/examples/collections.kwe?raw";
import conditions from "../generated/examples/conditions.kwe?raw";
import functions from "../generated/examples/functions.kwe?raw";
import hello from "../generated/examples/hello.kwe?raw";
import multilineStrings from "../generated/examples/multiline-strings.kwe?raw";
import modules from "../generated/examples/modules-main.kwe?raw";

export interface Example {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly source: string;
  readonly output: string;
}

export const examples: readonly Example[] = [
  {
    id: "hello",
    title: "First program",
    description: "Print a line of text with the language's runtime output function.",
    source: hello.trimEnd(),
    output: "Ndewo Ụwa!",
  },
  {
    id: "multiline-strings",
    title: "Multiline strings",
    description: "Write a string that spans several physical lines with three double quotes.",
    source: multilineStrings.trimEnd(),
    output: "Ndewo Ụwa!\nAhịrị abụọ\nAhịrị atọ",
  },
  {
    id: "functions",
    title: "Functions",
    description: "Declare a function, return a value, and call it from the top level.",
    source: functions.trimEnd(),
    output: "30",
  },
  {
    id: "conditions",
    title: "Conditions",
    description: "Use a strict Boolean condition and a flow-aware branch variable.",
    source: conditions.trimEnd(),
    output: "Okenye",
  },
  {
    id: "collections",
    title: "Collections",
    description: "Work with a homogeneous array and a typed object.",
    source: collections.trimEnd(),
    output: '["Uche","Ada","Obi"]\n{"aha":"Uche","afọ":36}\nUche',
  },
  {
    id: "modules",
    title: "Modules",
    description: "Import named values from a relative Kwechiri module.",
    source: modules.trimEnd(),
    output: "5.14159",
  },
];
