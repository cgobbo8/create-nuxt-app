// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const cp = require('child_process');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */

function createQuickPick(name,title,data,itemList,cascade){
	if (typeof cascade === 'undefined') { cascade = function() {console.log("test")}; }
	const options = Object.keys(itemList).map(label => ({label}));
	const quickPick = vscode.window.createQuickPick();
	quickPick.items = options;
	quickPick.title = title;
	quickPick.onDidChangeSelection(([{label}]) => {
		data[name] = itemList[label];
		console.log(data)
		quickPick.hide();
		cascade();
	});
	quickPick.show();
}

function listFromObject(l) {
	return ["Ok"].concat(Object.keys(l).map(i => `◻ ${i}`))
}

function optionsToList(l) {
	let liste = [];
	for (let i = 0; i < l.length; i++) {
		liste.push(l[i].label);
	}
	return liste;
}

function listeChecked(l,itemList) {
	let returnedList  = []
	for (let i = 0; i < l.length; i++) {
		if (l[i][0] == "☑") {
			returnedList.push(itemList[l[i].replace("☑ ","")])
		}
	}
	return returnedList;
}

function createCheckBox(name, title, data, itemList, cascade){
	console.log(listFromObject(itemList));
	if (typeof cascade === 'undefined') { cascade = function() {console.log("cascade")}; }
	let options = listFromObject(itemList).map(label => ({label}));
	const quickPick = vscode.window.createQuickPick();
	quickPick.items = options;
	quickPick.title = title;
	quickPick.onDidChangeSelection(([{label}]) => {

		if (label == 'Ok') {
			let returnListe = listeChecked(optionsToList(options),itemList);
			data[name] = returnListe
			console.log(data);
			quickPick.hide();
			cascade();
		} else {
			let liste = optionsToList(options);
			liste = liste.map((i) => {
				if (i == label) {
					if (i[0] == "☑") {
						return i.replace("☑","◻")
					} else {
						return i.replace("◻","☑")
					}
				} else {
					return i
				}
			});
	
			options = liste.map(label => ({label}));
			quickPick.items = options;
		}
	});
	quickPick.show();
}

function createPrompt(name,options,data,cascade){
	if (typeof cascade === 'undefined') { cascade = function() {console.log("test")}; }
	vscode.window.showInputBox(options).then(value => {
		if (!value) return;
		data[name] = value;
		cascade();
	});
}

async function app(){

	

	let data = {};

	let defaultData = {
		"name" : "test",
		"language" : "js",
		 "pm" : "npm" , 
		"ui" : "none" , 
		"features" : [] , 
		"linter" : [], 
		"test" : "none" , 
		"mode" : "universal" , 
		"target" : "server" , 
		"devTools" : [] 
	}

	

	const choix = ["Create default project","Create your own project"].map(label => ({label}));
	const quickPick = vscode.window.createQuickPick();
	quickPick.items = choix;
	quickPick.title = "Create your nuxt project";
	quickPick.onDidChangeSelection(([{label}]) => {
		if (label == "Create your own project") {
			let options = {
				prompt: "🌈 Project name ",
				placeHolder: "(name)"
			}		
			createPrompt("name", options, data, ()=>{
				createQuickPick("language","🔠 Programming language",data,{"🔠 JavaScript":'js',"🔠 TypeScript":"ts"}, ()=>{
					createQuickPick("pm","📂 Package manager",data,{"📂 Yarn":'yarn',"📂 Npm":"npm"}, ()=>{
						let uiFrameworks = {
							"None" 				:	"none",
							"🌟 Ant Design Vue" 	:	"ant-design-vue",
							"🌟 Bootstrap Vue" 	:	"bootstrap",
							"🌟 Buefy"				:	"buefy",
							"🌟 Bulma"				:	"bulma",
							"🌟 Chakra UI"			:	"chackra-ui",
							"🌟 Element"			:	"element-ui",
							"🌟 Framevuerk"		:	"framevuerk",
							"🌟 iView"				:	"iview",
							"🌟 Tachyons"			:	"tachyons",
							"🌟 Tailwind CSS"		: 	"tailwind",
							"🌟 Vuesax"			:	"vuesax",
							"🌟 Vuetify.js"		: 	"vuetify",
							"🌟 Oruga"				:	"oruga"
						};
						createQuickPick("ui","🌟 UI framework",data,uiFrameworks,()=>{
							let features = {
								"🕸 Axios - Promise based HTTP client"	:	"axios",
								"🕸 Progressive Web App (PWA"			:	"pwa",
								"🕸 Content - Git-based headless CMS"	:	"content"
							}
							createCheckBox("features", "🕸 Nuxt.js modules", data, features, ()=>{
								let linters = {
									"🍀 ESLint"			:	"eslint",
									"🍀 Prettier"			:	"prettier",
									"🍀 Lint staged files"	:	"lintStaged",
									"🍀 StyleLint"			:	"stylelint",
									"🍀 Commitlint"		:	"commitlint"
								}
								createCheckBox("linter", "🍀 Linting tools", data, linters, ()=>{
									let tests = {
										"None"			:	"none",
										"📊 Jest"			:	"jest",
										"📊 AVA"			:	"ava",
										"📊 WebdriverIO"	:	"webdriverio",
										"📊 Nightwatch"	:	"nightwatch"
									}
									createQuickPick("test","📊 Testing framework",data,tests,()=>{
										let modes = {
											"💥Universal (SSR / SSG)"	:	"universal",
											"💥Single Page App"			:	"spa"
										}
										createQuickPick("mode","💥 Rendering mode",data,modes,()=>{
											let targets = {
												"🌊 Server (Node.js hosting)"	:	"server",
												"🌊 Static (Static/JAMStack hosting)"		:	"static"
											}
											createQuickPick("target","🌊 Deployment target",data,targets,()=>{
												let tools = {
													"🛠 jsconfig.json (Recommended for VS Code if you're not using typescript)"	:	"jsconfig.json",
													"🛠 Semantic Pull Requests"		:	"semantic-pull-requests",
													"🛠 Dependabot (For auto-updating dependencies, GitHub only)"		:	"dependabot"
												}
												createCheckBox("devTools", "🛠 Development tools", data, tools, ()=>{
													vscode.window.showInformationMessage(JSON.stringify(data));
													vscode.window.createTerminal();
													vscode.window.terminals[0].show(true);
													
													vscode.window.terminals[0].sendText(`npx create-nuxt-app ${data.name} --answers '${JSON.stringify(data)}' `,true)
												});

											});
										});
									});
								});
							});
						});
					});
				});
			});
			
		} else {
			let options = {
				prompt: "🌈 Project name ",
				placeHolder: "(name)"
			};
			vscode.window.showInputBox(options).then(value => {
				if (!value) return;
				vscode.window.createTerminal();
				// vscode.window.terminals[0].show(true);
				vscode.window.terminals[0].sendText(`npx create-nuxt-app ${value} --answers '${JSON.stringify(defaultData)}' `,true)

			});

		}

		quickPick.hide();
	});
	quickPick.show();



}

function activate(context) {

	console.log(vscode.window.terminals.length);

	let disposable = vscode.commands.registerCommand('nuxtapp.nuxtapp', app);

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
