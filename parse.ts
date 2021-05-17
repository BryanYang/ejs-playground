interface Node {
    nodeId: string;
    type: "Branch" | "Condition" | "ForEach" | "Activity";
    actionType: "setValue" | "setRequired" | "setVisible" | "setDisalbe" | "setReadonly";
    caption: string,
    description: string;
    input: null,
    output: null,
}

interface Activity extends Node {
    elementId: string,
}

interface Value {
    type: "simple" | "expression",
    expression?: {
      "schema": string;
      "title": string;
    },
    "selectParam": null;
    "simple": string;
}

interface SetValue extends Activity {
    value : Value;
}

interface SetRequired extends Activity {
    required: string[];
    option: string[]
}

interface SetVisible extends Activity {
  visible: string[];
  invisible: string[]
}

interface SetDisable extends Activity {
  enable: string[];
  disable: string[]
}

interface SetReadonly extends Activity {
  readOnly: string[];
  editable: string[]
}


interface openPage extends Activity {
  url: string;
  queryObject?: {
    [k: string]: string | number;
  };
}


interface openWindow extends Activity {
  url: string;
  queryString?: string;
  target?: '_self' | '_blank';

}

interface callMicroFlow extends Activity {
  microFlow: string;
}


interface Condition extends Node {
    expression: string;
    nodes: Node[];
}

interface Branch extends Node {
  conditions?: Condition[];
}