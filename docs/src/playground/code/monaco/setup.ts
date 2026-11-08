import * as monaco from "monaco-editor";
import EditorWorker from "monaco-editor/editor/editor.worker?worker";
import TsWorker from "monaco-editor/language/typescript/ts.worker?worker";

import partyTypes from "virtual:party-js-types";

import "./theme";

self.MonacoEnvironment = {
	getWorker: (_, label) =>
		label === "typescript" || label === "javascript"
			? new TsWorker()
			: new EditorWorker(),
};

const { javascriptDefaults, ModuleKind, ModuleResolutionKind, ScriptTarget } =
	monaco.typescript;

javascriptDefaults.setCompilerOptions({
	target: ScriptTarget.ES2020,
	module: ModuleKind.ESNext,
	moduleResolution: ModuleResolutionKind.NodeJs,
	allowJs: true,
});
javascriptDefaults.addExtraLib(
	partyTypes,
	"file:///node_modules/party-js/index.d.ts",
);

export { monaco };
