enum JSReferences {
	MainPage = "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference",
	GlobalObjects = "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects",
	Operators = "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators",
	Statements = "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements",
	Functions = "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions",
	Classes = "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes",
	Errors = "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors",
	LexicalGrammar = "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar",
	IterationProtocols = "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols",
	StrictMode = "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode",
	TemplateLiterals = "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals",
	TrailingCommas = "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Trailing_commas",
	DeprecatedFeatures = "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Deprecated_and_obsolete_features",
}

enum HTMLReferences {
	MainPage = "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference",
	Elements = "https://developer.mozilla.org/en-US/docs/Web/HTML/Element",
	GlobalAttributes = "https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes",
	Attributes = "https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes",
	InputTypes = "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types",
}

export default {
	JS: JSReferences,
	HTML: HTMLReferences,
} as const;
